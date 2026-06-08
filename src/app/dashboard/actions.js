'use server';

import { db } from '@/db';
import { skills, skillFiles, skillVersions } from '@/db/schema';
import { verifySession } from '@/lib/auth';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { and, eq } from 'drizzle-orm';

const MAX_SKILL_FILE_BYTES = 256 * 1024;
const DEFAULT_SKILL_MD = `# Skill Name

## Purpose

Describe what this skill helps an AI system do.

## When to use

Use this skill when...

## Instructions

1. Add the workflow, constraints, and examples this skill should install.
2. Keep the guidance specific enough that another agent can reuse it.
`;

function slugifySkillName(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

function isReadableUpload(file) {
  return file && typeof file.text === 'function' && file.size > 0;
}

async function getSkillMarkdown(formData) {
  try {
    const source = formData.get('source')?.toString() || 'editor';
    const uploadedFile = formData.get('skillFile');

    if (source === 'upload' && isReadableUpload(uploadedFile)) {
      if (uploadedFile.size > MAX_SKILL_FILE_BYTES) {
        return { error: 'SKILL.md must be smaller than 256KB.' };
      }

      const fileName = uploadedFile.name || '';
      if (fileName && !fileName.toLowerCase().endsWith('.md')) {
        return { error: 'Upload a Markdown file for SKILL.md.' };
      }

      const content = await uploadedFile.text();
      return { content: content.trim() };
    }

    const editorContent = formData.get('skillMarkdown')?.toString().trim();
    return { content: editorContent };
  } catch (error) {
    console.error('Failed to read submitted skill markdown:', error);
    return { error: 'Could not read the submitted SKILL.md content.' };
  }
}

export async function createSkillAction(prevState, formData) {
  try {
    const session = await verifySession();
    if (!session) {
      return { error: 'Unauthorized. Please sign in again.' };
    }

    const skillId = formData.get('skillId')?.toString();
    const isEditMode = !!skillId;
    const name = formData.get('name')?.trim();
    const description = formData.get('description')?.trim();
    const category = formData.get('category')?.trim() || 'Skills';
    const version = formData.get('version')?.trim() || '1.0.0';
    const changelog = formData.get('changelog')?.trim();
    const { content: skillMarkdown, error: markdownError } = await getSkillMarkdown(formData);

    if (!isEditMode && !name) {
      return { error: 'Skill name is required.' };
    }

    if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(version)) {
      return { error: 'Version must use semver, for example 1.0.0.' };
    }

    if (markdownError) {
      return { error: markdownError };
    }

    if (!skillMarkdown) {
      return { error: 'Add SKILL.md content or upload a Markdown file.' };
    }

    if (skillMarkdown.length > MAX_SKILL_FILE_BYTES) {
      return { error: 'SKILL.md must be smaller than 256KB.' };
    }

    if (isEditMode) {
      // Edit mode: publish a new version of an existing skill
      const existingSkillRows = await db
        .select()
        .from(skills)
        .where(and(eq(skills.id, skillId), eq(skills.ownerId, session.userId)))
        .limit(1);

      const skill = existingSkillRows[0];
      if (!skill) {
        return { error: 'Skill not found or unauthorized.' };
      }

      // Check if version is already published
      const existingVersionRows = await db
        .select()
        .from(skillVersions)
        .where(and(eq(skillVersions.skillId, skillId), eq(skillVersions.version, version)))
        .limit(1);

      if (existingVersionRows.length > 0) {
        return { error: `Version ${version} has already been published.` };
      }

      const versionId = crypto.randomUUID();
      const fileId = crypto.randomUUID();
      const checksum = crypto
        .createHash('sha256')
        .update(`${versionId}-${version}-${Date.now()}-${skillMarkdown}`)
        .digest('hex');

      await db.transaction(async (tx) => {
        // Update skill details
        await tx
          .update(skills)
          .set({
            description: description || null,
            category,
            currentVersion: version,
            updatedAt: new Date()
          })
          .where(eq(skills.id, skillId));

        // Insert new version
        await tx.insert(skillVersions).values({
          id: versionId,
          skillId,
          version,
          changelog: changelog || null,
          checksum
        });

        // Insert SKILL.md content
        await tx.insert(skillFiles).values({
          id: fileId,
          skillVersionId: versionId,
          path: 'SKILL.md',
          content: skillMarkdown,
          fileType: 'markdown'
        });
      });

      revalidatePath('/dashboard');
      revalidatePath(`/@${session.username}`);
      revalidatePath(`/skills/${skill.slug}`);
      return {
        success: `Version ${version} published successfully.`,
        slug: skill.slug,
        installCommand: `kresh install ${skill.slug}`
      };
    } else {
      // Creation mode: publish a new skill
      const slugBase = slugifySkillName(name);

      if (!slugBase) {
        return { error: 'Invalid skill name.' };
      }

      let slug = slugBase;
      let counter = 1;
      while (true) {
        const existing = await db.select().from(skills).where(eq(skills.slug, slug));
        if (existing.length === 0) {
          break;
        }
        slug = `${slugBase}-${counter}`;
        counter++;
      }
      const id = crypto.randomUUID();
      const versionId = crypto.randomUUID();
      const fileId = crypto.randomUUID();
      const checksum = crypto
        .createHash('sha256')
        .update(`${versionId}-${version}-${Date.now()}-${skillMarkdown}`)
        .digest('hex');

      await db.transaction(async (tx) => {
        await tx.insert(skills).values({
          id,
          ownerId: session.userId,
          slug,
          name,
          description: description || null,
          category,
          visibility: 'public',
          currentVersion: version,
          installsCount: 0,
          starsCount: 0
        });

        await tx.insert(skillVersions).values({
          id: versionId,
          skillId: id,
          version,
          changelog: changelog || null,
          checksum
        });

        await tx.insert(skillFiles).values({
          id: fileId,
          skillVersionId: versionId,
          path: 'SKILL.md',
          content: skillMarkdown,
          fileType: 'markdown'
        });
      });

      revalidatePath('/dashboard');
      revalidatePath(`/@${session.username}`);
      revalidatePath('/dashboard/publish');
      return {
        success: 'Skill published successfully.',
        slug,
        installCommand: `kresh install ${slug}`
      };
    }
  } catch (error) {
    console.error("Failed to process skill action:", error);
    return { error: 'An error occurred while publishing.' };
  }
}

export async function getDefaultSkillMarkdown() {
  return DEFAULT_SKILL_MD;
}

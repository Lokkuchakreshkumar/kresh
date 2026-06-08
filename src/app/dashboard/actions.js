'use server';

import { db } from '@/db';
import { skills, skillFiles, skillVersions, skillStars } from '@/db/schema';
import { verifySession } from '@/lib/auth';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { and, eq, sql } from 'drizzle-orm';
import { redirect } from 'next/navigation';

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

async function getPublishedFiles(formData) {
  try {
    const source = formData.get('source')?.toString() || 'editor';
    const files = [];

    if (source === 'editor') {
      const editorContent = formData.get('skillMarkdown')?.toString().trim();
      if (!editorContent) {
        return { error: 'Add SKILL.md content.' };
      }
      files.push({ path: 'SKILL.md', content: editorContent });
    } else if (source === 'upload') {
      const uploadedFile = formData.get('skillFile');
      if (!isReadableUpload(uploadedFile)) {
        return { error: 'Upload a Markdown file for SKILL.md.' };
      }
      if (uploadedFile.size > MAX_SKILL_FILE_BYTES) {
        return { error: 'SKILL.md must be smaller than 256KB.' };
      }
      const fileName = uploadedFile.name || '';
      if (fileName && !fileName.toLowerCase().endsWith('.md')) {
        return { error: 'Upload a Markdown file for SKILL.md.' };
      }
      const content = await uploadedFile.text();
      files.push({ path: 'SKILL.md', content: content.trim() });
    } else if (source === 'folder') {
      const uploadedFiles = formData.getAll('skillFolder');
      if (!uploadedFiles || uploadedFiles.length === 0 || (uploadedFiles.length === 1 && uploadedFiles[0].size === 0)) {
        return { error: 'Select a valid directory to upload.' };
      }
      
      const seenPaths = new Set();
      let skillMdFound = false;
      for (const file of uploadedFiles) {
        if (!file || file.size === 0) continue;
        if (file.size > MAX_SKILL_FILE_BYTES) {
          return { error: `File ${file.name} exceeds the size limit of 256KB.` };
        }
        
        const filePath = file.name;
        let normalizedPath = filePath;
        
        if (filePath.toLowerCase() === 'skill.md') {
          normalizedPath = 'SKILL.md';
          skillMdFound = true;
        }
        
        if (seenPaths.has(normalizedPath)) {
          continue;
        }
        seenPaths.add(normalizedPath);
        
        const content = await file.text();
        files.push({ path: normalizedPath, content: content });
      }
      
      if (!skillMdFound) {
        return { error: 'Folder must contain a SKILL.md file at its root.' };
      }
    }

    return { files };
  } catch (error) {
    console.error('Failed to parse published files:', error);
    return { error: 'Could not read the submitted content.' };
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
    const visibility = formData.get('visibility')?.trim() || 'public';
    const version = formData.get('version')?.trim() || '1.0.0';
    const changelog = formData.get('changelog')?.trim();
    const { files, error: filesError } = await getPublishedFiles(formData);
    if (filesError) {
      return { error: filesError };
    }

    if (!files || files.length === 0) {
      return { error: 'No files found to publish.' };
    }

    const skillMdFile = files.find((f) => f.path === 'SKILL.md');
    if (!skillMdFile) {
      return { error: 'A SKILL.md file is required.' };
    }
    const skillMarkdown = skillMdFile.content;

    if (!isEditMode && !name) {
      return { error: 'Skill name is required.' };
    }

    if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(version)) {
      return { error: 'Version must use semver, for example 1.0.0.' };
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
            visibility,
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

        // Insert all files
        for (const file of files) {
          const fileId = crypto.randomUUID();
          await tx.insert(skillFiles).values({
            id: fileId,
            skillVersionId: versionId,
            path: file.path,
            content: file.content,
            fileType: file.path.toLowerCase().endsWith('.md') ? 'markdown' : 'text'
          });
        }
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
      const userPrefix = `@${session.username.toLowerCase()}`;
      const nameSlug = slugifySkillName(name);

      if (!nameSlug) {
        return { error: 'Invalid skill name.' };
      }

      const slugBase = `${userPrefix}/${nameSlug}`;
      let slug = slugBase;
      let counter = 1;
      while (true) {
        const existing = await db.select().from(skills).where(eq(skills.slug, slug));
        if (existing.length === 0) {
          break;
        }
        slug = `${userPrefix}/${nameSlug}-${counter}`;
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
          visibility,
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

        // Insert all files
        for (const file of files) {
          const fileId = crypto.randomUUID();
          await tx.insert(skillFiles).values({
            id: fileId,
            skillVersionId: versionId,
            path: file.path,
            content: file.content,
            fileType: file.path.toLowerCase().endsWith('.md') ? 'markdown' : 'text'
          });
        }
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

export async function deleteSkillAction(skillId) {
  let isSuccessful = false;
  let redirectUrl = '/skills';
  try {
    const session = await verifySession();
    if (!session) {
      return { error: 'Unauthorized. Please sign in again.' };
    }

    const existingSkillRows = await db
      .select({ id: skills.id, slug: skills.slug })
      .from(skills)
      .where(and(eq(skills.id, skillId), eq(skills.ownerId, session.userId)))
      .limit(1);

    const skill = existingSkillRows[0];
    if (!skill) {
      return { error: 'Skill not found or unauthorized.' };
    }

    redirectUrl = `/@${session.username}`;

    await db.transaction(async (tx) => {
      // 1. Get all version IDs for this skill
      const versions = await tx
        .select({ id: skillVersions.id })
        .from(skillVersions)
        .where(eq(skillVersions.skillId, skillId));

      const versionIds = versions.map(v => v.id);

      // 2. Delete from skill_files
      for (const vid of versionIds) {
        await tx.delete(skillFiles).where(eq(skillFiles.skillVersionId, vid));
      }

      // 3. Delete from skill_versions
      await tx.delete(skillVersions).where(eq(skillVersions.skillId, skillId));

      // 4. Delete from skill_stars
      await tx.delete(skillStars).where(eq(skillStars.skillId, skillId));

      // 5. Delete from collection_skills
      await tx.execute(sql`DELETE FROM collection_skills WHERE skill_id = ${skillId}`);

      // 6. Delete from skills
      await tx.delete(skills).where(eq(skills.id, skillId));
    });

    revalidatePath('/dashboard');
    revalidatePath(`/@${session.username}`);
    revalidatePath('/skills');
    isSuccessful = true;
  } catch (error) {
    console.error("Failed to delete skill:", error);
    return { error: 'An error occurred while deleting the skill.' };
  }

  if (isSuccessful) {
    redirect(redirectUrl);
  }
}

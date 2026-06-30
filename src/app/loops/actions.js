'use server';

import { db } from '@/db';
import { skills, skillFiles, skillVersions } from '@/db/schema';
import { verifySession } from '@/lib/auth';
import crypto from 'crypto';
import { revalidatePath } from 'next/cache';
import { eq, sql } from 'drizzle-orm';

function slugifyLoopName(name) {
  return name.toLowerCase()
    .replace(/[^a-z0-9_]+/g, '_') // Support underscores for loops if preferred, or standard slugify
    .replace(/(^-|-$)/g, '');
}

export async function createLoopAction(formData) {
  try {
    const session = await verifySession();
    if (!session) {
      return { error: 'Unauthorized. Please sign in to publish a loop.' };
    }

    const name = formData.get('name')?.trim();
    const version = formData.get('version')?.trim() || '1.0.0';
    const description = formData.get('description')?.trim() || 'No description provided.';
    const loopText = formData.get('loopText')?.trim();

    if (!name) {
      return { error: 'Loop name is required.' };
    }
    if (!loopText) {
      return { error: 'Loop configuration is required.' };
    }

    if (!/^\d+\.\d+\.\d+(-[a-zA-Z0-9.-]+)?$/.test(version)) {
      return { error: 'Version must use semver, for example 1.0.0.' };
    }

    const userPrefix = `@${session.username.toLowerCase()}`;
    const nameSlug = slugifyLoopName(name);
    const slug = `${userPrefix}/${nameSlug}`;

    // Title conflict check
    const titleConflict = await db
      .select()
      .from(skills)
      .where(eq(sql`LOWER(${skills.slug})`, slug.toLowerCase()))
      .limit(1);

    if (titleConflict.length > 0) {
      return { error: `A loop/skill with the slug "${slug}" already exists.` };
    }

    const id = crypto.randomUUID();
    const versionId = crypto.randomUUID();
    const fileId = crypto.randomUUID();
    const checksum = crypto
      .createHash('sha256')
      .update(`${versionId}-${version}-${Date.now()}-${loopText}`)
      .digest('hex');

    await db.transaction(async (tx) => {
      await tx.insert(skills).values({
        id,
        ownerId: session.userId,
        slug,
        name,
        description,
        category: 'loops',
        visibility: 'public',
        currentVersion: version,
        installsCount: 0,
        starsCount: 0
      });

      await tx.insert(skillVersions).values({
        id: versionId,
        skillId: id,
        version,
        changelog: 'Initial publish',
        checksum
      });

      // Save as loop.yaml and SKILL.md (for CLI fallback support)
      await tx.insert(skillFiles).values({
        id: crypto.randomUUID(),
        skillVersionId: versionId,
        path: 'loop.yaml',
        content: loopText,
        fileType: 'code'
      });

      await tx.insert(skillFiles).values({
        id: crypto.randomUUID(),
        skillVersionId: versionId,
        path: 'SKILL.md',
        content: loopText,
        fileType: 'markdown'
      });
    });

    revalidatePath('/loops');
    revalidatePath('/dashboard');
    revalidatePath(`/@${session.username}`);

    return {
      success: 'Loop published successfully to the registry.',
      slug
    };
  } catch (error) {
    console.error("Failed to process loop action:", error);
    return { error: `An error occurred while publishing: ${error.message}` };
  }
}

export async function getLoopsAction() {
  try {
    const { users } = await import('@/db/schema');
    const { skillFiles, skillVersions } = await import('@/db/schema');
    const { desc, eq } = await import('drizzle-orm');

    const rawLoops = await db
      .select({
        id: skills.id,
        slug: skills.slug,
        name: skills.name,
        description: skills.description,
        currentVersion: skills.currentVersion,
        createdAt: skills.createdAt,
        ownerUsername: users.username,
        filePath: skillFiles.path,
        fileContent: skillFiles.content
      })
      .from(skills)
      .leftJoin(users, eq(skills.ownerId, users.id))
      .leftJoin(skillVersions, eq(skillVersions.skillId, skills.id))
      .leftJoin(skillFiles, eq(skillFiles.skillVersionId, skillVersions.id))
      .where(eq(skills.category, 'loops'))
      .orderBy(desc(skills.createdAt));

    const loopsMap = new Map();
    for (const row of rawLoops) {
      if (!loopsMap.has(row.id)) {
        loopsMap.set(row.id, {
          id: row.id,
          slug: row.slug,
          name: row.name,
          description: row.description,
          version: row.currentVersion,
          createdAt: row.createdAt,
          ownerUsername: row.ownerUsername || 'anonymous',
          text: ''
        });
      }
      
      const loopObj = loopsMap.get(row.id);
      if (row.filePath === 'loop.yaml') {
        loopObj.text = row.fileContent;
      } else if (!loopObj.text && row.filePath === 'SKILL.md') {
        loopObj.text = row.fileContent;
      }
    }
    
    return { loops: Array.from(loopsMap.values()) };
  } catch (error) {
    console.error('Failed to fetch loops:', error);
    return { error: 'Failed to fetch loops' };
  }
}

export async function getLoopByIdAction(id) {
  try {
    const { users } = await import('@/db/schema');
    const { skillFiles, skillVersions } = await import('@/db/schema');
    const { eq, and } = await import('drizzle-orm');

    const loopRows = await db
      .select({
        id: skills.id,
        slug: skills.slug,
        name: skills.name,
        description: skills.description,
        currentVersion: skills.currentVersion,
        createdAt: skills.createdAt,
        ownerUsername: users.username
      })
      .from(skills)
      .leftJoin(users, eq(skills.ownerId, users.id))
      .where(and(eq(skills.id, id), eq(skills.category, 'loops')))
      .limit(1);

    const loop = loopRows[0];
    if (!loop) return null;

    // Get latest version files
    const versionRows = await db
      .select({ id: skillVersions.id })
      .from(skillVersions)
      .where(eq(skillVersions.skillId, loop.id))
      .orderBy(sql`${skillVersions.publishedAt} DESC`)
      .limit(1);

    const version = versionRows[0];
    let loopText = '';

    if (version) {
      const fileRows = await db
        .select({
          path: skillFiles.path,
          content: skillFiles.content
        })
        .from(skillFiles)
        .where(eq(skillFiles.skillVersionId, version.id));

      const loopFile = fileRows.find(f => f.path === 'loop.yaml') || fileRows.find(f => f.path === 'SKILL.md') || fileRows[0];
      loopText = loopFile?.content || '';
    }

    return {
      id: loop.id,
      slug: loop.slug,
      name: loop.name,
      description: loop.description,
      version: loop.currentVersion,
      createdAt: loop.createdAt,
      ownerUsername: loop.ownerUsername || 'anonymous',
      text: loopText
    };
  } catch (error) {
    console.error('Failed to get loop by ID:', error);
    return null;
  }
}

export async function deleteLoopAction(loopId) {
  try {
    const session = await verifySession();
    if (!session) {
      return { error: 'Unauthorized. Please sign in.' };
    }

    const { skillFiles, skillVersions } = await import('@/db/schema');
    const { eq, and } = await import('drizzle-orm');

    const existingSkillRows = await db
      .select({ id: skills.id, slug: skills.slug })
      .from(skills)
      .where(and(eq(skills.id, loopId), eq(skills.ownerId, session.userId)))
      .limit(1);

    const loop = existingSkillRows[0];
    if (!loop) {
      return { error: 'Loop not found or unauthorized.' };
    }

    await db.transaction(async (tx) => {
      // 1. Get all version IDs for this loop
      const versions = await tx
        .select({ id: skillVersions.id })
        .from(skillVersions)
        .where(eq(skillVersions.skillId, loopId));

      const versionIds = versions.map(v => v.id);

      // 2. Delete from skill_files
      for (const vid of versionIds) {
        await tx.delete(skillFiles).where(eq(skillFiles.skillVersionId, vid));
      }

      // 3. Delete from skill_versions
      await tx.delete(skillVersions).where(eq(skillVersions.skillId, loopId));

      // 4. Delete from skills
      await tx.delete(skills).where(eq(skills.id, loopId));
    });

    revalidatePath('/loops');
    return { success: true };
  } catch (error) {
    console.error("Failed to delete loop:", error);
    return { error: 'An error occurred while deleting the loop.' };
  }
}




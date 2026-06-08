'use server';

import { db } from '@/db';
import { skills, skillStars } from '@/db/schema';
import { verifySession } from '@/lib/auth';
import { and, eq, sql } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import crypto from 'crypto';

/**
 * Toggles the star state of a skill for the logged-in user.
 * Wraps the execution in a try-catch block to prevent crashes.
 *
 * @param {string} skillId The UUID of the skill to star/unstar.
 * @returns {Promise<{success?: boolean, starred?: boolean, starsCount?: number, error?: string}>}
 */
export async function toggleStarAction(skillId) {
  try {
    if (!skillId) {
      return { error: 'Skill ID is required.' };
    }

    const session = await verifySession();
    if (!session) {
      return { error: 'Unauthorized. Please sign in to star this skill.' };
    }

    const userId = session.userId;

    // Check if the user has already starred this skill
    const existingStar = await db
      .select()
      .from(skillStars)
      .where(and(eq(skillStars.userId, userId), eq(skillStars.skillId, skillId)))
      .limit(1);

    let starred = false;

    if (existingStar.length > 0) {
      // User has already starred, so unstar it
      await db
        .delete(skillStars)
        .where(and(eq(skillStars.userId, userId), eq(skillStars.skillId, skillId)));

      // Decrement stars count, making sure it doesn't drop below 0
      await db
        .update(skills)
        .set({ starsCount: sql`GREATEST(0, ${skills.starsCount} - 1)` })
        .where(eq(skills.id, skillId));

      starred = false;
    } else {
      // User has not starred, so star it
      const newStarId = crypto.randomUUID();
      await db.insert(skillStars).values({
        id: newStarId,
        userId,
        skillId
      });

      // Increment stars count
      await db
        .update(skills)
        .set({ starsCount: sql`${skills.starsCount} + 1` })
        .where(eq(skills.id, skillId));

      starred = true;
    }

    // Get the updated count to return for real-time visual synchronization
    const skillRow = await db
      .select({ starsCount: skills.starsCount, slug: skills.slug })
      .from(skills)
      .where(eq(skills.id, skillId))
      .limit(1);

    const updatedStarsCount = skillRow[0]?.starsCount ?? 0;
    const slug = skillRow[0]?.slug;

    if (slug) {
      revalidatePath(`/skills/${slug}`);
      revalidatePath(`/skills`);
      revalidatePath(`/dashboard`);
      revalidatePath(`/@${session.username}`);
    }

    return { success: true, starred, starsCount: updatedStarsCount };
  } catch (error) {
    console.error('Failed to toggle star in database action:', error);
    return { error: 'An unexpected error occurred. Please try again.' };
  }
}

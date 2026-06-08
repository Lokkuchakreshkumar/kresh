import { and, desc, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { skillFiles, skills, skillVersions, users } from '@/db/schema';

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    // Fetch skill and owner details
    const skillRows = await db
      .select({
        id: skills.id,
        slug: skills.slug,
        name: skills.name,
        description: skills.description,
        category: skills.category,
        currentVersion: skills.currentVersion,
        visibility: skills.visibility,
        installsCount: skills.installsCount,
        starsCount: skills.starsCount,
        createdAt: skills.createdAt,
        ownerUsername: users.username
      })
      .from(skills)
      .leftJoin(users, eq(skills.ownerId, users.id))
      .where(and(eq(skills.slug, slug), eq(skills.visibility, 'public')))
      .limit(1);

    const skill = skillRows[0];
    if (!skill) {
      return NextResponse.json({ error: 'Skill not found.' }, { status: 404 });
    }

    // Increment installs count in database
    await db
      .update(skills)
      .set({ installsCount: sql`${skills.installsCount} + 1` })
      .where(eq(skills.id, skill.id));

    // Get the latest version
    const versionRows = await db
      .select({
        id: skillVersions.id,
        version: skillVersions.version
      })
      .from(skillVersions)
      .where(eq(skillVersions.skillId, skill.id))
      .orderBy(desc(skillVersions.publishedAt))
      .limit(1);

    const version = versionRows[0];
    let skillContent = '';

    if (version) {
      const fileRows = await db
        .select({
          content: skillFiles.content
        })
        .from(skillFiles)
        .where(and(eq(skillFiles.skillVersionId, version.id), eq(skillFiles.path, 'SKILL.md')))
        .limit(1);

      skillContent = fileRows[0]?.content || '';
    }

    return NextResponse.json({
      name: skill.name,
      slug: skill.slug,
      description: skill.description,
      category: skill.category,
      currentVersion: skill.currentVersion || version?.version || '1.0.0',
      ownerUsername: skill.ownerUsername || 'unknown',
      createdAt: skill.createdAt,
      starsCount: skill.starsCount,
      installsCount: skill.installsCount + 1, // Return the incremented install count
      skillContent
    });
  } catch (error) {
    console.error('Failed to retrieve skill JSON details:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

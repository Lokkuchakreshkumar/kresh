import { and, desc, eq, or, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { skillFiles, skills, skillVersions, users } from '@/db/schema';
import { decrypt } from '@/lib/auth';

export async function GET(request, { params }) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug || '');

    // Extract optional CLI token
    const authHeader = request.headers.get('authorization');
    let authenticatedUserId = null;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      try {
        const sessionData = await decrypt(token);
        if (sessionData) {
          authenticatedUserId = sessionData.userId;
        }
      } catch (err) {
        console.error('Invalid CLI auth token:', err);
      }
    }

    const whereClause = authenticatedUserId 
      ? and(eq(skills.slug, slug), or(eq(skills.visibility, 'public'), eq(skills.ownerId, authenticatedUserId)))
      : and(eq(skills.slug, slug), eq(skills.visibility, 'public'));

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
      .where(whereClause)
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
          path: skillFiles.path,
          content: skillFiles.content,
          fileType: skillFiles.fileType
        })
        .from(skillFiles)
        .where(eq(skillFiles.skillVersionId, version.id));

      const skillMdFile = fileRows.find(f => f.path === 'SKILL.md');
      skillContent = skillMdFile?.content || '';
      
      // We attach the whole array so the CLI can download the full folder structure
      version.files = fileRows;
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
      skillContent,
      files: version?.files || []
    });
  } catch (error) {
    console.error('Failed to retrieve skill JSON details:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

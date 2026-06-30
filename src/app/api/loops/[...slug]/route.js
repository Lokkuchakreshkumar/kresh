import { and, desc, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { skillFiles, skills, skillVersions } from '@/db/schema';

export async function GET(request, { params }) {
  try {
    const { slug: rawSlug } = await params;
    const slug = decodeURIComponent(Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug || '').toLowerCase().replace(/^@/, '');

    // Query DB for skill with category 'loops' matching this slug case-insensitively
    const loopRows = await db
      .select({
        id: skills.id,
        name: skills.name,
        slug: skills.slug,
        currentVersion: skills.currentVersion
      })
      .from(skills)
      .where(
        and(
          eq(skills.category, 'loops'),
          eq(sql`LOWER(REPLACE(${skills.slug}, '@', ''))`, slug)
        )
      )
      .limit(1);

    const loop = loopRows[0];
    if (!loop) {
      return NextResponse.json({ error: 'Loop not found.' }, { status: 404 });
    }

    // Get latest version
    const versionRows = await db
      .select({
        id: skillVersions.id,
        version: skillVersions.version
      })
      .from(skillVersions)
      .where(eq(skillVersions.skillId, loop.id))
      .orderBy(desc(skillVersions.publishedAt))
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

      // Prefer loop.yaml, fallback to SKILL.md or first file
      const loopFile = fileRows.find(f => f.path === 'loop.yaml') || fileRows.find(f => f.path === 'SKILL.md') || fileRows[0];
      loopText = loopFile?.content || '';
    }

    return NextResponse.json({
      name: loop.name,
      text: loopText
    });
  } catch (error) {
    console.error('Failed to retrieve loop details:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

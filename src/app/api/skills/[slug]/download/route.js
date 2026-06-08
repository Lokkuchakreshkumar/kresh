import { and, desc, eq, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { skillFiles, skills, skillVersions } from '@/db/schema';

function safeDownloadName(slug) {
  return `${String(slug || 'skill').replace(/[^a-zA-Z0-9-]/g, '-')}-SKILL.md`;
}

export async function GET(request, { params }) {
  try {
    const { slug } = await params;

    const skillRows = await db
      .select({
        id: skills.id,
        slug: skills.slug
      })
      .from(skills)
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

    const versionRows = await db
      .select({
        id: skillVersions.id
      })
      .from(skillVersions)
      .where(eq(skillVersions.skillId, skill.id))
      .orderBy(desc(skillVersions.publishedAt))
      .limit(1);

    const version = versionRows[0];
    if (!version) {
      return NextResponse.json({ error: 'SKILL.md not found.' }, { status: 404 });
    }

    const fileRows = await db
      .select({
        content: skillFiles.content
      })
      .from(skillFiles)
      .where(and(eq(skillFiles.skillVersionId, version.id), eq(skillFiles.path, 'SKILL.md')))
      .limit(1);

    const content = fileRows[0]?.content;
    if (!content) {
      return NextResponse.json({ error: 'SKILL.md not found.' }, { status: 404 });
    }

    return new NextResponse(content, {
      status: 200,
      headers: {
        'Content-Type': 'text/markdown; charset=utf-8',
        'Content-Disposition': `attachment; filename="${safeDownloadName(skill.slug)}"`
      }
    });
  } catch (error) {
    console.error('Failed to download skill markdown:', error);
    return NextResponse.json({ error: 'Could not download SKILL.md.' }, { status: 500 });
  }
}

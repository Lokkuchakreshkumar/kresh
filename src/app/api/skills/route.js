import { and, desc, eq, like, or, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { skills, users } from '@/db/schema';

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q')?.trim() || '';

    let dbQuery = db
      .select({
        name: skills.name,
        slug: skills.slug,
        description: skills.description,
        category: skills.category,
        currentVersion: skills.currentVersion,
        starsCount: skills.starsCount,
        installsCount: skills.installsCount,
        createdAt: skills.createdAt,
        ownerUsername: users.username
      })
      .from(skills)
      .leftJoin(users, eq(skills.ownerId, users.id))
      .where(eq(skills.visibility, 'public'));

    if (query) {
      const searchPattern = `%${query.toLowerCase()}%`;
      dbQuery = dbQuery.where(
        and(
          eq(skills.visibility, 'public'),
          or(
            like(sql`lower(${skills.name})`, searchPattern),
            like(sql`lower(${skills.description})`, searchPattern),
            like(sql`lower(${skills.slug})`, searchPattern)
          )
        )
      );
    }

    const results = await dbQuery.orderBy(desc(skills.createdAt)).limit(50);

    return NextResponse.json(results);
  } catch (error) {
    console.error('Failed to query search skills:', error);
    return NextResponse.json({ error: 'Internal server error.' }, { status: 500 });
  }
}

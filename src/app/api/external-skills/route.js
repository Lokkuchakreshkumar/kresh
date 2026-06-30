import { and, asc, count, eq, gt, ilike, or } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { externalSkills } from '@/db/schema';
import { toExternalSkillDto } from '@/lib/externalSkills';

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const cursor = Math.max(0, Number(params.get('cursor') || 0));
    const limit = Math.min(50, Math.max(1, Number(params.get('limit') || 20)));
    const query = params.get('q')?.trim();
    const baseConditions = [eq(externalSkills.isAvailable, true)];
    if (query) {
      baseConditions.push(or(
        ilike(externalSkills.name, `%${query}%`),
        ilike(externalSkills.description, `%${query}%`),
        ilike(externalSkills.externalId, `%${query}%`)
      ));
    }
    const conditions = [...baseConditions, gt(externalSkills.upstreamRank, cursor)];

    const [rows, totalRows] = await Promise.all([
      db.select().from(externalSkills)
        .where(and(...conditions))
        .orderBy(asc(externalSkills.upstreamRank))
        .limit(limit + 1),
      db.select({ value: count() }).from(externalSkills).where(and(...baseConditions))
    ]);
    const hasMore = rows.length > limit;
    const items = rows.slice(0, limit).map(toExternalSkillDto);
    return NextResponse.json({ items, total: totalRows[0]?.value || 0, nextCursor: hasMore ? items.at(-1)?.upstreamRank : null });
  } catch (error) {
    console.error('Failed to list imported skills:', error);
    return NextResponse.json({ error: 'Could not load imported skills.' }, { status: 500 });
  }
}

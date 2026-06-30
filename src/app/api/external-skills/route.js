import { NextResponse } from 'next/server';
import { getVercelOidcToken } from '@vercel/oidc';
import { toExternalSkillDto } from '@/lib/externalSkills';
import { fetchSkillsShSkillList } from '@/lib/skillsShClient';

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const page = Math.max(0, Number(params.get('cursor') || 0));
    const limit = Math.min(50, Math.max(1, Number(params.get('limit') || 20)));
    const query = params.get('q')?.trim() || '';
    const live = await fetchSkillsShSkillList({ page, perPage: limit, query }, getVercelOidcToken);
    if (!live) {
      return NextResponse.json({ error: 'Could not load imported skills.' }, { status: 502 });
    }
    return NextResponse.json({
      items: live.items.map(toExternalSkillDto),
      total: live.total ?? live.items.length,
      nextCursor: live.hasMore ? live.nextPage : null
    });
  } catch (error) {
    console.error('Failed to list imported skills:', error);
    return NextResponse.json({ error: 'Could not load imported skills.' }, { status: 500 });
  }
}

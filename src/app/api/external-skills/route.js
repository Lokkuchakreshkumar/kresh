import { NextResponse } from 'next/server';
import { getVercelOidcToken } from '@vercel/oidc';
import { toExternalSkillDto } from '@/lib/externalSkills';
import { fetchSkillsShSkillList } from '@/lib/skillsShClient';

export async function GET(request) {
  try {
    const params = new URL(request.url).searchParams;
    const cursor = Math.max(0, Number(params.get('cursor') || 0));
    const limit = Math.min(500, Math.max(1, Number(params.get('limit') || 500)));
    const query = params.get('q')?.trim() || '';
    
    const CHUNK_SIZE = 100;
    const numChunks = Math.ceil(limit / CHUNK_SIZE);
    
    const startUpstreamPage = cursor;
    
    const fetchPromises = [];
    for (let i = 0; i < numChunks; i++) {
      const p = startUpstreamPage + i;
      fetchPromises.push(
        fetchSkillsShSkillList({ page: p, perPage: CHUNK_SIZE, query }, getVercelOidcToken)
      );
    }
    
    const results = await Promise.all(fetchPromises);
    
    let combinedItems = [];
    let total = 0;
    
    for (const res of results) {
      if (!res) continue;
      if (res.items && Array.isArray(res.items)) {
        combinedItems = combinedItems.concat(res.items);
      }
      total = res.total > total ? res.total : total;
    }
    
    const lastValidRes = results.reverse().find(r => r != null);
    const hasMore = lastValidRes ? lastValidRes.hasMore : false;
    
    return NextResponse.json({
      items: combinedItems.slice(0, limit).map(toExternalSkillDto),
      total: total,
      nextCursor: hasMore ? cursor + numChunks : null
    });
  } catch (error) {
    console.error('Failed to list imported skills:', error);
    return NextResponse.json({ error: 'Could not load imported skills.' }, { status: 500 });
  }
}

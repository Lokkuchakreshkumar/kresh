import crypto from 'crypto';
import { getVercelOidcToken } from '@vercel/oidc';
import { eq, lt, sql } from 'drizzle-orm';
import { NextResponse } from 'next/server';
import { db } from '@/db';
import { externalSkills, externalSkillSyncState } from '@/db/schema';
import { normalizeSkillsShSkill } from '@/lib/externalSkills';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

const SOURCE = 'skills.sh';
const PAGE_SIZE = 100;
const DETAIL_CONCURRENCY = 10;

function isAuthorized(request) {
  const secret = process.env.SKILLS_SYNC_SECRET || process.env.CRON_SECRET;
  const header = request.headers.get('authorization');
  return Boolean(secret && header === `Bearer ${secret}`);
}

async function getOidcToken() {
  if (process.env.SKILLS_SH_OIDC_TOKEN) return process.env.SKILLS_SH_OIDC_TOKEN;
  return getVercelOidcToken();
}

function readFrontmatterDescription(contents) {
  try {
    if (typeof contents !== 'string' || !contents.startsWith('---')) return null;
    const frontmatter = contents.split(/^---\s*$/m)[1] || '';
    const match = frontmatter.match(/^description:\s*(.*)$/m);
    if (!match) return null;
    const inline = match[1].trim();
    if (inline && !/^[>|][+-]?$/.test(inline)) return inline.replace(/^['"]|['"]$/g, '').slice(0, 4000) || null;
    const remainder = frontmatter.slice((match.index || 0) + match[0].length).split(/\r?\n/);
    const folded = [];
    for (const line of remainder) {
      if (!line.trim()) {
        if (folded.length) folded.push('');
        continue;
      }
      if (!/^\s+/.test(line)) break;
      folded.push(line.trim());
    }
    return folded.join(' ').replace(/\s+/g, ' ').trim().slice(0, 4000) || null;
  } catch (error) {
    return null;
  }
}

async function fetchDescriptions(entries, oidcToken) {
  const descriptions = new Map();
  for (let offset = 0; offset < entries.length; offset += DETAIL_CONCURRENCY) {
    const chunk = entries.slice(offset, offset + DETAIL_CONCURRENCY);
    const results = await Promise.allSettled(chunk.map(async (entry) => {
      const externalId = String(entry.id || '').replace(/^\/+|\/+$/g, '');
      if (!externalId) return null;
      const idPath = externalId.split('/').map(encodeURIComponent).join('/');
      const response = await fetch(`https://skills.sh/api/v1/skills/${idPath}`, {
        headers: { Authorization: `Bearer ${oidcToken}`, Accept: 'application/json' },
        cache: 'no-store',
        signal: AbortSignal.timeout(15000)
      });
      if (!response.ok) return null;
      const detail = await response.json();
      const skillFile = (detail.files || []).find((file) => String(file.path || '').toLowerCase() === 'skill.md');
      return { externalId, description: readFrontmatterDescription(skillFile?.contents) };
    }));
    results.forEach((result) => {
      if (result.status === 'fulfilled' && result.value?.description) descriptions.set(result.value.externalId, result.value.description);
    });
    if (offset + DETAIL_CONCURRENCY < entries.length) await new Promise((resolve) => setTimeout(resolve, 1000));
  }
  return descriptions;
}

export async function POST(request) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: 'Unauthorized.' }, { status: 401 });
  }

  try {
    const enrich = new URL(request.url).searchParams.get('enrich') !== 'false';
    const stateRows = await db.select().from(externalSkillSyncState).where(eq(externalSkillSyncState.source, SOURCE)).limit(1);
    const state = stateRows[0];
    const page = Math.max(0, state?.nextPage ?? 0);
    const runStartedAt = page === 0 || !state?.runStartedAt ? new Date() : state.runStartedAt;
    const oidcToken = await getOidcToken();
    const response = await fetch(`https://skills.sh/api/v1/skills?view=all-time&page=${page}&per_page=${PAGE_SIZE}`, {
      headers: { Authorization: `Bearer ${oidcToken}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000)
    });

    if (!response.ok) {
      const retryAfter = response.headers.get('retry-after');
      throw new Error(`skills.sh returned ${response.status}${retryAfter ? `; retry after ${retryAfter}s` : ''}`);
    }

    const payload = await response.json();
    const entries = Array.isArray(payload) ? payload : payload.skills || payload.data || payload.items || [];
    const explicitHasMore = payload.has_more ?? payload.hasMore;
    const hasMore = typeof explicitHasMore === 'boolean'
      ? explicitHasMore
      : Boolean(payload.next_page || payload.nextPage) || entries.length === PAGE_SIZE;
    const descriptions = enrich ? await fetchDescriptions(entries, oidcToken) : new Map();
    const normalized = entries
      .map((entry, index) => normalizeSkillsShSkill({ ...entry, description: descriptions.get(entry.id) || entry.description }, (page * PAGE_SIZE) + index + 1))
      .filter(Boolean);

    await db.transaction(async (tx) => {
      if (normalized.length > 0) {
        await tx.insert(externalSkills).values(normalized.map((entry) => ({ id: crypto.randomUUID(), ...entry }))).onConflictDoUpdate({
          target: externalSkills.externalId,
          set: {
            kreshSlug: sql`excluded.kresh_slug`,
            name: sql`excluded.name`,
            description: sql`excluded.description`,
            sourceOwner: sql`excluded.source_owner`,
            sourceRepository: sql`excluded.source_repository`,
            sourceUrl: sql`excluded.source_url`,
            skillSelector: sql`excluded.skill_selector`,
            upstreamUrl: sql`excluded.upstream_url`,
            upstreamInstalls: sql`excluded.upstream_installs`,
            upstreamRank: sql`excluded.upstream_rank`,
            isInstallable: sql`excluded.is_installable`,
            isAvailable: true,
            lastSeenAt: sql`excluded.last_seen_at`,
            updatedAt: sql`excluded.updated_at`
          }
        });
      }

      if (!hasMore || entries.length === 0) {
        await tx.update(externalSkills).set({ isAvailable: false, updatedAt: new Date() })
          .where(lt(externalSkills.lastSeenAt, runStartedAt));
      }

      await tx.insert(externalSkillSyncState).values({
        source: SOURCE,
        nextPage: hasMore && entries.length > 0 ? page + 1 : 0,
        runStartedAt: hasMore && entries.length > 0 ? runStartedAt : null,
        completedAt: hasMore && entries.length > 0 ? state?.completedAt || null : new Date(),
        updatedAt: new Date(),
        lastError: null
      }).onConflictDoUpdate({
        target: externalSkillSyncState.source,
        set: {
          nextPage: hasMore && entries.length > 0 ? page + 1 : 0,
          runStartedAt: hasMore && entries.length > 0 ? runStartedAt : null,
          completedAt: hasMore && entries.length > 0 ? state?.completedAt || null : new Date(),
          updatedAt: new Date(),
          lastError: null
        }
      });
    });

    return NextResponse.json({ page, imported: normalized.length, nextPage: hasMore && entries.length > 0 ? page + 1 : null });
  } catch (error) {
    console.error('skills.sh metadata sync failed:', error);
    try {
      await db.insert(externalSkillSyncState).values({ source: SOURCE, lastError: error.message, updatedAt: new Date() })
        .onConflictDoUpdate({ target: externalSkillSyncState.source, set: { lastError: error.message, updatedAt: new Date() } });
    } catch (stateError) {
      console.error('Failed to record skills.sh sync error:', stateError);
    }
    return NextResponse.json({ error: 'Sync failed safely.' }, { status: 502 });
  }
}

export const GET = POST;

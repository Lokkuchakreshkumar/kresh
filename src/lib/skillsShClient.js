import { readFrontmatterDescription } from '@/lib/skillFrontmatter';
import {
  mapSkillsShFiles,
  normalizeSkillsShSkill,
  parseSkillsShListPayload
} from '@/lib/externalSkills';
import { and, desc, eq, like, or, sql, asc } from 'drizzle-orm';
import { db } from '@/db';
import { externalSkills } from '@/db/schema';

async function resolveToken(getOidcToken) {
  if (process.env.SKILLS_SH_OIDC_TOKEN) return process.env.SKILLS_SH_OIDC_TOKEN;
  if (process.env.VERCEL_OIDC_TOKEN) return process.env.VERCEL_OIDC_TOKEN;
  if (typeof getOidcToken !== 'function') return null;
  try {
    return await getOidcToken();
  } catch (error) {
    console.warn('OIDC token resolution failed, proceeding with database fallback:', error.message || error);
    return null;
  }
}

async function fetchSkillsShSkillListFromDb({ page = 0, perPage = 20, query = '' }) {
  try {
    let dbQuery = db
      .select()
      .from(externalSkills)
      .where(eq(externalSkills.isAvailable, true));

    if (query) {
      const searchPattern = `%${query.toLowerCase()}%`;
      dbQuery = dbQuery.where(
        and(
          eq(externalSkills.isAvailable, true),
          or(
            like(sql`lower(${externalSkills.name})`, searchPattern),
            like(sql`lower(${externalSkills.description})`, searchPattern),
            like(sql`lower(${externalSkills.kreshSlug})`, searchPattern),
            like(sql`lower(${externalSkills.skillSelector})`, searchPattern)
          )
        )
      );
    }

    const dbItems = await dbQuery
      .orderBy(asc(externalSkills.upstreamRank), desc(externalSkills.upstreamInstalls))
      .offset(page * perPage)
      .limit(perPage + 1);

    const hasMore = dbItems.length > perPage;
    const nextPage = hasMore ? page + 1 : null;
    const entries = dbItems.slice(0, perPage);

    const items = entries
      .map((entry, index) => {
        return normalizeSkillsShSkill({
          id: entry.externalId,
          slug: entry.skillSelector,
          source: entry.sourceUrl || `${entry.sourceOwner}/${entry.sourceRepository}`,
          name: entry.name,
          description: entry.description,
          installs: entry.upstreamInstalls,
          rank: entry.upstreamRank,
          owner: entry.sourceOwner
        }, entry.upstreamRank || (page * perPage) + index + 1);
      })
      .filter(Boolean);

    let countQuery = db
      .select({ count: sql`count(*)` })
      .from(externalSkills)
      .where(eq(externalSkills.isAvailable, true));

    if (query) {
      const searchPattern = `%${query.toLowerCase()}%`;
      countQuery = db
        .select({ count: sql`count(*)` })
        .from(externalSkills)
        .where(
          and(
            eq(externalSkills.isAvailable, true),
            or(
              like(sql`lower(${externalSkills.name})`, searchPattern),
              like(sql`lower(${externalSkills.description})`, searchPattern),
              like(sql`lower(${externalSkills.kreshSlug})`, searchPattern),
              like(sql`lower(${externalSkills.skillSelector})`, searchPattern)
            )
          )
        );
    }

    const countResult = await countQuery;
    const total = Number(countResult[0]?.count || 0);

    return { items, hasMore, total, nextPage };
  } catch (dbError) {
    console.error('Failed to list skills.sh skills from database fallback:', dbError);
    return null;
  }
}

async function fetchLiveExternalSkillFromDb(externalId) {
  try {
    const normalizedId = String(externalId || '').replace(/^\/+|\/+$/g, '');
    if (!normalizedId) return null;
    const dbRows = await db
      .select()
      .from(externalSkills)
      .where(eq(externalSkills.externalId, normalizedId))
      .limit(1);
    const entry = dbRows[0];
    if (!entry) return null;

    const metadata = normalizeSkillsShSkill({
      id: entry.externalId,
      slug: entry.skillSelector,
      source: entry.sourceUrl || `${entry.sourceOwner}/${entry.sourceRepository}`,
      name: entry.name,
      description: entry.description,
      installs: entry.upstreamInstalls,
      rank: entry.upstreamRank,
      owner: entry.sourceOwner
    }, entry.upstreamRank);

    if (!metadata) return null;

    const markdown = `# ${entry.name}\n\n${entry.description || 'No description available.'}`;
    return {
      metadata,
      markdown,
      summary: entry.description,
      description: entry.description,
      files: []
    };
  } catch (dbError) {
    console.error('Failed to load external skill from database fallback:', dbError);
    return null;
  }
}

export async function fetchSkillsShSkillList({ page = 0, perPage = 20, query = '', view = 'all-time' }, getOidcToken) {
  try {
    const token = await resolveToken(getOidcToken);
    if (!token) {
      throw new Error('No VERCEL_OIDC_TOKEN available. The skills.sh live API requires authentication.');
    }
    
    let apiUrl, params;
    
    if (query) {
      params = new URLSearchParams({ q: query, limit: '50' });
      apiUrl = `https://skills.sh/api/v1/skills/search?${params}`;
    } else {
      params = new URLSearchParams({ view, page: String(page), per_page: String(perPage) });
      apiUrl = `https://skills.sh/api/v1/skills?${params}`;
    }

    const response = await fetch(apiUrl, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000)
    });
    
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('VERCEL_OIDC_TOKEN is expired or invalid. Please update the token in .env.local to access the live API.');
      }
      throw new Error(`Live API returned status ${response.status}`);
    }
    const payload = await response.json();
    let { entries, hasMore, total, nextPage } = parseSkillsShListPayload(payload, page, perPage);
    
    if (query) {
      hasMore = false;
      nextPage = null;
    }
    
    const items = entries
      .map((entry, index) => normalizeSkillsShSkill(entry, (page * perPage) + index + 1))
      .filter(Boolean);
    return { items, hasMore, total, nextPage };
  } catch (error) {
    console.error('Failed to list skills.sh skills from live API:', error.message);
    throw error;
  }
}

export async function fetchLiveExternalSkill(externalId, getOidcToken) {
  try {
    const normalizedId = String(externalId || '').replace(/^\/+|\/+$/g, '');
    if (!normalizedId) return null;
    const token = await resolveToken(getOidcToken);
    if (!token) {
      throw new Error('No VERCEL_OIDC_TOKEN available. The skills.sh live API requires authentication.');
    }
    const idPath = normalizedId.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`https://skills.sh/api/v1/skills/${idPath}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) {
      if (response.status === 401) {
        throw new Error('VERCEL_OIDC_TOKEN is expired or invalid. Please update the token in .env.local to access the live API.');
      }
      throw new Error(`Live API returned status ${response.status}`);
    }
    const detail = await response.json();
    const files = mapSkillsShFiles(detail.files);
    const markdown = files.find((file) => file.path.toLowerCase() === 'skill.md')?.content || '';
    const summary = detail.summary ? String(detail.summary) : null;
    const description = detail.description
      ? String(detail.description)
      : readFrontmatterDescription(markdown);
    const metadata = normalizeSkillsShSkill({
      id: normalizedId,
      name: detail.name,
      slug: detail.slug || detail.skill,
      source: detail.source || detail.repository,
      description,
      installs: detail.installs ?? detail.installCount,
      rank: detail.rank,
      owner: detail.owner
    }, detail.rank);
    if (!metadata) {
      throw new Error('Failed to normalize skill metadata from live API response.');
    }
    return { metadata, markdown, summary, description, files };
  } catch (error) {
    console.error('Failed to load live external skill from API:', error.message);
    throw error;
  }
}

export async function fetchSkillsShSkillDetail(externalId, getOidcToken) {
  const live = await fetchLiveExternalSkill(externalId, getOidcToken);
  if (!live) return { markdown: '', summary: null, description: null, files: [] };
  return {
    markdown: live.markdown,
    summary: live.summary,
    description: live.description,
    files: live.files
  };
}


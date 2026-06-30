import { readFrontmatterDescription } from '@/lib/skillFrontmatter';
import {
  mapSkillsShFiles,
  normalizeSkillsShSkill,
  parseSkillsShListPayload
} from '@/lib/externalSkills';

async function resolveToken(getOidcToken) {
  if (process.env.SKILLS_SH_OIDC_TOKEN) return process.env.SKILLS_SH_OIDC_TOKEN;
  return getOidcToken();
}

export async function fetchSkillsShSkillList({ page = 0, perPage = 20, query = '', view = 'all-time' }, getOidcToken) {
  try {
    const token = await resolveToken(getOidcToken);
    const params = new URLSearchParams({ view, page: String(page), per_page: String(perPage) });
    if (query) params.set('q', query);
    const response = await fetch(`https://skills.sh/api/v1/skills?${params}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(20000)
    });
    if (!response.ok) return null;
    const payload = await response.json();
    const { entries, hasMore, total, nextPage } = parseSkillsShListPayload(payload, page, perPage);
    const needle = query.trim().toLowerCase();
    const filtered = needle
      ? entries.filter((entry) => {
          const haystack = `${entry.id || ''} ${entry.name || ''} ${entry.description || ''} ${entry.slug || ''}`.toLowerCase();
          return haystack.includes(needle);
        })
      : entries;
    const items = filtered
      .map((entry, index) => normalizeSkillsShSkill(entry, (page * perPage) + index + 1))
      .filter(Boolean);
    return { items, hasMore, total, nextPage };
  } catch (error) {
    console.error('Failed to list skills.sh skills:', error);
    return null;
  }
}

export async function fetchLiveExternalSkill(externalId, getOidcToken) {
  try {
    const normalizedId = String(externalId || '').replace(/^\/+|\/+$/g, '');
    if (!normalizedId) return null;
    const token = await resolveToken(getOidcToken);
    const idPath = normalizedId.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`https://skills.sh/api/v1/skills/${idPath}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) return null;
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
    if (!metadata) return null;
    return { metadata, markdown, summary, description, files };
  } catch (error) {
    console.error('Failed to load live external skill:', error);
    return null;
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

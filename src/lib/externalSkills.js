const GITHUB_REPOSITORY = /^https:\/\/github\.com\/([A-Za-z0-9](?:[A-Za-z0-9-]{0,38}))\/([A-Za-z0-9._-]+?)\/?$/;
const SAFE_SELECTOR = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/;

export function parseGitHubSource(source) {
  try {
    const normalized = source?.startsWith('http') ? source : `https://github.com/${source || ''}`;
    const match = normalized.match(GITHUB_REPOSITORY);
    if (!match || match[2].endsWith('.git')) return null;
    return {
      owner: match[1],
      repository: match[2],
      url: `https://github.com/${match[1]}/${match[2]}`
    };
  } catch (error) {
    console.error('Failed to parse external GitHub source:', error);
    return null;
  }
}

export function isSafeSkillSelector(value) {
  return typeof value === 'string' && SAFE_SELECTOR.test(value) && !value.includes('..');
}

export function normalizeSkillsShSkill(raw, fallbackRank) {
  try {
    const externalId = String(raw.id || '').replace(/^\/+|\/+$/g, '');
    const selector = String(raw.slug || raw.skill || externalId.split('/').pop() || '');
    const source = raw.source || raw.repository || externalId.split('/').slice(0, -1).join('/');
    const github = parseGitHubSource(source);
    if (!externalId || !isSafeSkillSelector(selector)) return null;

    return {
      externalId,
      kreshSlug: `external/${externalId}`,
      name: String(raw.name || selector).slice(0, 240),
      description: raw.description ? String(raw.description) : null,
      sourceOwner: github?.owner || raw.owner || null,
      sourceRepository: github?.repository || null,
      sourceUrl: github?.url || null,
      skillSelector: selector,
      upstreamUrl: `https://skills.sh/${externalId}`,
      upstreamInstalls: Number(raw.installs || raw.installCount || 0) || 0,
      upstreamRank: Number(raw.rank || fallbackRank) || null,
      isInstallable: Boolean(github),
      isAvailable: true,
      lastSeenAt: new Date(),
      updatedAt: new Date()
    };
  } catch (error) {
    console.error('Failed to normalize skills.sh entry:', error);
    return null;
  }
}

export function mapSkillsShFiles(detailFiles) {
  return (detailFiles || [])
    .map((file) => ({
      path: String(file.path || ''),
      content: String(file.contents ?? file.content ?? ''),
      fileType: /\.(png|jpe?g|gif|webp|svg)$/i.test(String(file.path || '')) ? 'image' : 'text'
    }))
    .filter((file) => file.path && file.content);
}

export function readSkillsShTotal(payload) {
  if (!payload || typeof payload !== 'object') return null;
  const candidates = [
    payload.total,
    payload.total_count,
    payload.totalCount,
    payload.count,
    payload.meta?.total,
    payload.meta?.total_count,
    payload.pagination?.total,
    payload.pagination?.total_count
  ];
  for (const value of candidates) {
    const num = Number(value);
    if (Number.isFinite(num) && num > 0) return num;
  }
  return null;
}

export function parseSkillsShListPayload(payload, page, perPage) {
  const entries = Array.isArray(payload) ? payload : payload.skills || payload.data || payload.items || [];
  const explicitHasMore = payload.has_more ?? payload.hasMore;
  const hasMore = typeof explicitHasMore === 'boolean'
    ? explicitHasMore
    : Boolean(payload.next_page ?? payload.nextPage) || entries.length === perPage;
  const total = readSkillsShTotal(payload);
  const nextPage = hasMore && entries.length > 0 ? page + 1 : null;
  return { entries, hasMore, total, nextPage };
}

export function externalIdFromKreshSlug(slug) {
  return String(slug || '').replace(/^external\//, '').replace(/^\/+|\/+$/g, '');
}

export function toExternalInstallPayload(metadata, upstream) {
  return {
    name: metadata.name,
    slug: metadata.kreshSlug,
    description: upstream.description || metadata.description,
    category: 'Imported skill',
    currentVersion: 'upstream',
    ownerUsername: metadata.sourceOwner || 'upstream',
    installsCount: metadata.upstreamInstalls,
    skillContent: upstream.markdown,
    files: upstream.files,
    installStrategy: metadata.isInstallable ? 'external-npx' : 'unsupported-external',
    source: metadata.isInstallable ? {
      type: 'github',
      url: metadata.sourceUrl,
      skillSelector: metadata.skillSelector
    } : null,
    attribution: {
      owner: metadata.sourceOwner,
      repository: metadata.sourceRepository,
      skillsShUrl: metadata.upstreamUrl
    }
  };
}

export function toExternalSkillDto(skill) {
  return {
    id: skill.id || skill.externalId,
    slug: skill.kreshSlug,
    name: skill.name,
    description: skill.description,
    category: 'Imported skill',
    currentVersion: 'upstream',
    installsCount: skill.upstreamInstalls,
    starsCount: 0,
    createdAt: skill.firstSeenAt || skill.lastSeenAt || null,
    ownerUsername: skill.sourceOwner || 'upstream',
    external: true,
    upstreamRank: skill.upstreamRank,
    upstreamUrl: skill.upstreamUrl,
    sourceUrl: skill.sourceUrl,
    skillSelector: skill.skillSelector,
    isInstallable: skill.isInstallable
  };
}

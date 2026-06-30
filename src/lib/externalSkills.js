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

export function toExternalSkillDto(skill) {
  return {
    id: skill.id,
    slug: skill.kreshSlug,
    name: skill.name,
    description: skill.description,
    category: 'Imported skill',
    currentVersion: 'upstream',
    installsCount: skill.upstreamInstalls,
    starsCount: 0,
    createdAt: skill.firstSeenAt,
    ownerUsername: skill.sourceOwner || 'upstream',
    external: true,
    upstreamRank: skill.upstreamRank,
    upstreamUrl: skill.upstreamUrl,
    sourceUrl: skill.sourceUrl,
    skillSelector: skill.skillSelector,
    isInstallable: skill.isInstallable
  };
}

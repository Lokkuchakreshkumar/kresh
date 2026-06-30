import test from 'node:test';
import assert from 'node:assert/strict';
import { isSafeSkillSelector, normalizeSkillsShSkill, parseGitHubSource } from '../src/lib/externalSkills.js';

test('normalizes a skills.sh leaderboard entry without file content', () => {
  const entry = normalizeSkillsShSkill({
    id: 'vercel-labs/skills/find-skills',
    source: 'vercel-labs/skills',
    slug: 'find-skills',
    name: 'Find skills',
    installs: 1200
  }, 3);
  assert.equal(entry.kreshSlug, 'external/vercel-labs/skills/find-skills');
  assert.equal(entry.sourceUrl, 'https://github.com/vercel-labs/skills');
  assert.equal(entry.upstreamRank, 3);
  assert.equal(entry.isInstallable, true);
  assert.equal('files' in entry, false);
});

test('rejects unsafe selectors and malformed GitHub repositories', () => {
  assert.equal(isSafeSkillSelector('../secret'), false);
  assert.equal(isSafeSkillSelector('skill;echo bad'), false);
  assert.equal(parseGitHubSource('https://example.com/a/b'), null);
  assert.equal(normalizeSkillsShSkill({ id: 'a/b/bad;skill', source: 'a/b', slug: 'bad;skill' }, 1), null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { isSafeSkillSelector, mapSkillsShFiles, normalizeSkillsShSkill, parseGitHubSource, parseSkillsShListPayload, readSkillsShTotal } from '../src/lib/externalSkills.js';

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

test('maps skills.sh file payloads for CLI installs', () => {
  const files = mapSkillsShFiles([
    { path: 'SKILL.md', contents: '---\nname: find-skills\n---\n# Find skills' },
    { path: 'scripts/helper.sh', contents: '#!/bin/sh' },
    { path: 'empty.txt', contents: '' }
  ]);
  assert.equal(files.length, 2);
  assert.equal(files[0].path, 'SKILL.md');
  assert.match(files[0].content, /Find skills/);
  assert.equal(files[1].fileType, 'text');
});

test('parses skills.sh list pagination metadata', () => {
  const parsed = parseSkillsShListPayload({
    skills: [{ id: 'a/b/skill-one' }, { id: 'a/b/skill-two' }],
    total: 857000,
    has_more: true
  }, 0, 2);
  assert.equal(parsed.entries.length, 2);
  assert.equal(parsed.total, 857000);
  assert.equal(parsed.hasMore, true);
  assert.equal(parsed.nextPage, 1);
});

test('reads nested skills.sh total fields', () => {
  assert.equal(readSkillsShTotal({ pagination: { total_count: 12000 } }), 12000);
  assert.equal(readSkillsShTotal({ skills: [] }), null);
});

import test from 'node:test';
import assert from 'node:assert/strict';
import { validateExternalInstall } from '../src/services/externalInstaller.js';
import { canonicalRepository } from '../src/services/trust.js';

test('accepts structured HTTPS GitHub metadata', () => {
  assert.deepEqual(validateExternalInstall({
    type: 'github',
    url: 'https://github.com/vercel-labs/skills',
    skillSelector: 'find-skills'
  }), { url: 'https://github.com/vercel-labs/skills', selector: 'find-skills' });
});

test('rejects command injection and unsafe sources', () => {
  const attempts = [
    { type: 'github', url: 'https://evil.example/repo', skillSelector: 'safe' },
    { type: 'github', url: 'https://github.com/a/b;rm', skillSelector: 'safe' },
    { type: 'github', url: 'https://github.com/a/b', skillSelector: 'x; rm -rf /' },
    { type: 'github', url: 'file:///tmp/repo', skillSelector: 'safe' },
    { type: 'github', url: 'https://github.com/a/b', skillSelector: '../secret' }
  ];
  attempts.forEach((attempt) => assert.equal(validateExternalInstall(attempt), null));
});

test('canonicalizes repository trust keys', () => {
  assert.equal(canonicalRepository('https://github.com/Vercel-Labs/Skills'), 'https://github.com/vercel-labs/skills');
  assert.throws(() => canonicalRepository('http://github.com/a/b'));
});

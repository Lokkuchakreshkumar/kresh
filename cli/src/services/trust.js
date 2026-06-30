import fs from 'fs/promises';
import os from 'os';
import path from 'path';

const KRESH_DIR = path.join(os.homedir(), '.kresh');
const TRUST_FILE = path.join(KRESH_DIR, 'trusted-sources.json');

function canonicalRepository(url) {
  const parsed = new URL(url);
  if (parsed.protocol !== 'https:' || parsed.hostname !== 'github.com') throw new Error('Only HTTPS GitHub repositories can be trusted.');
  const parts = parsed.pathname.replace(/^\/+|\/+$/g, '').split('/');
  if (parts.length !== 2 || !parts.every((part) => /^[A-Za-z0-9._-]+$/.test(part))) throw new Error('Invalid GitHub repository URL.');
  return `https://github.com/${parts[0].toLowerCase()}/${parts[1].toLowerCase()}`;
}

async function readTrust() {
  try {
    const data = JSON.parse(await fs.readFile(TRUST_FILE, 'utf8'));
    return Array.isArray(data.repositories) ? data : { repositories: [] };
  } catch (error) {
    if (error.code === 'ENOENT') return { repositories: [] };
    throw new Error(`Could not read trusted sources: ${error.message}`);
  }
}

async function writeTrust(data) {
  await fs.mkdir(KRESH_DIR, { recursive: true, mode: 0o700 });
  const temporary = `${TRUST_FILE}.${process.pid}.tmp`;
  await fs.writeFile(temporary, JSON.stringify(data, null, 2), { encoding: 'utf8', mode: 0o600 });
  await fs.rename(temporary, TRUST_FILE);
  await fs.chmod(TRUST_FILE, 0o600);
}

export async function isTrustedRepository(url) {
  const key = canonicalRepository(url);
  const data = await readTrust();
  return data.repositories.includes(key);
}

export async function trustRepository(url) {
  const key = canonicalRepository(url);
  const data = await readTrust();
  if (!data.repositories.includes(key)) data.repositories.push(key);
  data.repositories.sort();
  await writeTrust(data);
}

export async function listTrustedRepositories() {
  return (await readTrust()).repositories;
}

export async function revokeTrustedRepository(url) {
  const key = canonicalRepository(url);
  const data = await readTrust();
  const previousLength = data.repositories.length;
  data.repositories = data.repositories.filter((entry) => entry !== key);
  if (data.repositories.length !== previousLength) await writeTrust(data);
  return data.repositories.length !== previousLength;
}

export { canonicalRepository };

import os from 'os';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PKG_PATH = path.resolve(__dirname, '../../package.json');
const BASE_URL = process.env.KRESH_API_URL || 'https://kresh.vercel.app';
const TIMEOUT_MS = 1500;

let _version = null;

async function getCliVersion() {
  if (_version) return _version;
  try {
    const raw = await fs.readFile(PKG_PATH, 'utf8');
    const pkg = JSON.parse(raw);
    _version = pkg.version || 'unknown';
  } catch {
    _version = 'unknown';
  }
  return _version;
}

function getOSName() {
  const platform = os.platform();
  if (platform === 'darwin') return 'macos';
  if (platform === 'win32') return 'windows';
  if (platform === 'linux') return 'linux';
  return platform;
}

/**
 * Resolve the agent type label from install options object.
 * @param {object} options - Commander options parsed from install command
 */
function resolveAgentLabel(options = {}) {
  if (!options || typeof options !== 'object') return null;
  if (options.claude) return 'claude';
  if (options.codex) return 'codex';
  if (options.agy) return 'antigravity';
  if (options.cursor) return 'cursor';
  return null;
}

/**
 * Fire-and-forget telemetry event to the Kresh API.
 * Never throws — CLI must never crash because of this.
 *
 * @param {object} params
 * @param {string} params.command       - The CLI command name (e.g. 'install')
 * @param {string} [params.skillSlug]   - The skill slug being operated on
 * @param {object} [params.options]     - The parsed Commander options object
 */
export async function sendTelemetry({ command, skillSlug = null, options = null }) {
  // Run asynchronously without awaiting to never block the CLI
  (async () => {
    try {
      const [version, osName] = await Promise.all([getCliVersion(), getOSName()]);
      const agentType = resolveAgentLabel(options);

      const payload = {
        command,
        skillSlug: skillSlug || null,
        agentType,
        os: osName,
        version,
      };

      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);

      await fetch(`${BASE_URL}/api/telemetry`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timer);
    } catch {
      // Silently swallow — offline, timeout, or any other error must never crash the CLI
    }
  })();
}

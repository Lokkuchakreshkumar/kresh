import { spawn } from 'child_process';
import inquirer from 'inquirer';
import { logger } from '../utils/logger.js';
import { isTrustedRepository, trustRepository } from './trust.js';

const SAFE_SELECTOR = /^[A-Za-z0-9][A-Za-z0-9._/-]{0,199}$/;

export function validateExternalInstall(source) {
  try {
    if (!source || source.type !== 'github' || typeof source.url !== 'string') return null;
    const url = new URL(source.url);
    const parts = url.pathname.replace(/^\/+|\/+$/g, '').split('/');
    const validRepo = url.protocol === 'https:' && url.hostname === 'github.com' && parts.length === 2 && parts.every((part) => /^[A-Za-z0-9._-]+$/.test(part));
    const selector = source.skillSelector;
    if (!validRepo || typeof selector !== 'string' || !SAFE_SELECTOR.test(selector) || selector.includes('..')) return null;
    return { url: `https://github.com/${parts[0]}/${parts[1]}`, selector };
  } catch (error) {
    return null;
  }
}

function runNpx(args) {
  return new Promise((resolve, reject) => {
    const executable = process.platform === 'win32' ? 'npx.cmd' : 'npx';
    let child;
    try {
      child = spawn(executable, args, { shell: false, stdio: 'inherit' });
    } catch (error) {
      reject(error);
      return;
    }
    child.once('error', reject);
    child.once('exit', (code, signal) => {
      if (signal) reject(new Error(`Upstream installer was interrupted by ${signal}.`));
      else resolve(code ?? 1);
    });
  });
}

export async function installExternalSkill(metadata) {
  const source = validateExternalInstall(metadata.source);
  if (!source) throw new Error('Kresh rejected unsafe or unsupported upstream installation metadata.');

  const args = ['-y', 'skills', 'add', source.url, '--skill', source.selector];
  const displayCommand = `npx ${args.join(' ')}`;
  const trusted = await isTrustedRepository(source.url);
  logger.info(`Upstream author: ${metadata.attribution?.owner || 'unknown'}`);
  logger.info(`Source: ${source.url}`);
  logger.info(`Command: ${displayCommand}`);

  if (!trusted) {
    logger.warning('This runs a third-party installer on your machine. Review the source before continuing.');
    const { approved } = await inquirer.prompt([{ type: 'confirm', name: 'approved', message: 'Trust this repository and continue?', default: false }]);
    if (!approved) {
      logger.info('Installation cancelled.');
      return { cancelled: true, code: 0 };
    }
  }

  const code = await runNpx(args);
  if (code !== 0) throw new Error(`Upstream installer exited with code ${code}.`);
  if (!trusted) await trustRepository(source.url);
  logger.success(`Installed ${logger.bold(metadata.name)} from its credited upstream repository.`);
  return { cancelled: false, code };
}

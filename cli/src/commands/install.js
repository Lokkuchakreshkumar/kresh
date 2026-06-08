import ora from 'ora';
import os from 'os';
import path from 'path';
import { api } from '../services/api.js';
import { writeLocalSkill } from '../services/filesystem.js';
import { logger } from '../utils/logger.js';

/**
 * Installs a skill from the registry locally.
 */
export async function installSkill(skillSlug) {
  const spinner = ora(`Fetching skill "${skillSlug}"...`).start();
  try {
    const response = await api.get(`/api/skills/${skillSlug}`);
    const { skillContent, ...metadata } = response.data;

    spinner.text = 'Writing skill files locally...';
    const savedDir = await writeLocalSkill(skillSlug, skillContent, metadata);

    spinner.succeed(`Successfully installed ${logger.bold(metadata.name)} (v${metadata.currentVersion}) by @${metadata.ownerUsername}`);
    logger.info(`Saved to: ${logger.bold(savedDir)}`);
  } catch (error) {
    spinner.fail(`Installation failed for "${skillSlug}"`);
    if (error.response) {
      if (error.response.status === 404) {
        logger.error(`Skill "${skillSlug}" was not found in the registry.`);
      } else {
        logger.error(`Registry error: ${error.response.data?.error || error.response.statusText}`);
      }
    } else {
      logger.error(`Connection error: ${error.message}`);
    }
  }
}

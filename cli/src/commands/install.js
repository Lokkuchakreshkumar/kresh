import ora from 'ora';
import os from 'os';
import path from 'path';
import { api } from '../services/api.js';
import { writeLocalSkill } from '../services/filesystem.js';
import { logger } from '../utils/logger.js';

/**
 * Installs a skill from the registry locally.
 */
import { cliAuthFlow, getToken } from '../services/auth.js';

export async function installSkill(skillSlug, isRetry = false) {
  const spinner = ora(`Fetching skill "${skillSlug}"...`).start();
  try {
    const response = await api.get(`/api/skills/${skillSlug}`);
    const { skillContent, ...metadata } = response.data;

    spinner.text = 'Writing skill files locally...';
    const savedDir = await writeLocalSkill(skillSlug, skillContent, metadata);

    spinner.succeed(`Successfully installed ${logger.bold(metadata.name)} (v${metadata.currentVersion}) by @${metadata.ownerUsername}`);
    logger.info(`Saved to: ${logger.bold(savedDir)}`);
  } catch (error) {
    spinner.stop();
    if (error.response && error.response.status === 404 && !isRetry) {
      // It might be a private skill, let's try authenticating
      logger.info(`Skill "${skillSlug}" not found publicly. This might be a private skill.`);
      
      const hasToken = getToken();
      if (!hasToken) {
        logger.info('Attempting to authenticate via browser to access private skills...');
        try {
          await cliAuthFlow();
          // Retry the installation now that we have a token
          logger.info('Authentication successful. Retrying download...');
          return await installSkill(skillSlug, true);
        } catch (authErr) {
          logger.error('Authentication failed: ' + authErr.message);
        }
      } else {
        logger.error(`Skill "${skillSlug}" was not found in the registry, even with your authenticated session.`);
      }
    } else {
      spinner.fail(`Installation failed for "${skillSlug}"`);
      if (error.response) {
        logger.error(`Registry error: ${error.response.data?.error || error.response.statusText}`);
      } else {
        logger.error(`Connection error: ${error.message}`);
      }
    }
  }
}

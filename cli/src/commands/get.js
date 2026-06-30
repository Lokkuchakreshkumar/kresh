import ora from 'ora';
import clipboard from 'clipboardy';
import { api } from '../services/api.js';
import { logger } from '../utils/logger.js';
import chalk from 'chalk';

export async function getLoop(loopId) {
  const spinner = ora(`Fetching loop "${loopId}"...`).start();
  try {
    const response = await api.get(`/api/loops/${encodeURIComponent(loopId)}`);
    const loop = response.data;
    spinner.stop();
    
    if (loop && loop.text) {
      clipboard.writeSync(loop.text);
      logger.success(`Successfully copied loop "${loopId}" to your clipboard!`);
      logger.info('You can now paste it into your project.');
    } else {
      logger.error('Loop content not found.');
    }
  } catch (error) {
    spinner.stop();
    // Fallback: try fetching as a skill in case the backend hasn't split them yet
    try {
      spinner.start(`Trying to fetch from skills...`);
      const fallbackResponse = await api.get(`/api/skills/${encodeURIComponent(loopId)}`);
      const skill = fallbackResponse.data;
      spinner.stop();
      if (skill && skill.skillContent) {
        clipboard.writeSync(skill.skillContent);
        logger.success(`Successfully copied loop "${loopId}" to your clipboard!`);
        logger.info('You can now paste it into your project.');
        return;
      }
    } catch (fallbackError) {
      spinner.stop();
    }
    
    spinner.fail(`Failed to get loop "${loopId}"`);
    if (error.response) {
      logger.error(`Registry error: ${error.response.data?.error || error.response.statusText}`);
    } else {
      logger.error(`Connection error: ${error.message}`);
    }
  }
}

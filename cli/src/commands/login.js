import { cliAuthFlow, clearToken, getToken } from '../services/auth.js';
import { logger } from '../utils/logger.js';

export async function loginCommand(options) {
  if (options.flush) {
    clearToken();
    logger.info('Authentication token has been flushed. You are now logged out of the CLI.');
    return;
  }

  const existingToken = getToken();
  if (existingToken) {
    logger.info('You are already authenticated. To log in as someone else, run: kresh login --flush');
    return;
  }

  try {
    logger.info('Starting browser authentication...');
    await cliAuthFlow();
    // cliAuthFlow already prints success and saves the token
  } catch (error) {
    logger.error('Authentication failed: ' + error.message);
  }
}

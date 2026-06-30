import { listTrustedRepositories, revokeTrustedRepository } from '../services/trust.js';
import { logger } from '../utils/logger.js';

export async function trustCommand(action, repository) {
  try {
    if (action === 'list') {
      const repositories = await listTrustedRepositories();
      if (!repositories.length) return logger.info('No trusted upstream repositories.');
      logger.info('Trusted upstream repositories:');
      repositories.forEach((item) => console.log(` • ${item}`));
      return;
    }
    if (action === 'revoke' && repository) {
      const removed = await revokeTrustedRepository(repository);
      return removed ? logger.success(`Revoked trust for ${repository}.`) : logger.info('Repository was not trusted.');
    }
    logger.error('Usage: kresh trust list | kresh trust revoke <https://github.com/owner/repo>');
  } catch (error) {
    logger.error(error.message);
  }
}

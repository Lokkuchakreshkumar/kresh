import ora from 'ora';
import { removeLocalSkill, readLocalSkillMetadata } from '../services/filesystem.js';
import { logger } from '../utils/logger.js';

/**
 * Removes/uninstalls a skill locally.
 */
export async function removeSkill(skillSlug) {
  const metadata = await readLocalSkillMetadata(skillSlug);
  const displayName = metadata ? metadata.name : skillSlug;
  const spinner = ora(`Uninstalling local skill "${displayName}"...`).start();

  try {
    await removeLocalSkill(skillSlug);
    spinner.succeed(`Successfully uninstalled "${logger.bold(displayName)}"`);
  } catch (error) {
    spinner.fail(`Failed to uninstall "${skillSlug}"`);
    logger.error(error.message);
  }
}

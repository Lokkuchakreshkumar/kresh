import { listLocalSkills } from '../services/filesystem.js';
import { logger } from '../utils/logger.js';

/**
 * Lists all installed skills locally.
 */
export async function listInstalledSkills() {
  const skills = await listLocalSkills();

  if (skills.length === 0) {
    logger.info('No skills installed locally. Run `kresh install <skill>` to install one.');
    return;
  }

  logger.success(`Installed skills (${skills.length}):\n`);
  skills.forEach((skill) => {
    console.log(` • ${logger.bold(skill.name)} (${logger.dim(skill.slug)}) [v${skill.version}]`);
    if (skill.description) {
      console.log(`   ${logger.dim(skill.description)}`);
    }
  });
  console.log();
}

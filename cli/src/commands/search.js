import ora from 'ora';
import { api } from '../services/api.js';
import { logger } from '../utils/logger.js';

/**
 * Searches the registry for skills matching the query.
 */
export async function searchSkills(query) {
  const spinner = ora(`Searching registry for "${query}"...`).start();
  try {
    const response = await api.get(`/api/skills`, { params: { q: query } });
    const skills = response.data;

    if (skills.length === 0) {
      spinner.info(`No skills found matching "${query}"`);
      return;
    }

    spinner.succeed(`Found ${skills.length} matching skill(s):\n`);

    skills.forEach((skill) => {
      console.log(` ${logger.bold(skill.name)} (${logger.dim(skill.slug)})`);
      console.log(`   ${logger.dim('Version:')} v${skill.currentVersion || '1.0.0'}  |  ${logger.dim('Publisher:')} @${skill.ownerUsername || 'unknown'}`);
      if (skill.description) {
        console.log(`   ${skill.description}`);
      }
      console.log();
    });
  } catch (error) {
    spinner.fail(`Search query failed for "${query}"`);
    if (error.response) {
      logger.error(`Registry error: ${error.response.data?.error || error.response.statusText}`);
    } else {
      logger.error(`Connection error: ${error.message}`);
    }
  }
}

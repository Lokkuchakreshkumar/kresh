import { logger } from '../utils/logger.js';

/**
 * Explains how users can publish a skill to the registry.
 */
export async function publishSkill() {
  logger.info("To publish an intelligence skill, please follow these steps:");
  console.log(" 1. Create a markdown file named SKILL.md specifying agent instructions.");
  const webUrl = process.env.KRESH_API_URL || 'https://kresh.vercel.app';
  console.log(` 2. Open the publisher page: ${webUrl}/dashboard/publish`);
  console.log(" 3. Enter the name, category, version, and upload or paste your SKILL.md content.");
  console.log();
  logger.success("Once published, anyone can install it with `kresh install <slug>`.");
}

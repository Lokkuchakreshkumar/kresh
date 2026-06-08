#!/usr/bin/env node

import { Command } from 'commander';
import { installSkill } from './commands/install.js';
import { searchSkills } from './commands/search.js';
import { listInstalledSkills } from './commands/ls.js';
import { removeSkill } from './commands/remove.js';
import { publishSkill } from './commands/publish.js';

const program = new Command();

program
  .name('kresh')
  .description('Install and manage intelligence skills')
  .version('0.1.0');

program
  .command('install <skill>')
  .alias('i')
  .description('Install a skill locally')
  .action(async (skill) => {
    await installSkill(skill);
  });

program
  .command('search <query>')
  .alias('s')
  .description('Search skills in the registry')
  .action(async (query) => {
    await searchSkills(query);
  });

program
  .command('ls')
  .alias('list')
  .description('List installed skills')
  .action(async () => {
    await listInstalledSkills();
  });

program
  .command('remove <skill>')
  .alias('rm')
  .description('Remove an installed skill')
  .action(async (skill) => {
    await removeSkill(skill);
  });

program
  .command('publish')
  .description('Publish a skill')
  .action(async () => {
    await publishSkill();
  });

program.parse();

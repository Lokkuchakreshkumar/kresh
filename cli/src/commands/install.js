import ora from 'ora';
import os from 'os';
import path from 'path';
import fs from 'fs/promises';
import inquirer from 'inquirer';
import { api } from '../services/api.js';
import { writeLocalSkill, getWorkspaceRoot } from '../services/filesystem.js';
import { logger } from '../utils/logger.js';
import { cliAuthFlow, getToken } from '../services/auth.js';

/**
 * Installs a skill from the registry locally.
 */
export async function installSkill(skillSlug, isRetry = false, options = {}) {
  const spinner = ora(`Fetching skill "${skillSlug}"...`).start();
  try {
    const response = await api.get(`/api/skills/${skillSlug}`);
    const { skillContent, files, ...metadata } = response.data;
    spinner.stop();

    const isAgent = metadata.category === 'AGENTS.md/CLAUDE.md' || metadata.category === 'AGENT.md/CLAUDE.md' || metadata.category === 'Agents';
    const isDesign = metadata.category === 'Design.md';

    if (isAgent || isDesign) {
      let fileName;
      if (isDesign) {
        const answer = await inquirer.prompt([
          {
            type: 'input',
            name: 'fileName',
            message: 'This is a Design document. What would you like to name the file?',
            default: 'Design.md'
          }
        ]);
        fileName = answer.fileName;
        if (!fileName.endsWith('.md')) fileName += '.md';
      } else {
        const answer = await inquirer.prompt([
          {
            type: 'list',
            name: 'fileName',
            message: 'This is an Agent or Claude config. Where would you like to save it?',
            choices: ['AGENTS.md', 'CLAUDE.md', 'Standard skills folder']
          }
        ]);
        fileName = answer.fileName;
      }

      if (fileName !== 'Standard skills folder') {
        const rootDir = await getWorkspaceRoot();
        const targetPath = path.join(rootDir, fileName);
        
        let shouldWrite = true;
        try {
          await fs.access(targetPath);
          const { overwrite } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'overwrite',
              message: `${fileName} already exists. Do you want to replace it?`,
              default: false
            }
          ]);
          shouldWrite = overwrite;
        } catch (e) {
          // File doesn't exist, proceed
        }

        if (shouldWrite) {
          spinner.start(`Writing ${fileName} to root directory...`);
          await fs.writeFile(targetPath, skillContent, 'utf8');
          
          if (files && files.length > 0) {
            for (const file of files) {
              if (file.path === 'SKILL.md') continue;
              const filePath = path.join(rootDir, file.path);
              await fs.mkdir(path.dirname(filePath), { recursive: true });
              if (file.fileType === 'image') {
                const base64Data = file.content.replace(/^data:image\/\w+;base64,/, "");
                await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
              } else {
                await fs.writeFile(filePath, file.content, 'utf8');
              }
            }
          }
          
          spinner.succeed(`Successfully installed ${logger.bold(metadata.name)} (v${metadata.currentVersion}) by @${metadata.ownerUsername}`);
          logger.info(`Saved to: ${logger.bold(targetPath)}`);
        } else {
          logger.info('Installation cancelled.');
        }
        return;
      }
    }

    let agentType = 'skills';
    if (options.claude) agentType = '.claude/skills';
    else if (options.codex) agentType = '.codex/skills';
    else if (options.agy) agentType = '.agents/skills';
    else if (options.cursor) agentType = '.cursor/skills';
    else {
      const answers = await inquirer.prompt([
        {
          type: 'list',
          name: 'agentType',
          message: 'Which AI Agent are you installing this skill for?',
          choices: [
            { name: 'Antigravity (.agents/skills)', value: '.agents/skills' },
            { name: 'Claude Code (.claude/skills)', value: '.claude/skills' },
            { name: 'Codex (.codex/skills)', value: '.codex/skills' },
            { name: 'Cursor (.cursor/skills)', value: '.cursor/skills' },
            { name: 'Standard / Other (skills)', value: 'skills' }
          ]
        }
      ]);
      agentType = answers.agentType;
    }

    spinner.start('Writing skill files locally...');
    const savedDir = await writeLocalSkill(skillSlug, skillContent, metadata, agentType, files);

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

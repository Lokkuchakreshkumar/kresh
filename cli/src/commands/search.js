import ora from 'ora';
import axios from 'axios';
import { api } from '../services/api.js';
import { logger } from '../utils/logger.js';

/**
 * Searches the registry for skills matching the query.
 */
export async function searchSkills(query = '') {
  const spinner = ora(query ? `Searching registry for "${query}"...` : 'Fetching all available skills...').start();
  try {
    const response = await api.get(`/api/skills`, { params: query ? { q: query } : {} });
    let skills = response.data;

    const token = process.env.VERCEL_OIDC_TOKEN || process.env.SKILLS_SH_OIDC_TOKEN;
    if (token) {
      try {
        const skillsShUrl = query
          ? `https://skills.sh/api/v1/skills/search?q=${encodeURIComponent(query)}&limit=50`
          : `https://skills.sh/api/v1/skills?view=all-time&page=0&per_page=50`;
        const skillsShRes = await axios.get(skillsShUrl, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        let skillsShItems = [];
        if (Array.isArray(skillsShRes.data)) {
           skillsShItems = skillsShRes.data;
        } else if (skillsShRes.data && Array.isArray(skillsShRes.data.items)) {
           skillsShItems = skillsShRes.data.items;
        } else if (skillsShRes.data && Array.isArray(skillsShRes.data.skills)) {
           skillsShItems = skillsShRes.data.skills;
        }
        
        const mappedSkillsSh = skillsShItems.map(s => {
          const externalId = String(s.id || '').replace(/^\/+|\/+$/g, '');
          const slug = `external/${externalId}`;
          return {
            name: s.name || s.slug || s.skill || s.id,
            slug: slug,
            description: s.description || s.summary,
            currentVersion: 'upstream',
            ownerUsername: s.owner || 'upstream'
          };
        });
        
        const existingSlugs = new Set(skills.map(s => s.slug));
        const newSkills = mappedSkillsSh.filter(s => !existingSlugs.has(s.slug));
        skills = [...skills, ...newSkills];
      } catch (err) {
        // silently ignore skills.sh failures so we still show Kresh skills
      }
    }

    if (skills.length === 0) {
      spinner.info(query ? `No skills found matching "${query}"` : 'No skills found in the registry.');
      return;
    }

    spinner.succeed(query ? `Found ${skills.length} matching skill(s):\n` : `Found ${skills.length} skill(s):\n`);

    skills.forEach((skill) => {
      console.log(` ${logger.bold(skill.name)} (${logger.dim(skill.slug)})`);
      console.log(`   ${logger.dim('Version:')} v${skill.currentVersion || '1.0.0'}  |  ${logger.dim('Publisher:')} @${skill.ownerUsername || 'unknown'}`);
      if (skill.description) {
        console.log(`   ${skill.description}`);
      }
      console.log(`   ${logger.dim('Install:')} kresh install ${skill.slug}`);
      console.log();
    });
  } catch (error) {
    spinner.fail(query ? `Search query failed for "${query}"` : 'Failed to fetch skills');
    if (error.response) {
      logger.error(`Registry error: ${error.response.data?.error || error.response.statusText}`);
    } else {
      logger.error(`Connection error: ${error.message}`);
    }
  }
}

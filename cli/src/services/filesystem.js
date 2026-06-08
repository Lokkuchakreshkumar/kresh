import fs from 'fs/promises';
import path from 'path';

/**
 * Writes the SKILL.md and metadata.json files directly in a folder named after the skill's slug inside the skills folder.
 */
export async function writeLocalSkill(slug, skillContent, metadata) {
  try {
    // Sanitize folder name, use slug
    const folderName = slug || metadata.slug;
    const targetDir = path.join(process.cwd(), 'skills', folderName);
    await fs.mkdir(targetDir, { recursive: true });
    await fs.writeFile(path.join(targetDir, 'SKILL.md'), skillContent, 'utf8');
    await fs.writeFile(path.join(targetDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');
    return targetDir;
  } catch (error) {
    console.error('Failed to write skill files in the skills directory:', error);
    throw new Error(`Local file system write failed: ${error.message}`);
  }
}

/**
 * Reads the local metadata.json of a specific skill if it exists.
 */
export async function readLocalSkillMetadata(slug) {
  try {
    const metadataPath = path.join(process.cwd(), 'skills', slug, 'metadata.json');
    const data = await fs.readFile(metadataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return null;
  }
}

/**
 * Removes the skill directory.
 */
export async function removeLocalSkill(slug) {
  try {
    const targetDir = path.join(process.cwd(), 'skills', slug);
    await fs.rm(targetDir, { recursive: true, force: true });
    return true;
  } catch (error) {
    console.error('Failed to remove skill files from the skills directory:', error);
    throw new Error(`Local file system removal failed: ${error.message}`);
  }
}

/**
 * Lists all installed skills by inspecting the skills directory.
 */
export async function listLocalSkills() {
  try {
    const skillsDir = path.join(process.cwd(), 'skills');
    let entries = [];
    try {
      entries = await fs.readdir(skillsDir, { withFileTypes: true });
    } catch (e) {
      if (e.code === 'ENOENT') return [];
      throw e;
    }

    const skills = [];
    for (const entry of entries) {
      if (entry.isDirectory()) {
        const metadata = await readLocalSkillMetadata(entry.name);
        if (metadata) {
          skills.push({
            slug: metadata.slug || entry.name,
            installed: true,
            version: metadata.version || metadata.currentVersion || 'unknown',
            name: metadata.name || 'unknown',
            description: metadata.description || ''
          });
        }
      }
    }
    return skills;
  } catch (error) {
    console.error('Failed to list local skills:', error);
    return [];
  }
}

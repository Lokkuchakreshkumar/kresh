import fs from 'fs/promises';
import path from 'path';

/**
 * Helper to find the workspace or project root directory by scanning up.
 */
async function getWorkspaceRoot(startDir = process.cwd()) {
  let currentDir = startDir;
  while (true) {
    try {
      const hasPackageJson = await fs.access(path.join(currentDir, 'package.json')).then(() => true).catch(() => false);
      const isKreshRoot = await fs.access(path.join(currentDir, 'next.config.mjs')).then(() => true).catch(() => false);
      
      if (hasPackageJson && isKreshRoot) {
        return currentDir;
      }
    } catch (e) {
      // Ignore
    }

    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }
  
  // Secondary check: look for any package.json up the tree
  currentDir = startDir;
  while (true) {
    try {
      const hasPackageJson = await fs.access(path.join(currentDir, 'package.json')).then(() => true).catch(() => false);
      if (hasPackageJson) {
        return currentDir;
      }
    } catch (e) {
      // Ignore
    }
    const parentDir = path.dirname(currentDir);
    if (parentDir === currentDir) {
      break;
    }
    currentDir = parentDir;
  }

  return startDir;
}

/**
 * Writes the SKILL.md and metadata.json files directly in a folder named after the skill's slug (excluding @owner scope folder) inside the skills folder.
 */
export async function writeLocalSkill(slug, skillContent, metadata) {
  try {
    const rootDir = await getWorkspaceRoot();
    const folderName = (slug || metadata.slug).split('/').pop();
    const targetDir = path.join(rootDir, 'skills', folderName);
    
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
    const rootDir = await getWorkspaceRoot();
    const folderName = slug.split('/').pop();
    const metadataPath = path.join(rootDir, 'skills', folderName, 'metadata.json');
    const data = await fs.readFile(metadataPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    // Also try legacy path for backwards compatibility
    try {
      const rootDir = await getWorkspaceRoot();
      const legacyPath = path.join(rootDir, 'skills', slug, 'metadata.json');
      const data = await fs.readFile(legacyPath, 'utf8');
      return JSON.parse(data);
    } catch (e) {
      return null;
    }
  }
}

/**
 * Removes the skill directory.
 */
export async function removeLocalSkill(slug) {
  try {
    const rootDir = await getWorkspaceRoot();
    const folderName = slug.split('/').pop();
    const targetDir = path.join(rootDir, 'skills', folderName);
    await fs.rm(targetDir, { recursive: true, force: true });
    
    // Also clean up legacy directory if it exists
    const legacyDir = path.join(rootDir, 'skills', slug);
    await fs.rm(legacyDir, { recursive: true, force: true });
    
    // Clean up empty parent directory (e.g. @username) if it becomes empty
    if (slug.includes('/')) {
      const parts = slug.split('/');
      const parentDir = path.join(rootDir, 'skills', parts[0]);
      try {
        const files = await fs.readdir(parentDir);
        if (files.length === 0) {
          await fs.rmdir(parentDir);
        }
      } catch (e) {
        // Ignore
      }
    }
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
    const rootDir = await getWorkspaceRoot();
    const skillsDir = path.join(rootDir, 'skills');
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
        if (entry.name.startsWith('@')) {
          // Legacy support: It's a user scope directory, scan subdirectories inside it
          const scopeDir = path.join(skillsDir, entry.name);
          let subEntries = [];
          try {
            subEntries = await fs.readdir(scopeDir, { withFileTypes: true });
          } catch (e) {
            continue;
          }
          
          for (const subEntry of subEntries) {
            if (subEntry.isDirectory()) {
              const scopedSlug = `${entry.name}/${subEntry.name}`;
              const metadata = await readLocalSkillMetadata(scopedSlug);
              if (metadata) {
                skills.push({
                  slug: metadata.slug || scopedSlug,
                  installed: true,
                  version: metadata.version || metadata.currentVersion || 'unknown',
                  name: metadata.name || 'unknown',
                  description: metadata.description || ''
                });
              }
            }
          }
        } else {
          // New format: Directly under skills/
          try {
            const metadataPath = path.join(skillsDir, entry.name, 'metadata.json');
            const data = await fs.readFile(metadataPath, 'utf8');
            const metadata = JSON.parse(data);
            if (metadata) {
              skills.push({
                slug: metadata.slug || entry.name,
                installed: true,
                version: metadata.version || metadata.currentVersion || 'unknown',
                name: metadata.name || 'unknown',
                description: metadata.description || ''
              });
            }
          } catch (e) {
            // Ignore if metadata is invalid/missing
          }
        }
      }
    }
    return skills;
  } catch (error) {
    console.error('Failed to list local skills:', error);
    return [];
  }
}

import fs from 'fs/promises';
import path from 'path';

const BASE_DIRS = ['skills', '.agents/skills', '.claude/skills', '.codex/skills', '.cursor/skills'];

/**
 * Helper to find the workspace or project root directory by scanning up.
 */
export async function getWorkspaceRoot(startDir = process.cwd()) {
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
export async function writeLocalSkill(slug, skillContent, metadata, baseDir = 'skills', files = []) {
  try {
    const rootDir = await getWorkspaceRoot();
    const folderName = (slug || metadata.slug).split('/').pop();
    const targetDir = path.join(rootDir, baseDir, folderName);
    
    await fs.mkdir(targetDir, { recursive: true });
    
    if (files && files.length > 0) {
      for (const file of files) {
        const filePath = path.join(targetDir, file.path);
        await fs.mkdir(path.dirname(filePath), { recursive: true });
        if (file.fileType === 'image' && file.content.startsWith('data:image')) {
          const base64Data = file.content.replace(/^data:image\/\w+;base64,/, "");
          await fs.writeFile(filePath, Buffer.from(base64Data, 'base64'));
        } else {
          await fs.writeFile(filePath, file.content, 'utf8');
        }
      }
      // Ensure SKILL.md is written even if missing from files (fallback)
      if (!files.some(f => f.path === 'SKILL.md') && skillContent) {
        await fs.writeFile(path.join(targetDir, 'SKILL.md'), skillContent, 'utf8');
      }
    } else {
      await fs.writeFile(path.join(targetDir, 'SKILL.md'), skillContent, 'utf8');
    }
    
    await fs.writeFile(path.join(targetDir, 'metadata.json'), JSON.stringify(metadata, null, 2), 'utf8');
    return targetDir;
  } catch (error) {
    console.error(`Failed to write skill files in the ${baseDir} directory:`, error);
    throw new Error(`Local file system write failed: ${error.message}`);
  }
}

export async function readLocalSkillMetadata(slug) {
  const rootDir = await getWorkspaceRoot();
  const folderName = slug.split('/').pop();
  
  for (const baseDir of BASE_DIRS) {
    try {
      const metadataPath = path.join(rootDir, baseDir, folderName, 'metadata.json');
      const data = await fs.readFile(metadataPath, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      // Also try legacy path for backwards compatibility
      try {
        const legacyPath = path.join(rootDir, baseDir, slug, 'metadata.json');
        const data = await fs.readFile(legacyPath, 'utf8');
        return JSON.parse(data);
      } catch (e) {
        // Continue to the next baseDir
      }
    }
  }
  return null;
}

export async function removeLocalSkill(slug) {
  try {
    const rootDir = await getWorkspaceRoot();
    const folderName = slug.split('/').pop();
    
    for (const baseDir of BASE_DIRS) {
      const targetDir = path.join(rootDir, baseDir, folderName);
      await fs.rm(targetDir, { recursive: true, force: true });
      
      // Also clean up legacy directory if it exists
      const legacyDir = path.join(rootDir, baseDir, slug);
      await fs.rm(legacyDir, { recursive: true, force: true });
      
      // Clean up empty parent directory (e.g. @username) if it becomes empty
      if (slug.includes('/')) {
        const parts = slug.split('/');
        const parentDir = path.join(rootDir, baseDir, parts[0]);
        try {
          const files = await fs.readdir(parentDir);
          if (files.length === 0) {
            await fs.rmdir(parentDir);
          }
        } catch (e) {
          // Ignore
        }
      }
    }
    return true;
  } catch (error) {
    console.error('Failed to remove skill files from the skills directories:', error);
    throw new Error(`Local file system removal failed: ${error.message}`);
  }
}

export async function listLocalSkills() {
  try {
    const rootDir = await getWorkspaceRoot();
    const skills = [];
    const seenSlugs = new Set();
    
    for (const baseDir of BASE_DIRS) {
      const skillsDir = path.join(rootDir, baseDir);
      let entries = [];
      try {
        entries = await fs.readdir(skillsDir, { withFileTypes: true });
      } catch (e) {
        continue;
      }

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
                if (seenSlugs.has(scopedSlug)) continue;
                
                try {
                  const metadataPath = path.join(skillsDir, entry.name, subEntry.name, 'metadata.json');
                  const data = await fs.readFile(metadataPath, 'utf8');
                  const metadata = JSON.parse(data);
                  if (metadata) {
                    skills.push({
                      slug: metadata.slug || scopedSlug,
                      installed: true,
                      version: metadata.version || metadata.currentVersion || 'unknown',
                      name: metadata.name || 'unknown',
                      description: metadata.description || ''
                    });
                    seenSlugs.add(scopedSlug);
                  }
                } catch (e) {
                  // Ignore
                }
              }
            }
          } else {
            // New format: Directly under skills/
            try {
              const metadataPath = path.join(skillsDir, entry.name, 'metadata.json');
              const data = await fs.readFile(metadataPath, 'utf8');
              const metadata = JSON.parse(data);
              const slug = metadata.slug || entry.name;
              
              if (metadata && !seenSlugs.has(slug)) {
                skills.push({
                  slug: slug,
                  installed: true,
                  version: metadata.version || metadata.currentVersion || 'unknown',
                  name: metadata.name || 'unknown',
                  description: metadata.description || ''
                });
                seenSlugs.add(slug);
              }
            } catch (e) {
              // Ignore if metadata is invalid/missing
            }
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

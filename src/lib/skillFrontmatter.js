export function readFrontmatterDescription(contents) {
  try {
    if (typeof contents !== 'string' || !contents.startsWith('---')) return null;
    const frontmatter = contents.split(/^---\s*$/m)[1] || '';
    const match = frontmatter.match(/^description:\s*(.*)$/m);
    if (!match) return null;
    const inline = match[1].trim();
    if (inline && !/^[>|][+-]?$/.test(inline)) {
      return inline.replace(/^['"]|['"]$/g, '').slice(0, 4000) || null;
    }
    const remainder = frontmatter.slice((match.index || 0) + match[0].length).split(/\r?\n/);
    const folded = [];
    for (const line of remainder) {
      if (!line.trim()) {
        if (folded.length) folded.push('');
        continue;
      }
      if (!/^\s+/.test(line)) break;
      folded.push(line.trim());
    }
    return folded.join(' ').replace(/\s+/g, ' ').trim().slice(0, 4000) || null;
  } catch (error) {
    console.error('Failed to read SKILL.md frontmatter description:', error);
    return null;
  }
}

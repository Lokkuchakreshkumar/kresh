import React, { useMemo } from 'react';
import { marked } from 'marked';

// Configure marked to escape raw HTML tokens to guarantee XSS security
const renderer = {
  html(html) {
    return html.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  }
};
marked.use({ renderer });

/**
 * Helper to strip Jekyll/YAML frontmatter from raw markdown content
 */
export function stripFrontmatter(contents) {
  if (typeof contents !== 'string') return '';
  if (!contents.startsWith('---')) return contents;
  const parts = contents.split(/^---\s*$/m);
  if (parts.length >= 3) {
    return parts.slice(2).join('---').trim();
  }
  return contents;
}

export function MarkdownRenderer({ content }) {
  const htmlContent = useMemo(() => {
    try {
      const cleanContent = stripFrontmatter(content || '');
      return marked.parse(cleanContent);
    } catch (error) {
      console.error('Failed to parse markdown:', error);
      return '';
    }
  }, [content]);

  return (
    <div 
      className="prose prose-invert max-w-none text-sm leading-7 text-text-secondary"
      dangerouslySetInnerHTML={{ __html: htmlContent }}
    />
  );
}

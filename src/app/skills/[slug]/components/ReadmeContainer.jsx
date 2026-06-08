import React from 'react';
import { BookOpen, Layers, Pencil } from 'lucide-react';
import { MarkdownRenderer } from './MarkdownRenderer';

/**
 * ReadmeContainer Component
 * Displays the main SKILL.md file inside a card with file metrics and an edit button for the owner.
 */
export function ReadmeContainer({ markdown, isOwner, slug }) {
  // Safe environment-agnostic byte calculation
  const bytes = new TextEncoder().encode(markdown || '').length;
  const fileSize = (bytes / 1024).toFixed(2);
  const lineCount = markdown ? markdown.split(/\r?\n/).length : 0;

  return (
    <div className="rounded-lg glass">
      {/* Readme Header bar */}
      <div className="flex items-center justify-between border-b border-border-color bg-white/[0.02] px-4 py-3 text-xs text-text-secondary">
        <div className="flex items-center gap-2 font-mono">
          <BookOpen className="w-4 h-4 text-text-secondary" />
          <span className="font-semibold text-text-primary text-xs">SKILL.md</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="font-mono text-[10px] text-text-secondary/75">
            {lineCount} lines | {fileSize} KB
          </div>
          {isOwner && (
            <a 
              href={`/dashboard/publish?edit=${slug}`}
              className="p-1 rounded hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors duration-150 flex items-center justify-center border border-transparent hover:border-white/5 bg-white/[0.02]"
              title="Edit SKILL.md"
            >
              <Pencil className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Readme Rendered HTML */}
      <div className="p-6 sm:p-8">
        {markdown ? (
          <MarkdownRenderer content={markdown} />
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <Layers className="w-8 h-8 text-text-secondary/30 mb-3" />
            <p className="text-xs text-text-secondary">
              This skill does not contain a `SKILL.md` file.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

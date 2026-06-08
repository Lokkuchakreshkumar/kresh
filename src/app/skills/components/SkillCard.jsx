import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { GlassCard } from '@/components/ui/GlassCard';

function formatPublishedDate(value) {
  try {
    return value ? new Date(value).toLocaleDateString() : 'N/A';
  } catch (error) {
    console.error('Failed to format skill publish date:', error);
    return 'N/A';
  }
}

export function SkillCard({ skill }) {
  return (
    <GlassCard className="flex h-full flex-col border-white/5 bg-white/[0.01]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-text-primary">{skill.name}</h2>
          <p className="mt-1 text-xs text-text-secondary">
            by{' '}
            <Link href={`/@${skill.ownerUsername || 'unknown'}`} className="font-semibold hover:text-text-primary transition-colors">
              @{skill.ownerUsername || 'unknown'}
            </Link>{' '}
            | v{skill.currentVersion || '1.0.0'}
          </p>
        </div>
        <Badge variant="default" className="shrink-0 normal-case">
          {skill.category}
        </Badge>
      </div>

      <p className="line-clamp-3 flex-1 text-sm leading-6 text-text-secondary">
        {skill.description || 'No description provided.'}
      </p>

      <div className="mt-6 rounded border border-border-color bg-text-primary/5 px-3 py-2 font-mono text-xs text-text-secondary select-all">
        kresh install {skill.slug}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
        <Link
          href={`/skills/${skill.slug}`}
          className="rounded border border-border-color bg-text-primary/5 px-3 py-2 text-center text-text-primary transition-colors hover:bg-text-primary/10"
        >
          View SKILL.md
        </Link>
        <a
          href={`/api/skills/${skill.slug}/download`}
          className="rounded border border-border-color bg-text-primary px-3 py-2 text-center font-semibold text-background transition-opacity hover:opacity-90"
        >
          Download
        </a>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-4 text-xs text-text-secondary">
        <span>{skill.installsCount || 0} installs</span>
        <span>{skill.starsCount || 0} stars</span>
        <span>{formatPublishedDate(skill.createdAt)}</span>
      </div>
    </GlassCard>
  );
}

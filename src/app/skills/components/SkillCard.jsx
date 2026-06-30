import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';

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
    <div className="flex h-full flex-col bg-[var(--background-100)] border border-[var(--gray-400)] rounded-[12px] p-5 shadow-card transition-colors duration-150 hover:border-[var(--gray-600)]">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div className="min-w-0">
          <h2 className="truncate text-lg font-bold text-[var(--primary)]">{skill.name}</h2>
          <p className="mt-1 text-xs text-[var(--gray-700)]">
            by{' '}
            <Link href={`/@${skill.ownerUsername || 'unknown'}`} className="font-semibold hover:text-[var(--primary)] transition-colors">
              @{skill.ownerUsername || 'unknown'}
            </Link>{' '}
            | v{skill.currentVersion || '1.0.0'}
          </p>
        </div>
        <Badge variant="default" className="shrink-0 normal-case">
          {skill.category}
        </Badge>
      </div>

      <p className="line-clamp-3 flex-1 text-[14px] leading-5 text-[var(--gray-700)]">
        {skill.description || 'No description provided.'}
      </p>

      <div className="mt-6 rounded-[6px] border border-[var(--gray-400)] bg-[var(--gray-100)] px-3 py-2 font-mono text-xs text-[var(--gray-900)] select-all">
        kresh install {skill.slug}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-2 text-xs font-medium">
        <Link
          href={`/skills/${skill.slug}`}
          className="rounded-[6px] border border-[var(--gray-400)] bg-[var(--background-100)] px-3 py-2 text-center text-[var(--primary)] transition-colors hover:bg-[var(--gray-100)] hover:border-[var(--gray-500)]"
        >
          View SKILL.md
        </Link>
        <a
          href={`/api/skills/download/${skill.slug}`}
          className="rounded-[6px] border border-transparent bg-[var(--gray-1000)] px-3 py-2 text-center text-[var(--background-100)] transition-colors hover:bg-[var(--gray-900)]"
        >
          Download
        </a>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-[var(--gray-200)] pt-4 text-[12px] text-[var(--gray-700)]">
        <span>{skill.installsCount || 0} installs</span>
        <span>{skill.starsCount || 0} stars</span>
        <span>{formatPublishedDate(skill.createdAt)}</span>
      </div>
    </div>
  );
}

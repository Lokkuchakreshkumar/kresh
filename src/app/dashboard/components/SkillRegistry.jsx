import React from 'react';
import Link from 'next/link';
import { Badge } from '@/components/ui/Badge';
import { Glass } from '@/components/ui/Glass';
import { GlassCard } from '@/components/ui/GlassCard';

function EmptySkills() {
  return (
    <Glass className="flex flex-col items-center justify-center border-white/10 bg-white/[0.01] p-12 text-center">
      <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-xl border border-white/10 bg-white/5 text-text-secondary">
        <span className="font-mono text-sm">md</span>
      </div>
      <h3 className="mb-1 text-base font-bold text-text-primary">No published modules</h3>
      <p className="max-w-sm text-sm text-text-secondary">
        Publish your first reusable skill from a dedicated `SKILL.md` workflow.
      </p>
    </Glass>
  );
}

function SkillCard({ skill }) {
  return (
    <GlassCard className="flex h-full flex-col border-white/5 bg-white/[0.01] hover:border-white/10">
      <div className="mb-3 flex items-start justify-between gap-4">
        <div className="flex min-w-0 items-center gap-2">
          <span className="shrink-0 font-mono text-[10px] text-text-secondary">pkg</span>
          <h3 className="truncate text-sm font-bold text-text-primary">{skill.name}</h3>
        </div>
        <Badge variant="default" className="px-1.5 py-0.5 text-[9px] lowercase">
          {skill.category}
        </Badge>
      </div>

      <p className="mb-6 line-clamp-3 flex-1 text-xs leading-relaxed text-text-secondary">
        {skill.description || 'No description provided.'}
      </p>

      <div className="mt-auto">
        <div className="mb-3 break-all rounded border border-border-color bg-text-primary/5 px-2.5 py-1.5 font-mono text-[10px] text-text-secondary select-all">
          kresh install {skill.slug}
        </div>

        <div className="mb-3 grid grid-cols-2 gap-2 text-[10px]">
          <Link
            href={`/skills/${skill.slug}`}
            className="rounded border border-border-color bg-text-primary/5 px-3 py-2 text-center text-text-primary transition-colors hover:bg-text-primary/10"
          >
            View SKILL.md
          </Link>
          <a
            href={`/api/skills/download/${skill.slug}`}
            className="rounded border border-border-color bg-text-primary px-3 py-2 text-center font-semibold text-background transition-opacity hover:opacity-90"
          >
            Download
          </a>
        </div>

        <div className="flex items-center justify-between border-t border-white/5 pt-3 text-[10px] text-text-secondary">
          <span className="flex items-center gap-1">
            {skill.installsCount || 0} installs
          </span>
          <span className="flex items-center gap-1">
            {skill.starsCount || 0} stars
          </span>
        </div>
      </div>
    </GlassCard>
  );
}

export function SkillRegistry({ skills }) {
  return (
    <section>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <span className="font-mono text-xs text-text-secondary">$</span>
          <h2 className="text-xl font-bold text-text-primary">My Intelligence Registry</h2>
        </div>
        <Badge variant="default" className="normal-case">
          {skills.length} modules
        </Badge>
      </div>

      {skills.length === 0 ? (
        <EmptySkills />
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {skills.map((skill) => (
            <SkillCard key={skill.id} skill={skill} />
          ))}
        </div>
      )}
    </section>
  );
}

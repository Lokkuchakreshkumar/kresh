import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Glass } from '@/components/ui/Glass';

function getInitial(username) {
  return username?.charAt(0)?.toUpperCase() || 'K';
}

function StatItem({ label, value }) {
  return (
    <div className="min-w-0 rounded-xl border border-border-color bg-text-primary/5 px-4 py-3">
      <div className="text-xs text-text-secondary">{label}</div>
      <div className="mt-1 text-2xl font-semibold text-text-primary">{value}</div>
    </div>
  );
}

export function ProfileHero({ user, formattedDate, stats }) {
  const username = user?.username || 'kresh-user';
  const email = user?.email || 'No email added';

  return (
    <Glass className="p-6 sm:p-8 border-white/10 bg-white/[0.02]">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-border-color bg-text-primary/5 px-3 py-1 text-xs text-text-secondary">
            <span className="font-mono">$ kresh profile</span>
          </div>

          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <div className="relative h-20 w-20 shrink-0 rounded-2xl border border-border-color bg-text-primary/5 p-1 shadow-[0_18px_60px_rgba(0,0,0,0.22)]">
              <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[radial-gradient(circle_at_30%_20%,rgba(var(--glow-color),0.14),rgba(var(--glow-color),0.04)_45%,transparent)] text-3xl font-black text-text-primary">
                {getInitial(username)}
              </div>
              <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full border border-border-color bg-text-primary text-background">
                <span className="text-[10px] font-bold">ok</span>
              </span>
            </div>

            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-3">
                <h1 className="truncate text-3xl font-black text-text-primary sm:text-4xl">
                  @{username}
                </h1>
                <Badge variant="default">developer</Badge>
              </div>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
                Your modular intelligence workspace. Keep your published skills ready for installation, reuse, and composition across AI systems.
              </p>

              <div className="mt-4 flex flex-wrap gap-x-5 gap-y-2 text-sm text-text-secondary">
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-[10px]">since</span>
                  <span>Member since {formattedDate}</span>
                </span>
                <span className="inline-flex items-center gap-2">
                  <span className="font-mono text-[10px]">role</span>
                  <span>Open registry contributor</span>
                </span>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-3 gap-3 lg:min-w-[360px]">
          <StatItem label="Skills" value={stats.skills} />
          <StatItem label="Installs" value={stats.installs} />
          <StatItem label="Stars" value={stats.stars} />
        </div>
      </div>
    </Glass>
  );
}

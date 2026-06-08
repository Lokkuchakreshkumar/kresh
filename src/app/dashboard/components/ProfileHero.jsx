import React from 'react';
import { Badge } from '@/components/ui/Badge';
import { Glass } from '@/components/ui/Glass';
import { FolderGit, Download, Star, Calendar } from 'lucide-react';

/**
 * Returns the first letter of the username.
 */
function getInitial(username) {
  return username?.charAt(0)?.toUpperCase() || 'K';
}

/**
 * ProfileHero Component
 * Displays user overview, avatar, username, developer tag, bio, and stats summary.
 */
export function ProfileHero({ user, formattedDate, stats }) {
  const username = user?.username || 'kresh-user';

  return (
    <Glass className="p-6 sm:p-8 border-white/10 bg-white/[0.02]">
      <div className="flex flex-col gap-6 sm:flex-row sm:items-center">
        {/* Avatar box */}
        <div className="h-20 w-20 shrink-0 rounded-2xl border border-border-color bg-text-primary/5 p-1 shadow-[0_18px_60px_rgba(0,0,0,0.12)]">
          <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-[radial-gradient(circle_at_30%_20%,rgba(var(--glow-color),0.08),rgba(var(--glow-color),0.02)_45%,transparent)] text-3xl font-black text-text-primary select-none">
            {getInitial(username)}
          </div>
        </div>

        {/* Profile Details Container */}
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="truncate text-3xl font-black text-text-primary sm:text-4xl">
              @{username}
            </h1>
            <Badge variant="default" className="text-[10px] tracking-normal font-bold">DEVELOPER</Badge>
          </div>
          <p className="mt-2 max-w-2xl text-sm leading-6 text-text-secondary">
            Your modular intelligence workspace. Keep your published skills ready for installation, reuse, and composition across AI systems.
          </p>

          {/* Stats Metadata Row */}
          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-3 text-xs text-text-secondary items-center font-medium">
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <FolderGit className="w-4 h-4 text-text-secondary/70 shrink-0" />
              <span className="font-bold text-text-primary">{stats.skills}</span>
              <span>{stats.skills === 1 ? 'Skill' : 'Skills'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <Download className="w-4 h-4 text-text-secondary/70 shrink-0" />
              <span className="font-bold text-text-primary">{stats.installs}</span>
              <span>{stats.installs === 1 ? 'Install' : 'Installs'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 min-w-0">
              <Star className="w-4 h-4 text-text-secondary/70 shrink-0" />
              <span className="font-bold text-text-primary">{stats.stars}</span>
              <span>{stats.stars === 1 ? 'Star' : 'Stars'}</span>
            </span>
            <span className="inline-flex items-center gap-1.5 border-l border-white/10 pl-6 hidden sm:inline-flex">
              <Calendar className="w-4 h-4 text-text-secondary/70 shrink-0" />
              <span>Member since</span>
              <span className="font-bold text-text-primary">{formattedDate}</span>
            </span>
          </div>
        </div>
      </div>
    </Glass>
  );
}

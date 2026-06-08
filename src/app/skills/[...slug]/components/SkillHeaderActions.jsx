"use client";

import React, { useState } from 'react';
import { Star, Eye, GitFork, AlertCircle } from 'lucide-react';
import { toggleStarAction } from '../../actions';

/**
 * SkillHeaderActions Component
 * Renders the GitHub-style header actions (Watch, Fork, Star).
 * Handles user interaction and triggers DB mutations via toggleStarAction.
 */
export function SkillHeaderActions({ skillId, initialIsStarred, initialStarsCount, hasSession }) {
  const [starred, setStarred] = useState(initialIsStarred);
  const [starsCount, setStarsCount] = useState(initialStarsCount);
  const [isPending, setIsPending] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleStarClick = async () => {
    if (isPending) return;

    if (!hasSession) {
      setErrorMsg('Please sign in to star this skill.');
      setTimeout(() => setErrorMsg(''), 4000);
      return;
    }

    setIsPending(true);
    setErrorMsg('');

    try {
      const result = await toggleStarAction(skillId);
      if (result.error) {
        setErrorMsg(result.error);
        setTimeout(() => setErrorMsg(''), 4000);
      } else if (result.success) {
        setStarred(result.starred);
        setStarsCount(result.starsCount);
      }
    } catch (err) {
      console.error('Failed to handle star action:', err);
      setErrorMsg('Failed to update star state.');
      setTimeout(() => setErrorMsg(''), 4000);
    } finally {
      setIsPending(false);
    }
  };

  return (
    <div className="relative flex flex-col gap-2">
      <div className="flex flex-wrap items-center gap-3">
        {/* Watch Button Group */}
        <div className="inline-flex items-center rounded-md border border-border-color bg-white/[0.02] text-xs">
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-text-primary hover:bg-white/5 transition-colors duration-150 outline-none focus:ring-1 focus:ring-kresh-green/30 rounded-l-md"
          >
            <Eye className="w-3.5 h-3.5 text-text-secondary" />
            <span>Watch</span>
          </button>
          <span className="border-l border-border-color px-2.5 py-1.5 text-text-secondary bg-white/[0.01] rounded-r-md">
            1
          </span>
        </div>

        {/* Fork Button Group */}
        <div className="inline-flex items-center rounded-md border border-border-color bg-white/[0.02] text-xs">
          <button 
            type="button"
            className="flex items-center gap-1.5 px-3 py-1.5 font-medium text-text-primary hover:bg-white/5 transition-colors duration-150 outline-none focus:ring-1 focus:ring-kresh-green/30 rounded-l-md"
          >
            <GitFork className="w-3.5 h-3.5 text-text-secondary" />
            <span>Fork</span>
          </button>
          <span className="border-l border-border-color px-2.5 py-1.5 text-text-secondary bg-white/[0.01] rounded-r-md">
            0
          </span>
        </div>

        {/* Star Button Group */}
        <div className="inline-flex items-center rounded-md border border-border-color bg-white/[0.02] text-xs">
          <button
            type="button"
            onClick={handleStarClick}
            disabled={isPending}
            className={`flex items-center gap-1.5 px-3 py-1.5 font-medium transition-all duration-150 outline-none focus:ring-1 focus:ring-kresh-green/30 rounded-l-md ${
              starred
                ? 'text-kresh-green bg-kresh-green/5 hover:bg-kresh-green/10'
                : 'text-text-primary hover:bg-white/5'
            }`}
          >
            <Star className={`w-3.5 h-3.5 ${starred ? 'fill-kresh-green text-kresh-green' : 'text-text-secondary'}`} />
            <span>{starred ? 'Starred' : 'Star'}</span>
          </button>
          <span className="border-l border-border-color px-2.5 py-1.5 text-text-secondary bg-white/[0.01] min-w-[20px] text-center rounded-r-md">
            {starsCount}
          </span>
        </div>
      </div>

      {/* Floating Error Toast */}
      {errorMsg && (
        <div className="absolute right-0 top-full mt-2 z-10 flex items-center gap-2 rounded-lg border border-red-500/20 bg-background backdrop-blur-md px-3.5 py-2 text-xs text-red-400 shadow-xl border-t-red-500/40">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-500" />
          <span>{errorMsg}</span>
        </div>
      )}
    </div>
  );
}

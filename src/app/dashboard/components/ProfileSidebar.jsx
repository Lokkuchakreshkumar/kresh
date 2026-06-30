"use client";

import React, { useState, useEffect } from 'react';
import { 
  Zap, Plus, Clock, Link as LinkIcon, 
  Copy, Check, ArrowUpRight, LogOut
} from 'lucide-react';
import { Glass } from '@/components/ui/Glass';
import Link from 'next/link';
import { logoutAction } from '@/app/(auth)/actions';

/**
 * ProfileSidebar Component
 * Handles layout blocks on the right: Quick Actions panel, timeline activities logs,
 * and copyable user profiles sharing link.
 */
export function ProfileSidebar({ username, isOwner, activities = [] }) {
  const [copied, setCopied] = useState(false);

  const handleLogout = async () => {
    try {
      await logoutAction();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };
  const [profileUrl, setProfileUrl] = useState(`kresh.dev/@${username}`);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const host = window.location.host;
      setProfileUrl(`${host}/@${username}`);
    }
  }, [username]);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(`${window.location.protocol}//${profileUrl}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy profile link to clipboard:', err);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full lg:max-w-xs shrink-0">
      
      {/* Quick Actions (Owner Only) */}
      {isOwner && (
        <div className="p-5 border-[var(--gray-200)] bg-[var(--gray-100)]">
          <h3 className="text-xs font-bold uppercase text-[var(--primary)] flex items-center gap-2 mb-4">
            <Zap className="w-4 h-4 text-[var(--blue-700)]" />
            Quick Actions
          </h3>
          <div className="flex flex-col divide-y divide-white/5 text-sm">
            <Link 
              href="/dashboard/publish" 
              className="flex items-center justify-between py-3 text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors group"
            >
              <span>Publish a new skill</span>
              <Plus className="w-4 h-4 text-[var(--gray-700)]/60 group-hover:text-[var(--primary)] transition-colors" />
            </Link>
            <a 
              href="/skills" 
              className="flex items-center justify-between py-3 text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors group"
            >
              <span>Documentation</span>
              <ArrowUpRight className="w-4 h-4 text-[var(--gray-700)]/60 group-hover:text-[var(--primary)] transition-colors" />
            </a>
            <button 
              type="button"
              onClick={handleLogout}
              className="flex items-center justify-between py-3 text-red-400 hover:text-red-300 transition-colors group w-full text-left cursor-pointer"
            >
              <span>Logout</span>
              <LogOut className="w-4 h-4 text-red-400/70 group-hover:text-red-300 transition-colors" />
            </button>
          </div>
        </div>
      )}

      {/* Recent Activity Timeline */}
      <div className="p-5 border-[var(--gray-200)] bg-[var(--gray-100)]">
        <h3 className="text-xs font-bold uppercase text-[var(--primary)] flex items-center gap-2 mb-5">
          <Clock className="w-4 h-4 text-[var(--gray-700)]" />
          Recent Activity
        </h3>

        {activities.length === 0 ? (
          <p className="text-xs text-[var(--gray-700)]/70 py-4 text-center">No recent activities logged.</p>
        ) : (
          <div className="relative border-l border-[var(--gray-200)] pl-5 ml-2.5 space-y-6 py-2">
            {activities.map((act, index) => {
              const isPublish = act.type === 'publish';
              return (
                <div key={index} className="relative">
                  {/* Timeline bullet */}
                  <span className={`absolute -left-[27px] top-1 flex h-3.5 w-3.5 items-center justify-center rounded-full border bg-[var(--background-100)] ${
                    isPublish 
                      ? 'border-[var(--blue-700)]/40' 
                      : 'border-purple-500/40'
                  }`}>
                    <span className={`h-1.5 w-1.5 rounded-full ${
                      isPublish ? 'bg-[var(--blue-700)]' : 'bg-purple-400'
                    }`} />
                  </span>
                  
                  {/* Details */}
                  <div className="flex flex-col gap-1 text-xs">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-[var(--gray-700)]/70 font-mono text-[10px]">
                        {new Date(act.date).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </span>
                      <span className={`rounded-md px-1.5 py-0.5 text-[9px] font-bold uppercase ${
                        isPublish 
                          ? 'bg-[var(--blue-100)] border border-[var(--blue-200)] text-[var(--blue-700)]' 
                          : 'bg-purple-500/10 border border-purple-500/20 text-purple-400'
                      }`}>
                        {isPublish ? 'PUBLISHED' : 'STAR'}
                      </span>
                    </div>
                    <span className="font-semibold text-[var(--primary)] leading-normal mt-0.5">
                      {act.title}
                    </span>
                    {isPublish && act.version && (
                      <span className="text-[10px] text-[var(--gray-700)] font-mono">v{act.version}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Profile Link Card */}
      <div className="p-5 border-[var(--gray-200)] bg-[var(--gray-100)]">
        <h3 className="text-xs font-bold uppercase text-[var(--primary)] flex items-center gap-2 mb-4">
          <LinkIcon className="w-4 h-4 text-[var(--gray-700)]" />
          Profile Link
        </h3>
        <div className="flex items-center justify-between rounded-lg border border-[var(--gray-400)] bg-[var(--background-100)] p-3 text-xs font-mono text-[var(--gray-700)] backdrop-blur-sm">
          <span className="truncate text-[var(--primary)] select-all">{profileUrl}</span>
          <button 
            type="button"
            onClick={handleCopy}
            className={`transition-all duration-200 p-1.5 rounded-md hover:bg-[var(--gray-200)] ml-2 shrink-0 outline-none ${
              copied ? 'text-[var(--blue-700)]' : 'text-[var(--gray-700)] hover:text-[var(--primary)]'
            }`}
            aria-label="Copy profile URL"
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

    </div>
  );
}

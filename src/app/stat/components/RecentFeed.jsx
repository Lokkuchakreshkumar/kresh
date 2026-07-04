"use client";

import { useMemo } from 'react';
import { Download, Search, Terminal, Trash2, Star, Zap, Globe, Monitor } from 'lucide-react';

const CMD = {
  install: { icon: Download, color: '#006bff',  verb: 'installed' },
  search:  { icon: Search,   color: '#a000f8',  verb: 'searched'  },
  ls:      { icon: Terminal, color: '#00ac96',  verb: 'listed'    },
  remove:  { icon: Trash2,   color: '#fc0035',  verb: 'removed'   },
  get:     { icon: Star,     color: '#ffa600',  verb: 'fetched'   },
  login:   { icon: Zap,      color: '#00ac96',  verb: 'logged in' },
  publish: { icon: Globe,    color: '#f22782',  verb: 'published' },
  trust:   { icon: Monitor,  color: '#28a948',  verb: 'trusted'   },
};

function timeAgo(dateStr) {
  try {
    const s = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
    if (s < 60)  return `${s}s ago`;
    if (s < 3600) return `${Math.floor(s / 60)}m ago`;
    if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
    return `${Math.floor(s / 86400)}d ago`;
  } catch { return 'recently'; }
}

export function RecentFeed({ events }) {
  const items = useMemo(() => events || [], [events]);

  if (items.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center rounded-[6px] border border-dashed border-[var(--gray-300)] py-10"
      >
        <Terminal className="w-6 h-6 mb-3" style={{ color: 'var(--gray-500)' }} />
        <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>No events recorded yet.</p>
        <p className="mt-1" style={{ fontSize: 12, color: 'var(--gray-600)' }}>
          Run a <code className="font-mono">kresh</code> command to see activity here.
        </p>
      </div>
    );
  }

  return (
    /* Table-style layout */
    <div className="divide-y divide-[var(--gray-200)]">

      {/* Header row */}
      <div className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 items-center pb-2">
        {['', 'Action', 'Skill', 'Platform', 'When'].map(h => (
          <span key={h} style={{ fontSize: 12, fontWeight: 500, color: 'var(--gray-700)', lineHeight: '16px' }}>
            {h}
          </span>
        ))}
      </div>

      {/* Event rows */}
      {items.map((ev, i) => {
        const meta = CMD[ev.command] || { icon: Terminal, color: '#8f8f8f', verb: ev.command };
        const Icon = meta.icon;

        return (
          <div
            key={i}
            className="grid grid-cols-[auto_1fr_auto_auto_auto] gap-x-4 items-center py-2.5 hover:bg-[var(--gray-100)] -mx-6 px-6 transition-colors duration-100"
          >
            {/* Command icon */}
            <div
              className="w-6 h-6 rounded-[6px] flex items-center justify-center shrink-0"
              style={{ background: `${meta.color}12`, border: `1px solid ${meta.color}24` }}
            >
              <Icon className="w-3 h-3" style={{ color: meta.color }} />
            </div>

            {/* Verb + agent badge */}
            <div className="flex items-center gap-2 min-w-0">
              <span style={{ fontSize: 13, color: 'var(--primary)' }}>{meta.verb}</span>
              {ev.agentType && (
                <span
                  className="font-mono px-1.5 py-px rounded-[6px] border border-[var(--gray-300)] bg-[var(--gray-100)] shrink-0"
                  style={{ fontSize: 11, color: 'var(--gray-900)' }}
                >
                  --{ev.agentType}
                </span>
              )}
            </div>

            {/* Skill slug */}
            <div className="min-w-0">
              {ev.skillSlug ? (
                <a
                  href={`/skills/${ev.skillSlug}`}
                  className="font-mono truncate hover:text-[var(--blue-700)] hover:underline transition-colors"
                  style={{ fontSize: 12, color: 'var(--gray-900)', maxWidth: 160, display: 'block' }}
                  title={ev.skillSlug}
                  onClick={e => e.stopPropagation()}
                >
                  {ev.skillSlug}
                </a>
              ) : (
                <span style={{ fontSize: 12, color: 'var(--gray-600)' }}>—</span>
              )}
            </div>

            {/* OS */}
            <span className="font-mono capitalize shrink-0" style={{ fontSize: 12, color: 'var(--gray-700)' }}>
              {ev.os || '—'}
            </span>

            {/* Time */}
            <span className="font-mono shrink-0 text-right" style={{ fontSize: 12, color: 'var(--gray-700)' }}>
              {timeAgo(ev.createdAt)}
            </span>
          </div>
        );
      })}
    </div>
  );
}

"use client";

import { useState, useEffect, useCallback } from 'react';
import {
  Terminal, Download, Search, Trash2, Star, Globe,
  Monitor, Activity, Clock, TrendingUp, Zap, RefreshCw
} from 'lucide-react';
import { ActivityChart } from './ActivityChart';
import { DistributionBar } from './DistributionBar';
import { RecentFeed } from './RecentFeed';
import { StatCard } from './StatCard';

const COMMAND_META = {
  install:  { icon: Download, label: 'Installs',     color: '#006bff' },
  search:   { icon: Search,   label: 'Searches',     color: '#a000f8' },
  ls:       { icon: Terminal, label: 'Lists',        color: '#00ac96' },
  remove:   { icon: Trash2,   label: 'Removes',      color: '#fc0035' },
  get:      { icon: Star,     label: 'Gets',         color: '#ffa600' },
  login:    { icon: Zap,      label: 'Logins',       color: '#00ac96' },
  publish:  { icon: Globe,    label: 'Publishes',    color: '#f22782' },
  trust:    { icon: Monitor,  label: 'Trust',        color: '#28a948' },
};

export function StatsDashboard({ initialStats }) {
  const [stats, setStats]             = useState(initialStats);
  const [loading, setLoading]         = useState(false);
  const [lastUpdated, setLastUpdated] = useState(new Date());

  const refresh = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        setStats(await res.json());
        setLastUpdated(new Date());
      }
    } catch { /* silent */ }
    finally { setLoading(false); }
  }, []);

  useEffect(() => {
    const id = setInterval(refresh, 30_000);
    return () => clearInterval(id);
  }, [refresh]);

  /* ── derived values ─────────────────────────────────── */
  const commandMap = {};
  (stats?.commandCounts || []).forEach(r => { commandMap[r.command] = Number(r.count); });

  const totalInstalls  = commandMap['install'] || 0;
  const totalSearches  = commandMap['search']  || 0;
  const totalCount     = Number(stats?.totalCount || 0);
  const otherCount     = Math.max(0, totalCount - totalInstalls - totalSearches);

  const topSkills     = stats?.topSkills    || [];
  const osDist        = stats?.osDist       || [];
  const agentDist     = stats?.agentDist    || [];
  const dailyActivity = stats?.dailyActivity || [];
  const recentEvents  = stats?.recentEvents  || [];

  const osTotal    = osDist.reduce((a, r)    => a + Number(r.count), 0);
  const agentTotal = agentDist.reduce((a, r) => a + Number(r.count), 0);

  /* ── render ─────────────────────────────────────────── */
  return (
    <div className="max-w-[1200px] mx-auto px-6 py-16">

      {/* ── Page header ───────────────────────────────── */}
      <div className="mb-10 flex items-end justify-between gap-4 flex-wrap border-b border-[var(--gray-200)] pb-8">
        <div>
          {/* Live badge */}
          <div className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-[var(--gray-300)] bg-[var(--gray-100)] mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue-700)] animate-pulse" />
            <span className="text-[12px] font-medium text-[var(--gray-900)]">Live</span>
          </div>

          <h1
            className="text-[var(--primary)] font-semibold"
            style={{ fontSize: 32, lineHeight: '40px', letterSpacing: '-1.28px' }}
          >
            CLI Statistics
          </h1>
          <p className="mt-1" style={{ fontSize: 14, lineHeight: '20px', color: 'var(--secondary)' }}>
            Every <code className="font-mono bg-[var(--gray-100)] border border-[var(--gray-300)] px-1 py-px rounded-[6px] text-[13px] text-[var(--primary)]">kresh</code> command, counted in real time.
          </p>
        </div>

        {/* Refresh control */}
        <div className="flex items-center gap-3">
          <span className="font-mono text-[var(--gray-700)]" style={{ fontSize: 12 }}>
            {lastUpdated.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
          <button
            onClick={refresh}
            disabled={loading}
            className="inline-flex items-center gap-1.5 h-8 px-3 rounded-[6px] border border-[var(--gray-400)] bg-[var(--background-100)] text-[var(--secondary)] hover:text-[var(--primary)] hover:border-[var(--gray-500)] hover:bg-[var(--gray-100)] active:bg-[var(--gray-200)] active:border-[var(--gray-600)] transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:focus-ring"
            style={{ fontSize: 14, fontWeight: 500 }}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
        </div>
      </div>

      {/* ── KPI row ───────────────────────────────────── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard label="Total CLI Runs"   value={totalCount}    icon={Activity} accent="#006bff" sub="all commands" />
        <StatCard label="kresh install"    value={totalInstalls} icon={Download} accent="#a000f8" sub="installs fired" />
        <StatCard label="kresh search"     value={totalSearches} icon={Search}   accent="#00ac96" sub="registry searches" />
        <StatCard label="Other Commands"   value={otherCount}    icon={Terminal} accent="#ffa600" sub="ls · remove · login…" />
      </div>

      {/* ── Main row: chart + breakdown ───────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-4">

        {/* Activity chart */}
        <div className="lg:col-span-2 rounded-[12px] border border-[var(--gray-300)] bg-[var(--background-200)] p-6"
             style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.04)' }}>
          <SectionHeader icon={TrendingUp} title="Daily Activity" meta="Last 30 days" />
          <ActivityChart data={dailyActivity} />
        </div>

        {/* Command breakdown */}
        <div className="rounded-[12px] border border-[var(--gray-300)] bg-[var(--background-200)] p-6"
             style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.04)' }}>
          <SectionHeader icon={Terminal} title="Command Breakdown" />
          <CommandBreakdown commandMap={commandMap} totalCount={totalCount} />
        </div>
      </div>

      {/* ── Second row: top skills + distributions ────── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">

        {/* Top installed skills */}
        <div className="rounded-[12px] border border-[var(--gray-300)] bg-[var(--background-200)] p-6"
             style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.04)' }}>
          <SectionHeader icon={Download} title="Top Installed Skills" />
          <TopSkillsList skills={topSkills} />
        </div>

        {/* OS distribution */}
        <div className="rounded-[12px] border border-[var(--gray-300)] bg-[var(--background-200)] p-6"
             style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.04)' }}>
          <SectionHeader icon={Monitor} title="Platform" />
          <DistributionBar
            data={osDist.map(r => ({ label: r.os || 'unknown', count: Number(r.count) }))}
            total={osTotal}
            colors={['#006bff', '#a000f8', '#00ac96', '#ffa600', '#fc0035']}
            emptyMessage="No platform data yet."
          />
        </div>

        {/* Agent type distribution */}
        <div className="rounded-[12px] border border-[var(--gray-300)] bg-[var(--background-200)] p-6"
             style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.04)' }}>
          <SectionHeader icon={Zap} title="AI Agent" />
          <DistributionBar
            data={agentDist.map(r => ({ label: r.agentType || 'default', count: Number(r.count) }))}
            total={agentTotal}
            colors={['#006bff', '#f22782', '#28a948', '#ffa600', '#a000f8']}
            emptyMessage="No agent data yet."
          />
        </div>
      </div>

      {/* ── Event feed ────────────────────────────────── */}
      <div className="rounded-[12px] border border-[var(--gray-300)] bg-[var(--background-200)] p-6"
           style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.04)' }}>
        <div className="flex items-center justify-between mb-6">
          <SectionHeader icon={Clock} title="Live Event Feed" />
          <span className="font-mono text-[var(--gray-700)]" style={{ fontSize: 12 }}>Last 20</span>
        </div>
        <RecentFeed events={recentEvents} />
      </div>
    </div>
  );
}

/* ── Internal sub-components ──────────────────────────── */

function SectionHeader({ icon: Icon, title, meta }) {
  return (
    <div className="flex items-center gap-2 mb-6">
      <Icon className="w-4 h-4 shrink-0" style={{ color: 'var(--gray-700)' }} />
      <span style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', letterSpacing: '-0.28px', color: 'var(--primary)' }}>
        {title}
      </span>
      {meta && (
        <span className="ml-auto font-mono" style={{ fontSize: 12, color: 'var(--gray-700)' }}>{meta}</span>
      )}
    </div>
  );
}

function CommandBreakdown({ commandMap, totalCount }) {
  return (
    <div className="space-y-3">
      {Object.entries(COMMAND_META).map(([cmd, meta]) => {
        const val = commandMap[cmd] || 0;
        const pct = totalCount > 0 ? Math.round((val / totalCount) * 100) : 0;
        const Icon = meta.icon;
        return (
          <div key={cmd} className="flex items-center gap-3">
            <div
              className="w-7 h-7 rounded-[6px] flex items-center justify-center shrink-0"
              style={{ background: `${meta.color}14`, border: `1px solid ${meta.color}28` }}
            >
              <Icon className="w-3.5 h-3.5" style={{ color: meta.color }} />
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between mb-1">
                <span style={{ fontSize: 13, fontWeight: 400, lineHeight: '16px', color: 'var(--primary)' }}>
                  {meta.label}
                </span>
                <span className="font-mono" style={{ fontSize: 12, color: 'var(--gray-800)' }}>
                  {val.toLocaleString()}
                </span>
              </div>
              <div className="h-1 w-full rounded-full overflow-hidden" style={{ background: 'var(--gray-200)' }}>
                <div
                  className="h-full rounded-full transition-all duration-700"
                  style={{ width: `${pct}%`, background: meta.color }}
                />
              </div>
            </div>
          </div>
        );
      })}
      {Object.values(commandMap).every(v => v === 0) && (
        <p className="text-center py-6" style={{ fontSize: 13, color: 'var(--gray-700)' }}>
          No command data yet.
        </p>
      )}
    </div>
  );
}

function TopSkillsList({ skills }) {
  if (!skills || skills.length === 0) {
    return (
      <p className="text-center py-8" style={{ fontSize: 13, color: 'var(--gray-700)' }}>
        No install data yet.
      </p>
    );
  }
  return (
    <div className="space-y-0.5">
      {skills.slice(0, 10).map((s, i) => (
        <a
          key={s.skillSlug}
          href={`/skills/${s.skillSlug}`}
          className="flex items-center gap-3 px-2 py-2 rounded-[6px] hover:bg-[var(--gray-100)] transition-colors duration-150 group"
        >
          <span className="font-mono shrink-0 w-4 text-right" style={{ fontSize: 12, color: 'var(--gray-600)' }}>
            {i + 1}
          </span>
          <span
            className="flex-1 truncate group-hover:text-[var(--blue-700)] transition-colors"
            style={{ fontSize: 13, color: 'var(--primary)' }}
          >
            {s.skillSlug}
          </span>
          <span className="font-mono shrink-0" style={{ fontSize: 12, color: 'var(--gray-800)' }}>
            {Number(s.count).toLocaleString()}
          </span>
        </a>
      ))}
    </div>
  );
}

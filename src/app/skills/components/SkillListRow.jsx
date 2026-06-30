'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Check, CheckCircle2, Copy, Download } from 'lucide-react';
import { Badge } from '@/components/ui/Badge';

const DIRECTIONS = ['to top', 'to top right', 'to right', 'to bottom right', 'to bottom', 'to bottom left', 'to left', 'to top left'];

function gradientFor(slug) {
  let hash = 0;
  for (let index = 0; index < (slug || '').length; index += 1) hash = slug.charCodeAt(index) + ((hash << 5) - hash);
  const red = Math.abs((hash >> 4) % 256);
  const green = Math.abs((hash >> 12) % 256);
  const blue = Math.abs((hash >> 20) % 256);
  return {
    backgroundImage: `linear-gradient(${DIRECTIONS[Math.abs(hash) % DIRECTIONS.length]}, rgb(${red}, ${green}, ${blue}), rgb(${Math.abs((hash >> 8) % 256)}, ${Math.abs((hash >> 16) % 256)}, ${Math.abs((hash >> 24) % 256)}))`,
    borderColor: `rgba(${red}, ${green}, ${blue}, 0.4)`
  };
}

function compactNumber(value) {
  if (!value) return '0';
  return value >= 1000 ? `${(value / 1000).toFixed(1).replace(/\.0$/, '')}k` : String(value);
}

function formattedDate(value) {
  try {
    return value ? new Date(value).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : 'N/A';
  } catch (error) {
    return 'N/A';
  }
}

function CopyCommand({ slug }) {
  const [copied, setCopied] = useState(false);
  const command = `kresh install ${slug}`;
  async function copy(event) {
    event.preventDefault();
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy install command:', error);
    }
  }
  return <div className="mt-2 flex w-full max-w-xs items-center justify-between gap-2 rounded border border-[var(--gray-400)] bg-[var(--background-100)] px-2.5 py-1 font-mono text-[11px] text-[var(--gray-700)]">
    <span className="truncate"><span className="text-[var(--blue-700)]">$</span> {command}</span>
    <button type="button" onClick={copy} className="shrink-0 p-0.5" title="Copy install command">{copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}</button>
  </div>;
}

export function SkillListRow({ skill }) {
  const detailHref = skill.external ? `/skills/external/${skill.slug.replace(/^external\//, '')}` : `/skills/${skill.slug}`;
  const author = skill.ownerUsername || (skill.external ? 'upstream' : 'unknown');
  const authorNode = skill.external
    ? <a href={skill.sourceUrl || skill.upstreamUrl} target="_blank" rel="noreferrer" className="font-semibold text-[var(--gray-700)] hover:text-[var(--primary)]">@{author}</a>
    : <Link href={`/@${author}`} className="font-semibold text-[var(--gray-700)] hover:text-[var(--primary)]">@{author}</Link>;

  async function copyExternalInstall() {
    try {
      await navigator.clipboard.writeText(`kresh install ${skill.slug}`);
    } catch (error) {
      console.error('Failed to copy external install command:', error);
    }
  }

  const installClass = 'flex items-center gap-1.5 rounded border border-[var(--gray-400)] bg-[var(--gray-1000)] px-4 py-1.5 text-xs font-bold text-[var(--background-100)] hover:opacity-90';

  return <div className="rounded-xl border border-[var(--gray-400)] bg-[var(--background-100)] p-5 shadow-card transition-all duration-200 hover:bg-[var(--gray-100)]">
    <div className="flex flex-col items-start gap-5 lg:grid lg:grid-cols-12 lg:items-center">
      <div className="col-span-6 flex w-full gap-4">
        <div style={gradientFor(skill.slug)} className="h-12 w-12 shrink-0 select-none rounded-xl border shadow-inner" />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <Link href={detailHref} className="hover:text-[var(--blue-700)]"><h3 className="truncate text-sm font-bold text-[var(--primary)]">{skill.name}</h3></Link>
            <Badge variant="default" className="px-1.5 py-0.5 text-[9px] font-semibold lowercase">{skill.external ? 'imported' : skill.category}</Badge>
          </div>
          <p className="mt-1 line-clamp-2 max-w-xl text-xs text-[var(--gray-700)]">{skill.description || 'No description provided.'}</p>
          <CopyCommand slug={skill.slug} />
        </div>
      </div>
      <div className="flex w-full items-center gap-1.5 border-t border-[var(--gray-200)] pt-3 text-xs text-[var(--primary)] lg:col-span-2 lg:w-auto lg:justify-center lg:border-t-0 lg:pt-0">
        <span className="w-24 shrink-0 text-[10px] font-bold uppercase text-[var(--gray-700)] lg:hidden">Author:</span>
        <div className="flex items-center gap-1">{authorNode}<CheckCircle2 className="h-3.5 w-3.5 fill-[var(--blue-100)] text-[var(--blue-700)]" /></div>
      </div>
      <div className="w-full font-mono text-xs text-[var(--gray-700)] lg:col-span-1 lg:w-auto lg:text-center"><span className="inline-block w-24 text-[10px] font-bold uppercase lg:hidden">Version:</span>{skill.external ? 'upstream' : `v${skill.currentVersion || '1.0.0'}`}</div>
      <div className="w-full font-mono text-xs text-[var(--gray-700)] lg:col-span-1 lg:w-auto lg:text-center"><span className="inline-block w-24 text-[10px] font-bold uppercase lg:hidden">Installs:</span>{compactNumber(skill.installsCount)}</div>
      <div className="w-full font-mono text-xs font-semibold text-[var(--blue-700)] lg:col-span-1 lg:w-auto lg:text-center"><span className="inline-block w-24 text-[10px] font-bold uppercase text-[var(--gray-700)] lg:hidden">Stars:</span>{skill.starsCount || 0}</div>
      <div className="w-full text-left font-mono text-xs text-[var(--gray-700)] lg:col-span-1 lg:w-auto lg:text-right"><span className="inline-block w-24 text-[10px] font-bold uppercase lg:hidden">Updated:</span>{formattedDate(skill.createdAt)}</div>
    </div>
    <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-[var(--gray-200)] pt-3">
      <Link href={detailHref} className="rounded border border-[var(--gray-400)] bg-[var(--gray-100)] px-4 py-1.5 text-xs font-semibold text-[var(--primary)] hover:bg-[var(--gray-200)]">View</Link>
      {skill.external
        ? <button type="button" onClick={copyExternalInstall} className={installClass}><Download className="h-3.5 w-3.5" /><span>Copy install</span></button>
        : <a href={`/api/skills/download/${skill.slug}`} className={installClass}><Download className="h-3.5 w-3.5" /><span>Install</span></a>}
    </div>
  </div>;
}

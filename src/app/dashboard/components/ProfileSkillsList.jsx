"use client";

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { 
  FolderGit, CheckCircle2, Copy, Check, Download, 
  ChevronDown, ChevronUp, Pencil
} from 'lucide-react';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';

// Directions for background linear gradients
const DIRECTIONS = [
  'to top',
  'to top right',
  'to right',
  'to bottom right',
  'to bottom',
  'to bottom left',
  'to left',
  'to top left'
];

/**
 * Generates a dynamic, deterministic linear gradient from any random RGB colors.
 */
function getSkillGradient(slug) {
  let hash = 0;
  for (let i = 0; i < (slug || '').length; i++) {
    hash = (slug || '').charCodeAt(i) + ((hash << 5) - hash);
  }
  const dirIdx = Math.abs(hash) % DIRECTIONS.length;
  const direction = DIRECTIONS[dirIdx];
  const r1 = Math.abs((hash >> 4) % 256);
  const g1 = Math.abs((hash >> 12) % 256);
  const b1 = Math.abs((hash >> 20) % 256);
  const r2 = Math.abs((hash >> 8) % 256);
  const g2 = Math.abs((hash >> 16) % 256);
  const b2 = Math.abs((hash >> 24) % 256);
  return {
    backgroundImage: `linear-gradient(${direction}, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`,
    borderColor: `rgba(${r1}, ${g1}, ${b1}, 0.4)`
  };
}

/**
 * Row-level CLI command copy button.
 */
function CopyCommandLine({ slug }) {
  const [copied, setCopied] = useState(false);
  const command = `kresh install ${slug}`;

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy command:', err);
    }
  };

  return (
    <div className="mt-2 flex items-center justify-between gap-2 rounded border border-border-color bg-white/[0.01] px-2.5 py-1 font-mono text-[11px] text-text-secondary w-full max-w-[280px] sm:max-w-xs shrink-0 select-all">
      <div className="flex items-center gap-1.5 truncate">
        <span className="text-kresh-green">$</span>
        <span className="truncate">{command}</span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={`transition-all duration-150 p-0.5 rounded hover:bg-white/10 shrink-0 outline-none ${
          copied ? 'text-kresh-green' : 'text-text-secondary/70 hover:text-text-primary'
        }`}
        title="Copy install command"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

/**
 * ProfileSkillsList Component
 * Displays user's skills using the list layout, with sorting and expandable accordion.
 */
export function ProfileSkillsList({ skills, isOwner }) {
  const [activeTab, setActiveTab] = useState('all');
  const [isExpanded, setIsExpanded] = useState(false);

  const initialLimit = 2;

  // Handle sorting
  const sortedSkills = useMemo(() => {
    const result = [...skills];
    if (activeTab === 'popular') {
      result.sort((a, b) => (b.starsCount || 0) - (a.starsCount || 0));
    } else if (activeTab === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeTab === 'most-installed') {
      result.sort((a, b) => (b.installsCount || 0) - (a.installsCount || 0));
    } else {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    return result;
  }, [skills, activeTab]);

  // Limit/Accordion slicing
  const displayedSkills = useMemo(() => {
    if (isExpanded) return sortedSkills;
    return sortedSkills.slice(0, initialLimit);
  }, [sortedSkills, isExpanded]);

  const hiddenCount = sortedSkills.length - initialLimit;

  return (
    <div className="space-y-6">
      {/* Title section */}
      <div className="flex flex-col gap-1 border-b border-white/5 pb-4">
        <h2 className="text-lg font-bold text-text-primary flex items-center gap-2">
          <FolderGit className="w-5 h-5 text-text-secondary" />
          My Intelligence Registry
        </h2>
        <span className="text-xs text-text-secondary">
          {skills.length} {skills.length === 1 ? 'skill' : 'skills'} published
        </span>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <div className="flex rounded-lg border border-border-color bg-white/[0.01] p-1 font-medium">
          {[
            { id: 'all', label: 'All' },
            { id: 'popular', label: 'Popular' },
            { id: 'recent', label: 'Recent' },
            { id: 'most-installed', label: 'Most Installed' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`rounded px-3.5 py-1.5 transition-colors duration-150 ${
                activeTab === tab.id
                  ? 'bg-white/10 text-text-primary font-bold'
                  : 'text-text-secondary hover:text-text-primary'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* Rows */}
      <div className="space-y-4">
        {displayedSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 glass rounded-lg text-center">
            <span className="font-mono text-xs text-text-secondary/50 mb-2">$ no published skills</span>
            <p className="text-xs text-text-secondary">Publish a skill to see it listed here.</p>
          </div>
        ) : (
          displayedSkills.map((skill) => {
            const gradientStyle = getSkillGradient(skill.slug);
            const formattedDate = new Date(skill.createdAt).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric'
            });

            return (
              <div 
                key={skill.id}
                className="glass rounded-xl p-5 hover:border-white/20 hover:bg-white/[0.02] transition-all duration-200"
              >
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start lg:items-center">
                  
                  {/* Left column info */}
                  <div className="col-span-6 flex gap-4 w-full">
                    <div 
                      style={gradientStyle}
                      className="w-12 h-12 rounded-xl border shrink-0 shadow-inner select-none"
                    />
                    
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/skills/${skill.slug}`} className="hover:text-kresh-green transition-colors duration-150">
                          <h3 className="text-sm font-bold text-text-primary truncate">{skill.name}</h3>
                        </Link>
                        <Badge variant="default" className="text-[9px] px-1.5 py-0.5 lowercase font-semibold">
                          {skill.category}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-text-secondary line-clamp-2 max-w-xl">
                        {skill.description || 'No description provided.'}
                      </p>
                      <CopyCommandLine slug={skill.slug} />
                    </div>
                  </div>

                  {/* Author */}
                  <div className="lg:col-span-2 flex items-center gap-1.5 text-xs text-text-primary lg:justify-center w-full lg:w-auto border-t lg:border-t-0 border-white/5 pt-3 lg:pt-0">
                    <span className="lg:hidden text-[10px] text-text-secondary font-bold uppercase w-24 shrink-0">Author:</span>
                    <div className="flex items-center gap-1">
                      <span className="font-semibold text-text-secondary">
                        @{skill.ownerUsername || 'unknown'}
                      </span>
                      <CheckCircle2 className="w-3.5 h-3.5 text-kresh-green fill-kresh-green/10" />
                    </div>
                  </div>

                  {/* Version */}
                  <div className="lg:col-span-1 text-xs text-text-secondary font-mono lg:text-center w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-text-secondary font-bold uppercase w-24 inline-block">Version:</span>
                    <span>v{skill.currentVersion || '1.0.0'}</span>
                  </div>

                  {/* Installs */}
                  <div className="lg:col-span-1 text-xs text-text-secondary font-mono lg:text-center w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-text-secondary font-bold uppercase w-24 inline-block">Installs:</span>
                    <span>{skill.installsCount || 0}</span>
                  </div>

                  {/* Stars */}
                  <div className="lg:col-span-1 text-xs font-semibold font-mono text-kresh-green lg:text-center w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-text-secondary font-bold uppercase w-24 inline-block">Stars:</span>
                    <span>{skill.starsCount || 0}</span>
                  </div>

                  {/* Updated Date */}
                  <div className="lg:col-span-1 text-xs text-text-secondary/85 text-left lg:text-right w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-text-secondary font-bold uppercase w-24 inline-block">Updated:</span>
                    <span className="font-mono">{formattedDate}</span>
                  </div>

                </div>

                {/* Bottom buttons */}
                <div className="mt-4 flex items-center justify-between border-t border-white/5 pt-3">
                  <div className="flex items-center">
                    {isOwner && (
                      <Link 
                        href={`/dashboard/publish?edit=${skill.slug}`}
                        className="p-1.5 rounded hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1 text-[11px]"
                        title="Edit Skill Details"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit</span>
                      </Link>
                    )}
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/skills/${skill.slug}`}>
                      <button 
                        type="button" 
                        className="rounded border border-border-color bg-white/5 hover:bg-white/10 px-4 py-1.5 text-center text-xs font-semibold text-text-primary transition-all duration-150 outline-none"
                      >
                        View
                      </button>
                    </Link>
                    <a href={`/api/skills/${skill.slug}/download`}>
                      <button 
                        type="button" 
                        className="rounded border border-border-color bg-text-primary px-4 py-1.5 text-center text-xs font-bold text-background hover:opacity-90 transition-all duration-150 outline-none flex items-center gap-1.5"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Install</span>
                      </button>
                    </a>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

      {/* Expandable view more controls */}
      {!isExpanded && hiddenCount > 0 && (
        <div className="flex items-center justify-center pt-2">
          <Button 
            variant="outline" 
            onClick={() => setIsExpanded(true)}
            className="text-xs py-2 px-6 flex items-center gap-1.5 rounded-lg border-white/10 hover:bg-white/5 cursor-pointer"
          >
            <span>View more skills ({hiddenCount})</span>
            <ChevronDown className="w-4 h-4 text-text-secondary" />
          </Button>
        </div>
      )}

      {isExpanded && sortedSkills.length > initialLimit && (
        <div className="flex items-center justify-center pt-2">
          <Button 
            variant="outline" 
            onClick={() => setIsExpanded(false)}
            className="text-xs py-2 px-6 flex items-center gap-1.5 rounded-lg border-white/10 hover:bg-white/5 cursor-pointer"
          >
            <span>Show less</span>
            <ChevronUp className="w-4 h-4 text-text-secondary" />
          </Button>
        </div>
      )}

    </div>
  );
}

"use client";

import React, { useState } from 'react';
import Link from 'next/link';
import { Download, Star, Terminal, Copy, Check, Info, Calendar, Shield, Award, X, ChevronRight, MonitorSmartphone } from 'lucide-react';

/**
 * Sidebar Component
 * Displays repository details, installation commands, statistics, releases, and creator profile.
 */
export function Sidebar({ skill, ownerUsername, latestVersion }) {
  const [copied, setCopied] = useState(false);
  const [showInstallOptions, setShowInstallOptions] = useState(false);
  const [selectedEnv, setSelectedEnv] = useState(null);
  const [copiedEnv, setCopiedEnv] = useState(false);
  
  const isAgentConfig = skill.category === 'AGENTS.md/CLAUDE.md' || skill.category === 'AGENT.md/CLAUDE.md' || skill.category === 'Agents' || skill.category === 'Design.md';
  const baseInstallText = `kresh install ${skill.slug}`;

  const getEnvInstallText = () => {
    if (!selectedEnv) return baseInstallText;
    return `kresh install ${skill.slug} --${selectedEnv}`;
  };

  const handleCopyEnv = async () => {
    try {
      await navigator.clipboard.writeText(getEnvInstallText());
      setCopiedEnv(true);
      setTimeout(() => setCopiedEnv(false), 2000);
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(baseInstallText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy text to clipboard:', err);
    }
  };

  const environments = [
    { id: 'claude', name: 'Claude Code', image: '/install_images/claude_code.png' },
    { id: 'codex', name: 'Codex', image: '/install_images/codex.png' },
    { id: 'agy', name: 'Antigravity', image: '/install_images/antigravity.png' },
    { id: 'cursor', name: 'Cursor', image: '/install_images/cursor.png' },
  ];

  const publishDate = latestVersion?.publishedAt 
    ? new Date(latestVersion.publishedAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : new Date(skill.createdAt).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

  return (
    <div className="flex flex-col gap-6 w-full lg:max-w-xs shrink-0">
      {/* About Box */}
      <div className="flex flex-col gap-3">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Info className="w-4 h-4 text-text-secondary" />
          About
        </h3>
        <p className="text-sm leading-6 text-text-secondary">
          {skill.description || 'No description provided for this skill.'}
        </p>
        <div className="mt-2 flex flex-col gap-2.5 text-xs text-text-secondary">
          <div className="flex items-center gap-2">
            <Shield className="w-3.5 h-3.5 text-text-secondary/70" />
            <span>Public registry module</span>
          </div>
          <div className="flex items-center gap-2">
            <Award className="w-3.5 h-3.5 text-text-secondary/70" />
            <span>Category: <span className="text-text-primary font-medium">{skill.category}</span></span>
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Install Action */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Terminal className="w-4 h-4 text-text-secondary" />
          Installation
        </h3>
        
        {isAgentConfig ? (
          <div className="flex items-center justify-between rounded-lg border border-border-color bg-white/[0.01] p-3 text-xs font-mono text-text-secondary backdrop-blur-sm">
            <div className="flex items-center gap-2 truncate">
              <span className="text-kresh-green shrink-0">$</span>
              <span className="truncate text-text-primary select-all">{baseInstallText}</span>
            </div>
            <button 
              type="button"
              onClick={handleCopy}
              className={`transition-all duration-200 p-1.5 rounded-md hover:bg-white/10 ml-2 shrink-0 outline-none ${
                copied ? 'text-kresh-green' : 'text-text-secondary hover:text-text-primary'
              }`}
              aria-label="Copy install command"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            </button>
          </div>
        ) : (
          <div className="relative flex flex-col gap-2">
            <button
              onClick={() => setShowInstallOptions(!showInstallOptions)}
              className="group flex w-full items-center justify-between rounded-lg border border-border-color bg-white/[0.02] p-4 transition-all duration-200 hover:border-white/20 hover:bg-white/[0.05]"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-kresh-green/10 text-kresh-green">
                  <MonitorSmartphone className="h-4 w-4" />
                </div>
                <div className="flex flex-col items-start">
                  <span className="text-sm font-semibold text-text-primary">Install Component</span>
                  <span className="text-[10px] text-text-secondary">Select target environment</span>
                </div>
              </div>
              <ChevronRight className={`h-4 w-4 text-text-secondary transition-all duration-300 group-hover:text-text-primary ${showInstallOptions ? 'rotate-90' : ''}`} />
            </button>
            
            {showInstallOptions && (
              <>
                <div 
                  className="fixed inset-0 z-40" 
                  onClick={() => setShowInstallOptions(false)} 
                />
                <div className="absolute left-0 top-full z-50 mt-2 w-full animate-in fade-in slide-in-from-top-2 duration-200">
                  <div 
                    className="flex flex-col gap-2 rounded-xl border border-border-color p-3 shadow-2xl"
                    style={{
                      backgroundColor: 'var(--background)',
                      backgroundImage: 'radial-gradient(circle at top right, rgba(46, 204, 113, 0.08), transparent 50%)',
                      backdropFilter: 'blur(24px) saturate(180%)',
                      WebkitBackdropFilter: 'blur(24px) saturate(180%)'
                    }}
                  >
                    <div className="flex flex-col gap-1">
                      {environments.map((env) => (
                        <button
                          key={env.id}
                          onClick={() => setSelectedEnv(env.id)}
                          className={`flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${
                            selectedEnv === env.id 
                              ? 'bg-kresh-green/10 text-kresh-green border border-kresh-green/20' 
                              : 'bg-transparent text-text-secondary border border-transparent hover:bg-text-primary/5 hover:text-text-primary'
                          }`}
                        >
                          <img src={env.image} alt={env.name} className="h-5 w-5 object-contain opacity-80" />
                          {env.name}
                        </button>
                      ))}
                    </div>
                    
                    <div className={`mt-2 transition-all duration-300 ${selectedEnv ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2 pointer-events-none'}`}>
                      <div className="flex items-center justify-between rounded-md bg-text-primary/5 p-2.5 border border-border-color">
                        <div className="flex items-center gap-2 truncate font-mono text-[11px]">
                          <span className="text-kresh-green">$</span>
                          <span className="truncate text-text-primary select-all">{getEnvInstallText()}</span>
                        </div>
                        <button 
                          onClick={handleCopyEnv}
                          className={`ml-2 shrink-0 rounded p-1.5 transition-all duration-200 ${
                            copiedEnv ? 'text-kresh-green' : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          {copiedEnv ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      <hr className="border-white/10" />

      {/* Stats */}
      <div className="flex flex-col gap-2.5 text-sm">
        <h3 className="font-bold text-text-primary">Repository Metrics</h3>
        <div className="grid grid-cols-2 gap-3 mt-1 text-xs">
          <div className="flex flex-col gap-1 p-3 rounded-lg border border-border-color bg-white/[0.01]">
            <span className="text-text-secondary">Installs</span>
            <span className="text-lg font-bold text-text-primary flex items-center gap-1.5 mt-0.5">
              <Download className="w-4 h-4 text-kresh-green" />
              {skill.installsCount || 0}
            </span>
          </div>
          <div className="flex flex-col gap-1 p-3 rounded-lg border border-border-color bg-white/[0.01]">
            <span className="text-text-secondary">Stars</span>
            <span className="text-lg font-bold text-text-primary flex items-center gap-1.5 mt-0.5">
              <Star className="w-4 h-4 text-kresh-green" />
              {skill.starsCount || 0}
            </span>
          </div>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Releases */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-text-primary flex items-center gap-2">
          <Calendar className="w-4 h-4 text-text-secondary" />
          Releases
        </h3>
        <div className="flex items-center justify-between rounded-lg border border-border-color bg-white/[0.01] p-3 text-xs backdrop-blur-sm">
          <div className="flex flex-col gap-0.5">
            <span className="font-bold text-text-primary">v{latestVersion?.version || skill.currentVersion || '1.0.0'}</span>
            <span className="text-[10px] text-text-secondary">{publishDate}</span>
          </div>
          <span className="rounded bg-kresh-green/10 border border-kresh-green/20 px-2 py-0.5 text-[9px] font-bold text-kresh-green uppercase">
            Latest
          </span>
        </div>
      </div>

      <hr className="border-white/10" />

      {/* Contributor / Publisher */}
      <div className="flex flex-col gap-2.5">
        <h3 className="text-sm font-bold text-text-primary">Publisher</h3>
        <Link href={`/@${ownerUsername || 'unknown'}`} className="flex items-center gap-3 hover:opacity-85 transition-opacity">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/5 border border-white/10 text-sm font-bold text-text-primary uppercase shrink-0">
            {ownerUsername ? ownerUsername.charAt(0) : 'U'}
          </div>
          <div className="flex flex-col">
            <span className="text-xs font-semibold text-text-primary hover:text-kresh-green transition-colors">@{ownerUsername || 'unknown'}</span>
            <span className="text-[10px] text-text-secondary">Open registry contributor</span>
          </div>
        </Link>
      </div>
    </div>
  );
}

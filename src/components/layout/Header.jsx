"use client";

import React, { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, Loader2, Code, Feather, Brain, Terminal, Copy, Check, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { MobileMenu } from './MobileMenu';

function getSkillIcon(name, category) {
  const lowercaseName = (name || '').toLowerCase();
  
  if (lowercaseName.includes('python') || lowercaseName.includes('code') || lowercaseName.includes('expert') || lowercaseName.includes('programming')) {
    return Code;
  }
  if (lowercaseName.includes('writing') || lowercaseName.includes('doc') || lowercaseName.includes('guide') || lowercaseName.includes('write')) {
    return Feather;
  }
  if (lowercaseName.includes('prompt') || lowercaseName.includes('brain') || lowercaseName.includes('think') || lowercaseName.includes('agent')) {
    return Brain;
  }
  return Terminal;
}

function getCategoryVariant(category) {
  const lower = (category || '').toLowerCase();
  if (lower.includes('agents') || lower.includes('claude')) return 'green';
  if (lower.includes('skill')) return 'default';
  return 'default';
}

export function Header() {
  const inputRef = useRef(null);
  const containerRef = useRef(null);
  const router = useRouter();

  const [session, setSession] = useState(undefined);
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [isMobileSearchOpen, setIsMobileSearchOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const [copiedSlug, setCopiedSlug] = useState(null);

  useEffect(() => {
    import('@/app/(auth)/actions').then(m => {
      m.getSessionAction().then(res => setSession(res || null));
    });
  }, []);

  const handleLogout = async () => {
    try {
      const { logoutAction } = await import('@/app/(auth)/actions');
      await logoutAction();
    } catch (err) {
      console.error('Failed to log out:', err);
    }
  };

  useEffect(() => {
    const handleGlobalKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
        setIsOpen(true);
      }
    };
    window.addEventListener('keydown', handleGlobalKeyDown);
    return () => window.removeEventListener('keydown', handleGlobalKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (containerRef.current && !containerRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const isSearchingActive = isOpen || isMobileSearchOpen;
    if (!isSearchingActive || !searchQuery.trim()) {
      setResults([]);
      return;
    }

    const fetchSkills = async () => {
      setLoading(true);
      try {
        const url = `/api/skills?q=${encodeURIComponent(searchQuery)}`;
        const res = await fetch(url);
        if (res.ok) {
          const data = await res.json();
          setResults(data.slice(0, 6));
        } else {
          setResults([]);
        }
      } catch (err) {
        console.error('Error searching skills:', err);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(() => {
      fetchSkills();
    }, 200);

    return () => clearTimeout(timer);
  }, [searchQuery, isOpen, isMobileSearchOpen]);

  useEffect(() => {
    setActiveIndex(-1);
  }, [results]);

  const handleInputKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev + 1 >= results.length ? 0 : prev + 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev - 1 < 0 ? results.length - 1 : prev - 1));
    } else if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      inputRef.current?.blur();
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (activeIndex >= 0 && activeIndex < results.length) {
        const selectedSkill = results[activeIndex];
        router.push(`/skills/${selectedSkill.slug}`);
        setIsOpen(false);
        inputRef.current?.blur();
      } else if (searchQuery.trim()) {
        router.push(`/skills?search=${encodeURIComponent(searchQuery)}`);
        setIsOpen(false);
        inputRef.current?.blur();
      }
    }
  };

  const handleCopyInstall = async (e, slug) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`kresh install ${slug}`);
      setCopiedSlug(slug);
      setTimeout(() => setCopiedSlug(null), 2000);
    } catch (err) {
      console.error('Failed to copy install command:', err);
    }
  };

  const handleResultClick = (slug) => {
    router.push(`/skills/${slug}`);
    setIsOpen(false);
    setIsMobileSearchOpen(false);
    if (inputRef.current) inputRef.current.blur();
  };

  const showDropdown = isOpen && searchQuery.trim().length > 0;

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-[var(--background-100)] border-b border-[var(--gray-400)] px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/logo/kresh_logo_exact.svg" alt="Kresh Logo" width={36} height={36} className="object-contain" />
            <span className="text-[var(--primary)] font-bold text-xl hidden sm:inline-block">kresh</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6 text-sm text-[var(--gray-700)] font-medium">
            <a href="/skills?category=skill" className="hover:text-[var(--primary)] transition-all duration-200 hover:-translate-y-[1px]">Skills</a>
            <a href="/skills?category=agents.md/claude.md" className="hover:text-[var(--primary)] transition-all duration-200 hover:-translate-y-[1px]">Agent.md/Claude.md</a>
            <a href="/skills?category=design.md" className="hover:text-[var(--primary)] transition-all duration-200 hover:-translate-y-[1px]">Design.md</a>
            <a href="/loops" className="hover:text-[var(--primary)] transition-all duration-200 hover:-translate-y-[1px]">Loops</a>
            <a href="/docs" className="hover:text-[var(--primary)] transition-all duration-200 hover:-translate-y-[1px]">Docs</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          {/* Desktop/Tablet search input */}
          <div 
            ref={containerRef}
            className="hidden md:flex items-center bg-[var(--background-100)] border border-[var(--gray-400)] rounded-[6px] px-3 py-1.5 text-sm text-[var(--gray-900)] w-64 focus-within:border-[var(--gray-600)] transition-all duration-150 relative"
          >
            <Search className="w-4 h-4 mr-2 text-[var(--gray-700)] shrink-0" />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search skills..." 
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setIsOpen(true);
              }}
              onFocus={() => setIsOpen(true)}
              onKeyDown={handleInputKeyDown}
              className="bg-transparent border-none outline-none w-full text-[var(--primary)] placeholder-text-secondary/50 text-xs"
            />
            {loading ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin text-[var(--gray-900)] shrink-0 ml-auto" />
            ) : (
              <span className="ml-auto text-[12px] bg-[var(--gray-100)] text-[var(--gray-900)] px-1.5 py-0.5 rounded-[6px] border border-[var(--gray-400)] shrink-0 select-none">Ctrl+K</span>
            )}

            {showDropdown && (
              <div 
                className="absolute top-full right-0 mt-2 w-full min-w-[320px] max-h-[420px] overflow-hidden rounded-[12px] border border-[var(--gray-400)] shadow-menu flex flex-col z-50 bg-[var(--background-100)]"
              >
                <div className="px-3.5 py-2 border-b border-[var(--gray-200)] flex items-center justify-between text-[12px] font-semibold text-[var(--gray-900)] uppercase tracking-wider bg-[var(--background-200)] select-none">
                  <span>Search Results</span>
                  {results.length > 0 && (
                    <span className="text-[9px] font-normal normal-case">{results.length} found</span>
                  )}
                </div>

                <div className="overflow-y-auto flex-1 max-h-[300px] p-1.5 space-y-0.5 custom-scrollbar">
                  {results.length === 0 ? (
                    <div className="py-8 px-4 text-center">
                      <p className="text-xs text-[var(--gray-700)] font-medium">
                        {loading ? 'Searching Kresh registry...' : `No skills found matching "${searchQuery}"`}
                      </p>
                    </div>
                  ) : (
                    results.map((skill, index) => {
                      const IconComponent = getSkillIcon(skill.name, skill.category);
                      const isHighlighted = activeIndex === index;
                      const isCopied = copiedSlug === skill.slug;

                      return (
                        <div
                          key={skill.slug}
                          onClick={() => handleResultClick(skill.slug)}
                          className={`flex items-center justify-between gap-3 px-3 py-2 rounded-[6px] border transition-colors duration-150 cursor-pointer ${
                            isHighlighted
                              ? 'bg-[var(--gray-100)] border-[var(--gray-400)]'
                              : 'bg-transparent border-transparent hover:bg-[var(--gray-100)]'
                          }`}
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <div className={`w-8 h-8 rounded-[6px] flex items-center justify-center shrink-0 transition-colors ${
                              isHighlighted ? 'bg-[var(--blue-100)] text-[var(--blue-700)]' : 'bg-[var(--gray-200)] text-[var(--gray-900)]'
                            }`}>
                              <IconComponent className="w-4 h-4" />
                            </div>
                            
                            <div className="min-w-0 text-left">
                              <div className="flex items-center gap-2">
                                <span className={`text-xs font-bold truncate transition-colors ${
                                  isHighlighted ? 'text-[var(--primary)]' : 'text-[var(--primary)]/95'
                                }`}>
                                  {skill.name}
                                </span>
                                <Badge variant={getCategoryVariant(skill.category)} className="shrink-0 scale-90 origin-left">
                                  {skill.category}
                                </Badge>
                              </div>
                              <div className="flex items-center gap-1.5 mt-0.5 text-[10px] text-[var(--gray-700)] truncate">
                                <span className="text-kresh-green/90">@{skill.ownerUsername}</span>
                                <span>•</span>
                                <span className="truncate max-w-[140px]">{skill.description}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center gap-2 shrink-0">
                            <button
                              type="button"
                              onClick={(e) => handleCopyInstall(e, skill.slug)}
                              className={`p-1.5 rounded transition-all duration-150 border ${
                                isCopied 
                                  ? 'bg-kresh-green/10 border-kresh-green/30 text-kresh-green'
                                  : isHighlighted
                                    ? 'bg-white/10 border-[var(--gray-400)] hover:bg-white/15 text-[var(--primary)]'
                                    : 'bg-transparent border-transparent hover:bg-[var(--gray-100)] text-[var(--gray-700)]/70 hover:text-[var(--primary)]'
                              }`}
                              title="Copy install command"
                            >
                              {isCopied ? (
                                <Check className="w-3.5 h-3.5 animate-scale-in" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>

                <div className="px-3 py-2 border-t border-[var(--gray-400)]/40 bg-white/[0.02] flex items-center justify-between text-[9px] text-[var(--gray-700)]/70 select-none font-mono">
                  <div className="flex items-center gap-1">
                    <span className="bg-text-primary/5 px-1 py-0.5 rounded border border-[var(--gray-400)]">↑↓</span>
                    <span>to navigate</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="bg-text-primary/5 px-1 py-0.5 rounded border border-[var(--gray-400)]">↵</span>
                    <span>to select</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <span className="bg-text-primary/5 px-1 py-0.5 rounded border border-[var(--gray-400)]">Esc</span>
                    <span>to close</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Mobile search toggle icon */}
          <button
            type="button"
            onClick={() => setIsMobileSearchOpen(true)}
            className="md:hidden p-2 text-[var(--gray-700)] hover:text-[var(--primary)] hover:bg-[var(--gray-100)] rounded-md transition-colors"
            aria-label="Search skills"
          >
            <Search className="w-5.5 h-5.5" />
          </button>
          
          <div className="flex items-center gap-4">
            {session === undefined ? (
              <div className="w-20 h-9 bg-[var(--gray-100)] animate-pulse rounded-md" />
            ) : session ? (
              <div className="hidden md:flex items-center gap-4">
                <a href={`/@${session.username}`} className="text-sm font-medium text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-kresh-green animate-pulse" />
                  @{session.username}
                </a>
                <a href="/dashboard/publish">
                  <Button variant="glass">Publish Skill</Button>
                </a>
              </div>
            ) : (
              <div className="hidden md:flex items-center gap-4">
                <a href="/signin">
                  <Button variant="outline">Sign in</Button>
                </a>
              </div>
            )}
            {session !== undefined && (
              <MobileMenu session={session} onLogout={handleLogout} />
            )}
          </div>

        </div>
      </div>

      {/* MOBILE FULL SCREEN SEARCH OVERLAY */}
      {isMobileSearchOpen && (
        <div 
          className="fixed inset-0 z-[100] flex flex-col p-4 md:hidden bg-[var(--background-100)]"
        >
          {/* Top input bar */}
          <div className="flex items-center gap-3 w-full">
            <div className="flex-1 flex items-center bg-[var(--background-100)] border border-[var(--gray-400)] rounded-[6px] px-4 py-2.5 text-sm text-[var(--gray-900)]">
              <Search className="w-4 h-4 mr-2.5 shrink-0 text-[var(--gray-700)]/60" />
              <input
                autoFocus
                type="text"
                placeholder="Search skills..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    if (activeIndex >= 0 && activeIndex < results.length) {
                      handleResultClick(results[activeIndex].slug);
                    } else if (searchQuery.trim()) {
                      router.push(`/skills?search=${encodeURIComponent(searchQuery)}`);
                      setIsMobileSearchOpen(false);
                    }
                  } else if (e.key === 'Escape') {
                    setIsMobileSearchOpen(false);
                  }
                }}
                className="bg-transparent border-none outline-none w-full text-[var(--primary)] placeholder-text-secondary/50 text-sm"
              />
              {loading && <Loader2 className="w-4 h-4 animate-spin text-kresh-green shrink-0" />}
            </div>
            
            {/* Close button */}
            <button
              type="button"
              onClick={() => setIsMobileSearchOpen(false)}
              className="p-2 text-[var(--gray-700)] hover:text-[var(--primary)] hover:bg-[var(--gray-100)] rounded-full transition-colors flex items-center justify-center shrink-0"
              aria-label="Close search overlay"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Results Area */}
          <div className="flex-1 overflow-y-auto mt-4 space-y-2.5 custom-scrollbar pb-8">
            {searchQuery.trim() === '' ? (
              <div className="py-12 text-center text-[var(--gray-700)]/60">
                <Search className="w-8 h-8 mx-auto mb-3 text-[var(--gray-700)]/35 animate-pulse" />
                <p className="text-xs font-semibold">Type a name, keyword, or author</p>
                <p className="text-[10px] text-[var(--gray-700)]/55 mt-1">Real-time suggestions will show up here</p>
              </div>
            ) : results.length === 0 ? (
              <div className="py-12 text-center text-[var(--gray-700)]/60">
                <p className="text-xs font-semibold">
                  {loading ? 'Searching...' : `No results for "${searchQuery}"`}
                </p>
              </div>
            ) : (
              results.map((skill, index) => {
                const IconComponent = getSkillIcon(skill.name, skill.category);
                const isCopied = copiedSlug === skill.slug;

                return (
                  <div
                    key={skill.slug}
                    onClick={() => handleResultClick(skill.slug)}
                    className="flex items-center justify-between gap-3 p-3.5 rounded-[6px] border border-[var(--gray-400)] bg-[var(--background-100)] active:bg-[var(--gray-100)] transition-colors duration-150 cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-[6px] flex items-center justify-center shrink-0 bg-[var(--gray-100)] text-[var(--gray-900)]">
                        <IconComponent className="w-5 h-5" />
                      </div>
                      
                      <div className="min-w-0 text-left">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-sm font-bold text-[var(--primary)] truncate">
                            {skill.name}
                          </span>
                          <Badge variant={getCategoryVariant(skill.category)} className="shrink-0 scale-90 origin-left">
                            {skill.category}
                          </Badge>
                        </div>
                        <div className="flex items-center gap-1.5 mt-1 text-[11px] text-[var(--gray-700)] truncate">
                          <span className="text-kresh-green font-semibold">@{skill.ownerUsername}</span>
                          <span>•</span>
                          <span className="truncate max-w-[160px]">{skill.description}</span>
                        </div>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleCopyInstall(e, skill.slug)}
                      className={`p-2 rounded-lg transition-all duration-150 border shrink-0 ${
                        isCopied 
                          ? 'bg-kresh-green/10 border-kresh-green/30 text-kresh-green'
                          : 'bg-[var(--gray-100)] border-[var(--gray-400)] text-[var(--gray-700)]'
                      }`}
                    >
                      {isCopied ? (
                        <Check className="w-4 h-4" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}
    </header>
  );
}

'use client';

import React, { useState, useMemo, useEffect, Suspense, useRef, useCallback } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Code, Feather, Brain, Network, Terminal, CheckCircle2, 
  Copy, Check, Eye, Download
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
 * Opacity is set to 0.2 for backgrounds, and border/text matches the generated color.
 */
function getSkillGradient(slug) {
  let hash = 0;
  for (let i = 0; i < (slug || '').length; i++) {
    hash = (slug || '').charCodeAt(i) + ((hash << 5) - hash);
  }

  // Deterministically select direction
  const dirIdx = Math.abs(hash) % DIRECTIONS.length;
  const direction = DIRECTIONS[dirIdx];

  // Deterministically generate color 1 (R, G, B channels from 0 to 255)
  const r1 = Math.abs((hash >> 4) % 256);
  const g1 = Math.abs((hash >> 12) % 256);
  const b1 = Math.abs((hash >> 20) % 256);

  // Deterministically generate color 2
  const r2 = Math.abs((hash >> 8) % 256);
  const g2 = Math.abs((hash >> 16) % 256);
  const b2 = Math.abs((hash >> 24) % 256);

  return {
    backgroundImage: `linear-gradient(${direction}, rgb(${r1}, ${g1}, ${b1}), rgb(${r2}, ${g2}, ${b2}))`,
    borderColor: `rgba(${r1}, ${g1}, ${b1}, 0.4)`
  };
}

/**
 * Resolves the display icon or initials for a skill.
 */
function getSkillIcon(name, category) {
  const lowercaseName = (name || '').toLowerCase();
  
  if (lowercaseName.includes('python') || lowercaseName.includes('code') || lowercaseName.includes('expert') || lowercaseName.includes('programming')) {
    return { type: 'icon', element: Code };
  }
  if (lowercaseName.includes('writing') || lowercaseName.includes('doc') || lowercaseName.includes('guide') || lowercaseName.includes('write')) {
    return { type: 'icon', element: Feather };
  }
  if (lowercaseName.includes('prompt') || lowercaseName.includes('brain') || lowercaseName.includes('think') || lowercaseName.includes('agent')) {
    return { type: 'icon', element: Brain };
  }
  if (lowercaseName.includes('animation') || lowercaseName.includes('motion') || lowercaseName.includes('design') || lowercaseName.includes('workflow')) {
    return { type: 'icon', element: Network };
  }
  
  // Create abbreviation fallback (e.g. Andrej_Karpathy -> A_K)
  const words = (name || '').split(/[\s_-]+/);
  let initials = '';
  if (words.length >= 2 && words[0] && words[1]) {
    initials = (words[0].charAt(0) + '_' + words[1].charAt(0)).toUpperCase();
  } else if ((name || '').length > 0) {
    initials = (name || '').substring(0, 3).toUpperCase();
  } else {
    initials = 'SK';
  }
  return { type: 'text', value: initials };
}

/**
 * Formats statistics counts nicely (e.g. 1500 -> 1.5k)
 */
function formatStatCount(num) {
  if (!num) return '0';
  if (num >= 1000) {
    return (num / 1000).toFixed(1).replace(/\.0$/, '') + 'k';
  }
  return String(num);
}

/**
 * Formats date into "MMM D, YYYY"
 */
function formatDate(dateVal) {
  if (!dateVal) return 'N/A';
  try {
    return new Date(dateVal).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  } catch (e) {
    return 'N/A';
  }
}

/**
 * Compact row-level copy command button.
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
    <div 
      onClick={handleCopy}
      className={`flex items-center gap-2 rounded border px-3 py-1.5 font-mono text-xs cursor-pointer select-all transition-all duration-150 shrink-0 ${
        copied 
          ? 'bg-[var(--blue-1000)]/40 border-[var(--blue-700)]/50 text-[var(--blue-400)] shadow-[0_0_8px_rgba(0,107,255,0.15)]' 
          : 'bg-[var(--background-100)] border-[var(--gray-300)] text-[var(--primary)] hover:bg-[var(--gray-100)] hover:border-[var(--gray-400)] shadow-sm'
      }`}
      title="Click to copy install command"
    >
      {copied ? (
        <Check className="w-3.5 h-3.5 text-[var(--blue-500)] shrink-0" />
      ) : (
        <Copy className="w-3.5 h-3.5 text-[var(--secondary)] shrink-0" />
      )}
      <span>{command}</span>
    </div>
  );
}

/**
 * Computes a human-readable time-ago string from a date.
 */
function formatTimeAgo(dateVal) {
  if (!dateVal) return 'recently';
  try {
    const now = new Date();
    const past = new Date(dateVal);
    const diffMs = now - past;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    const diffWeeks = Math.floor(diffDays / 7);
    const diffMonths = Math.floor(diffDays / 30);

    if (diffMins < 60) return `${Math.max(1, diffMins)}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    if (diffWeeks < 4) return `${diffWeeks}w ago`;
    if (diffMonths < 12) return `${diffMonths}mo ago`;
    return `${Math.floor(diffDays / 365)}y ago`;
  } catch (e) {
    return 'recently';
  }
}

/**
 * Returns color classes based on category name matching vercel_design.md dark mode colors.
 */
function getCategoryClass(category) {
  const cat = (category || '').toLowerCase();
  if (cat.includes('discover') || cat.includes('api')) {
    return 'bg-[#2f004e]/40 text-[#dfa7ff] border border-[#8500d1]/30';
  }
  if (cat.includes('front') || cat.includes('design') || cat.includes('theme') || cat.includes('css') || cat.includes('ui')) {
    return 'bg-[#002359]/40 text-[#94ccff] border border-[#0059ec]/30';
  }
  if (cat.includes('content') || cat.includes('write') || cat.includes('prompt')) {
    return 'bg-[#47000c]/40 text-[#ffb1b3] border border-[#ea001d]/30';
  }
  if (cat.includes('agent') || cat.includes('claude') || cat.includes('ai')) {
    return 'bg-[#561900]/40 text-[#ffc543] border border-[#ff9300]/30';
  }
  return 'bg-[var(--gray-200)] text-[var(--gray-800)] border border-[var(--gray-300)]';
}

function SkillsListContent({ skills }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  
  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'popular', 'recent', 'most-installed'
  const [authorFilter, setAuthorFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);

  const [externalSkills, setExternalSkills] = useState([]);
  const [externalTotal, setExternalTotal] = useState(0);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Keep state variables in refs to construct stable callbacks
  const loadingRef = useRef(loading);
  const hasMoreRef = useRef(hasMore);
  const cursorRef = useRef(cursor);
  const searchRef = useRef(search);
  const categoryFilterRef = useRef(categoryFilter);
  const errorRef = useRef(error);

  useEffect(() => {
    loadingRef.current = loading;
  }, [loading]);

  useEffect(() => {
    hasMoreRef.current = hasMore;
  }, [hasMore]);

  useEffect(() => {
    cursorRef.current = cursor;
  }, [cursor]);

  useEffect(() => {
    searchRef.current = search;
  }, [search]);

  useEffect(() => {
    categoryFilterRef.current = categoryFilter;
  }, [categoryFilter]);

  useEffect(() => {
    errorRef.current = error;
  }, [error]);

  // Sync initialSearch and initialCategory if they change
  useEffect(() => {
    setSearch(initialSearch || '');
    setCategoryFilter(initialCategory || 'all');
  }, [initialSearch, initialCategory]);

  // Extract unique authors for filtering dropdown
  const uniqueAuthors = useMemo(() => {
    const authors = new Set();
    skills.forEach(s => {
      if (s.ownerUsername) authors.add(s.ownerUsername);
    });
    return Array.from(authors).sort();
  }, [skills]);

  // Extract unique categories for filtering dropdown, including imported
  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    skills.forEach(s => {
      if (s.category) categories.add(s.category.toLowerCase());
    });
    categories.add('imported');
    categories.add('skill');
    return Array.from(categories).sort();
  }, [skills]);

  const abortControllerRef = useRef(null);

  const fetchExternalSkills = useCallback(async (queryVal, categoryVal, cursorVal, append = false) => {
    // If paginating, ignore if already loading to prevent double pages
    if (append && loadingRef.current) return;

    // Load external skills only when category is all, imported, or skill
    if (categoryVal !== 'all' && categoryVal !== 'imported' && categoryVal !== 'skill') {
      setExternalSkills([]);
      setExternalTotal(0);
      setHasMore(false);
      return;
    }

    // Abort previous in-flight request if starting a new search/category query
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    abortControllerRef.current = abortController;

    setLoading(true);
    setError('');
    try {
      const limit = cursorVal === 0 ? 500 : 100;
      const response = await fetch(
        `/api/external-skills?cursor=${cursorVal}&limit=${limit}&q=${encodeURIComponent(queryVal)}`,
        { signal: abortController.signal }
      );
      if (!response.ok) throw new Error('Catalog request failed');
      const data = await response.json();
      
      setExternalSkills((current) => {
        if (!append) {
          return data.items;
        }
        const known = new Set(current.map((item) => item.slug));
        return [...current, ...data.items.filter((item) => !known.has(item.slug))];
      });
      if (data.total !== undefined) {
        setExternalTotal(data.total);
      }
      setCursor(data.nextCursor || 0);
      setHasMore(Boolean(data.nextCursor));
    } catch (loadError) {
      if (loadError.name === 'AbortError') {
        // Silence aborted request errors
        return;
      }
      console.error('Failed to load imported skill catalog:', loadError);
      setError('The imported catalog could not be loaded.');
    } finally {
      if (abortControllerRef.current === abortController) {
        setLoading(false);
      }
    }
  }, []);

  // Reset and fetch external skills when search query or category changes
  useEffect(() => {
    fetchExternalSkills(search, categoryFilter, 0, false);
  }, [search, categoryFilter, fetchExternalSkills]);

  const loadNextPage = useCallback(() => {
    if (loadingRef.current || !hasMoreRef.current) return;
    fetchExternalSkills(searchRef.current, categoryFilterRef.current, cursorRef.current, true);
  }, [fetchExternalSkills]);

  const sentinelNodeRef = useRef(null);

  // Standard intersection observer (fetch only when scrolled to bottom)
  useEffect(() => {
    if (!loading && hasMore && !error) {
      const node = sentinelNodeRef.current;
      if (!node) return undefined;
      
      const observer = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting) {
          loadNextPage();
        }
      }, { rootMargin: '100px' });
      
      observer.observe(node);
      return () => observer.disconnect();
    }
  }, [loading, hasMore, error, loadNextPage, categoryFilter]);

  // Handle manual load / retry
  const handleManualLoad = () => {
    setError('');
    loadNextPage();
  };

  // Handle filtering and sorting
  const filteredAndSortedSkills = useMemo(() => {
    let localResult = [...skills];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      localResult = localResult.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.ownerUsername || '').toLowerCase().includes(q)
      );
    }

    // 2. Author Filter
    if (authorFilter !== 'all') {
      localResult = localResult.filter(s => s.ownerUsername === authorFilter);
    }

    // 3. Category Filter
    let combinedResult = [];
    if (categoryFilter === 'imported') {
      let uniqueExternal = [...externalSkills];
      if (search.trim()) {
        const q = search.toLowerCase();
        uniqueExternal = uniqueExternal.filter(s => 
          s.name.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.ownerUsername || '').toLowerCase().includes(q)
        );
      }
      combinedResult = uniqueExternal;
    } else if (categoryFilter === 'all') {
      const localSlugs = new Set(localResult.map(s => s.slug));
      let uniqueExternal = externalSkills.filter(s => !localSlugs.has(s.slug));
      if (search.trim()) {
        const q = search.toLowerCase();
        uniqueExternal = uniqueExternal.filter(s => 
          s.name.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.ownerUsername || '').toLowerCase().includes(q)
        );
      }
      combinedResult = [...localResult, ...uniqueExternal];
    } else if (categoryFilter === 'skill') {
      const filteredLocal = localResult.filter(s => (s.category || '').toLowerCase() === 'skill');
      const localSlugs = new Set(filteredLocal.map(s => s.slug));
      let uniqueExternal = externalSkills.filter(s => !localSlugs.has(s.slug));
      if (search.trim()) {
        const q = search.toLowerCase();
        uniqueExternal = uniqueExternal.filter(s => 
          s.name.toLowerCase().includes(q) ||
          (s.description || '').toLowerCase().includes(q) ||
          (s.ownerUsername || '').toLowerCase().includes(q)
        );
      }
      combinedResult = [...filteredLocal, ...uniqueExternal];
    } else {
      const lowerCat = categoryFilter.toLowerCase();
      localResult = localResult.filter(s => {
        const itemCat = (s.category || '').toLowerCase();
        if (lowerCat === 'agent.md') {
          return itemCat.includes('agent') || itemCat.includes('claude');
        }
        return itemCat === lowerCat || itemCat.includes(lowerCat);
      });
      combinedResult = localResult;
    }

    // 4. Tab Sorting
    if (activeTab === 'popular') {
      combinedResult.sort((a, b) => (b.starsCount || b.upstreamInstalls || 0) - (a.starsCount || a.upstreamInstalls || 0));
    } else if (activeTab === 'recent') {
      combinedResult.sort((a, b) => {
        if (a.external && b.external) {
          return (a.upstreamRank || 999999) - (b.upstreamRank || 999999);
        }
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    } else if (activeTab === 'most-installed') {
      combinedResult.sort((a, b) => (b.installsCount || 0) - (a.installsCount || 0));
    } else {
      // Default: order local first (by date), then external (by rank/order)
      combinedResult.sort((a, b) => {
        if (a.external && !b.external) return 1;
        if (!a.external && b.external) return -1;
        if (a.external && b.external) {
          // Sort external skills by their true API rank/order
          return (a.upstreamRank || 999999) - (b.upstreamRank || 999999);
        }
        // Sort local skills by newest first
        return new Date(b.createdAt) - new Date(a.createdAt);
      });
    }

    return combinedResult;
  }, [skills, externalSkills, search, activeTab, authorFilter, categoryFilter]);

  // Determine sort label for display
  const sortLabel = useMemo(() => {
    if (activeTab === 'popular') return 'stars';
    if (activeTab === 'recent') return 'date';
    if (activeTab === 'most-installed') return 'installs';
    return 'order';
  }, [activeTab]);

  const trueTotal = useMemo(() => {
    // If we're looking at purely imported, total is externalTotal
    if (categoryFilter === 'imported') return externalTotal;
    // Local skills base count (pre-filter to estimate real total if we want, but using filtered local is safer)
    const localCount = skills.length;
    // Since we don't have server-side pagination for local skills yet, we just add local + externalTotal
    // But if we're filtering locally, we should use the filtered local count
    const filteredLocalCount = filteredAndSortedSkills.filter(s => !s.external).length;
    
    if (categoryFilter === 'all' || categoryFilter === 'skill') {
      return filteredLocalCount + externalTotal;
    }
    // For other categories, we only have local skills
    return filteredLocalCount;
  }, [filteredAndSortedSkills, externalTotal, categoryFilter, skills.length]);

  return (
    <div className="space-y-6">
      {/* Filtering Header Section */}
      <div className="flex flex-col gap-4 md:flex-row md:items-center justify-between border-b border-[var(--gray-200)] pb-6">
        
        {/* Search Input Box */}
        <div className="flex items-center bg-[var(--background-100)] border border-[var(--gray-400)] shadow-card rounded-lg px-3 py-2 text-sm text-[var(--gray-700)] w-full md:max-w-md">
          <Search className="w-4 h-4 mr-2 text-[var(--gray-700)]/60" />
          <input
            type="text"
            placeholder="Search skills by name, description, or author..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
            }}
            className="bg-transparent border-none outline-none w-full text-[var(--primary)] placeholder-text-secondary/50 text-xs"
          />
        </div>

        {/* Action Toggle Filters */}
        <div className="flex flex-wrap items-center gap-3">
          {/* Sorting tabs */}
          <div className="flex rounded-lg border border-[var(--gray-400)] bg-[var(--background-100)] p-1 text-xs font-medium">
            {[
              { id: 'all', label: 'All' },
              { id: 'popular', label: 'Popular' },
              { id: 'recent', label: 'Recent' },
              { id: 'most-installed', label: 'Most Installed' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => {
                  setActiveTab(tab.id);
                }}
                className={`rounded px-3.5 py-1.5 transition-colors duration-150 ${
                  activeTab === tab.id
                    ? 'bg-[var(--gray-200)] text-[var(--primary)] font-bold'
                    : 'text-[var(--gray-700)] hover:text-[var(--primary)]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Author filter dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={authorFilter}
              onChange={(e) => {
                setAuthorFilter(e.target.value);
              }}
              className="rounded-lg border border-[var(--gray-400)] bg-[var(--background-100)] px-3 py-2 text-xs text-[var(--primary)] outline-none transition-colors focus:border-text-primary/30 min-w-[120px] [&>option]:bg-[var(--background-100)] [&>option]:text-[var(--primary)] cursor-pointer"
            >
              <option value="all">All Authors</option>
              {uniqueAuthors.map((author) => (
                <option key={author} value={author}>
                  @{author}
                </option>
              ))}
            </select>
          </div>

          {/* Category filter dropdown */}
          <div className="flex items-center gap-2">
            <select
              value={categoryFilter}
              onChange={(e) => {
                setCategoryFilter(e.target.value);
              }}
              className="rounded-lg border border-[var(--gray-400)] bg-[var(--background-100)] px-3 py-2 text-xs text-[var(--primary)] outline-none transition-colors focus:border-text-primary/30 min-w-[120px] [&>option]:bg-[var(--background-100)] [&>option]:text-[var(--primary)] cursor-pointer uppercase"
            >
              <option value="all">ALL CATEGORIES</option>
              {uniqueCategories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat.toUpperCase()}
                </option>
              ))}
            </select>
          </div>

        </div>

      </div>

      {/* Sleek Terminal-like Skills Container aligned with Geist Dark tokens */}
      <div className="border border-[var(--gray-300)] rounded-xl bg-[var(--background-200)] p-6 shadow-card font-mono text-[13px] text-[var(--secondary)]">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[var(--gray-300)]/70 pb-4 mb-4 select-none text-[11px] font-semibold text-[var(--secondary)]">
          <div className="font-mono text-[var(--primary)]">
            $ kresh skills – {filteredAndSortedSkills.length.toLocaleString()} visible / {trueTotal.toLocaleString()} total
          </div>
          <div className="font-mono text-[var(--secondary)]">sorted by {sortLabel}</div>
        </div>

        {/* Skills rows */}
        {filteredAndSortedSkills.length === 0 ? (
          <div className="py-12 text-center">
            <span className="font-mono text-xs text-[var(--secondary)]/50 mb-3 block">$ no skills found</span>
            <p className="text-sm text-[var(--secondary)] font-sans">Try searching with another keyword or category.</p>
          </div>
        ) : (
          <div className="divide-y divide-[var(--gray-300)]/45">
            {filteredAndSortedSkills.map((skill) => {
              const detailHref = skill.external 
                ? `/skills/external/${skill.slug.replace(/^external\//, '')}` 
                : `/skills/${skill.slug}`;
              const author = skill.ownerUsername || (skill.external ? 'upstream' : 'unknown');
              
              const badgeClass = getCategoryClass(skill.category);
              const timeAgo = formatTimeAgo(skill.createdAt);

              return (
                <div 
                  key={skill.id || skill.slug}
                  className="py-5 first:pt-2 last:pb-2 flex flex-col gap-2.5"
                >
                  {/* Header: Badge & Link Title */}
                  <div className="flex flex-wrap items-center gap-2">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold uppercase font-mono tracking-wide ${badgeClass}`}>
                      {skill.category || 'skill'}
                    </span>
                    
                    <Link 
                      href={detailHref} 
                      className="text-base font-bold text-white hover:text-[var(--blue-500)] transition-colors duration-150 font-mono tracking-tight"
                    >
                      {skill.name}
                    </Link>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[var(--secondary)] leading-relaxed font-sans max-w-4xl">
                    {skill.description || 'No description provided.'}
                  </p>

                  {/* Metadata & Command Input Box */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                    
                    {/* Meta info columns */}
                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-[var(--secondary)] font-mono">
                      <span className="flex items-center gap-1 font-semibold text-[var(--primary)]">
                        {skill.external ? (
                          <a 
                            href={skill.sourceUrl || skill.upstreamUrl} 
                            target="_blank" 
                            rel="noreferrer" 
                            className="hover:underline hover:text-white"
                          >
                            {author}
                          </a>
                        ) : (
                          <Link href={`/@${author}`} className="hover:underline hover:text-white">
                            {author}
                          </Link>
                        )}
                        {(skill.external || author === 'vercel-labs' || author === 'anthropics' || author === 'chakresh') && (
                          <span className="text-[var(--blue-500)] font-bold ml-0.5">✓</span>
                        )}
                      </span>
                      
                      <span className="text-[var(--gray-300)]">|</span>
                      
                      <span className="flex items-center gap-1">
                        <span>↓</span>
                        <span>{formatStatCount(skill.installsCount)}</span>
                      </span>

                      <span className="text-[var(--gray-300)]">|</span>

                      <span className="flex items-center gap-1">
                        <span>★</span>
                        <span>{skill.starsCount || 0}</span>
                      </span>

                      <span className="text-[var(--gray-300)]">|</span>

                      <span>updated {timeAgo}</span>
                    </div>

                    {/* Command display box */}
                    <CopyCommandLine slug={skill.slug} />

                  </div>

                </div>
              );
            })}
          </div>
        )}

      </div>

      {/* Sentinel for infinite scroll / Load More */}
      {(categoryFilter === 'all' || categoryFilter === 'imported' || categoryFilter === 'skill') && (
        <div ref={sentinelNodeRef} className="mt-8 mb-8 min-h-[40px] flex flex-col items-center justify-center text-xs text-[var(--gray-700)]">
          {loading ? (
            <div className="flex items-center gap-2 font-mono mt-4">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue-500)] animate-ping" />
              <span>Loading more community skills…</span>
            </div>
          ) : error ? (
            <div className="text-[var(--red-500)] mt-4">Failed to load more skills.</div>
          ) : !hasMore ? (
            <div className="mt-4 font-mono text-center">End of community catalog</div>
          ) : null}
          
          {/* Manual fallback button if not loading but has more (handles error and observer misses) */}
          {!loading && hasMore && (
            <button 
              type="button" 
              onClick={handleManualLoad} 
              className="mt-6 block rounded-lg border border-[var(--gray-400)] bg-[var(--background-100)] px-6 py-2.5 font-mono text-xs text-[var(--primary)] hover:bg-[var(--gray-100)] shadow-sm transition-all hover:border-[var(--gray-500)]"
            >
              {error ? 'Retry Loading' : 'Load More Skills'}
            </button>
          )}
        </div>
      )}

    </div>
  );
}

export function SkillsList({ skills }) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-[var(--gray-700)] font-mono">Loading search...</div>}>
      <SkillsListContent skills={skills} />
    </Suspense>
  );
}

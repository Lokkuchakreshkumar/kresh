'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { 
  Search, Code, Feather, Brain, Network, Terminal, CheckCircle2, 
  Copy, Check, Eye, Download, ChevronLeft, ChevronRight 
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
    <div className="mt-2 flex items-center justify-between gap-2 rounded border border-[var(--gray-400)] bg-[var(--background-100)] px-2.5 py-1 font-mono text-[11px] text-[var(--gray-700)] w-full max-w-[280px] sm:max-w-xs shrink-0 select-all">
      <div className="flex items-center gap-1.5 truncate">
        <span className="text-[var(--blue-700)]">$</span>
        <span className="truncate">{command}</span>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className={`transition-all duration-150 p-0.5 rounded hover:bg-[var(--gray-200)] shrink-0 outline-none ${
          copied ? 'text-[var(--blue-700)]' : 'text-[var(--gray-700)]/70 hover:text-[var(--primary)]'
        }`}
        title="Copy install command"
      >
        {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
      </button>
    </div>
  );
}

function SkillsListContent({ skills }) {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || searchParams.get('q') || '';
  const initialCategory = searchParams.get('category') || 'all';
  const [search, setSearch] = useState(initialSearch);
  const [activeTab, setActiveTab] = useState('all'); // 'all', 'popular', 'recent', 'most-installed'
  const [authorFilter, setAuthorFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState(initialCategory);
  const [currentPage, setCurrentPage] = useState(1);

  // Sync initialSearch and initialCategory if they change
  useEffect(() => {
    setSearch(initialSearch || '');
    setCategoryFilter(initialCategory || 'all');
    setCurrentPage(1);
  }, [initialSearch, initialCategory]);

  const itemsPerPage = Math.max(skills.length, 1);

  // Extract unique authors for filtering dropdown
  const uniqueAuthors = useMemo(() => {
    const authors = new Set();
    skills.forEach(s => {
      if (s.ownerUsername) authors.add(s.ownerUsername);
    });
    return Array.from(authors).sort();
  }, [skills]);

  // Extract unique categories for filtering dropdown
  const uniqueCategories = useMemo(() => {
    const categories = new Set();
    skills.forEach(s => {
      if (s.category) categories.add(s.category);
    });
    return Array.from(categories).sort();
  }, [skills]);

  // Handle filtering and sorting
  const filteredAndSortedSkills = useMemo(() => {
    let result = [...skills];

    // 1. Search Query
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(s => 
        s.name.toLowerCase().includes(q) ||
        (s.description || '').toLowerCase().includes(q) ||
        (s.ownerUsername || '').toLowerCase().includes(q)
      );
    }

    // 2. Author Filter
    if (authorFilter !== 'all') {
      result = result.filter(s => s.ownerUsername === authorFilter);
    }

    // 3. Category Filter
    if (categoryFilter !== 'all') {
      const lowerCat = categoryFilter.toLowerCase();
      result = result.filter(s => {
        const itemCat = (s.category || '').toLowerCase();
        if (lowerCat === 'agent.md') {
          return itemCat.includes('agent') || itemCat.includes('claude');
        }
        return itemCat === lowerCat || itemCat.includes(lowerCat);
      });
    }

    // 4. Tab Sorting
    if (activeTab === 'popular') {
      result.sort((a, b) => (b.starsCount || 0) - (a.starsCount || 0));
    } else if (activeTab === 'recent') {
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    } else if (activeTab === 'most-installed') {
      result.sort((a, b) => (b.installsCount || 0) - (a.installsCount || 0));
    } else {
      // Default: order by creation newest
      result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }

    return result;
  }, [skills, search, activeTab, authorFilter, categoryFilter]);

  // Calculate paginated index
  const totalPages = Math.ceil(filteredAndSortedSkills.length / itemsPerPage) || 1;
  const paginatedSkills = useMemo(() => {
    // Reset page if it exceeds maximum
    const maxPage = Math.ceil(filteredAndSortedSkills.length / itemsPerPage) || 1;
    const activePage = currentPage > maxPage ? maxPage : currentPage;
    
    const startIdx = (activePage - 1) * itemsPerPage;
    return filteredAndSortedSkills.slice(startIdx, startIdx + itemsPerPage);
  }, [filteredAndSortedSkills, currentPage]);

  const handlePageChange = (pageNum) => {
    if (pageNum >= 1 && pageNum <= totalPages) {
      setCurrentPage(pageNum);
      // Smooth scroll back to top of lists
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  // Safe pagination tabs render
  const renderPaginationButtons = () => {
    const pages = [];
    
    // First page
    pages.push(1);

    if (currentPage > 3) {
      pages.push('...');
    }

    // Neighbors
    for (let i = Math.max(2, currentPage - 1); i <= Math.min(totalPages - 1, currentPage + 1); i++) {
      if (!pages.includes(i)) pages.push(i);
    }

    if (currentPage < totalPages - 2) {
      pages.push('...');
    }

    // Last page
    if (totalPages > 1 && !pages.includes(totalPages)) {
      pages.push(totalPages);
    }

    return pages.map((p, idx) => {
      if (p === '...') {
        return (
          <span key={`dots-${idx}`} className="px-2.5 py-1.5 text-xs text-[var(--gray-700)]/60 font-mono">
            ...
          </span>
        );
      }
      return (
        <button
          key={`page-${p}`}
          onClick={() => handlePageChange(p)}
          className={`h-7 w-7 rounded-md text-xs font-semibold font-mono transition-all duration-150 ${
            currentPage === p
              ? 'bg-[var(--blue-700)] text-[var(--background-100)] border border-[var(--blue-200)]'
              : 'border border-[var(--gray-400)] bg-[var(--background-100)] text-[var(--gray-700)] hover:text-[var(--primary)] hover:bg-[var(--gray-100)]'
          }`}
        >
          {p}
        </button>
      );
    });
  };

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
              setCurrentPage(1);
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
                  setCurrentPage(1);
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
                setCurrentPage(1);
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
                setCurrentPage(1);
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

      {/* Row count info */}
      <div className="text-xs font-medium text-[var(--gray-700)]">
        {filteredAndSortedSkills.length} public skills
      </div>

      {/* Skills list table */}
      <div className="space-y-4">
        
        {/* Table column headers (desktop only) */}
        <div className="hidden lg:grid lg:grid-cols-12 gap-4 px-6 text-[10px] font-bold uppercase tracking-wider text-[var(--gray-700)]/70">
          <div className="col-span-6">Skill</div>
          <div className="col-span-2 text-center">Author</div>
          <div className="col-span-1 text-center">Version</div>
          <div className="col-span-1 text-center">Installs</div>
          <div className="col-span-1 text-center font-semibold text-[var(--blue-700)]">Stars</div>
          <div className="col-span-1 text-right">Updated</div>
        </div>

        {/* Skills rows */}
        {paginatedSkills.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 bg-[var(--background-100)] border border-[var(--gray-400)] shadow-card rounded-lg text-center">
            <span className="font-mono text-xs text-[var(--gray-700)]/50 mb-3">$ no skills found</span>
            <p className="text-sm text-[var(--gray-700)]">Try searching with another keyword or author.</p>
          </div>
        ) : (
          paginatedSkills.map((skill) => {
            const iconObj = getSkillIcon(skill.name, skill.category);
            const gradientStyle = getSkillGradient(skill.slug);
            const IconComponent = iconObj.type === 'icon' ? iconObj.element : null;

            return (
              <div 
                key={skill.id}
                className="bg-[var(--background-100)] border border-[var(--gray-400)] shadow-card rounded-xl p-5 hover:border-[var(--gray-400)] hover:bg-[var(--gray-100)] transition-all duration-200"
              >
                <div className="flex flex-col lg:grid lg:grid-cols-12 gap-5 items-start lg:items-center">
                  
                  {/* Skill main info column (Col span 6) */}
                  <div className="col-span-6 flex gap-4 w-full">
                    {/* Gradient Icon box */}
                    <div 
                      style={gradientStyle}
                      className="w-12 h-12 rounded-xl border shrink-0 shadow-inner select-none"
                    />
                    
                    {/* Details details */}
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2 flex-wrap">
                        <Link href={`/skills/${skill.slug}`} className="hover:text-[var(--blue-700)] transition-colors duration-150">
                          <h3 className="text-sm font-bold text-[var(--primary)] truncate">{skill.name}</h3>
                        </Link>
                        <Badge variant="default" className="text-[9px] px-1.5 py-0.5 lowercase tracking-normal font-semibold">
                          {skill.category}
                        </Badge>
                      </div>
                      <p className="mt-1 text-xs text-[var(--gray-700)] line-clamp-2 max-w-xl">
                        {skill.description || 'No description provided.'}
                      </p>
                      {/* Copy CLI CLI command box */}
                      <CopyCommandLine slug={skill.slug} />
                    </div>
                  </div>

                  {/* Author column (Col span 2) */}
                  <div className="lg:col-span-2 flex items-center gap-1.5 text-xs text-[var(--primary)] lg:justify-center w-full lg:w-auto border-t lg:border-t-0 border-[var(--gray-200)] pt-3 lg:pt-0">
                    <span className="lg:hidden text-[10px] text-[var(--gray-700)] font-bold uppercase w-24 shrink-0">Author:</span>
                    <div className="flex items-center gap-1">
                      <Link href={`/@${skill.ownerUsername || 'unknown'}`} className="font-semibold text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors cursor-pointer">
                        @{skill.ownerUsername || 'unknown'}
                      </Link>
                      <CheckCircle2 className="w-3.5 h-3.5 text-[var(--blue-700)] fill-[var(--blue-100)]" />
                    </div>
                  </div>

                  {/* Version column (Col span 1) */}
                  <div className="lg:col-span-1 text-xs text-[var(--gray-700)] font-mono lg:text-center w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-[var(--gray-700)] font-bold uppercase w-24 inline-block">Version:</span>
                    <span>v{skill.currentVersion || '1.0.0'}</span>
                  </div>

                  {/* Installs column (Col span 1) */}
                  <div className="lg:col-span-1 text-xs text-[var(--gray-700)] font-mono lg:text-center w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-[var(--gray-700)] font-bold uppercase w-24 inline-block">Installs:</span>
                    <span>{formatStatCount(skill.installsCount)}</span>
                  </div>

                  {/* Stars column (Col span 1) */}
                  <div className="lg:col-span-1 text-xs font-semibold font-mono text-[var(--blue-700)] lg:text-center w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-[var(--gray-700)] font-bold uppercase w-24 inline-block">Stars:</span>
                    <span>{skill.starsCount || 0}</span>
                  </div>

                  {/* Updated date column (Col span 1) */}
                  <div className="lg:col-span-1 text-xs text-[var(--gray-700)]/85 text-left lg:text-right w-full lg:w-auto">
                    <span className="lg:hidden text-[10px] text-[var(--gray-700)] font-bold uppercase w-24 inline-block">Updated:</span>
                    <span className="font-mono">{formatDate(skill.createdAt)}</span>
                  </div>

                </div>

                {/* Bottom row actions (aligned on the right side) */}
                <div className="mt-4 flex items-center justify-end gap-2.5 border-t border-[var(--gray-200)] pt-3">
                  <Link href={`/skills/${skill.slug}`}>
                    <button 
                      type="button" 
                      className="rounded border border-[var(--gray-400)] bg-[var(--gray-100)] hover:bg-[var(--gray-200)] px-4 py-1.5 text-center text-xs font-semibold text-[var(--primary)] transition-all duration-150 outline-none"
                    >
                      View
                    </button>
                  </Link>
                  <a href={`/api/skills/download/${skill.slug}`}>
                    <button 
                      type="button" 
                      className="rounded border border-[var(--gray-400)] bg-[var(--gray-1000)] px-4 py-1.5 text-center text-xs font-bold text-[var(--background-100)] hover:opacity-90 transition-all duration-150 outline-none flex items-center gap-1.5"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Install</span>
                    </button>
                  </a>
                </div>

              </div>
            );
          })
        )}

      </div>

      {/* Pagination controls */}
      {totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2.5 pt-4">
          <button
            onClick={() => handlePageChange(currentPage - 1)}
            disabled={currentPage === 1}
            className="h-7 w-7 rounded-md border border-[var(--gray-400)] bg-[var(--background-100)] text-[var(--gray-700)] hover:text-[var(--primary)] hover:bg-[var(--gray-100)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150"
            title="Previous page"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          
          <div className="flex items-center gap-1.5">
            {renderPaginationButtons()}
          </div>

          <button
            onClick={() => handlePageChange(currentPage + 1)}
            disabled={currentPage === totalPages}
            className="h-7 w-7 rounded-md border border-[var(--gray-400)] bg-[var(--background-100)] text-[var(--gray-700)] hover:text-[var(--primary)] hover:bg-[var(--gray-100)] disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center transition-colors duration-150"
            title="Next page"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      )}

    </div>
  );
}

export function SkillsList({ skills }) {
  return (
    <Suspense fallback={<div className="text-center py-12 text-sm text-[var(--gray-700)]">Loading search...</div>}>
      <SkillsListContent skills={skills} />
    </Suspense>
  );
}

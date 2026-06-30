"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Menu, X, Search, LogOut, Plus, BookOpen, Compass, Settings, ArrowLeft, Brain, Layers, RefreshCw } from 'lucide-react';
import { Button } from '../ui/Button';

export function MobileMenu({ session, onLogout }) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState('main'); // 'main' | 'settings'
  const [theme, setTheme] = useState('dark');
  const menuRef = useRef(null);

  // Load initial theme safety
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem('theme');
      if (savedTheme) {
        setTheme(savedTheme);
      } else {
        const isLight = document.documentElement.classList.contains('light');
        setTheme(isLight ? 'light' : 'dark');
      }
    } catch (err) {
      console.error("Error checking theme in useEffect:", err);
    }
  }, []);

  const toggleTheme = () => {
    try {
      const nextTheme = theme === 'dark' ? 'light' : 'dark';
      setTheme(nextTheme);
      
      if (nextTheme === 'light') {
        document.documentElement.classList.add('light');
        localStorage.setItem('theme', 'light');
      } else {
        document.documentElement.classList.remove('light');
        localStorage.setItem('theme', 'dark');
      }
    } catch (err) {
      console.error("Error setting theme in toggleTheme:", err);
    }
  };

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      try {
        if (menuRef.current && !menuRef.current.contains(e.target)) {
          setIsOpen(false);
          setView('main'); // Reset view to main when closed
        }
      } catch (err) {
        console.error("Error in handleClickOutside:", err);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const handleLinkClick = () => {
    setIsOpen(false);
    setView('main');
  };

  const handleLogoutClick = async () => {
    try {
      handleLinkClick();
      await onLogout();
    } catch (err) {
      console.error("Error during logout click:", err);
    }
  };

  return (
    <div className="relative md:hidden" ref={menuRef}>
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (isOpen) setView('main');
        }}
        className="p-2 text-[var(--gray-700)] hover:text-[var(--primary)] transition-all duration-150 rounded-md hover:bg-[var(--gray-100)] outline-none cursor-pointer flex items-center justify-center"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        type="button"
      >
        {isOpen ? (
          <X className="w-6 h-6 transition-transform duration-150 rotate-0 hover:rotate-90" />
        ) : (
          <Menu className="w-6 h-6 transition-transform duration-150 hover:scale-110" />
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-3 z-50">
          <div 
            className="w-72 shadow-menu rounded-[12px] border border-[var(--gray-400)] bg-[var(--background-100)] p-5 flex flex-col gap-4 animate-in fade-in slide-in-from-top-2 duration-150"
          >
          {view === 'main' ? (
            <>
              {/* User profile section */}
              {session && (
                <div className="flex items-center gap-3 pb-3.5 border-b border-[var(--gray-200)]">
                  <span className="w-2.5 h-2.5 rounded-full bg-kresh-green animate-pulse shrink-0" />
                  <div className="flex flex-col min-w-0">
                    <span className="text-[10px] text-[var(--gray-700)] uppercase tracking-wider font-semibold">Signed in as</span>
                    <a 
                      href={`/@${session.username}`} 
                      onClick={handleLinkClick}
                      className="text-sm font-bold text-[var(--primary)] hover:text-kresh-green transition-colors truncate mt-0.5"
                    >
                      @{session.username}
                    </a>
                  </div>
                </div>
              )}

              {/* Search section */}
              <form 
                onSubmit={(e) => {
                  e.preventDefault();
                  const q = e.target.elements.search.value.trim();
                  if (q) {
                    window.location.href = `/skills?search=${encodeURIComponent(q)}`;
                    setIsOpen(false);
                  }
                }}
                className="flex items-center border border-[var(--gray-400)] bg-[var(--background-100)] rounded-[6px] px-3 py-2 text-sm text-[var(--gray-700)] w-full focus-within:border-[var(--gray-600)] transition-colors"
              >
                <Search className="w-4 h-4 mr-2.5 shrink-0 text-[var(--gray-700)]/60" />
                <input 
                  name="search"
                  type="text" 
                  placeholder="Search skills..." 
                  className="bg-transparent border-none outline-none w-full text-[var(--primary)] placeholder-[var(--gray-700)]/50 text-[12px] font-medium"
                />
              </form>

              {/* Nav Links */}
              <nav className="flex flex-col gap-1 text-[14px] text-[var(--primary)] font-medium">
                <a 
                  href="/skills?category=skill" 
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-[var(--gray-100)] hover:text-[var(--primary)] transition-colors duration-150"
                >
                  <Compass className="w-4 h-4 shrink-0 text-[var(--gray-700)]" />
                  <span>Skills</span>
                </a>
                <a 
                  href="/skills?category=agents.md/claude.md" 
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-[var(--gray-100)] hover:text-[var(--primary)] transition-colors duration-150"
                >
                  <Brain className="w-4 h-4 shrink-0 text-[var(--blue-700)]" />
                  <span>Agent.md/Claude.md</span>
                </a>
                <a 
                  href="/skills?category=design.md" 
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-[var(--gray-100)] hover:text-[var(--primary)] transition-colors duration-150"
                >
                  <Layers className="w-4 h-4 shrink-0 text-[var(--gray-700)]" />
                  <span>Design.md</span>
                </a>
                <a 
                  href="/loops" 
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-[var(--gray-100)] hover:text-[var(--primary)] transition-colors duration-150"
                >
                  <RefreshCw className="w-4 h-4 shrink-0 text-[var(--gray-700)]" />
                  <span>Loops</span>
                </a>
                <a 
                  href="/docs" 
                  onClick={handleLinkClick}
                  className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-[var(--gray-100)] hover:text-[var(--primary)] transition-colors duration-150"
                >
                  <BookOpen className="w-4 h-4 shrink-0 text-[var(--gray-700)]" />
                  <span>Docs</span>
                </a>
                
                {/* Settings Toggle button inside navigation list */}
                <button 
                  type="button"
                  onClick={() => setView('settings')}
                  className="flex items-center gap-3 px-3 py-2 rounded-[6px] hover:bg-[var(--gray-100)] hover:text-[var(--primary)] transition-colors duration-150 text-left w-full cursor-pointer"
                >
                  <Settings className="w-4 h-4 shrink-0 text-[var(--gray-700)]" />
                  <span>Settings</span>
                </button>
              </nav>

              {/* Action buttons */}
              <div className="flex flex-col gap-2.5 pt-4 border-t border-[var(--gray-200)]">
                {!session ? (
                  <a href="/signin" onClick={handleLinkClick} className="w-full">
                    <Button variant="secondary" className="w-full justify-center">
                      Sign In
                    </Button>
                  </a>
                ) : (
                  <>
                    <a href="/dashboard/publish" onClick={handleLinkClick} className="w-full">
                      <Button variant="secondary" className="w-full justify-start gap-2.5 hover:border-[var(--blue-400)]">
                        <Plus className="w-4 h-4 text-[var(--blue-700)] shrink-0" />
                        Publish Skill
                      </Button>
                    </a>

                    <button 
                      type="button"
                      onClick={handleLogoutClick}
                      className="w-full flex items-center justify-between px-3 py-2 text-[14px] text-[var(--red-800)] hover:bg-[var(--red-100)] rounded-[6px] transition-colors duration-150 cursor-pointer font-medium mt-1"
                    >
                      <span>Logout</span>
                      <LogOut className="w-4 h-4 text-[var(--red-800)]/70" />
                    </button>
                  </>
                )}
              </div>
            </>
          ) : (
            <>
              {/* Settings View Header */}
              <div className="flex items-center gap-2 pb-3.5 border-b border-[var(--gray-200)]">
                <button
                  onClick={() => setView('main')}
                  className="p-1 rounded-[6px] hover:bg-[var(--gray-100)] text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors cursor-pointer"
                  aria-label="Back to main menu"
                  type="button"
                >
                  <ArrowLeft className="w-4.5 h-4.5" />
                </button>
                <span className="text-[14px] font-bold text-[var(--primary)]">Settings</span>
              </div>

              {/* Settings Content */}
              <div className="flex flex-col gap-4 py-2">
                <div className="flex items-center justify-between px-1">
                  <div className="flex flex-col">
                    <span className="text-[12px] font-semibold text-[var(--primary)]">Dark Mode</span>
                    <span className="text-[10px] text-[var(--gray-700)] mt-0.5">Toggle app color theme</span>
                  </div>
                  
                  {/* Apple Style Toggle Switch */}
                  <button
                    onClick={toggleTheme}
                    className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full p-0.5 transition-colors duration-300 ease-in-out outline-none ${
                      theme === 'dark' ? 'bg-[var(--blue-700)]' : 'bg-[var(--gray-400)]'
                    }`}
                    role="switch"
                    aria-checked={theme === 'dark'}
                    type="button"
                  >
                    <span
                      className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow-card transition-transform duration-300 ease-in-out ${
                        theme === 'dark' ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              </div>
            </>
          )}
          </div>
        </div>
      )}
    </div>
  );
}

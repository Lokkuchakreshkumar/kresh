"use client";

import React, { useEffect, useRef } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';
import { Button } from '../ui/Button';
import ThemeToggle from '../ui/ThemeToggle';

export function Header() {
  const inputRef = useRef(null);
  const [session, setSession] = React.useState(null);

  useEffect(() => {
    import('@/app/(auth)/actions').then(m => {
      m.getSessionAction().then(setSession);
    });
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        inputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <header className="fixed top-0 inset-x-0 z-50 bg-background border-b border-border-color px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="flex items-center gap-8">
          <a href="/" className="flex items-center gap-3 cursor-pointer">
            <Image src="/logo/kresh_logo_exact.svg" alt="Kresh Logo" width={36} height={36} className="object-contain" />
            <span className="text-text-primary font-bold text-xl hidden sm:inline-block">kresh</span>
          </a>
          
          <nav className="hidden md:flex items-center gap-6 text-sm text-text-secondary font-medium">
            <a href="/skills" className="hover:text-text-primary transition-colors">Skills</a>
            <a href="#" className="hover:text-text-primary transition-colors">Docs</a>
          </nav>
        </div>

        <div className="flex items-center gap-4">
          <div className="hidden lg:flex items-center glass rounded-md px-3 py-1.5 text-sm text-text-secondary w-64">
            <Search className="w-4 h-4 mr-2" />
            <input 
              ref={inputRef}
              type="text" 
              placeholder="Search skills..." 
              className="bg-transparent border-none outline-none w-full text-text-primary placeholder-text-secondary/50"
            />
            <span className="ml-auto text-[10px] bg-text-primary/10 px-1.5 py-0.5 rounded border border-border-color">Ctrl+K</span>
          </div>
          
          <div className="hidden sm:flex items-center gap-4">
            {session ? (
              <div className="flex items-center gap-4">
                <a href={`/@${session.username}`} className="text-sm font-medium text-text-secondary hover:text-text-primary transition-colors flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-kresh-green animate-pulse" />
                  @{session.username}
                </a>
                <a href="/dashboard/publish">
                  <Button variant="glass">Publish Skill</Button>
                </a>
              </div>
            ) : (
              <a href="/signin">
                <Button variant="outline">Sign in</Button>
              </a>
            )}
          </div>

          {/* 3D Glass theme toggle */}
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}

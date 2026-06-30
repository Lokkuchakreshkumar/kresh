'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { ChevronLeft, Plus, Terminal, RefreshCw, Calendar, User, Copy, Check, ChevronRight } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

function LoopCard({ loop, formatDate }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(loop.text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy loop content:', err);
    }
  };

  return (
    <Link href={`/loops/${loop.id}`}>
      <div 
        className="bg-[var(--background-100)] border-[var(--gray-400)] shadow-card rounded-xl border border-[var(--gray-200)] bg-[var(--background-100)] hover:border-[var(--gray-200)] hover:bg-[var(--gray-100)] p-5 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 relative group"
      >
        {/* Name / Category info */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-[var(--blue-100)] border border-[var(--blue-200)] text-[var(--blue-700)] flex items-center justify-center shrink-0">
            <RefreshCw className="w-4.5 h-4.5" />
          </div>
          
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-bold text-[var(--primary)] group-hover:text-[var(--blue-700)] transition-colors">{loop.name}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-[var(--gray-200)] bg-[var(--gray-100)] font-mono text-[var(--gray-700)]/70">
                v{loop.version}
              </span>
            </div>
            <p className="mt-1 text-xs text-[var(--gray-700)]/80 line-clamp-2 max-w-xl">
              {loop.description}
            </p>
          </div>
        </div>

        {/* Right controls (Copy & Metadata) */}
        <div className="flex items-center gap-5 shrink-0 self-end md:self-center">
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-[10px] text-[var(--gray-700)]/50 font-mono">
            <div className="flex items-center gap-1">
              <User className="w-3.5 h-3.5" />
              <span>@{loop.ownerUsername}</span>
            </div>
            <div className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{formatDate(loop.createdAt)}</span>
            </div>
          </div>

          {/* Copy installation command button */}
          <button
            type="button"
            onClick={handleCopy}
            className={`p-2 rounded-lg border transition-all duration-150 relative z-20 ${
              copied 
                ? 'bg-[var(--blue-100)] border-[var(--blue-300)] text-[var(--blue-700)]'
                : 'bg-[var(--gray-100)] border-[var(--gray-200)] hover:bg-[var(--gray-200)] text-[var(--gray-700)] hover:text-[var(--primary)]'
            }`}
            title="Copy loop config"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 animate-scale-in" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <ChevronRight className="w-4 h-4 text-[var(--gray-700)]/30 group-hover:text-[var(--primary)] group-hover:translate-x-0.5 transition-all duration-200 hidden md:block" />

        </div>

      </div>
    </Link>
  );
}

export default function LoopsPage() {
  const [loops, setLoops] = useState([]);

  useEffect(() => {
    try {
      const existingLoopsRaw = localStorage.getItem('kresh_loops');
      if (existingLoopsRaw) {
        const parsed = JSON.parse(existingLoopsRaw);
        // Filter out any anonymous loops
        const filtered = parsed.filter(l => l.ownerUsername !== 'anonymous' && l.ownerUsername !== 'Anonymous');
        setLoops(filtered);
        if (filtered.length !== parsed.length) {
          localStorage.setItem('kresh_loops', JSON.stringify(filtered));
        }
      }
    } catch (err) {
      console.error('Failed to load loops from localStorage:', err);
    }
  }, []);

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
    } catch (e) {
      return 'N/A';
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)] flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-32 pb-24 z-10 relative">
        
        {/* Header section with Publish Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-[var(--gray-200)]">
          <div className="text-left">
            <Link 
              href="/skills" 
              className="inline-flex items-center gap-1.5 text-xs text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors group mb-3"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to discovery</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-[var(--primary)] flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-[var(--blue-700)]" />
              <span>Loops</span>
            </h1>
            <p className="mt-2 text-xs text-[var(--gray-700)] max-w-xl leading-relaxed">
              Orchestrate autonomous agent workflows. Create, manage, and execute multi-turn agent processes predictably.
            </p>
          </div>

          <Link href="/loops/publish" className="shrink-0">
            <Button className="rounded-xl bg-[var(--gray-1000)] text-[var(--background-100)] hover:opacity-95 px-5 py-3 font-bold text-xs flex items-center gap-1.5 active:scale-[0.98] transition-transform">
              <Plus className="w-4 h-4" />
              <span>Publish Loop</span>
            </Button>
          </Link>
        </div>

        {/* Loops Listing / Grid */}
        <div className="space-y-6">
          {loops.length === 0 ? (
            /* Empty State */
            <div 
              className="w-full text-center p-12 md:p-16 rounded-[12px] border border-[var(--gray-400)] bg-[var(--background-100)] shadow-card relative"
            >
              <div className="w-12 h-12 rounded-xl bg-[var(--gray-100)] flex items-center justify-center mx-auto mb-4 border border-[var(--gray-400)] text-[var(--gray-700)]">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-[var(--primary)] mb-2">No Published Loops</h3>
              <p className="text-xs text-[var(--gray-700)] max-w-xs mx-auto mb-6 leading-relaxed">
                Be the first to publish a loop workflow. Define triggers, actions, and agent iterations.
              </p>
              <Link href="/loops/publish">
                <Button className="rounded-xl text-xs py-2 px-6 border-[var(--gray-200)] hover:bg-[var(--gray-100)] font-semibold">
                  Publish your first loop
                </Button>
              </Link>
            </div>
          ) : (
            /* Loops Cards List */
            <div className="grid grid-cols-1 gap-4">
              {loops.map((loop) => (
                <LoopCard key={loop.id} loop={loop} formatDate={formatDate} />
              ))}
            </div>
          )}
        </div>

      </main>

      <Footer />
    </div>
  );
}

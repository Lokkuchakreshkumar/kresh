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
        className="glass rounded-xl border border-white/5 bg-white/[0.01] hover:border-white/10 hover:bg-white/[0.02] p-5 transition-all duration-200 cursor-pointer flex flex-col md:flex-row md:items-center justify-between gap-5 relative group"
      >
        {/* Name / Category info */}
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-xl bg-kresh-green/10 border border-kresh-green/20 text-kresh-green flex items-center justify-center shrink-0">
            <RefreshCw className="w-4.5 h-4.5" />
          </div>
          
          <div className="min-w-0 text-left">
            <div className="flex items-center gap-2.5 flex-wrap">
              <h3 className="text-sm font-bold text-text-primary group-hover:text-kresh-green transition-colors">{loop.name}</h3>
              <span className="text-[10px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-mono text-text-secondary/70">
                v{loop.version}
              </span>
            </div>
            <p className="mt-1 text-xs text-text-secondary/80 line-clamp-2 max-w-xl">
              {loop.description}
            </p>
          </div>
        </div>

        {/* Right controls (Copy & Metadata) */}
        <div className="flex items-center gap-5 shrink-0 self-end md:self-center">
          
          {/* Metadata */}
          <div className="flex items-center gap-4 text-[10px] text-text-secondary/50 font-mono">
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
                ? 'bg-kresh-green/10 border-kresh-green/30 text-kresh-green'
                : 'bg-white/5 border-white/5 hover:bg-white/10 text-text-secondary hover:text-text-primary'
            }`}
            title="Copy install command"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 animate-scale-in" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>

          <ChevronRight className="w-4 h-4 text-text-secondary/30 group-hover:text-text-primary group-hover:translate-x-0.5 transition-all duration-200 hidden md:block" />

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
        setLoops(JSON.parse(existingLoopsRaw));
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
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <Header />
      
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] rounded-full bg-kresh-green/5 blur-[120px] pointer-events-none z-0" />
      <div className="absolute bottom-1/4 right-1/4 w-[350px] h-[350px] rounded-full bg-kresh-green/3 blur-[100px] pointer-events-none z-0" />

      <main className="flex-1 max-w-5xl mx-auto w-full px-6 pt-32 pb-24 z-10 relative">
        
        {/* Header section with Publish Button */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 mb-10 pb-6 border-b border-white/5">
          <div className="text-left">
            <Link 
              href="/skills" 
              className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors group mb-3"
            >
              <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
              <span>Back to discovery</span>
            </Link>
            <h1 className="text-3xl md:text-4xl font-black text-text-primary flex items-center gap-3">
              <RefreshCw className="w-8 h-8 text-kresh-green" />
              <span>Loops</span>
            </h1>
            <p className="mt-2 text-xs text-text-secondary max-w-xl leading-relaxed">
              Orchestrate autonomous agent workflows. Create, manage, and execute multi-turn agent processes predictably.
            </p>
          </div>

          <Link href="/loops/publish" className="shrink-0">
            <Button className="rounded-xl bg-text-primary text-background hover:opacity-95 px-5 py-3 font-bold text-xs flex items-center gap-1.5 active:scale-[0.98] transition-transform">
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
              className="w-full text-center p-12 md:p-16 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl relative"
              style={{
                backgroundColor: 'rgba(10, 10, 10, 0.4)',
                backgroundImage: 'radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent)'
              }}
            >
              <div className="w-12 h-12 rounded-xl bg-white/5 flex items-center justify-center mx-auto mb-4 border border-white/10 text-text-secondary">
                <Terminal className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-text-primary mb-2">No Published Loops</h3>
              <p className="text-xs text-text-secondary max-w-xs mx-auto mb-6 leading-relaxed">
                Be the first to publish a loop workflow. Define triggers, actions, and agent iterations.
              </p>
              <Link href="/loops/publish">
                <Button className="rounded-xl text-xs py-2 px-6 border-white/10 hover:bg-white/5 font-semibold">
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

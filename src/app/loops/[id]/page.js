'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  ChevronLeft, FolderGit, Code, RefreshCw, Calendar, User, 
  Copy, Check, FileText
} from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function LoopDetailPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [loop, setLoop] = useState(null);
  const [copiedInstall, setCopiedInstall] = useState(false);
  const [copiedContent, setCopiedContent] = useState(false);

  useEffect(() => {
    try {
      const existingLoopsRaw = localStorage.getItem('kresh_loops');
      if (existingLoopsRaw) {
        const loopsList = JSON.parse(existingLoopsRaw);
        const found = loopsList.find(l => l.id === id);
        if (found) {
          setLoop(found);
        }
      }
    } catch (err) {
      console.error('Failed to load loop details:', err);
    }
  }, [id]);

  if (!loop) {
    return (
      <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)] flex flex-col">
        <Header />
        <main className="flex-1 flex flex-col items-center justify-center pt-32 pb-16 px-6">
          <p className="text-sm text-[var(--gray-700)] font-mono">$ loop not found</p>
          <button onClick={() => router.push('/loops')} className="mt-4 text-xs text-[var(--blue-700)] hover:underline cursor-pointer">
            Go back to loops
          </button>
        </main>
        <Footer />
      </div>
    );
  }

  const handleCopyInstall = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(`kresh get ${loop.ownerUsername}/${loop.name}`);
      setCopiedInstall(true);
      setTimeout(() => setCopiedInstall(false), 2000);
    } catch (err) {
      console.error('Failed to copy install command:', err);
    }
  };

  const handleCopyContent = async () => {
    try {
      await navigator.clipboard.writeText(loop.text);
      setCopiedContent(true);
      setTimeout(() => setCopiedContent(false), 2000);
    } catch (err) {
      console.error('Failed to copy loop content:', err);
    }
  };

  const formattedDate = new Date(loop.createdAt).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });

  return (
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)] selection:bg-[var(--blue-200)]">
      <Header />
      
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32 text-left">
        {/* Breadcrumbs & Action Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--gray-200)] pb-5">
          <div className="flex flex-wrap items-center gap-2.5 text-lg md:text-xl font-medium">
            <FolderGit className="w-5 h-5 text-[var(--gray-700)]" />
            <Link href="/loops" className="text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors font-mono">
              loops
            </Link>
            <span className="text-[var(--gray-700)]/50 font-mono">/</span>
            <span className="font-bold text-[var(--primary)] font-mono select-all">
              {loop.name}
            </span>
            <span className="ml-1.5 rounded-full border border-[var(--gray-400)] bg-[var(--gray-100)] px-2 py-0.5 text-[10px] font-semibold text-[var(--gray-700)]">
              public
            </span>
          </div>
        </div>

        {/* Tabs Bar */}
        <div className="mt-4 flex items-center gap-1 border-b border-[var(--gray-400)] overflow-x-auto no-scrollbar">
          <button
            type="button"
            className="flex items-center gap-2 border-b-2 border-[var(--blue-700)] px-4 py-3 text-xs font-semibold text-[var(--primary)] bg-[var(--background-100)] outline-none"
          >
            <Code className="w-3.5 h-3.5 text-[var(--gray-700)]" />
            <span>Code</span>
          </button>
        </div>

        {/* Content Layout Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          
          {/* Main Contents Left Column (File list and README) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Code Box container */}
            <div className="rounded-xl border border-[var(--gray-200)] overflow-hidden bg-[var(--background-100)]">
              <div className="flex items-center justify-between px-4 py-3 bg-[var(--gray-100)] border-b border-[var(--gray-200)]">
                <div className="flex items-center gap-2 text-xs text-[var(--gray-700)] font-mono">
                  <FileText className="w-4 h-4 text-[var(--blue-700)]" />
                  <span>loop.yaml</span>
                </div>
                
                <button
                  onClick={handleCopyContent}
                  className="flex items-center gap-1.5 px-2.5 py-1.5 rounded border border-[var(--gray-200)] bg-[var(--gray-100)] text-[10px] font-mono text-[var(--gray-700)] hover:text-[var(--primary)] transition-all duration-150 active:scale-[0.98] cursor-pointer"
                >
                  {copiedContent ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-[var(--blue-700)] animate-scale-in" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy config</span>
                    </>
                  )}
                </button>
              </div>

              {/* Code text content */}
              <div className="p-5 font-mono text-xs text-[var(--primary)]/90 overflow-x-auto whitespace-pre-wrap leading-relaxed">
                {loop.text}
              </div>
            </div>

          </div>

          {/* Sidebar Right Column */}
          <div className="lg:col-span-1 space-y-6">
            
            {/* Install Box */}
            <div className="rounded-xl border border-[var(--gray-200)] p-5 bg-[var(--background-100)]">
              <h4 className="text-xs font-bold text-[var(--primary)] mb-3">Install Loop</h4>
              <div className="flex items-center justify-between gap-2 rounded border border-[var(--gray-400)] bg-[var(--background-100)] px-2.5 py-1.5 font-mono text-[11px] text-[var(--gray-700)] select-all">
                <div className="flex items-center gap-1.5 truncate">
                  <span className="text-[var(--blue-700)]">$</span>
                  <span className="truncate">kresh get {loop.ownerUsername}/{loop.name}</span>
                </div>
                <button
                  type="button"
                  onClick={handleCopyInstall}
                  className={`transition-all duration-150 p-1 rounded hover:bg-[var(--gray-200)] shrink-0 outline-none cursor-pointer ${
                    copiedInstall ? 'text-[var(--blue-700)]' : 'text-[var(--gray-700)]/70 hover:text-[var(--primary)]'
                  }`}
                  title="Copy install command"
                >
                  {copiedInstall ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
            </div>

            {/* About Box */}
            <div className="rounded-xl border border-[var(--gray-200)] p-5 bg-[var(--background-100)] space-y-4">
              <h4 className="text-xs font-bold text-[var(--primary)] border-b border-[var(--gray-200)] pb-2">About</h4>
              
              <p className="text-xs text-[var(--gray-700)] leading-relaxed">
                {loop.description}
              </p>

              <div className="space-y-3 pt-2 text-xs">
                <div className="flex items-center justify-between text-[var(--gray-700)]">
                  <span>Author</span>
                  <span className="font-semibold text-[var(--primary)]">@{loop.ownerUsername}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--gray-700)]">
                  <span>Published</span>
                  <span className="font-mono text-[var(--primary)]">{formattedDate}</span>
                </div>
                <div className="flex items-center justify-between text-[var(--gray-700)]">
                  <span>Version</span>
                  <span className="font-mono text-[var(--primary)]">v{loop.version}</span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

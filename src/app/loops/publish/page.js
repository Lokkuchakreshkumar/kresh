'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, CloudUpload, AlertCircle, Terminal } from 'lucide-react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';

export default function PublishLoopPage() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [version, setVersion] = useState('1.0.0');
  const [description, setDescription] = useState('');
  const [loopText, setLoopText] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [session, setSession] = useState(null);

  useEffect(() => {
    import('@/app/(auth)/actions').then(m => {
      m.getSessionAction().then(res => setSession(res || null));
    });
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');

    if (!name.trim()) {
      setError('Loop name is required.');
      return;
    }
    if (!version.trim()) {
      setError('Version is required.');
      return;
    }
    if (!loopText.trim()) {
      setError('Loop configuration text is required.');
      return;
    }

    setLoading(true);
    try {
      // Simulate validation and API timing
      await new Promise((resolve) => setTimeout(resolve, 800));

      const newLoop = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        name: name.trim(),
        version: version.trim(),
        description: description.trim() || 'No description provided.',
        text: loopText,
        createdAt: new Date().toISOString(),
        ownerUsername: session?.username || 'anonymous'
      };

      // Save to localStorage
      const existingLoopsRaw = localStorage.getItem('kresh_loops');
      const existingLoops = existingLoopsRaw ? JSON.parse(existingLoopsRaw) : [];
      existingLoops.unshift(newLoop);
      localStorage.setItem('kresh_loops', JSON.stringify(existingLoops));

      router.push('/loops');
    } catch (err) {
      setError('An error occurred while publishing the loop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      <Header />
      
      {/* Decorative background glows */}
      <div className="absolute top-1/4 left-1/4 w-[350px] h-[350px] rounded-full bg-kresh-green/3 blur-[100px] pointer-events-none z-0" />

      <main className="flex-1 max-w-3xl mx-auto w-full px-6 pt-32 pb-24 z-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-text-secondary hover:text-text-primary transition-colors group cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        {/* Publish form glass panel */}
        <div 
          className="w-full p-6 md:p-10 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-md"
          style={{
            backgroundColor: 'rgba(10, 10, 10, 0.4)',
            backgroundImage: 'radial-gradient(circle at top, rgba(255, 255, 255, 0.03), transparent)'
          }}
        >
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-5 h-5 text-kresh-green" />
            <h1 className="text-xl md:text-2xl font-bold text-text-primary">Publish a Loop</h1>
          </div>

          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-lg border border-red-500/20 bg-red-500/10 text-xs text-red-400">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Loop Name */}
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary/70">Loop Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. pr-patcher"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-primary placeholder-text-secondary/30 outline-none transition-all duration-150 focus:border-kresh-green/20 focus:bg-white/[0.08]"
                  disabled={loading}
                />
              </div>

              {/* Version */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-text-secondary/70">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-primary placeholder-text-secondary/30 outline-none transition-all duration-150 focus:border-kresh-green/20 focus:bg-white/[0.08]"
                  disabled={loading}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary/70">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short summary of what this loop does"
                className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-xs text-text-primary placeholder-text-secondary/30 outline-none transition-all duration-150 focus:border-kresh-green/20 focus:bg-white/[0.08]"
                disabled={loading}
              />
            </div>

            {/* Textarea Configuration ("add text") */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-text-secondary/70">Loop Configuration / Markdown / YAML</label>
              <textarea
                value={loopText}
                onChange={(e) => setLoopText(e.target.value)}
                placeholder={`name: pr-patcher\ntriggers:\n  - github_pull_request\nsteps:\n  - run: verify-build\n  - run: security-audit`}
                rows={10}
                className="rounded-lg border border-white/10 bg-white/5 p-4 text-xs font-mono text-text-primary placeholder-text-secondary/20 outline-none transition-all duration-150 focus:border-kresh-green/20 focus:bg-white/[0.08] resize-y"
                disabled={loading}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-white/5 bg-white/5 hover:bg-white/10 text-xs font-semibold rounded-lg text-text-secondary hover:text-text-primary transition-all duration-150 active:scale-[0.98]"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="rounded-lg bg-text-primary text-background hover:opacity-95 px-5 py-2 font-bold text-xs flex items-center gap-1.5 active:scale-[0.98] transition-all"
              >
                <CloudUpload className="w-3.5 h-3.5" />
                <span>{loading ? 'Publishing...' : 'Publish Loop'}</span>
              </Button>
            </div>

          </form>

        </div>

      </main>

      <Footer />
    </div>
  );
}

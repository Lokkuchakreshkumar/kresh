'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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
  const [session, setSession] = useState(undefined);

  useEffect(() => {
    import('@/app/(auth)/actions').then(m => {
      m.getSessionAction().then(res => setSession(res || null));
    });
  }, []);

  const handlePublish = async (e) => {
    e.preventDefault();
    setError('');

    if (!session) {
      setError('You must be signed in to publish a loop. Anonymous submissions are not permitted.');
      return;
    }

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
      const formData = new FormData();
      formData.append('name', name.trim());
      formData.append('version', version.trim());
      formData.append('description', description.trim() || 'No description provided.');
      formData.append('loopText', loopText);

      const { createLoopAction } = await import('../actions');
      const result = await createLoopAction(formData);

      if (result?.error) {
        setError(result.error);
        setLoading(false);
        return;
      }

      const newLoop = {
        id: crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2),
        name: name.trim(),
        version: version.trim(),
        description: description.trim() || 'No description provided.',
        text: loopText,
        createdAt: new Date().toISOString(),
        ownerUsername: session.username
      };

      // Save to localStorage for fallback/local sync
      const existingLoopsRaw = localStorage.getItem('kresh_loops');
      const existingLoops = existingLoopsRaw ? JSON.parse(existingLoopsRaw) : [];
      existingLoops.unshift(newLoop);
      localStorage.setItem('kresh_loops', JSON.stringify(existingLoops));

      router.push('/loops');
    } catch (err) {
      setError(err.message || 'An error occurred while publishing the loop.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)] flex flex-col relative overflow-hidden">
      <Header />
      
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 pt-32 pb-24 z-10">
        
        {/* Back Link */}
        <div className="mb-6">
          <button 
            onClick={() => router.back()}
            className="inline-flex items-center gap-1.5 text-xs text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors group cursor-pointer"
          >
            <ChevronLeft className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" />
            <span>Back</span>
          </button>
        </div>

        {/* Publish form flat panel */}
        <div 
          className="w-full p-6 md:p-10 rounded-[12px] border border-[var(--gray-400)] bg-[var(--background-100)] shadow-card"
        >
          <div className="flex items-center gap-2 mb-6">
            <Terminal className="w-5 h-5 text-[var(--blue-700)]" />
            <h1 className="text-xl md:text-2xl font-bold text-[var(--primary)]">Publish a Loop</h1>
          </div>

          {session === null && (
            <div className="mb-6 flex items-start gap-2.5 p-4 rounded-lg border border-[var(--red-300)] bg-[var(--red-100)] text-xs text-[var(--red-700)]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <div>
                <span className="font-bold">Access Denied:</span> You must be signed in to publish a loop workflow. Please <Link href="/signin" className="underline font-semibold hover:text-[var(--red-800)]">Sign In</Link> to write to the registry.
              </div>
            </div>
          )}

          {error && (
            <div className="mb-6 flex items-start gap-2.5 p-3.5 rounded-lg border border-[var(--red-300)] bg-[var(--red-100)] text-xs text-[var(--red-700)]">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handlePublish} className="space-y-6 text-left">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              
              {/* Loop Name */}
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--gray-700)]/70">Loop Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g. pr-patcher"
                  className="rounded-lg border border-[var(--gray-400)] bg-[var(--gray-100)] px-3 py-2 text-xs text-[var(--primary)] placeholder-[var(--gray-500)] outline-none transition-all duration-150 focus:border-[var(--blue-300)] focus:bg-[var(--gray-200)] disabled:opacity-50"
                  disabled={loading || session === null}
                />
              </div>

              {/* Version */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-[var(--gray-700)]/70">Version</label>
                <input
                  type="text"
                  value={version}
                  onChange={(e) => setVersion(e.target.value)}
                  placeholder="1.0.0"
                  className="rounded-lg border border-[var(--gray-400)] bg-[var(--gray-100)] px-3 py-2 text-xs text-[var(--primary)] placeholder-[var(--gray-500)] outline-none transition-all duration-150 focus:border-[var(--blue-300)] focus:bg-[var(--gray-200)] disabled:opacity-50"
                  disabled={loading || session === null}
                />
              </div>
            </div>

            {/* Description */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--gray-700)]/70">Description</label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="A short summary of what this loop does"
                className="rounded-lg border border-[var(--gray-400)] bg-[var(--gray-100)] px-3 py-2 text-xs text-[var(--primary)] placeholder-[var(--gray-500)] outline-none transition-all duration-150 focus:border-[var(--blue-300)] focus:bg-[var(--gray-200)] disabled:opacity-50"
                disabled={loading || session === null}
              />
            </div>

            {/* Textarea Configuration ("add text") */}
            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-[var(--gray-700)]/70">Loop Configuration / Markdown / YAML</label>
              <textarea
                value={loopText}
                onChange={(e) => setLoopText(e.target.value)}
                placeholder={`name: pr-patcher\ntriggers:\n  - github_pull_request\nsteps:\n  - run: verify-build\n  - run: security-audit`}
                rows={10}
                className="rounded-lg border border-[var(--gray-400)] bg-[var(--gray-100)] p-4 text-xs font-mono text-[var(--primary)] placeholder-[var(--gray-500)] outline-none transition-all duration-150 focus:border-[var(--blue-300)] focus:bg-[var(--gray-200)] resize-y disabled:opacity-50"
                disabled={loading || session === null}
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => router.back()}
                className="px-4 py-2 border border-[var(--gray-200)] bg-[var(--gray-100)] hover:bg-[var(--gray-200)] text-xs font-semibold rounded-lg text-[var(--gray-700)] hover:text-[var(--primary)] transition-all duration-150 active:scale-[0.98]"
                disabled={loading}
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={loading || session === null}
                className="rounded-lg bg-[var(--gray-1000)] text-[var(--background-100)] hover:opacity-95 px-5 py-2 font-bold text-xs flex items-center gap-1.5 active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed"
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

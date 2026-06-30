'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { SkillListRow } from './SkillListRow';

export function ImportedSkillsFeed() {
  const searchParams = useSearchParams();
  const query = searchParams.get('search') || searchParams.get('q') || '';
  return <ImportedSkillsFeedContent key={query} query={query} />;
}

function ImportedSkillsFeedContent({ query }) {
  const [items, setItems] = useState([]);
  const [cursor, setCursor] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [total, setTotal] = useState(0);
  const sentinel = useRef(null);

  const loadMore = useCallback(async () => {
    if (loading || !hasMore) return;
    setLoading(true);
    setError('');
    try {
      const response = await fetch(`/api/external-skills?cursor=${cursor}&limit=20&q=${encodeURIComponent(query)}`);
      if (!response.ok) throw new Error('Catalog request failed');
      const data = await response.json();
      setTotal(Number(data.total || 0));
      setItems((current) => {
        const known = new Set(current.map((item) => item.slug));
        return [...current, ...data.items.filter((item) => !known.has(item.slug))];
      });
      setCursor(data.nextCursor || 0);
      setHasMore(Boolean(data.nextCursor));
    } catch (loadError) {
      console.error('Failed to load imported skill catalog:', loadError);
      setError('The imported catalog could not be loaded.');
    } finally {
      setLoading(false);
    }
  }, [cursor, hasMore, loading, query]);

  useEffect(() => {
    const timer = setTimeout(() => loadMore(), 0);
    return () => clearTimeout(timer);
  }, []); // The keyed content component performs exactly one initial request.

  useEffect(() => {
    if (!sentinel.current) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) loadMore();
    }, { rootMargin: '300px' });
    observer.observe(sentinel.current);
    return () => observer.disconnect();
  }, [loadMore]);

  return (
    <section className="mb-14" aria-labelledby="imported-skills-heading">
      <div className="mb-5">
        <h2 id="imported-skills-heading" className="text-2xl font-bold text-[var(--primary)]">Kresh community catalog</h2>
        <p className="mt-2 text-sm text-[var(--gray-700)]">{total.toLocaleString()} community skills ordered by popularity and installed securely through Kresh.</p>
      </div>
      <div className="space-y-4">
        <div className="hidden gap-4 px-6 text-[10px] font-bold uppercase text-[var(--gray-700)]/70 lg:grid lg:grid-cols-12">
          <div className="col-span-6">Skill</div><div className="col-span-2 text-center">Author</div><div className="col-span-1 text-center">Version</div><div className="col-span-1 text-center">Installs</div><div className="col-span-1 text-center text-[var(--blue-700)]">Stars</div><div className="col-span-1 text-right">Updated</div>
        </div>
        {items.map((skill) => <SkillListRow key={skill.slug} skill={skill} />)}
      </div>
      <div ref={sentinel} className="mt-6 min-h-8 text-center text-sm text-[var(--gray-700)]">
        {loading ? 'Loading more skills…' : error || (hasMore ? '' : 'End of imported catalog')}
      </div>
      {error && <button type="button" onClick={loadMore} className="mx-auto block rounded border border-[var(--gray-400)] px-3 py-2 text-sm">Retry</button>}
    </section>
  );
}

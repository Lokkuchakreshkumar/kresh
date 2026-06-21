import React from 'react';
import Link from 'next/link';
import { desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { skills, users } from '@/db/schema';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { Button } from '@/components/ui/Button';
import { EmptySkills } from './components/EmptySkills';
import { SkillsList } from './components/SkillsList';

import { unstable_cache } from 'next/cache';

export const revalidate = 60;

const getPublicSkills = unstable_cache(
  async () => {
    try {
      return await db
        .select({
          id: skills.id,
          slug: skills.slug,
          name: skills.name,
          description: skills.description,
          category: skills.category,
          currentVersion: skills.currentVersion,
          installsCount: skills.installsCount,
          starsCount: skills.starsCount,
          createdAt: skills.createdAt,
          ownerUsername: users.username
        })
        .from(skills)
        .leftJoin(users, eq(skills.ownerId, users.id))
        .where(eq(skills.visibility, 'public'))
        .orderBy(desc(skills.createdAt));
    } catch (error) {
      console.error('Failed to load public skills:', error);
      return [];
    }
  },
  ['public-skills'],
  { revalidate: 60, tags: ['skills'] }
);

export default async function SkillsPage({ searchParams }) {
  const resolvedParams = searchParams ? (searchParams.then ? await searchParams : searchParams) : {};
  const initialSearch = resolvedParams.search || resolvedParams.q || '';
  const publicSkills = await getPublicSkills();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/20">
      <Header />
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32">
        <section className="mb-10 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <div>
            <div className="font-mono text-xs text-text-secondary">$ kresh skills</div>
            <h1 className="mt-4 text-4xl font-black text-text-primary">Skills & Modules</h1>
            <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
              Browse every public installable module on Kresh, including Skills, Agent.md, and Design.md. Each module is versioned, reusable, and built for AI systems.
            </p>
          </div>

          <Link href="/dashboard/publish">
            <Button className="rounded-lg">Publish a skill</Button>
          </Link>
        </section>

        {publicSkills.length === 0 ? (
          <EmptySkills />
        ) : (
          <SkillsList skills={publicSkills} initialSearch={initialSearch} />
        )}
      </main>
      <Footer />
    </div>
  );
}

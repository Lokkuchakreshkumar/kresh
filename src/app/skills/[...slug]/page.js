import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { and, desc, eq, or } from 'drizzle-orm';
import { db } from '@/db';
import { skillFiles, skills, skillVersions, skillStars, users } from '@/db/schema';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { verifySession } from '@/lib/auth';
import { FolderGit, Code, MessageSquare, Play, Settings, ShieldAlert } from 'lucide-react';
import { Button } from '@/components/ui/Button';

import { SkillHeaderActions } from './components/SkillHeaderActions';
import { FileExplorer } from './components/FileExplorer';
import { ReadmeContainer } from './components/ReadmeContainer';
import { Sidebar } from './components/Sidebar';
import { deleteSkillAction } from '@/app/dashboard/actions';

export const dynamic = 'force-dynamic';

/**
 * Retrieves the skill metadata, active version, list of version files,
 * and the specific markdown contents for SKILL.md.
 *
 * @param {string} slug Skill slug
 */
async function getSkillWithMarkdown(slug, userId = null) {
  try {
    const whereClause = userId
      ? and(eq(skills.slug, slug), or(eq(skills.visibility, 'public'), eq(skills.ownerId, userId)))
      : and(eq(skills.slug, slug), eq(skills.visibility, 'public'));

    const skillRows = await db
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
        ownerId: skills.ownerId,
        ownerUsername: users.username,
        visibility: skills.visibility
      })
      .from(skills)
      .leftJoin(users, eq(skills.ownerId, users.id))
      .where(whereClause)
      .limit(1);

    const skill = skillRows[0];
    if (!skill) {
      return null;
    }

    const versionRows = await db
      .select()
      .from(skillVersions)
      .where(eq(skillVersions.skillId, skill.id))
      .orderBy(desc(skillVersions.publishedAt))
      .limit(1);

    const version = versionRows[0];
    if (!version) {
      return { skill, version: null, markdown: '', files: [] };
    }

    // Get all files belonging to this active version (without contents for speed)
    const files = await db
      .select({
        id: skillFiles.id,
        path: skillFiles.path,
        fileType: skillFiles.fileType,
        createdAt: skillFiles.createdAt
      })
      .from(skillFiles)
      .where(eq(skillFiles.skillVersionId, version.id));

    // Get the markdown content of SKILL.md if it exists
    let markdown = '';
    const skillMdFile = files.find(f => f.path === 'SKILL.md');
    if (skillMdFile) {
      const mdContentRows = await db
        .select({ content: skillFiles.content })
        .from(skillFiles)
        .where(eq(skillFiles.id, skillMdFile.id))
        .limit(1);
      if (mdContentRows.length > 0) {
        markdown = mdContentRows[0].content;
      }
    }

    return {
      skill,
      version,
      markdown,
      files
    };
  } catch (error) {
    console.error('Failed to load skill details:', error);
    return null;
  }
}

export default async function SkillMarkdownPage({ params }) {
  const { slug: rawSlug } = await params;
  const slug = decodeURIComponent(Array.isArray(rawSlug) ? rawSlug.join('/') : rawSlug || '');
  const session = await verifySession();
  const data = await getSkillWithMarkdown(slug, session?.userId);

  if (!data) {
    notFound();
  }

  const { skill, version, markdown, files } = data;

  // Determine if the currently logged-in user has starred this skill
  let isStarred = false;
  if (session && skill) {
    try {
      const starRow = await db
        .select()
        .from(skillStars)
        .where(and(
          eq(skillStars.skillId, skill.id),
          eq(skillStars.userId, session.userId)
        ))
        .limit(1);
      isStarred = starRow.length > 0;
    } catch (err) {
      console.error('Failed to verify user star status:', err);
    }
  }

  const isOwner = session && skill && session.userId === skill.ownerId;
  const publishTimestamp = version?.publishedAt || skill.createdAt;

  return (
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)] selection:bg-[var(--blue-200)]">
      <Header />
      
      <main className="mx-auto max-w-7xl px-6 pb-16 pt-32">
        {/* GitHub Repository Breadcrumbs & Action Bar */}
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between border-b border-[var(--gray-200)] pb-5">
          <div className="flex flex-wrap items-center gap-2.5 text-lg md:text-xl font-medium">
            <FolderGit className="w-5 h-5 text-[var(--gray-700)]" />
            <Link href="/skills" className="text-[var(--gray-700)] hover:text-[var(--primary)] transition-colors font-mono">
              skills
            </Link>
            <span className="text-[var(--gray-700)]/50 font-mono">/</span>
            <span className="font-bold text-[var(--primary)] font-mono select-all">
              {skill.slug}
            </span>
            <span className="ml-1.5 rounded-full border border-[var(--gray-400)] bg-[var(--gray-100)] px-2 py-0.5 text-[10px] font-semibold text-[var(--gray-700)] capitalize">
              {skill.visibility || 'public'}
            </span>
          </div>

          <SkillHeaderActions
            skillId={skill.id}
            initialIsStarred={isStarred}
            initialStarsCount={skill.starsCount}
            hasSession={!!session}
          />
        </div>

        {/* GitHub Tabs Bar */}
        <div className="mt-4 flex items-center gap-1 border-b border-[var(--gray-400)] overflow-x-auto no-scrollbar">
          {[
            { id: 'code', label: 'Code', icon: Code, active: true },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                type="button"
                disabled={!tab.active}
                className={`flex items-center gap-2 border-b-2 px-4 py-3 text-xs font-semibold transition-all duration-150 whitespace-nowrap outline-none ${
                  tab.active
                    ? 'border-[var(--blue-700)] text-[var(--primary)] bg-[var(--background-100)]'
                    : 'border-transparent text-[var(--gray-700)]/50 hover:text-[var(--gray-700)]/80 hover:border-[var(--gray-400)] cursor-not-allowed'
                }`}
              >
                <Icon className="w-3.5 h-3.5 text-[var(--gray-700)]" />
                <span>{tab.label}</span>
                {tab.count !== undefined && (
                  <span className="rounded-full bg-[var(--gray-100)] border border-[var(--gray-400)] px-1.5 py-0.5 text-[9px] text-[var(--gray-700)]/75">
                    {tab.count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* GitHub Content Layout Grid */}
        <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-4">
          
          {/* Main Contents Left Column (File list and README) */}
          <div className="lg:col-span-3 flex flex-col gap-6">
            
            {/* Git Action Subheader */}
            <div className="flex items-center justify-end gap-3">
              {/* Action buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {isOwner && (
                  <form action={async () => {
                    'use server';
                    await deleteSkillAction(skill.id);
                  }}>
                    <Button type="submit" variant="outline" className="border border-red-500/30 hover:bg-red-500/10 text-red-400 hover:text-red-300 rounded-md px-3.5 py-1.5 text-xs font-semibold">
                      Delete Skill
                    </Button>
                  </form>
                )}
                <a href={`/api/skills/download/${skill.slug}`}>
                  <Button className="rounded-md px-3.5 py-1.5 text-xs font-semibold">
                    Download
                  </Button>
                </a>
              </div>
            </div>

            {/* File Explorer Tree view */}
            <FileExplorer 
              files={files} 
              ownerUsername={skill.ownerUsername} 
              latestVersion={version} 
              publishedAt={publishTimestamp} 
            />

            {/* Readme preview container */}
            <ReadmeContainer markdown={markdown} isOwner={isOwner} slug={skill.slug} />

          </div>

          {/* Sidebar Right Column */}
          <div className="lg:col-span-1">
            <Sidebar 
              skill={skill} 
              ownerUsername={skill.ownerUsername} 
              latestVersion={version} 
            />
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

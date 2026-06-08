import React from 'react';
import { redirect } from 'next/navigation';
import { and, desc, eq } from 'drizzle-orm';
import { db } from '@/db';
import { skills, skillVersions, skillFiles } from '@/db/schema';
import { Footer } from '@/components/layout/Footer';
import { Header } from '@/components/layout/Header';
import { verifySession } from '@/lib/auth';
import { getDefaultSkillMarkdown } from '../actions';
import { PublishSkillForm } from './PublishSkillForm';

export const dynamic = 'force-dynamic';

export default async function PublishSkillPage({ searchParams }) {
  const session = await verifySession();

  if (!session) {
    redirect('/signin');
  }

  const { edit } = await searchParams;
  let initialSkill = null;

  if (edit) {
    try {
      // Find the skill matching the slug and belonging to this owner
      const skillRows = await db
        .select()
        .from(skills)
        .where(and(eq(skills.slug, edit), eq(skills.ownerId, session.userId)))
        .limit(1);

      const skill = skillRows[0];
      if (skill) {
        // Find latest version of the skill
        const versionRows = await db
          .select()
          .from(skillVersions)
          .where(eq(skillVersions.skillId, skill.id))
          .orderBy(desc(skillVersions.publishedAt))
          .limit(1);

        const version = versionRows[0];
        let markdown = '';

        if (version) {
          // Find SKILL.md content
          const fileRows = await db
            .select({ content: skillFiles.content })
            .from(skillFiles)
            .where(and(eq(skillFiles.skillVersionId, version.id), eq(skillFiles.path, 'SKILL.md')))
            .limit(1);

          markdown = fileRows[0]?.content || '';
        }

        initialSkill = {
          id: skill.id,
          name: skill.name,
          slug: skill.slug,
          description: skill.description || '',
          category: skill.category,
          visibility: skill.visibility || 'public',
          version: version?.version || '1.0.0',
          markdown
        };
      }
    } catch (error) {
      console.error('Failed to pre-load skill details for editing:', error);
    }
  }

  const defaultMarkdown = await getDefaultSkillMarkdown();

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/20">
      <Header />
      <main className="mx-auto max-w-5xl px-6 pb-16 pt-32">
        <div className="mb-8">
          <div className="font-mono text-xs text-text-secondary">
            $ kresh {initialSkill ? 'edit' : 'publish'}
          </div>
          <h1 className="mt-4 text-4xl font-black text-text-primary">
            {initialSkill ? 'Edit skill version' : 'Publish a skill'}
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-text-secondary">
            {initialSkill 
              ? `Update details and publish a new version of @${session.username}/${initialSkill.slug}.`
              : 'Publish installable intelligence by shipping a real `SKILL.md`. Upload the file or write it here, then Kresh stores it as a versioned registry module.'
            }
          </p>
        </div>

        <PublishSkillForm 
          defaultMarkdown={defaultMarkdown} 
          initialSkill={initialSkill} 
        />
      </main>
      <Footer />
    </div>
  );
}

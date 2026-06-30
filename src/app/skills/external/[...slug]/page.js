import Link from 'next/link';
import { and, eq } from 'drizzle-orm';
import { notFound } from 'next/navigation';
import { db } from '@/db';
import { externalSkills } from '@/db/schema';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InstallCommands } from './InstallCommands';
import { ReadmeContainer } from '@/app/skills/[...slug]/components/ReadmeContainer';
import { getVercelOidcToken } from '@vercel/oidc';

export const dynamic = 'force-dynamic';

async function fetchUpstreamMarkdown(externalId) {
  try {
    const token = process.env.SKILLS_SH_OIDC_TOKEN || await getVercelOidcToken();
    const idPath = externalId.split('/').map(encodeURIComponent).join('/');
    const response = await fetch(`https://skills.sh/api/v1/skills/${idPath}`, {
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
      cache: 'no-store',
      signal: AbortSignal.timeout(15000)
    });
    if (!response.ok) return '';
    const detail = await response.json();
    return (detail.files || []).find((file) => String(file.path || '').toLowerCase() === 'skill.md')?.contents || '';
  } catch (error) {
    console.error('Failed to load original community skill content:', error);
    return '';
  }
}

export default async function ExternalSkillPage({ params }) {
  const { slug } = await params;
  const externalId = Array.isArray(slug) ? slug.join('/') : slug;
  let skill;
  try {
    [skill] = await db.select().from(externalSkills)
      .where(and(eq(externalSkills.externalId, externalId), eq(externalSkills.isAvailable, true))).limit(1);
  } catch (error) {
    console.error('Failed to load imported skill:', error);
  }
  if (!skill) notFound();
  const markdown = await fetchUpstreamMarkdown(skill.externalId);

  return <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)]">
    <Header />
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <Link href="/skills" className="text-sm text-[var(--gray-700)] hover:text-[var(--primary)]">← All skills</Link>
      <div className="mt-8 rounded border border-[var(--gray-400)] bg-[var(--gray-100)] p-7">
        <span className="rounded-full border border-[var(--gray-400)] px-2.5 py-1 text-xs">Kresh community skill</span>
        <h1 className="mt-5 text-4xl font-bold">{skill.name}</h1>
        <p className="mt-4 leading-7 text-[var(--gray-700)]">{skill.description || 'No upstream description provided.'}</p>
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--gray-700)]">
          <span>Rank #{skill.upstreamRank || '—'}</span><span>{skill.upstreamInstalls.toLocaleString()} installs</span>
          <a href={skill.upstreamUrl} target="_blank" rel="noreferrer" className="underline">Original listing</a>
          {skill.sourceUrl && <a href={skill.sourceUrl} target="_blank" rel="noreferrer" className="underline">GitHub source</a>}
        </div>
      </div>
      <div className="mt-8"><InstallCommands kreshSlug={skill.kreshSlug} /></div>
      <p className="my-8 text-sm leading-6 text-[var(--gray-700)]">Created and maintained by {skill.sourceOwner ? `@${skill.sourceOwner}` : 'the original author'}. Kresh runs the credited installer locally after confirmation.</p>
      <ReadmeContainer markdown={markdown} isOwner={false} slug={skill.kreshSlug} />
    </main>
    <Footer />
  </div>;
}

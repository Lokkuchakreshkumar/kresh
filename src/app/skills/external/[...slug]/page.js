import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { InstallCommands } from './InstallCommands';
import { SummarySection } from './SummarySection';
import { ReadmeContainer } from '@/app/skills/[...slug]/components/ReadmeContainer';
import { fetchLiveExternalSkill } from '@/lib/skillsShClient';
import { getVercelOidcToken } from '@vercel/oidc';

export const dynamic = 'force-dynamic';

export default async function ExternalSkillPage({ params }) {
  const { slug } = await params;
  const externalId = Array.isArray(slug) ? slug.join('/') : slug;
  const live = await fetchLiveExternalSkill(externalId, getVercelOidcToken);
  if (!live) notFound();

  const { metadata: skill, markdown, summary, description } = live;

  return <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)]">
    <Header />
    <main className="mx-auto max-w-4xl px-6 pb-20 pt-32">
      <Link href="/skills" className="text-sm text-[var(--gray-700)] hover:text-[var(--primary)]">← All skills</Link>
      <div className="mt-8 rounded border border-[var(--gray-400)] bg-[var(--gray-100)] p-7">
        <span className="rounded-full border border-[var(--gray-400)] px-2.5 py-1 text-xs">Kresh community skill</span>
        <h1 className="mt-5 text-4xl font-bold">{skill.name}</h1>
        {description && <p className="mt-4 leading-7 text-[var(--gray-700)]">{description}</p>}
        {!description && !summary && (
          <p className="mt-4 leading-7 text-[var(--gray-700)]">No upstream description provided.</p>
        )}
        <div className="mt-5 flex flex-wrap gap-4 text-sm text-[var(--gray-700)]">
          <span>Rank #{skill.upstreamRank || '—'}</span><span>{skill.upstreamInstalls.toLocaleString()} installs</span>
          <a href={skill.upstreamUrl} target="_blank" rel="noreferrer" className="underline">Original listing</a>
          {skill.sourceUrl && <a href={skill.sourceUrl} target="_blank" rel="noreferrer" className="underline">GitHub source</a>}
        </div>
      </div>
      <div className="mt-8"><InstallCommands kreshSlug={skill.kreshSlug} /></div>
      <SummarySection summary={summary} />
      <p className="my-8 text-sm leading-6 text-[var(--gray-700)]">Created and maintained by {skill.sourceOwner ? `@${skill.sourceOwner}` : 'the original author'}. Kresh runs the credited installer locally after confirmation.</p>
      <ReadmeContainer markdown={markdown} isOwner={false} slug={skill.kreshSlug} />
    </main>
    <Footer />
  </div>;
}

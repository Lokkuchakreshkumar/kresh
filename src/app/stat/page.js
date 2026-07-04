import { Suspense } from 'react';
import { db } from '@/db';
import { cliEvents } from '@/db/schema';
import { count, desc, sql, gte } from 'drizzle-orm';
import { StatsDashboard } from './components/StatsDashboard';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';

export const metadata = {
  title: 'CLI Stats — Kresh',
  description: 'Real-time usage statistics for the Kresh CLI. Track installs, commands, OS distribution, and top skills.',
};

export const revalidate = 60;

async function fetchStats() {
  try {
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const [totalRows, commandCounts, topSkills, osDist, agentDist, dailyActivity, recentEvents] =
      await Promise.all([
        db.select({ count: count() }).from(cliEvents),

        db
          .select({ command: cliEvents.command, count: count() })
          .from(cliEvents)
          .groupBy(cliEvents.command)
          .orderBy(desc(count())),

        db
          .select({ skillSlug: cliEvents.skillSlug, count: count() })
          .from(cliEvents)
          .where(sql`${cliEvents.command} = 'install' AND ${cliEvents.skillSlug} IS NOT NULL`)
          .groupBy(cliEvents.skillSlug)
          .orderBy(desc(count()))
          .limit(10),

        db
          .select({ os: cliEvents.os, count: count() })
          .from(cliEvents)
          .where(sql`${cliEvents.os} IS NOT NULL`)
          .groupBy(cliEvents.os)
          .orderBy(desc(count())),

        db
          .select({ agentType: cliEvents.agentType, count: count() })
          .from(cliEvents)
          .where(sql`${cliEvents.agentType} IS NOT NULL`)
          .groupBy(cliEvents.agentType)
          .orderBy(desc(count())),

        db
          .select({
            day: sql`date_trunc('day', ${cliEvents.createdAt})::date`.as('day'),
            count: count(),
          })
          .from(cliEvents)
          .where(gte(cliEvents.createdAt, thirtyDaysAgo))
          .groupBy(sql`date_trunc('day', ${cliEvents.createdAt})::date`)
          .orderBy(sql`date_trunc('day', ${cliEvents.createdAt})::date`),

        db
          .select({
            command: cliEvents.command,
            skillSlug: cliEvents.skillSlug,
            agentType: cliEvents.agentType,
            os: cliEvents.os,
            version: cliEvents.version,
            createdAt: cliEvents.createdAt,
          })
          .from(cliEvents)
          .orderBy(desc(cliEvents.createdAt))
          .limit(20),
      ]);

    return {
      totalCount: totalRows[0]?.count || 0,
      commandCounts,
      topSkills,
      osDist,
      agentDist,
      dailyActivity,
      recentEvents,
    };
  } catch (err) {
    console.error('Failed to fetch telemetry stats:', err);
    return null;
  }
}

export default async function StatPage() {
  const stats = await fetchStats();

  return (
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)]">
      <Header />
      <main className="pt-[80px]">
        <Suspense fallback={<StatsLoadingSkeleton />}>
          <StatsDashboard initialStats={stats} />
        </Suspense>
      </main>
      <Footer />
    </div>
  );
}

function StatsLoadingSkeleton() {
  return (
    <div className="max-w-7xl mx-auto px-6 py-16">
      <div className="h-8 w-48 bg-[var(--gray-200)] rounded-[6px] animate-pulse mb-4" />
      <div className="h-4 w-72 bg-[var(--gray-100)] rounded-[6px] animate-pulse mb-12" />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="h-28 bg-[var(--gray-100)] rounded-[12px] animate-pulse" />
        ))}
      </div>
    </div>
  );
}

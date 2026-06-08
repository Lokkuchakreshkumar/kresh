import React from 'react';
export const dynamic = 'force-dynamic';
import { db } from '@/db';
import { users, skills } from '@/db/schema';
import { eq, desc } from 'drizzle-orm';
import { verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProfileHero } from './components/ProfileHero';
import { PublishCta } from './components/PublishCta';
import { SkillRegistry } from './components/SkillRegistry';

function formatMemberDate(value) {
  try {
    return value
      ? new Date(value).toLocaleDateString(undefined, {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';
  } catch (error) {
    console.error('Failed to format dashboard member date:', error);
    return 'N/A';
  }
}

export default async function DashboardPage() {
  // Double-guard session in component (middleware also handles this)
  const session = await verifySession();
  if (!session) {
    redirect('/signin');
  }

  let userRecord = null;
  let userSkills = [];

  try {
    // Fetch user details from DB
    const fetchedUsers = await db.select().from(users).where(eq(users.id, session.userId));
    userRecord = fetchedUsers[0] || {
      username: session.username,
      email: '',
      createdAt: new Date()
    };

    // Fetch user skills from DB
    userSkills = await db.select()
      .from(skills)
      .where(eq(skills.ownerId, session.userId))
      .orderBy(desc(skills.createdAt));

  } catch (error) {
    console.error("Failed to query dashboard database records:", error);
  }

  // Calculate metrics
  const totalSkills = userSkills.length;
  const totalInstalls = userSkills.reduce((acc, skill) => acc + (skill.installsCount || 0), 0);
  const totalStars = userSkills.reduce((acc, skill) => acc + (skill.starsCount || 0), 0);
  const formattedDate = formatMemberDate(userRecord?.createdAt);

  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-white/20">
      <Header />
      
      <main className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <section className="mb-10">
          <ProfileHero
            user={userRecord}
            formattedDate={formattedDate}
            stats={{
              skills: totalSkills,
              installs: totalInstalls,
              stars: totalStars
            }}
          />
        </section>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_360px]">
          <div className="space-y-8">
            <SkillRegistry skills={userSkills} />
          </div>

          <div className="space-y-8">
            <PublishCta />
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

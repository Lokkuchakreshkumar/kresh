import React from 'react';
import { notFound } from 'next/navigation';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users, skills, skillStars } from '@/db/schema';
import { verifySession } from '@/lib/auth';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { ProfileHero } from '../dashboard/components/ProfileHero';
import { ProfileSidebar } from '../dashboard/components/ProfileSidebar';
import { ProfileSkillsList } from '../dashboard/components/ProfileSkillsList';

import { unstable_cache } from 'next/cache';

const getCachedUser = unstable_cache(
  async (username) => {
    const userRows = await db
      .select()
      .from(users)
      .where(eq(sql`lower(${users.username})`, username.toLowerCase()))
      .limit(1);
    return userRows[0] || null;
  },
  ['user-profile'],
  { revalidate: 60, tags: ['user'] }
);

const getCachedUserSkills = unstable_cache(
  async (userId, isOwner) => {
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
        ownerUsername: users.username,
        visibility: skills.visibility
      })
      .from(skills)
      .leftJoin(users, eq(skills.ownerId, users.id))
      .where(
        isOwner
          ? eq(skills.ownerId, userId)
          : and(eq(skills.ownerId, userId), eq(skills.visibility, 'public'))
      )
      .orderBy(desc(skills.createdAt));
  },
  ['user-skills'],
  { revalidate: 60, tags: ['skills'] }
);

const getCachedReceivedStars = unstable_cache(
  async (userId) => {
    return await db
      .select({
        id: skillStars.id,
        createdAt: skillStars.createdAt,
        skillName: skills.name,
        username: users.username
      })
      .from(skillStars)
      .innerJoin(skills, eq(skillStars.skillId, skills.id))
      .innerJoin(users, eq(skillStars.userId, users.id))
      .where(eq(skills.ownerId, userId))
      .orderBy(desc(skillStars.createdAt))
      .limit(20);
  },
  ['user-received-stars'],
  { revalidate: 60, tags: ['stars'] }
);

/**
 * Formats a Date object into "Month Day, Year"
 */
function formatMemberDate(value) {
  try {
    return value
      ? new Date(value).toLocaleDateString('en-US', {
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })
      : 'N/A';
  } catch (error) {
    console.error('Failed to format member date:', error);
    return 'N/A';
  }
}

export default async function UserProfilePage({ params }) {
  const { username: rawUsername } = await params;
  let username = decodeURIComponent(rawUsername || '');

  // Strip leading '@' or '%40' for query sanitization
  if (username.startsWith('@')) {
    username = username.substring(1);
  }

  // 1 & 6. Fetch user and verify session in parallel
  const [userRecord, session] = await Promise.all([
    getCachedUser(username),
    verifySession()
  ]);

  if (!userRecord) {
    notFound();
  }

  const isOwner = session && session.userId === userRecord.id;

  // 2 & 3. Fetch user's skills and received stars in parallel
  const [userSkills, receivedStars] = await Promise.all([
    getCachedUserSkills(userRecord.id, isOwner),
    getCachedReceivedStars(userRecord.id)
  ]);

  // 4. Construct recent activities timeline events
  const publications = userSkills.map(s => ({
    type: 'publish',
    date: s.createdAt,
    title: `Published ${s.name}`,
    version: s.currentVersion
  }));

  const starEvents = receivedStars.map(st => ({
    type: 'star',
    date: st.createdAt,
    title: `Received star from @${st.username} on ${st.skillName}`
  }));

  const activities = [...publications, ...starEvents]
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, 10); // Show top 10 activities

  // 5. Calculate metrics
  const totalSkills = userSkills.length;
  const totalInstalls = userSkills.reduce((acc, skill) => acc + (skill.installsCount || 0), 0);
  const totalStars = userSkills.reduce((acc, skill) => acc + (skill.starsCount || 0), 0);
  const formattedDate = formatMemberDate(userRecord.createdAt);


  return (
    <div className="min-h-screen bg-background text-foreground selection:bg-kresh-green/30">
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
            <ProfileSkillsList skills={userSkills} isOwner={isOwner} />
          </div>

          <div className="space-y-8">
            <ProfileSidebar 
              username={userRecord.username} 
              isOwner={isOwner} 
              activities={activities} 
            />
          </div>
        </div>
      </main>
      
      <Footer />
    </div>
  );
}

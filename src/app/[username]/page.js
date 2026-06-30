import React from 'react';
import { notFound } from 'next/navigation';
import { and, desc, eq, sql } from 'drizzle-orm';
import { db } from '@/db';
import { users, skills, skillStars } from '@/db/schema';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import ProfileClientWrapper from './ProfileClientWrapper';

import { getCachedData, setCachedData } from '@/lib/memoryCache';

export const revalidate = 60; // Cache this page at the server/ISR level for 60 seconds

export async function generateStaticParams() {
  return [
    { username: 'chakresh' }
  ];
}

async function fetchUser(username) {
  const userRows = await db
    .select()
    .from(users)
    .where(eq(sql`lower(${users.username})`, username.toLowerCase()))
    .limit(1);
  return userRows[0] || null;
}

async function fetchUserSkills(userId) {
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
      and(eq(skills.ownerId, userId), eq(skills.visibility, 'public'))
    )
    .orderBy(desc(skills.createdAt));
}

async function fetchReceivedStars(userId) {
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
}

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

  // 1 & 6. Fetch user from cache/DB
  let userRecord = getCachedData(`user:${username.toLowerCase()}`);
  if (!userRecord) {
    userRecord = await fetchUser(username);
    if (userRecord) {
      setCachedData(`user:${username.toLowerCase()}`, userRecord, 60);
    }
  }

  if (!userRecord) {
    notFound();
  }

  // 2 & 3. Fetch user's skills and received stars
  const cacheKeySkills = `user-skills:${userRecord.id}`;
  const cacheKeyStars = `user-stars:${userRecord.id}`;
  
  let userSkills = getCachedData(cacheKeySkills);
  let receivedStars = getCachedData(cacheKeyStars);
  
  if (!userSkills || !receivedStars) {
    const [_skills, _stars] = await Promise.all([
      userSkills ? null : fetchUserSkills(userRecord.id),
      receivedStars ? null : fetchReceivedStars(userRecord.id)
    ]);
    if (!userSkills) {
      userSkills = _skills;
      setCachedData(cacheKeySkills, userSkills, 60);
    }
    if (!receivedStars) {
      receivedStars = _stars;
      setCachedData(cacheKeyStars, receivedStars, 60);
    }
  }

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
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)] selection:bg-[var(--blue-200)]">
      <Header />
      
      <main className="pt-32 pb-16 max-w-7xl mx-auto px-6">
        <ProfileClientWrapper
          userRecord={userRecord}
          userSkills={userSkills}
          activities={activities}
          stats={{
            skills: totalSkills,
            installs: totalInstalls,
            stars: totalStars
          }}
          formattedDate={formattedDate}
          username={username}
        />
      </main>
      
      <Footer />
    </div>
  );
}

"use client";

import React, { useState, useEffect } from 'react';
import { ProfileHero } from '../dashboard/components/ProfileHero';
import { ProfileSkillsList } from '../dashboard/components/ProfileSkillsList';
import { ProfileSidebar } from '../dashboard/components/ProfileSidebar';

export default function ProfileClientWrapper({ 
  userRecord, 
  userSkills, 
  activities, 
  stats, 
  formattedDate, 
  username 
}) {
  const [isOwner, setIsOwner] = useState(false);

  useEffect(() => {
    import('@/app/(auth)/actions').then(m => {
      m.getSessionAction().then(session => {
        if (session && session.username && session.username.toLowerCase() === username.toLowerCase()) {
          setIsOwner(true);
        }
      });
    });
  }, [username]);

  return (
    <>
      <section className="mb-10">
        <ProfileHero
          user={userRecord}
          formattedDate={formattedDate}
          stats={stats}
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
    </>
  );
}

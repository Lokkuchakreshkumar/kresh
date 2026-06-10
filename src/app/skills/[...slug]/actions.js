'use server';

import { eq } from 'drizzle-orm';
import { db } from '@/db';
import { skillFiles } from '@/db/schema';

export async function getFileContentAction(fileId) {
  try {
    const files = await db
      .select({ content: skillFiles.content })
      .from(skillFiles)
      .where(eq(skillFiles.id, fileId))
      .limit(1);
    
    if (files.length > 0) {
      return files[0].content;
    }
    return null;
  } catch (error) {
    console.error('Failed to fetch file content:', error);
    return null;
  }
}

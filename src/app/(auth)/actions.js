'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq, sql } from 'drizzle-orm';
import { hashPassword, verifyPassword, createSession, deleteSession, verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

export async function signupAction(prevState, formData) {
  try {
    const rawUsername = formData.get('username');
    const rawEmail = formData.get('email');
    const password = formData.get('password');
    console.log("Signup action started", { rawUsername, rawEmail, password: !!password });

    if (!rawUsername || !rawEmail || !password) {
      return { error: 'All fields are required.' };
    }

    let username = rawUsername.trim();
    if (username.startsWith('@')) {
      username = username.substring(1);
    }

    if (!username) {
      return { error: 'Username is required.' };
    }

    if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      return { error: 'Username can only contain letters, numbers, underscores, or hyphens.' };
    }

    if (username.length < 3) {
      return { error: 'Username must be at least 3 characters long.' };
    }

    const email = rawEmail.trim().toLowerCase();

    // Check if user already exists (case-insensitive email check)
    const existingUser = await db
      .select()
      .from(users)
      .where(eq(sql`lower(${users.email})`, email))
      .limit(1);

    if (existingUser.length > 0) {
      console.log("Signup action error: User already exists", email);
      return { error: 'User already exists.' };
    }

    // Check if username is taken (case-insensitive username check)
    const existingUsername = await db
      .select()
      .from(users)
      .where(eq(sql`lower(${users.username})`, username.toLowerCase()))
      .limit(1);

    if (existingUsername.length > 0) {
      console.log("Signup action error: Username is taken", username);
      return { error: 'Username is taken.' };
    }

    const hashedPassword = await hashPassword(password);
    const id = crypto.randomUUID();

    await db.insert(users).values({
      id,
      username,
      email,
      passwordHash: hashedPassword,
    });

    await createSession(id, username);
  } catch (error) {
    console.error('Signup action failed:', error);
    return { error: 'An unexpected error occurred during signup.' };
  }

  redirect('/');
}

export async function signinAction(prevState, formData) {
  const email = formData.get('email');
  const password = formData.get('password');

  if (!email || !password) {
    return { error: 'All fields are required.' };
  }

  const userRecords = await db.select().from(users).where(eq(users.email, email));
  const user = userRecords[0];

  if (!user || !user.passwordHash) {
    return { error: 'Invalid email or password.' };
  }

  const isValid = await verifyPassword(password, user.passwordHash);
  if (!isValid) {
    return { error: 'Invalid email or password.' };
  }

  await createSession(user.id, user.username);
  redirect('/');
}

export async function logoutAction() {
  await deleteSession();
  redirect('/');
}

export async function getSessionAction() {
  return await verifySession();
}

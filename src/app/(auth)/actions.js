'use server';

import { db } from '@/db';
import { users } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { hashPassword, verifyPassword, createSession, deleteSession, verifySession } from '@/lib/auth';
import { redirect } from 'next/navigation';
import crypto from 'crypto';

export async function signupAction(prevState, formData) {
  const username = formData.get('username');
  const email = formData.get('email');
  const password = formData.get('password');

  if (!username || !email || !password) {
    return { error: 'All fields are required.' };
  }

  // Check if user already exists
  const existingUser = await db.select().from(users).where(eq(users.email, email));
  if (existingUser.length > 0) {
    return { error: 'User already exists.' };
  }

  const existingUsername = await db.select().from(users).where(eq(users.username, username));
  if (existingUsername.length > 0) {
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

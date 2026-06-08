import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { encrypt, decrypt } from './jwt';

export async function hashPassword(password) {
  try {
    return await bcrypt.hash(password, 10);
  } catch (error) {
    console.error("Password hashing failed:", error);
    throw error;
  }
}

export async function verifyPassword(password, hash) {
  try {
    return await bcrypt.compare(password, hash);
  } catch (error) {
    console.error("Password verification failed:", error);
    return false;
  }
}

export async function createSession(userId, username) {
  try {
    const expiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const session = await encrypt({ userId, username });

    if (!session) {
      throw new Error("Failed to generate session token");
    }

    const cookieStore = await cookies();
    cookieStore.set('session', session, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      expires: expiresAt,
      sameSite: 'lax',
      path: '/',
    });
  } catch (error) {
    console.error("Creating session failed:", error);
  }
}

export async function verifySession() {
  try {
    const cookieStore = await cookies();
    const session = cookieStore.get('session')?.value;
    return await decrypt(session);
  } catch (error) {
    console.error("Session verification failed:", error);
    return null;
  }
}

export async function deleteSession() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('session');
  } catch (error) {
    console.error("Deleting session failed:", error);
  }
}

export { decrypt };

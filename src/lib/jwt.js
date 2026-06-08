import { SignJWT, jwtVerify } from 'jose';

const secretKey = process.env.JWT_SECRET || 'super-secret-key-for-kresh-dev-only';
const encodedKey = new TextEncoder().encode(secretKey);

export async function encrypt(payload) {
  try {
    return await new SignJWT(payload)
      .setProtectedHeader({ alg: 'HS256' })
      .setIssuedAt()
      .setExpirationTime('7d')
      .sign(encodedKey);
  } catch (error) {
    console.error("JWT encryption failed:", error);
    return null;
  }
}

export async function decrypt(session) {
  if (!session) return null;
  try {
    const { payload } = await jwtVerify(session, encodedKey, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.error("JWT decryption failed:", error);
    return null;
  }
}

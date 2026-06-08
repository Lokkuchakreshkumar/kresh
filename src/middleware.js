import { NextResponse } from 'next/server';
import { decrypt } from './lib/jwt';

export async function middleware(request) {
  try {
    const { pathname } = request.nextUrl;
    
    // Read the session cookie
    const sessionCookie = request.cookies.get('session')?.value;
    const session = await decrypt(sessionCookie);

    // Paths that require authentication
    const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/publish');
    // Paths that require being logged out
    const isAuthRoute = pathname.startsWith('/signin') || pathname.startsWith('/signup');

    if (isProtectedRoute && !session) {
      // Redirect to signin if not authenticated
      const url = new URL('/signin', request.url);
      return NextResponse.redirect(url);
    }

    if (isAuthRoute && session) {
      // Redirect to dashboard if already authenticated
      const url = new URL('/dashboard', request.url);
      return NextResponse.redirect(url);
    }

    return NextResponse.next();
  } catch (error) {
    console.error("Middleware processing error:", error);
    return NextResponse.next();
  }
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/publish/:path*',
    '/signin',
    '/signup'
  ],
};

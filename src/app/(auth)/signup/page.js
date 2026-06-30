'use client';

import { useActionState } from 'react';
import { signupAction } from '../actions';
import Link from 'next/link';

const GoogleIcon = () => (
  <svg className="w-4 h-4 mr-2" viewBox="0 0 24 24" fill="currentColor">
    <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
    <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
    <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z" />
    <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z" />
  </svg>
);

export default function Signup() {
  const [state, formAction, isPending] = useActionState(signupAction, null);

  return (
    <div className="min-h-screen bg-[#09090b] text-white grid grid-cols-1 lg:grid-cols-2">
      {/* Left Column - Signup Side Image */}
      <div className="hidden lg:block relative w-full h-full bg-black">
        <img
          src="/signup_side.png"
          alt="Sign Up Aesthetic Graphic"
          className="absolute inset-0 w-full h-full object-cover"
        />
      </div>

      {/* Right Column - Signup Form */}
      <div className="flex items-center justify-center p-8 sm:p-12 md:p-16 lg:p-24 bg-[#09090b] min-h-screen">
        <div className="w-full max-w-md space-y-8">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight text-white">Sign Up Account</h1>
            <p className="text-sm text-gray-400">Enter your personal data to create your account.</p>
          </div>

          {/* Social Logins */}
          <div>
            <button
              type="button"
              className="w-full flex items-center justify-center py-2.5 px-4 bg-[var(--gray-100)] hover:bg-[var(--gray-200)] border border-[var(--gray-200)] rounded-lg text-sm font-medium text-white transition-colors cursor-pointer"
            >
              <GoogleIcon />
              Google
            </button>
          </div>

          {/* Divider */}
          <div className="relative flex items-center justify-center">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-[var(--gray-200)]"></div>
            </div>
            <span className="relative px-3 bg-[#09090b] text-xs text-gray-500 uppercase tracking-wider">Or</span>
          </div>

          {/* Form */}
          <form action={formAction} className="space-y-5">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Username</label>
              <input
                name="username"
                type="text"
                required
                placeholder="eg. john_doe"
                className="w-full bg-[#18181b] border border-[var(--gray-200)] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Email</label>
              <input
                name="email"
                type="email"
                required
                placeholder="eg. johnfrans@gmail.com"
                className="w-full bg-[#18181b] border border-[var(--gray-200)] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Password</label>
              <input
                name="password"
                type="password"
                required
                placeholder="Enter your password"
                className="w-full bg-[#18181b] border border-[var(--gray-200)] rounded-lg px-4 py-3 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-white/30 transition-colors"
              />
              <p className="text-[10px] text-gray-500 font-medium">Must be at least 8 characters.</p>
            </div>

            {state?.error && (
              <p className="text-red-400 text-xs text-center">{state.error}</p>
            )}

            <button
              type="submit"
              disabled={isPending}
              className="w-full bg-white text-black hover:bg-white/90 disabled:bg-[var(--gray-100)] disabled:cursor-not-allowed font-semibold text-sm py-3 rounded-lg transition-colors cursor-pointer mt-2"
            >
              {isPending ? 'Creating account...' : 'Sign Up'}
            </button>
          </form>

          {/* Switch page */}
          <p className="text-center text-xs text-gray-400 mt-6">
            Already have an account?{' '}
            <Link href="/signin" className="text-white underline font-medium hover:text-gray-200 transition-colors">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

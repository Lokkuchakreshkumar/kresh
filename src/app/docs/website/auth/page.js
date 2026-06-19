import React from 'react';
import { DocsNextStep } from '@/components/docs/DocsNextStep';
import { DocsPagination } from '@/components/docs/DocsPagination';
import { ShieldCheck, KeyRound, UserPlus } from 'lucide-react';

export const metadata = {
  title: 'Authentication | Kresh Docs',
  description: 'Learn how to secure your Kresh account and manage your profile.',
};

export default function AuthPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="text-[14px] font-medium text-geist-gray-700 mb-6 flex items-center gap-2 tracking-[-0.28px]">
        Website Features <span className="text-geist-gray-400">&gt;</span> Authentication
      </div>
      
      <h1>Authentication</h1>
      
      <p>
        While you can browse and discover public skills without an account, interacting deeply with the Kresh ecosystem requires secure authentication.
      </p>

      <h2>Creating an Account</h2>
      <p>
        Signing up for Kresh unlocks your ability to:
      </p>
      <ul>
        <li>Publish your own intelligence modules to the registry.</li>
        <li>Manage private skills that only you can access.</li>
        <li>Maintain a public portfolio (<code>/@username</code>) of your best workflows.</li>
        <li>Authenticate the Kresh CLI for local command-line operations.</li>
      </ul>

      <div className="bg-geist-bg-200 border border-geist-gray-200 rounded-[12px] p-6 md:p-8 my-8 not-prose">
        <h4 className="text-geist-gray-1000 font-bold mb-6 text-lg flex items-center gap-2">
          <UserPlus className="w-5 h-5 text-kresh-green" /> The Registration Flow
        </h4>
        <div className="space-y-6">
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-geist-bg-100 border border-geist-gray-200 flex items-center justify-center font-bold text-geist-gray-1000 text-sm">1</div>
            <div>
              <strong className="text-geist-gray-1000 block mb-1">Choose a Username</strong>
              <p className="text-xs text-geist-gray-900 leading-relaxed m-0">Your username is permanent and serves as the namespace for all your skills (e.g., <code>@username/my-skill</code>).</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-geist-bg-100 border border-geist-gray-200 flex items-center justify-center font-bold text-geist-gray-1000 text-sm">2</div>
            <div>
              <strong className="text-geist-gray-1000 block mb-1">Secure Password</strong>
              <p className="text-xs text-geist-gray-900 leading-relaxed m-0">We use bcrypt for secure password hashing. Kresh never stores your password in plain text.</p>
            </div>
          </div>
          <div className="flex gap-4">
            <div className="w-10 h-10 shrink-0 rounded-full bg-geist-bg-100 border border-geist-gray-200 flex items-center justify-center font-bold text-geist-gray-1000 text-sm">3</div>
            <div>
              <strong className="text-geist-gray-1000 block mb-1">Session Management</strong>
              <p className="text-xs text-geist-gray-900 leading-relaxed m-0">Upon signing in, an HTTP-only JWT (JSON Web Token) cookie is securely stored in your browser to maintain your session.</p>
            </div>
          </div>
        </div>
      </div>

      <DocsNextStep 
        title="Publish your work"
        description="Learn how to upload and manage skills via the web dashboard."
        href="/docs/website/publishing"
        buttonText="Publishing & Dashboard"
      />

      <DocsPagination 
        prev={{ name: 'Skill Discovery', href: '/docs/website/discovery' }}
        next={{ name: 'Publishing', href: '/docs/website/publishing' }}
      />
    </div>
  );
}

import React from 'react';
import { DocsNextStep } from '@/components/docs/DocsNextStep';
import { DocsPagination } from '@/components/docs/DocsPagination';
import { Search, Star, Download } from 'lucide-react';

export const metadata = {
  title: 'Skill Discovery | Kresh Docs',
  description: 'Learn how to explore, filter, and discover skills on the Kresh platform.',
};

export default function DiscoveryPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="text-[14px] font-medium text-geist-gray-700 mb-6 flex items-center gap-2 tracking-[-0.28px]">
        Website Features <span className="text-geist-gray-400">&gt;</span> Skill Discovery
      </div>
      
      <h1>Skill Discovery</h1>
      
      <p>
        The core of the Kresh website is the <strong>Explore Skills</strong> section. It serves as an open, searchable registry where you can discover new capabilities for your AI agents.
      </p>

      <h2>Browsing the Registry</h2>
      <p>
        The global skill registry lists all public intelligence modules created by the community. 
      </p>

      <div className="grid sm:grid-cols-3 gap-4 my-8 not-prose">
        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-5 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 rounded-[6px] bg-geist-gray-100 border border-geist-gray-200 flex items-center justify-center mb-3">
            <Search className="w-5 h-5 text-kresh-green" />
          </div>
          <h4 className="text-geist-gray-1000 font-bold mb-2 text-sm">Global Search</h4>
          <p className="text-xs text-geist-gray-900 leading-relaxed">Use the search bar (Shortcut: <code>Ctrl+K</code>) to quickly find skills by name or keyword across the entire registry.</p>
        </div>
        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-5 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 rounded-[6px] bg-geist-gray-100 border border-geist-gray-200 flex items-center justify-center mb-3">
            <Star className="w-5 h-5 text-amber-500" />
          </div>
          <h4 className="text-geist-gray-1000 font-bold mb-2 text-sm">Popularity</h4>
          <p className="text-xs text-geist-gray-900 leading-relaxed">Gauge a skill's quality by looking at its <strong>Stars</strong>. Highly starred skills are often battle-tested by the community.</p>
        </div>
        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-5 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <div className="w-10 h-10 rounded-[6px] bg-geist-gray-100 border border-geist-gray-200 flex items-center justify-center mb-3">
            <Download className="w-5 h-5 text-geist-blue-700" />
          </div>
          <h4 className="text-geist-gray-1000 font-bold mb-2 text-sm">Install Counts</h4>
          <p className="text-xs text-geist-gray-900 leading-relaxed">Installs represent the number of times a skill has been pulled via the CLI, indicating active usage.</p>
        </div>
      </div>

      <h2>Anatomy of a Skill Page</h2>
      <p>
        When you click on a skill, you are taken to its dedicated page. Here you can evaluate whether the skill fits your needs before installing it.
      </p>
      
      <div className="bg-geist-bg-200 border border-geist-gray-200 rounded-[12px] p-6 md:p-8 my-8 not-prose">
        <h4 className="text-geist-gray-1000 font-bold mb-6 text-lg">What you'll find on a Skill Page:</h4>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-geist-bg-100 p-5 rounded-[12px] border border-geist-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <h5 className="text-kresh-green font-bold mb-2 flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-kresh-green"></span> SKILL.md Viewer
            </h5>
            <p className="text-geist-gray-900 text-xs m-0 leading-relaxed">Read the raw intelligence instructions, guidelines, and context the skill provides.</p>
          </div>
          <div className="bg-geist-bg-100 p-5 rounded-[12px] border border-geist-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <h5 className="text-kresh-green font-bold mb-2 flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-kresh-green"></span> Installation
            </h5>
            <p className="text-geist-gray-900 text-xs m-0 leading-relaxed">A quick copy-to-clipboard command to add the skill locally into your workspace.</p>
          </div>
          <div className="bg-geist-bg-100 p-5 rounded-[12px] border border-geist-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <h5 className="text-kresh-green font-bold mb-2 flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-kresh-green"></span> Version History
            </h5>
            <p className="text-geist-gray-900 text-xs m-0 leading-relaxed">View previous versions and read the changelogs provided by the author.</p>
          </div>
          <div className="bg-geist-bg-100 p-5 rounded-[12px] border border-geist-gray-200 shadow-[0_1px_2px_rgba(0,0,0,0.02)]">
            <h5 className="text-kresh-green font-bold mb-2 flex items-center gap-2 text-sm">
              <span className="w-1.5 h-1.5 rounded-full bg-kresh-green"></span> Author Profile
            </h5>
            <p className="text-geist-gray-900 text-xs m-0 leading-relaxed">Link to the creator's profile to discover other modules they have built.</p>
          </div>
        </div>
      </div>

      <DocsNextStep 
        title="Secure your account"
        description="Learn how to sign up, manage your profile, and authenticate."
        href="/docs/website/auth"
        buttonText="Authentication"
      />

      <DocsPagination 
        prev={{ name: 'The Problem', href: '/docs/the-problem' }}
        next={{ name: 'Authentication', href: '/docs/website/auth' }}
      />
    </div>
  );
}

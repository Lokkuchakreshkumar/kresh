import React from 'react';
import { DocsNextStep } from '@/components/docs/DocsNextStep';
import { DocsPagination } from '@/components/docs/DocsPagination';
import { AlertCircle, CheckCircle2 } from 'lucide-react';

export const metadata = {
  title: 'The Problem | Kresh Docs',
  description: 'Understand why AI workflows are currently inefficient and how Kresh solves it.',
};

export default function TheProblemPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="text-[14px] font-medium text-geist-gray-700 mb-6 flex items-center gap-2 tracking-[-0.28px]">
        Getting Started <span className="text-geist-gray-400">&gt;</span> The Problem
      </div>
      
      <h1>The Problem</h1>
      
      <p>
        AI coding systems are powerful, but they are not automatically grounded in your project's real rules. Most projects still do not treat knowledge as a first-class asset.
      </p>

      <h2>The Six Core Problems</h2>
      
      <div className="space-y-6 my-8 not-prose">
        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-6 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <h4 className="text-geist-gray-1000 font-bold mb-2">1. AI forgets the project too easily</h4>
          <p className="text-[14px] leading-[20px] text-geist-gray-900 m-0">Sessions reset. Context gets dropped. What was obvious in one chat is gone in the next. Kresh makes project knowledge persistent by putting it in files the repo can carry everywhere.</p>
        </div>
        
        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-6 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <h4 className="text-geist-gray-1000 font-bold mb-2">2. Instructions are scattered and inconsistent</h4>
          <p className="text-[14px] leading-[20px] text-geist-gray-900 m-0">One tool wants one format. Another tool wants another. One team writes prompts in chat, another in README. That fragmentation creates drift. Kresh gives the project a unified knowledge layer.</p>
        </div>

        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-6 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <h4 className="text-geist-gray-1000 font-bold mb-2">3. Teams depend too much on tribal knowledge</h4>
          <p className="text-[14px] leading-[20px] text-geist-gray-900 m-0">Most real project knowledge is not in code—it's what people assume others "just know" (how to run the project, what style to follow). Kresh turns tribal knowledge into documented system knowledge.</p>
        </div>

        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-6 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <h4 className="text-geist-gray-1000 font-bold mb-2">4. AI agents are too generic by default</h4>
          <p className="text-[14px] leading-[20px] text-geist-gray-900 m-0">A serious project needs an agent that understands the architecture, stack, repo structure, and security rules. Kresh is built so agents are not guessing.</p>
        </div>

        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-6 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <h4 className="text-geist-gray-1000 font-bold mb-2">5. Repeated tasks waste time because skills are not modular</h4>
          <p className="text-[14px] leading-[20px] text-geist-gray-900 m-0">Teams keep re-explaining the same work (testing rules, commit conventions, build steps). Kresh treats skills as reusable modules. Define once, version once, reuse everywhere.</p>
        </div>

        <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-6 shadow-[0_2px_2px_rgba(0,0,0,0.04)]">
          <h4 className="text-geist-gray-1000 font-bold mb-2">6. Tooling is expanding faster than coordination</h4>
          <p className="text-[14px] leading-[20px] text-geist-gray-900 m-0">The ecosystem now includes repo instructions, custom agents, tool calls, and orchestration layers. This creates chaos. Kresh exists to reduce that chaos as a coordination infrastructure.</p>
        </div>
      </div>

      <h2>The Solution: Kresh</h2>
      <p>
        <strong>Kresh is a documentation-first framework for AI-assisted development.</strong> It helps a repository describe what the project is, how it works, and how agents should behave.
      </p>

      <div className="bg-emerald-500/5 dark:bg-emerald-500/10 border border-emerald-500/20 rounded-[12px] p-6 md:p-8 my-8 not-prose relative overflow-hidden">
        <h4 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-6 text-lg">
          <CheckCircle2 className="w-5 h-5" /> The Kresh Standard
        </h4>
        <ul className="space-y-6 text-geist-gray-900 relative z-10">
          <li>
            <strong className="text-geist-gray-1000 block mb-1">Knowledge must live with the code</strong>
            <span className="text-sm">Not in memory. Not in chat history. Not in someone's head.</span>
          </li>
          <li>
            <strong className="text-geist-gray-1000 block mb-1">Instructions must be local</strong>
            <span className="text-sm">A repo should carry its own expectations, so the right behavior travels with the code wherever it goes.</span>
          </li>
        </ul>
      </div>

      <DocsNextStep 
        title="Explore Skills"
        description="Learn how to find and evaluate intelligence modules on the website."
        href="/docs/website/discovery"
        buttonText="Discover Skills"
      />

      <DocsPagination 
        prev={{ name: 'Introduction', href: '/docs' }}
        next={{ name: 'Skill Discovery', href: '/docs/website/discovery' }}
      />
    </div>
  );
}

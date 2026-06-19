import React from 'react';
import { DocsCodeBlock } from '@/components/docs/DocsCodeBlock';
import { DocsNextStep } from '@/components/docs/DocsNextStep';
import { DocsPagination } from '@/components/docs/DocsPagination';

export const metadata = {
  title: 'Introduction | Kresh Docs',
  description: 'The open registry where developers package, share, and compose intelligence modules for AI systems.',
};

export default function DocsPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="text-[14px] font-medium text-geist-gray-700 mb-6 flex items-center gap-2 tracking-[-0.28px]">
        Getting Started <span className="text-geist-gray-400">&gt;</span> Introduction
      </div>
      
      <h1>Introduction</h1>
      
      <p>
        Kresh exists to make AI-native software development predictable, reusable, and maintainable. It is a documentation-first framework for AI-assisted development.
      </p>

      <p>
        Modern coding is no longer just human-to-code. It is human + AI + repo knowledge + tools + workflows + validation. Kresh turns scattered project knowledge into a durable system of instructions, skills, and workflows for humans and AI agents.
      </p>

      <h2>Core Mission</h2>
      <p>
        Build the missing layer between code and intelligence. Kresh exists to turn repositories into structured operating systems for humans and AI agents, where knowledge is explicit, workflows are repeatable, and project behavior is predictable.
      </p>

      <h2>The Ecosystem</h2>
      <p>
        Kresh gives the project a unified knowledge layer so humans and agents can read the same source of truth. The ecosystem consists of:
      </p>

      <div className="grid sm:grid-cols-2 gap-4 my-8 not-prose">
        <div className="bg-geist-bg-100 border border-geist-gray-200 p-6 rounded-[12px] shadow-[0_2px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_-4px_rgba(0,0,0,0.04),0_16px_24px_-8px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="w-10 h-10 rounded-[6px] bg-geist-gray-100 border border-geist-gray-200 flex items-center justify-center mb-4">
            <span className="text-xl">🌐</span>
          </div>
          <h4 className="text-geist-gray-1000 font-semibold text-[16px] mb-2 leading-[24px] tracking-[-0.32px]">Global Registry</h4>
          <p className="text-[14px] text-geist-gray-900 m-0 leading-[20px]">A centralized hub to discover and publish skills as reusable modules. Define once, version once, improve once, and reuse everywhere.</p>
        </div>
        <div className="bg-geist-bg-100 border border-geist-gray-200 p-6 rounded-[12px] shadow-[0_2px_2px_rgba(0,0,0,0.04)] hover:shadow-[0_4px_8px_-4px_rgba(0,0,0,0.04),0_16px_24px_-8px_rgba(0,0,0,0.06)] transition-shadow">
          <div className="w-10 h-10 rounded-[6px] bg-geist-gray-100 border border-geist-gray-200 flex items-center justify-center mb-4">
            <span className="text-xl">💻</span>
          </div>
          <h4 className="text-geist-gray-1000 font-semibold text-[16px] mb-2 leading-[24px] tracking-[-0.32px]">Local Development</h4>
          <p className="text-[14px] text-geist-gray-900 m-0 leading-[20px]">Seamlessly integrate intelligence into your projects using the CLI. The right behavior travels with the code wherever it goes.</p>
        </div>
      </div>

      <h2>Quick Install</h2>
      <p>
        If you want to use Kresh locally, you can install the CLI globally using your preferred package manager.
      </p>

      <DocsCodeBlock 
        tabs={['npm']}
        code="$ npm install -g @chakresh/kresh" 
      />

      <DocsNextStep 
        title="Why Kresh?"
        description="Learn about the context problem in AI and why we built Kresh."
        href="/docs/the-problem"
        buttonText="Read the Problem"
      />

      <DocsPagination 
        next={{ name: 'The Problem', href: '/docs/the-problem' }}
      />
    </div>
  );
}

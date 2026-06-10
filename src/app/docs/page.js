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
      <div className="text-sm font-medium text-text-secondary/70 mb-4 flex items-center gap-2">
        Getting Started <span className="text-white/20">&gt;</span> Introduction
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
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-kresh-green/10 flex items-center justify-center mb-3">
            <span className="text-xl">🌐</span>
          </div>
          <h4 className="text-white font-bold mb-1">Global Registry</h4>
          <p className="text-sm text-text-secondary/90 m-0">A centralized hub to discover and publish skills as reusable modules. Define once, version once, improve once, and reuse everywhere.</p>
        </div>
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <span className="text-xl">💻</span>
          </div>
          <h4 className="text-white font-bold mb-1">Local Development</h4>
          <p className="text-sm text-text-secondary/90 m-0">Seamlessly integrate intelligence into your projects using the CLI. The right behavior travels with the code wherever it goes.</p>
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

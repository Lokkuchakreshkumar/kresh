import React from 'react';
import { DocsCodeBlock } from '@/components/docs/DocsCodeBlock';
import { DocsNextStep } from '@/components/docs/DocsNextStep';
import { DocsPagination } from '@/components/docs/DocsPagination';
import { Terminal, Lock, Download } from 'lucide-react';

export const metadata = {
  title: 'CLI Getting Started | Kresh Docs',
  description: 'Learn how to install and authenticate the Kresh CLI.',
};

export default function CliGettingStartedPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="text-sm font-medium text-text-secondary/70 mb-4 flex items-center gap-2">
        CLI Reference <span className="text-white/20">&gt;</span> Getting Started
      </div>
      
      <h1>Kresh CLI</h1>
      
      <p>
        The Kresh CLI is the official tool for interacting with the Kresh registry from your terminal. It allows you to search for skills, install them into your projects, and publish your own intelligence modules directly from your codebase.
      </p>

      <h2>Installation</h2>
      <p>
        The CLI is distributed as an npm package. You can install it globally to make the <code>kresh</code> command available anywhere on your system.
      </p>

      <DocsCodeBlock 
        tabs={['npm']}
        code="$ npm install -g @chakresh/kresh" 
      />

      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 my-8 not-prose">
        <h4 className="flex items-center gap-2 text-white font-bold mb-4 text-sm">
          <Terminal className="w-4 h-4 text-kresh-green" /> Verifying Installation
        </h4>
        <p className="text-xs text-text-secondary leading-relaxed mb-4">
          Once installed, you can verify it by checking the version or viewing the help menu.
        </p>
        <DocsCodeBlock 
          language="bash"
          code={`$ kresh --version
$ kresh --help`}
        />
      </div>

      <h2>Authentication</h2>
      <p>
        While you can search and install public skills without an account, you must authenticate to publish your own skills or access private ones.
      </p>

      <div className="grid sm:grid-cols-2 gap-4 my-8 not-prose">
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-3">
            <Lock className="w-5 h-5 text-purple-500" />
          </div>
          <h4 className="text-white font-bold mb-1">Interactive Login</h4>
          <p className="text-xs text-text-secondary leading-relaxed m-0 mb-4">Run the login command and follow the prompts to authenticate via the browser.</p>
          <DocsCodeBlock 
            language="bash"
            code="$ kresh login"
          />
        </div>
        
        <div className="bg-[#0a0a0a] border border-white/10 p-5 rounded-2xl">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-3">
            <Download className="w-5 h-5 text-blue-500" />
          </div>
          <h4 className="text-white font-bold mb-1">Session Token</h4>
          <p className="text-xs text-text-secondary leading-relaxed m-0 mb-4">The CLI securely stores your session token locally, so you only need to login once.</p>
          <DocsCodeBlock 
            language="bash"
            code="$ kresh whoami"
          />
        </div>
      </div>

      <DocsNextStep 
        title="Explore CLI Commands"
        description="Learn how to install, search, publish, and manage your skills from the terminal."
        href="/docs/cli/commands"
        buttonText="View Commands"
      />

      <DocsPagination 
        prev={{ name: 'Publishing & Dashboard', href: '/docs/website/publishing' }}
        next={{ name: 'Commands', href: '/docs/cli/commands' }}
      />
    </div>
  );
}

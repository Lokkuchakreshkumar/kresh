import React from 'react';
import { DocsCodeBlock } from '@/components/docs/DocsCodeBlock';
import { DocsPagination } from '@/components/docs/DocsPagination';
import { Terminal } from 'lucide-react';

export const metadata = {
  title: 'CLI Commands | Kresh Docs',
  description: 'Reference for all available Kresh CLI commands.',
};

export default function CliCommandsPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="text-sm font-medium text-text-secondary/70 mb-4 flex items-center gap-2">
        CLI Reference <span className="text-white/20">&gt;</span> Commands
      </div>
      
      <h1>Commands Reference</h1>
      
      <p>
        Here is a detailed breakdown of all the commands available in the Kresh CLI to manage intelligence modules locally.
      </p>

      {/* SEARCH COMMAND */}
      <h2>kresh search</h2>
      <p>
        Searches the global Kresh registry for public skills matching your query. This is useful for finding new capabilities without leaving your terminal.
      </p>
      <DocsCodeBlock 
        language="bash"
        code="$ kresh search <query>" 
      />
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm mt-4 not-prose">
        <strong className="text-white block mb-2">Example:</strong>
        <code className="text-kresh-green block mb-1">$ kresh search &quot;react component&quot;</code>
        <span className="text-text-secondary text-xs">Returns a list of skills matching &quot;react component&quot; along with their author and version.</span>
      </div>

      {/* INSTALL COMMAND */}
      <h2>kresh install</h2>
      <p>
        Downloads a skill from the registry and installs it into your local project. By default, skills are installed into the <code>skills/</code> directory at the root of your project.
      </p>
      <DocsCodeBlock 
        language="bash"
        code="$ kresh install @<username>/<skill-name>" 
      />
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm mt-4 not-prose">
        <strong className="text-white block mb-2">Example:</strong>
        <code className="text-kresh-green block mb-1">$ kresh install @universe/kresh-mission</code>
        <span className="text-text-secondary text-xs">Installs the exact files (e.g., MISSION.md) associated with that skill into your local workspace.</span>
      </div>

      {/* LS COMMAND */}
      <h2>kresh ls</h2>
      <p>
        Lists all the skills currently installed in your local project. It scans the <code>skills/</code> directory and outputs the installed modules.
      </p>
      <DocsCodeBlock 
        language="bash"
        code="$ kresh ls" 
      />

      {/* REMOVE COMMAND */}
      <h2>kresh remove</h2>
      <p>
        Removes a previously installed skill from your local project. This will delete the specific skill folder inside your <code>skills/</code> directory.
      </p>
      <DocsCodeBlock 
        language="bash"
        code="$ kresh remove @<username>/<skill-name>" 
      />

      {/* LOGIN COMMAND */}
      <h2>kresh login</h2>
      <p>
        Authenticates your CLI session with your Kresh account. This is required before you can publish your own skills.
      </p>
      <DocsCodeBlock 
        language="bash"
        code="$ kresh login" 
      />

      {/* PUBLISH COMMAND */}
      <h2>kresh publish</h2>
      <p>
        Publishes a new skill or updates an existing one from your local machine to the Kresh registry. You must be authenticated to use this command.
      </p>
      <DocsCodeBlock 
        language="bash"
        code="$ kresh publish [path-to-folder-or-file]" 
      />
      <div className="bg-[#0a0a0a] border border-white/10 rounded-xl p-4 text-sm mt-4 not-prose">
        <strong className="text-white block mb-2">Details:</strong>
        <p className="text-text-secondary text-xs m-0">
          The CLI will interactively ask you for the skill&apos;s name, description, and visibility setting before uploading the files. It supports single files (like <code>AGENTS.md</code>) or entire folders.
        </p>
      </div>

      <DocsPagination 
        prev={{ name: 'Getting Started', href: '/docs/cli' }}
      />
    </div>
  );
}

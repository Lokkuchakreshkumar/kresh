import React from 'react';
import { DocsPagination } from '@/components/docs/DocsPagination';
import { Edit3, FileText, FolderTree, Settings } from 'lucide-react';

export const metadata = {
  title: 'Publishing & Dashboard | Kresh Docs',
  description: 'Learn how to publish skills and manage your dashboard on Kresh.',
};

export default function PublishingPage() {
  return (
    <div className="animate-fade-in-up">
      <div className="text-sm font-medium text-text-secondary/70 mb-4 flex items-center gap-2">
        Website Features <span className="text-white/20">&gt;</span> Publishing & Dashboard
      </div>
      
      <h1>Publishing & Dashboard</h1>
      
      <p>
        The Dashboard is your personal control center. From here, you can author, publish, and manage the intelligence modules you share with the world or keep private for yourself.
      </p>

      <h2>Publishing a Skill</h2>
      <p>
        To contribute to the ecosystem or create a private workflow, you must publish a Skill. Kresh supports three different methods from the Dashboard to accommodate your preferred workflow:
      </p>

      <div className="grid md:grid-cols-3 gap-4 my-8 not-prose">
        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-kresh-green/10 flex items-center justify-center mb-4">
            <Edit3 className="w-5 h-5 text-kresh-green" />
          </div>
          <h3 className="text-white font-bold mb-2 text-sm">1. Web Editor</h3>
          <p className="text-xs text-text-secondary leading-relaxed m-0">
            Write your knowledge files directly in the browser. This is the fastest way to publish instructions without leaving the website.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center mb-4">
            <FileText className="w-5 h-5 text-blue-500" />
          </div>
          <h3 className="text-white font-bold mb-2 text-sm">2. File Upload</h3>
          <p className="text-xs text-text-secondary leading-relaxed m-0">
            Upload your existing markdown files directly. Kresh natively supports files like <code>AGENTS.md</code>, <code>CLAUDE.md</code>, <code>MISSION.md</code>, or any other standard instructions.
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 p-5 rounded-2xl hover:bg-white/10 transition-colors">
          <div className="w-10 h-10 rounded-xl bg-purple-500/10 flex items-center justify-center mb-4">
            <FolderTree className="w-5 h-5 text-purple-500" />
          </div>
          <h3 className="text-white font-bold mb-2 text-sm">3. Folder Upload</h3>
          <p className="text-xs text-text-secondary leading-relaxed m-0">
            For complex modules, upload an entire directory (e.g., a <code>SKILLS/</code> folder containing multiple reusable capabilities).
          </p>
        </div>
      </div>

      <div className="bg-kresh-green/10 border-l-4 border-kresh-green p-4 mt-4 text-sm text-text-secondary not-prose rounded-r-lg">
        <strong className="text-kresh-green block mb-1 text-sm">Important Note:</strong> 
        <span className="text-xs">Your upload should represent persistent project context or reusable capabilities. Size limits apply (max 10MB per file).</span>
      </div>

      <h2>Versioning & Metadata</h2>
      <p>
        When publishing a skill, you need to provide essential metadata to help users understand what your module does:
      </p>
      
      <div className="bg-[#0a0a0a] border border-white/10 rounded-2xl p-6 md:p-8 my-8 not-prose">
        <h4 className="flex items-center gap-2 text-white font-bold mb-6 text-lg">
          <Settings className="w-5 h-5 opacity-70" /> Configuration Fields
        </h4>
        <ul className="space-y-4">
          <li className="flex gap-3">
            <span className="text-kresh-green/70">✦</span>
            <div>
              <strong className="text-white block text-sm mb-1">Title & Description</strong> 
              <span className="text-text-secondary text-xs block">Clear descriptions help users discover your skill via search.</span>
            </div>
          </li>

          <li className="flex gap-3">
            <span className="text-kresh-green/70">✦</span>
            <div>
              <strong className="text-white block text-sm mb-1">Visibility</strong> 
              <span className="text-text-secondary text-xs block">Choose whether the skill is <code>Public</code> (visible to everyone) or <code>Private</code> (only visible to you).</span>
            </div>
          </li>
          <li className="flex gap-3">
            <span className="text-kresh-green/70">✦</span>
            <div>
              <strong className="text-white block text-sm mb-1">Version (SemVer)</strong> 
              <span className="text-text-secondary text-xs block">Kresh highly encourages Semantic Versioning (e.g., <code>1.0.0</code>). This ensures that users relying on your skill don&apos;t experience breaking changes unexpectedly.</span>
            </div>
          </li>
        </ul>
      </div>

      <h2>Managing Existing Skills</h2>
      <p>
        Once a skill is live, your Dashboard allows you to maintain it over time:
      </p>
      <ul>
        <li><strong>Publish New Versions:</strong> Upload updated files, bump the version number, and write a changelog so users know exactly what changed.</li>
        <li><strong>Edit Details:</strong> Update the visibility or description at any time without needing to bump the version.</li>
        <li><strong>Delete:</strong> Permanently remove a skill and all of its versions from the Kresh registry.</li>
      </ul>

      <DocsPagination 
        prev={{ name: 'Authentication', href: '/docs/website/auth' }}
      />
    </div>
  );
}

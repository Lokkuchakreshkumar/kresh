import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'Website Overview | Kresh Docs',
  description: 'An overview of the Kresh Website and its ecosystem.',
};

export default function WebsiteOverviewPage() {
  return (
    <div className="animate-fade-in-up pb-20">
      <h1 className="schibsted-grotesk-hero tracking-tight text-geist-gray-1000">Website Overview</h1>
      
      <p className="text-xl text-geist-gray-900 mt-4 mb-8">
        Welcome to the Kresh platform. This is the central hub where developers package, share, and compose intelligence modules for AI systems.
      </p>

      <p>
        The Kresh Website serves as the global registry for the ecosystem. Whether you are looking for a pre-built skill to give your local agent new capabilities, or you want to publish your own custom AI workflow to share with the world, the Website is where it all happens.
      </p>

      <div className="bg-geist-bg-200 border border-geist-gray-200 p-6 rounded-[12px] my-10 not-prose">
        <h3 className="text-lg font-bold text-geist-gray-1000 mb-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-kresh-green"></span> What is a Skill?
        </h3>
        <p className="text-geist-gray-900">
          A &quot;Skill&quot; is a reusable, composable intelligence module. At its core, it is a <code>SKILL.md</code> file that contains specific instructions, context, workflows, or rules for an AI agent to follow. Think of it like an npm package, but for AI reasoning and behavior.
        </p>
      </div>

      <h2>Navigating the Docs</h2>
      <p>
        In this section, we will cover the core features of the Kresh Website:
      </p>
      <ul>
        <li>
          <strong><Link href="/docs/website/the-problem">The Problem (Why Kresh)</Link>:</strong> Understand why AI workflows are currently inefficient and how the Kresh registry solves this.
        </li>
        <li>
          <strong><Link href="/docs/website/discovery">Skill Discovery</Link>:</strong> Learn how to find and explore the exact intelligence modules you need.
        </li>
        <li>
          <strong><Link href="/docs/website/publishing">Publishing & Dashboard</Link>:</strong> Discover how to author, upload, and version your own skills for others to install.
        </li>
      </ul>

      <hr className="border-geist-gray-200 my-10" />

      <div className="flex justify-between items-center not-prose">
        <div></div>
        <Link 
          href="/docs/website/the-problem" 
          className="flex items-center gap-2 px-6 py-3 rounded-[6px] bg-geist-bg-100 hover:bg-geist-gray-100 border border-geist-gray-200 transition-colors text-geist-gray-1000 font-medium"
        >
          Next: The Problem <span className="text-kresh-green">→</span>
        </Link>
      </div>
    </div>
  );
}

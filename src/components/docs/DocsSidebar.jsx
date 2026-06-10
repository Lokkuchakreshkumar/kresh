"use client";

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  PlayCircle, Lightbulb, Search, ShieldCheck, UploadCloud, ChevronRight
} from 'lucide-react';

const DOCS_NAV = [
  {
    group: 'GETTING STARTED',
    items: [
      { name: 'Introduction', href: '/docs', icon: PlayCircle },
      { name: 'The Problem', href: '/docs/the-problem', icon: Lightbulb },
    ]
  },
  {
    group: 'WEBSITE FEATURES',
    items: [
      { name: 'Skill Discovery', href: '/docs/website/discovery', icon: Search },
      { name: 'Authentication', href: '/docs/website/auth', icon: ShieldCheck },
      { name: 'Publishing & Dashboard', href: '/docs/website/publishing', icon: UploadCloud },
    ]
  },
  {
    group: 'CLI REFERENCE',
    items: [
      { name: 'Getting Started', href: '/docs/cli', icon: PlayCircle },
      { name: 'Commands', href: '/docs/cli/commands', icon: Search },
    ]
  }
];

export function DocsSidebar() {
  const pathname = usePathname();

  return (
    <nav className="h-full overflow-y-auto pb-10 pr-4 custom-scrollbar">
      {DOCS_NAV.map((section, idx) => (
        <div key={idx} className="mb-8">
          <h3 className="text-[11px] font-bold text-text-secondary/70 uppercase tracking-widest mb-3 px-3">
            {section.group}
          </h3>
          <ul className="space-y-0.5">
            {section.items.map((item) => {
              const isActive = pathname === item.href;
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className={`
                      flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors
                      ${isActive 
                        ? 'bg-white/10 text-text-primary' 
                        : 'text-text-secondary hover:text-text-primary hover:bg-white/5'
                      }
                    `}
                  >
                    <div className={`w-4 h-4 flex items-center justify-center rounded-full border ${isActive ? 'border-kresh-green text-kresh-green' : 'border-transparent text-text-secondary/70'}`}>
                      {isActive ? (
                        <div className="w-1.5 h-1.5 rounded-full bg-kresh-green" />
                      ) : (
                        <item.icon className="w-3.5 h-3.5" />
                      )}
                    </div>
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}

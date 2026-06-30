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
          <h3 className="text-[12px] font-medium text-[var(--gray-900)] tracking-normal mb-3 px-3">
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
                      flex items-center gap-3 px-3 py-2 rounded-[6px] text-[14px] leading-[20px] transition-colors
                      ${isActive 
                        ? 'bg-[var(--gray-100)] text-[var(--primary)] font-medium' 
                        : 'text-[var(--gray-900)] hover:text-[var(--primary)] hover:bg-[var(--gray-100)] font-normal'
                      }
                    `}
                  >
                    <div className="flex items-center justify-center shrink-0">
                      <item.icon className={`w-4 h-4 ${isActive ? 'text-[var(--primary)]' : 'text-[var(--gray-700)]'}`} />
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

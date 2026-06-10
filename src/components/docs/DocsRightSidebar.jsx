"use client";

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { ExternalLink, ThumbsUp, ThumbsDown } from 'lucide-react';

export function DocsRightSidebar() {
  const [headings, setHeadings] = useState([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Give the DOM a moment to render the prose content
    const timeout = setTimeout(() => {
      const elements = Array.from(document.querySelectorAll('main h2'));
      const headingData = elements.map(el => {
        // Ensure element has an ID
        if (!el.id) {
          el.id = el.textContent.toLowerCase().replace(/[^a-z0-9]+/g, '-');
        }
        return {
          id: el.id,
          text: el.textContent
        };
      });
      setHeadings(headingData);

      // Setup intersection observer for active states
      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach(entry => {
            if (entry.isIntersecting) {
              setActiveId(entry.target.id);
            }
          });
        },
        { rootMargin: '0px 0px -80% 0px' }
      );

      elements.forEach(el => observer.observe(el));

      return () => observer.disconnect();
    }, 100);

    return () => clearTimeout(timeout);
  }, []);

  if (headings.length === 0) return null;

  return (
    <aside className="hidden xl:block w-64 shrink-0 pl-8 pb-10">
      <div className="sticky top-32">
        <h4 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">On this page</h4>
        <ul className="space-y-2.5 mb-10 border-l border-white/10 relative">
          {headings.map(heading => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`
                  block pl-4 text-sm transition-colors border-l-2 -ml-[1px]
                  ${activeId === heading.id 
                    ? 'text-kresh-green border-kresh-green font-medium' 
                    : 'text-text-secondary hover:text-text-primary border-transparent'
                  }
                `}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>



        <div className="mt-10">
          <p className="text-sm text-text-secondary mb-3">Was this helpful?</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

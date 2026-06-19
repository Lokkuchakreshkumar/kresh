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
        <h4 className="text-[12px] font-medium text-geist-gray-1000 tracking-normal mb-4">On this page</h4>
        <ul className="space-y-2.5 mb-10 border-l border-geist-gray-200 relative">
          {headings.map(heading => (
            <li key={heading.id}>
              <a
                href={`#${heading.id}`}
                className={`
                  block pl-4 text-[14px] leading-[20px] transition-colors border-l-2 -ml-[1px]
                  ${activeId === heading.id 
                    ? 'text-geist-gray-1000 border-geist-gray-1000 font-medium' 
                    : 'text-geist-gray-900 hover:text-geist-gray-1000 border-transparent font-normal'
                  }
                `}
              >
                {heading.text}
              </a>
            </li>
          ))}
        </ul>



        <div className="mt-10">
          <p className="text-[14px] leading-[20px] text-geist-gray-900 mb-3">Was this helpful?</p>
          <div className="flex items-center gap-2">
            <button className="p-2 rounded-[6px] bg-geist-bg-100 border border-geist-gray-200 hover:bg-geist-gray-100 text-geist-gray-900 hover:text-geist-gray-1000 transition-colors">
              <ThumbsUp className="w-4 h-4" />
            </button>
            <button className="p-2 rounded-[6px] bg-geist-bg-100 border border-geist-gray-200 hover:bg-geist-gray-100 text-geist-gray-900 hover:text-geist-gray-1000 transition-colors">
              <ThumbsDown className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}

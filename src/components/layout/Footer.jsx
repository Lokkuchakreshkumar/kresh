import React from 'react';
import Image from 'next/image';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-[var(--gray-400)] pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-6 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo/kresh_logo_exact.svg" alt="Kresh Logo" width={40} height={40} className="object-contain" />
            <span className="text-[var(--primary)] font-bold text-xl">kresh</span>
          </div>
          <p className="text-[var(--gray-700)] text-[14px] leading-5 max-w-xs">
            The open registry where developers package, share, and compose intelligence modules for AI systems.
          </p>
          <p className="text-[var(--gray-700)]/60 text-[12px] leading-4 mt-12">
            © 2026 Kresh Inc.
          </p>
        </div>
        
        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-12 lg:gap-24">
          <div>
            <h4 className="text-[var(--primary)] font-medium mb-4 text-[14px]">Platform</h4>
            <ul className="space-y-3 text-[14px] text-[var(--gray-700)]">
              <li><a href="/skills" className="hover:text-[var(--primary)] transition-colors">Skills Registry</a></li>
              <li><a href="/docs" className="hover:text-[var(--primary)] transition-colors">Documentation</a></li>
              <li><a href="/docs/cli" className="hover:text-[var(--primary)] transition-colors">CLI Reference</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-[var(--primary)] font-medium mb-4 text-[14px]">Legal & Connect</h4>
            <ul className="space-y-3 text-[14px] text-[var(--gray-700)]">
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-[var(--primary)] transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h4 className="text-[var(--primary)] font-medium mb-4 text-[14px]">Stay in the loop</h4>
          <p className="text-[var(--gray-700)] text-[12px] mb-4">
            Get updates on new intelligence and community highlights.
          </p>
          <div className="flex bg-[var(--background-100)] border border-[var(--gray-400)] rounded-[6px] p-1">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-none outline-none px-2 py-1 text-[12px] text-[var(--primary)] placeholder-text-secondary/50 w-full"
            />
            <button className="bg-[var(--gray-1000)] text-[var(--background-100)] px-2 py-1 rounded-[4px] hover:bg-[var(--gray-900)] transition-colors flex items-center justify-center">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

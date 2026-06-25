import React from 'react';
import Image from 'next/image';
import { Github, Twitter, Linkedin } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-border-color pt-16 pb-8 mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-6 gap-8">
        <div className="col-span-1 md:col-span-2 space-y-6">
          <div className="flex items-center gap-3 mb-2">
            <Image src="/logo/kresh_logo_exact.svg" alt="Kresh Logo" width={40} height={40} className="object-contain" />
            <span className="text-text-primary font-bold text-xl">kresh</span>
          </div>
          <p className="text-text-secondary text-sm max-w-xs leading-relaxed">
            The open registry where developers package, share, and compose intelligence modules for AI systems.
          </p>
          <p className="text-text-secondary/60 text-xs mt-12">
            © 2026 Kresh Inc.
          </p>
        </div>
        
        <div className="col-span-1 md:col-span-2 flex flex-col sm:flex-row gap-12 lg:gap-24">
          <div>
            <h4 className="text-text-primary font-medium mb-4 text-sm">Platform</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="/skills" className="hover:text-text-primary transition-colors">Skills Registry</a></li>
              <li><a href="/docs" className="hover:text-text-primary transition-colors">Documentation</a></li>
              <li><a href="/docs/cli" className="hover:text-text-primary transition-colors">CLI Reference</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-text-primary font-medium mb-4 text-sm">Legal & Connect</h4>
            <ul className="space-y-3 text-sm text-text-secondary">
              <li><a href="#" className="hover:text-text-primary transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-text-primary transition-colors">Terms of Service</a></li>
              <li><a href="#" className="hover:text-text-primary transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 lg:col-span-1">
          <h4 className="text-text-primary font-medium mb-4 text-sm">Stay in the loop</h4>
          <p className="text-text-secondary text-xs mb-4">
            Get updates on new intelligence and community highlights.
          </p>
          <div className="flex glass rounded p-1">
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="bg-transparent border-none outline-none px-2 py-1 text-xs text-text-primary placeholder-text-secondary/50 w-full"
            />
            <button className="bg-text-primary text-background p-1 rounded-sm hover:opacity-90 transition-colors flex items-center justify-center">
              &rarr;
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
}

"use client";

import React, { useState } from 'react';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { DocsSidebar } from '@/components/docs/DocsSidebar';
import { DocsRightSidebar } from '@/components/docs/DocsRightSidebar';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';

export default function DocsLayout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-foreground flex flex-col font-sans">
      {/* Existing Navbar */}
      <Header />

      <main className="flex-1 flex pt-20 max-w-[1600px] w-full mx-auto relative border-t border-white/5">
        
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Button 
            className="w-14 h-14 rounded-full shadow-2xl bg-white text-black hover:bg-gray-200"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Left Sidebar (Navigation) */}
        <aside 
          className={`
            fixed lg:sticky top-20 h-[calc(100vh-5rem)] w-72 shrink-0 
            border-r border-white/5 bg-[#0a0a0a] lg:bg-transparent
            transition-transform duration-300 ease-in-out z-40 py-8
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
        >
          <DocsSidebar />
        </aside>

        {/* Overlay for mobile */}
        {sidebarOpen && (
          <div 
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-30 lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}

        {/* Main Content Area */}
        <div className="flex-1 min-w-0 px-6 md:px-12 lg:px-16 xl:px-20 py-10 pb-24 overflow-x-hidden">
          <div className="max-w-3xl mx-auto w-full">
            {/* The actual markdown/content goes here */}
            <div className="prose prose-invert max-w-none
              prose-headings:font-bold prose-headings:text-text-primary prose-headings:tracking-tight
              prose-h1:text-4xl md:prose-h1:text-5xl prose-h1:mb-4
              prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-2 prose-h2:border-b prose-h2:border-white/5
              prose-h3:text-xl prose-h3:mt-8 prose-h3:mb-4
              prose-p:text-text-secondary/90 prose-p:leading-relaxed prose-p:text-[15px]
              prose-li:text-text-secondary/90 prose-li:text-[15px]
              prose-a:text-white prose-a:underline prose-a:decoration-white/30 hover:prose-a:decoration-white transition-colors
              prose-strong:text-text-primary prose-strong:font-semibold
              prose-code:text-white prose-code:bg-white/10 prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-medium prose-code:before:content-none prose-code:after:content-none
              prose-hr:border-white/5 prose-hr:my-12
            ">
              {children}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Table of Contents) */}
        <DocsRightSidebar />

      </main>

      {/* Footer */}
      <div className="border-t border-white/5">
        <Footer />
      </div>
    </div>
  );
}

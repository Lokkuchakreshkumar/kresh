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
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)] flex flex-col font-sans selection:bg-[var(--blue-200)]">
      {/* Existing Navbar */}
      <Header />

      <main className="flex-1 flex pt-20 max-w-[1600px] w-full mx-auto relative border-t border-[var(--gray-400)]">
        
        {/* Mobile Menu Toggle */}
        <div className="lg:hidden fixed bottom-6 right-6 z-50">
          <Button 
            className="w-14 h-14 rounded-full shadow-2xl bg-[var(--primary)] text-[var(--background-100)] hover:opacity-90"
            onClick={() => setSidebarOpen(!sidebarOpen)}
          >
            {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </Button>
        </div>

        {/* Left Sidebar (Navigation) */}
        <aside 
          className={`
            fixed lg:sticky top-20 h-[calc(100vh-5rem)] w-72 shrink-0 
            border-r border-[var(--gray-400)] bg-[var(--background-100)] lg:bg-transparent
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
              prose-headings:font-semibold prose-headings:text-[var(--primary)] prose-headings:tracking-tight
              prose-h1:text-4xl md:prose-h1:text-[40px] prose-h1:leading-[48px] prose-h1:mb-6 prose-h1:tracking-[-2.4px]
              prose-h2:text-2xl md:prose-h2:text-[32px] prose-h2:leading-[40px] prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-[var(--gray-400)] prose-h2:tracking-[-1.28px]
              prose-h3:text-xl md:prose-h3:text-[24px] prose-h3:leading-[32px] prose-h3:mt-8 prose-h3:mb-4 prose-h3:tracking-[-0.96px]
              prose-p:text-[var(--gray-900)] prose-p:leading-[24px] prose-p:text-[16px] prose-p:font-normal
              prose-li:text-[var(--gray-900)] prose-li:leading-[24px] prose-li:text-[16px]
              prose-a:text-[var(--blue-700)] prose-a:no-underline hover:prose-a:underline transition-colors
              prose-strong:text-[var(--primary)] prose-strong:font-semibold
              prose-code:text-[var(--primary)] prose-code:bg-[var(--gray-100)] prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded-md prose-code:font-mono prose-code:text-[14px] prose-code:before:content-none prose-code:after:content-none
              prose-hr:border-[var(--gray-400)] prose-hr:my-12
            ">
              {children}
            </div>
          </div>
        </div>

        {/* Right Sidebar (Table of Contents) */}
        <DocsRightSidebar />

      </main>

      {/* Footer */}
      <div className="border-t border-[var(--gray-400)] bg-[var(--background-200)]">
        <Footer />
      </div>
    </div>
  );
}

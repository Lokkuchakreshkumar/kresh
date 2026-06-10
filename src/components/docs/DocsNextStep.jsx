import React from 'react';
import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';

export function DocsNextStep({ title = "What's next?", description, href, buttonText }) {
  return (
    <div className="bg-[#1a0f2e]/40 border border-[#4c1d95]/50 rounded-2xl p-6 md:p-8 my-10 not-prose flex flex-col md:flex-row md:items-center justify-between gap-6 relative overflow-hidden">
      {/* Decorative gradient blob */}
      <div className="absolute -left-20 -top-20 w-40 h-40 bg-purple-600/20 blur-[60px] rounded-full pointer-events-none" />
      
      <div className="flex items-center gap-5 relative z-10">
        <div className="w-14 h-14 shrink-0 rounded-2xl bg-purple-900/40 border border-purple-500/30 flex items-center justify-center">
          <Rocket className="w-6 h-6 text-purple-400" />
        </div>
        <div>
          <h3 className="text-xl font-bold text-white mb-1">{title}</h3>
          <p className="text-text-secondary m-0">{description}</p>
        </div>
      </div>

      <Link 
        href={href}
        className="relative z-10 shrink-0 inline-flex items-center justify-center h-12 px-6 rounded-xl bg-white text-black font-semibold hover:bg-white/90 transition-colors"
      >
        {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}

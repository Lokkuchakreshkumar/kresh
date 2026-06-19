import React from 'react';
import Link from 'next/link';
import { ArrowRight, Rocket } from 'lucide-react';

export function DocsNextStep({ title = "What's next?", description, href, buttonText }) {
  return (
    <div className="bg-geist-bg-100 border border-geist-gray-200 rounded-[12px] p-6 md:p-8 my-10 not-prose flex flex-col md:flex-row md:items-center justify-between gap-6 hover:shadow-[0_4px_8px_-4px_rgba(0,0,0,0.04),0_16px_24px_-8px_rgba(0,0,0,0.06)] transition-shadow">
      <div className="flex items-center gap-5 relative z-10">
        <div className="w-14 h-14 shrink-0 rounded-[12px] bg-geist-gray-100 border border-geist-gray-200 flex items-center justify-center">
          <Rocket className="w-6 h-6 text-geist-gray-1000" />
        </div>
        <div>
          <h3 className="text-[20px] leading-[26px] tracking-[-0.4px] font-semibold text-geist-gray-1000 mb-1">{title}</h3>
          <p className="text-[14px] leading-[20px] text-geist-gray-900 m-0">{description}</p>
        </div>
      </div>

      <Link 
        href={href}
        className="relative z-10 shrink-0 inline-flex items-center justify-center h-[40px] px-[16px] rounded-[6px] bg-geist-gray-1000 text-geist-bg-100 font-medium text-[14px] leading-[20px] hover:opacity-90 transition-opacity"
      >
        {buttonText} <ArrowRight className="w-4 h-4 ml-2" />
      </Link>
    </div>
  );
}

import React from 'react';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

export function DocsPagination({ prev, next }) {
  if (!prev && !next) return null;

  return (
    <div className="flex items-center justify-between border-t border-[var(--gray-400)] pt-8 mt-12 not-prose">
      {prev ? (
        <Link 
          href={prev.href} 
          className="group flex flex-col items-start gap-1 p-4 rounded-xl hover:bg-[var(--gray-100)] transition-colors max-w-[50%]"
        >
          <span className="text-xs text-[var(--gray-700)] flex items-center gap-1 uppercase tracking-wider font-semibold">
            <ArrowLeft className="w-3 h-3 group-hover:-translate-x-1 transition-transform" /> Previous
          </span>
          <span className="text-[var(--primary)] font-medium">{prev.name}</span>
        </Link>
      ) : <div />}

      {next ? (
        <Link 
          href={next.href} 
          className="group flex flex-col items-end gap-1 p-4 rounded-xl hover:bg-[var(--gray-100)] transition-colors max-w-[50%] text-right"
        >
          <span className="text-xs text-[var(--gray-700)] flex items-center gap-1 uppercase tracking-wider font-semibold">
            Next <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
          </span>
          <span className="text-[var(--primary)] font-medium">{next.name}</span>
        </Link>
      ) : <div />}
    </div>
  );
}

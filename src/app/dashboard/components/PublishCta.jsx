import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';

export function PublishCta() {
  return (
    <Glass className="border-white/10 bg-white/[0.02] p-6">
      <div className="font-mono text-xs text-text-secondary">$ kresh publish</div>
      <h2 className="mt-4 text-xl font-bold text-text-primary">Publish a skill</h2>
      <p className="mt-2 text-sm leading-6 text-text-secondary">
        Create a versioned skill from a real `SKILL.md`. Upload the markdown file or write it in the browser.
      </p>
      <Link href="/dashboard/publish" className="mt-6 block">
        <Button className="w-full rounded-lg">Open publish flow</Button>
      </Link>
    </Glass>
  );
}

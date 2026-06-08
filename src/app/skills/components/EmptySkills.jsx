import React from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';

export function EmptySkills() {
  return (
    <Glass className="flex flex-col items-center justify-center border-white/10 bg-white/[0.01] p-12 text-center">
      <div className="mb-4 font-mono text-xs text-text-secondary">$ kresh install</div>
      <h2 className="text-xl font-bold text-text-primary">No public skills yet</h2>
      <p className="mt-2 max-w-md text-sm leading-6 text-text-secondary">
        The platform registry is ready. Publish the first installable `SKILL.md` and it will appear here.
      </p>
      <Link href="/dashboard/publish" className="mt-6">
        <Button className="rounded-lg">Publish a skill</Button>
      </Link>
    </Glass>
  );
}

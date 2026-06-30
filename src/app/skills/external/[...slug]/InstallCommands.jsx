'use client';

import { useState } from 'react';
import { Copy, Check } from 'lucide-react';

function CopyLine({ command, label }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(command);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch (error) {
      console.error('Failed to copy install command:', error);
    }
  }
  return (
    <div>
      <p className="mb-2 text-xs font-semibold uppercase text-[var(--gray-700)]">{label}</p>
      <button type="button" onClick={copy} className="flex w-full items-center justify-between gap-3 rounded border border-[var(--gray-400)] bg-[var(--gray-100)] px-4 py-3 text-left font-mono text-sm">
        <span className="truncate">$ {command}</span>{copied ? <Check className="h-4 w-4" /> : <Copy className="h-4 w-4" />}
      </button>
    </div>
  );
}

export function InstallCommands({ kreshSlug }) {
  return <CopyLine label="Install with Kresh" command={`kresh install ${kreshSlug}`} />;
}

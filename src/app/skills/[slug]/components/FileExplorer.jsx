import React from 'react';
import Link from 'next/link';
import { FileText, GitCommit } from 'lucide-react';

/**
 * Formats a timestamp into a human-readable relative time string.
 *
 * @param {string} dateString
 * @returns {string} Relative time (e.g. "2 hours ago")
 */
function timeAgo(dateString) {
  try {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now - date) / 1000);
    
    if (seconds < 60) return 'just now';
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}h ago`;
    const days = Math.floor(hours / 24);
    if (days < 30) return `${days}d ago`;
    return date.toLocaleDateString();
  } catch (e) {
    return 'recently';
  }
}

/**
 * FileExplorer Component
 * Displays the published files inside the selected skill version.
 */
export function FileExplorer({ files, ownerUsername, latestVersion, publishedAt }) {
  const commitMessage = latestVersion?.changelog || `Publish version v${latestVersion?.version || '1.0.0'}`;
  const commitHash = latestVersion?.checksum ? latestVersion.checksum.substring(0, 7) : 'initial';

  return (
    <div className="overflow-hidden rounded-lg glass text-sm">
      {/* File Explorer Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-color bg-white/[0.02] px-4 py-3 text-xs text-text-secondary">
        <div className="flex items-center gap-2">
          <Link href={`/@${ownerUsername || 'unknown'}`} className="flex items-center gap-2 hover:opacity-85 transition-opacity shrink-0">
            {/* User Avatar Circle */}
            <div className="flex h-5 w-5 items-center justify-center rounded-full bg-kresh-green/10 text-[10px] font-bold text-kresh-green uppercase">
              {ownerUsername ? ownerUsername.charAt(0) : 'U'}
            </div>
            <span className="font-semibold text-text-primary">@{ownerUsername || 'unknown'}</span>
          </Link>
          <span className="text-text-secondary/30 select-none">|</span>
          <span className="truncate text-text-secondary/85 max-w-[240px] md:max-w-[400px]" title={commitMessage}>
            {commitMessage}
          </span>
        </div>
        <div className="flex items-center gap-3 font-mono shrink-0">
          <span className="flex items-center gap-1 text-[10px] text-text-secondary/70">
            <GitCommit className="w-3.5 h-3.5 text-text-secondary/50" />
            {commitHash}
          </span>
          <span>{timeAgo(publishedAt)}</span>
        </div>
      </div>

      {/* File List Rows */}
      <div className="divide-y divide-white/5">
        {files && files.length > 0 ? (
          files.map((file) => (
            <div
              key={file.id}
              className="flex items-center justify-between px-4 py-3 hover:bg-white/[0.02] transition-colors duration-150"
            >
              <div className="flex items-center gap-3 min-w-0">
                <FileText className="w-4 h-4 text-text-secondary shrink-0" />
                <span className="font-mono text-xs text-text-primary truncate">{file.path}</span>
              </div>
              <div className="hidden md:block flex-1 px-8 text-xs text-text-secondary/70 truncate text-left">
                {commitMessage}
              </div>
              <div className="text-[11px] text-text-secondary/80 shrink-0 font-mono">
                {timeAgo(publishedAt)}
              </div>
            </div>
          ))
        ) : (
          <div className="px-4 py-6 text-center text-xs text-text-secondary">
            No files found in this version.
          </div>
        )}
      </div>
    </div>
  );
}

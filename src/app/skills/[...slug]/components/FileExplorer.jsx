'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { FileText, GitCommit, Folder, ChevronRight, ChevronDown, Image as ImageIcon, Code, ArrowLeft } from 'lucide-react';

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

function buildTree(files) {
  const root = { name: 'root', type: 'folder', children: {}, path: '' };
  files.forEach(file => {
    const parts = file.path.split('/');
    let current = root;
    parts.forEach((part, index) => {
      if (!current.children[part]) {
        current.children[part] = {
          name: part,
          type: index === parts.length - 1 ? 'file' : 'folder',
          children: {},
          path: parts.slice(0, index + 1).join('/'),
          file: index === parts.length - 1 ? file : null
        };
      }
      current = current.children[part];
    });
  });
  return root;
}

function TreeNode({ node, level, onSelect, selectedPath }) {
  const [isOpen, setIsOpen] = useState(true);
  const isSelected = selectedPath === node.path;

  if (node.type === 'file') {
    const isImage = node.file.fileType === 'image';
    return (
      <div 
        className={`flex items-center gap-2 py-1.5 px-2 cursor-pointer rounded-md transition-colors ${isSelected ? 'bg-white/10 text-white' : 'hover:bg-white/5 text-text-secondary hover:text-text-primary'}`}
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => onSelect(node.file)}
      >
        {isImage ? <ImageIcon className="w-3.5 h-3.5 text-blue-400" /> : <Code className="w-3.5 h-3.5 text-kresh-green" />}
        <span className="text-xs font-mono truncate">{node.name}</span>
      </div>
    );
  }

  return (
    <div>
      <div 
        className="flex items-center gap-1.5 py-1.5 px-2 cursor-pointer hover:bg-white/5 rounded-md text-text-secondary hover:text-text-primary transition-colors"
        style={{ paddingLeft: `${level * 12 + 8}px` }}
        onClick={() => setIsOpen(!isOpen)}
      >
        {isOpen ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
        <Folder className="w-3.5 h-3.5 text-yellow-500/80" />
        <span className="text-xs font-mono truncate">{node.name}</span>
      </div>
      {isOpen && (
        <div>
          {Object.values(node.children).sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
          }).map(child => (
            <TreeNode key={child.path} node={child} level={level + 1} onSelect={onSelect} selectedPath={selectedPath} />
          ))}
        </div>
      )}
    </div>
  );
}

import { getFileContentAction } from '../actions';

export function FileExplorer({ files, ownerUsername, latestVersion, publishedAt }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileContent, setFileContent] = useState(null);
  const [isLoadingContent, setIsLoadingContent] = useState(false);

  const handleFileSelect = async (file) => {
    setSelectedFile(file);
    if (file.content) {
      setFileContent(file.content);
      return;
    }
    setIsLoadingContent(true);
    setFileContent(null);
    try {
      const content = await getFileContentAction(file.id);
      setFileContent(content);
      file.content = content; // cache it
    } catch (err) {
      console.error('Failed to load file content:', err);
      setFileContent('Error loading content.');
    } finally {
      setIsLoadingContent(false);
    }
  };

  const commitMessage = latestVersion?.changelog || `Publish version v${latestVersion?.version || '1.0.0'}`;
  const commitHash = latestVersion?.checksum ? latestVersion.checksum.substring(0, 7) : 'initial';

  const tree = useMemo(() => buildTree(files || []), [files]);

  return (
    <div className="overflow-hidden rounded-lg glass text-sm flex flex-col border border-white/5 shadow-xl">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border-color bg-white/[0.02] px-4 py-3 text-xs text-text-secondary shrink-0">
        <div className="flex items-center gap-2">
          <Link href={`/@${ownerUsername || 'unknown'}`} className="flex items-center gap-2 hover:opacity-85 transition-opacity shrink-0">
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

      <div className="flex flex-col md:flex-row h-[600px] md:h-[500px] bg-background/50">
        <div className="w-full h-[200px] shrink-0 md:h-auto md:w-1/3 border-b md:border-b-0 md:border-r border-border-color overflow-y-auto p-2 bg-white/[0.01]">
          {Object.values(tree.children).sort((a, b) => {
            if (a.type === b.type) return a.name.localeCompare(b.name);
            return a.type === 'folder' ? -1 : 1;
          }).map(node => (
            <TreeNode key={node.path} node={node} level={0} onSelect={handleFileSelect} selectedPath={selectedFile?.path} />
          ))}
          {(!files || files.length === 0) && (
            <div className="p-4 text-center text-xs text-text-secondary">No files found.</div>
          )}
        </div>
        
        <div className="w-full flex-1 min-h-0 md:w-2/3 flex flex-col overflow-hidden bg-black/20">
          {selectedFile ? (
            <div className="flex flex-col h-full">
              <div className="flex items-center gap-2 px-4 py-2 border-b border-border-color bg-white/[0.02] text-xs font-mono text-text-secondary shrink-0">
                <FileText className="w-3.5 h-3.5" />
                <span className="truncate">{selectedFile.path}</span>
              </div>
              <div className="flex-1 overflow-auto p-4 relative">
                {isLoadingContent ? (
                  <div className="flex items-center justify-center min-h-full">
                    <div className="text-text-secondary text-sm animate-pulse">Loading content...</div>
                  </div>
                ) : selectedFile.fileType === 'image' ? (
                  <div className="flex items-center justify-center min-h-full">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={fileContent || ''} alt={selectedFile.path} className="max-w-full max-h-full rounded-md shadow-lg border border-white/10" />
                  </div>
                ) : (
                  <pre className="text-[11px] leading-relaxed font-mono text-text-primary whitespace-pre-wrap word-break-all">
                    <code>{fileContent}</code>
                  </pre>
                )}
              </div>
            </div>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center text-text-secondary/50 p-6 text-center">
              <Code className="w-12 h-12 mb-3 opacity-20" />
              <p className="text-sm">Select a file from the tree to view its contents.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

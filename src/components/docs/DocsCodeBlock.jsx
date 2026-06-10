"use client";

import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export function DocsCodeBlock({ code, language = "bash", tabs = [] }) {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState(tabs.length > 0 ? tabs[0] : null);

  const handleCopy = () => {
    // If we have tabs, we might have different code per tab, but for simplicity
    // we'll just copy the current `code` string or a variant if provided.
    // In a real advanced implementation, `code` would be an object mapped to tabs.
    // Here we'll just handle simple single-string codes for now, replacing 'npm' with the tab if needed.
    let textToCopy = code;
    if (activeTab && activeTab !== 'npm' && code.includes('npm')) {
      textToCopy = code.replace(/npm/g, activeTab);
    }

    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Determine the display code
  let displayCode = code;
  if (activeTab && activeTab !== 'npm' && code.includes('npm')) {
    displayCode = code.replace(/npm/g, activeTab);
  }

  return (
    <div className="bg-[#0f1115] border border-white/10 rounded-2xl overflow-hidden my-6 not-prose">
      {tabs.length > 0 && (
        <div className="flex items-center border-b border-white/10 px-4 bg-black/40">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-3 text-sm font-medium border-b-2 transition-colors
                ${activeTab === tab 
                  ? 'border-kresh-green text-kresh-green' 
                  : 'border-transparent text-text-secondary hover:text-text-primary'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex items-start justify-between p-4">
        <pre className={`language-${language} m-0 bg-transparent p-0 border-none text-sm`}>
          <code className="text-kresh-green">{displayCode}</code>
        </pre>
        
        <button 
          onClick={handleCopy}
          className="p-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 text-text-secondary hover:text-text-primary transition-colors ml-4 shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-kresh-green" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

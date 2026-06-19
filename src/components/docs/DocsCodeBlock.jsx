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
    <div className="bg-[#111111] border border-geist-gray-200 rounded-[12px] overflow-hidden my-6 not-prose">
      {tabs.length > 0 && (
        <div className="flex items-center px-4 bg-[#111111] border-b border-[#333]">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`
                px-4 py-3 text-[14px] leading-[20px] font-medium border-b-2 transition-colors -mb-[1px]
                ${activeTab === tab 
                  ? 'border-white text-white' 
                  : 'border-transparent text-[#888] hover:text-[#ccc]'
                }
              `}
            >
              {tab}
            </button>
          ))}
        </div>
      )}
      
      <div className="flex items-start justify-between p-4 bg-[#111111]">
        <pre className={`language-${language} m-0 bg-transparent p-0 border-none text-[13px] leading-[20px] font-mono`}>
          <code className="text-zinc-100">{displayCode}</code>
        </pre>
        
        <button 
          onClick={handleCopy}
          className="p-2 rounded-[6px] bg-transparent hover:bg-white/10 text-[#888] hover:text-white transition-colors ml-4 shrink-0"
        >
          {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
        </button>
      </div>
    </div>
  );
}

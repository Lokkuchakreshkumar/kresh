'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Copy, Check } from 'lucide-react';

function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className={`transition-all duration-200 p-1.5 rounded-md hover:bg-[var(--gray-200)] ${
        copied ? 'text-white' : 'text-[var(--gray-600)] hover:text-white'
      }`}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4 animate-scale-in" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

export function InteractiveDemo() {
  const [phase, setPhase] = useState('idle'); // idle -> typing-npm -> running-npm -> kresh-prompt -> typing-kresh -> running-kresh -> completed
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentTypedText, setCurrentTypedText] = useState('');
  
  const terminalBodyRef = useRef(null);

  // Auto-scroll terminal
  useEffect(() => {
    try {
      if (terminalBodyRef.current) {
        terminalBodyRef.current.scrollTop = terminalBodyRef.current.scrollHeight;
      }
    } catch (err) {
      console.error('Terminal scroll error:', err);
    }
  }, [terminalLines, currentTypedText]);

  // Animation sequence
  useEffect(() => {
    let active = true;
    let timeouts = [];

    const delay = (ms) => new Promise((resolve) => {
      const t = setTimeout(resolve, ms);
      timeouts.push(t);
    });

    const typeText = async (text, speed = 60) => {
      for (let i = 0; i <= text.length; i++) {
        if (!active) return;
        setCurrentTypedText(text.slice(0, i));
        await delay(speed + Math.random() * 20);
      }
      await delay(400);
    };

    const runSequence = async () => {
      setTerminalLines([]);
      setCurrentTypedText('');
      setPhase('idle');
      await delay(1200);

      // Typing npm install
      if (!active) return;
      setPhase('typing-npm');
      await typeText('npm i -g @chakresh/kresh', 50);

      // Running npm install
      if (!active) return;
      setPhase('running-npm');
      setTerminalLines((prev) => [...prev, { type: 'cmd', text: 'npm i -g @chakresh/kresh' }]);
      setCurrentTypedText('');
      
      await delay(400);
      setTerminalLines((prev) => [...prev, { type: 'info', text: '⠋ Fetching package metadata...' }]);
      await delay(700);
      setTerminalLines((prev) => [
        ...prev.slice(0, -1),
        { type: 'success', text: '+ @chakresh/kresh@0.1.3' },
        { type: 'success', text: 'added 94 packages in 2.3s' }
      ]);

      await delay(1500);

      // Wait for next prompt
      if (!active) return;
      setPhase('kresh-prompt');
      await delay(600);

      // Typing kresh install
      if (!active) return;
      setPhase('typing-kresh');
      await typeText('kresh install @universe/taste-redesign-skill --agy', 45);

      // Running kresh install
      if (!active) return;
      setPhase('running-kresh');
      setTerminalLines((prev) => [...prev, { type: 'cmd', text: 'kresh install @universe/taste-redesign-skill --agy' }]);
      setCurrentTypedText('');

      await delay(500);
      setTerminalLines((prev) => [...prev, { type: 'info', text: '● Fetching instruction set...' }]);
      await delay(800);
      setTerminalLines((prev) => [
        ...prev,
        { type: 'info', text: '● Resolving agent compatibility (--agy)...' }
      ]);
      await delay(800);
      setTerminalLines((prev) => [
        ...prev,
        { type: 'success', text: '✔ Successfully installed Taste-Redesign-Skill (v1.0.1) by @Universe' },
        { type: 'info', text: 'ℹ Saved to: /home/user/projects/.agents/skills/taste-redesign-skill' }
      ]);

      await delay(1000);
      if (!active) return;
      setPhase('completed');

      // Reset after a pause
      await delay(8000);
      if (active) {
        setPhase('restart');
      }
    };

    runSequence();

    return () => {
      active = false;
      timeouts.forEach(clearTimeout);
    };
  }, [phase === 'restart' ? Math.random() : null]);

  return (
    <div className="w-full flex flex-col md:flex-row items-center justify-between gap-12 lg:gap-20 py-10 selection:bg-[var(--gray-300)]">
      {/* Left Column: Typography & Install Box */}
      <div className="flex-1 text-left flex flex-col items-start max-w-xl">
        <h2 className="text-3xl md:text-[40px] font-semibold text-[var(--primary)]  leading-[1.1] mb-6">
          Run skills, anywhere.
          <br />
          <span className="text-[var(--gray-700)]">Plug into your setup anywhere.</span>
        </h2>
        
        <div className="flex items-center space-x-4 bg-[var(--background-200)] border border-[var(--gray-200)] rounded-lg px-4 py-3 w-full max-w-md group hover:border-[var(--gray-200)] transition-colors">
          <code className="text-[var(--primary)] font-mono text-sm flex-1 font-mono">
            npm i -g @chakresh/kresh
          </code>
          <CopyButton text="npm i -g @chakresh/kresh" />
        </div>
      </div>

      {/* Right Column: Canvas & Terminal */}
      <div className="flex-1 w-full flex justify-end mt-8 md:mt-0">
        <div className="relative w-full max-w-[850px] aspect-[4/5] md:aspect-[4/3] xl:aspect-[16/10] rounded-sm overflow-hidden flex items-center justify-center shadow-2xl">
          {/* Subtle Sandy/Landscape Canvas Background */}
          <div className="absolute inset-0 z-0">
            <img 
              src="/terminal_background/image.png" 
              alt="Terminal Background" 
              className="w-full h-full object-cover opacity-90"
            />
            {/* Soft overlay gradient to blend nicely with the dark terminal */}
            <div className="absolute inset-0 bg-black/10 mix-blend-multiply" />
          </div>

          {/* Floating Terminal Window */}
          <div className="relative z-10 w-[95%] bg-[var(--background-100)] rounded-[10px] border border-[var(--gray-400)] shadow-[0_30px_60px_rgba(0,0,0,0.5)] overflow-hidden flex flex-col text-left h-[94%] max-h-[550px]">
            
            {/* Terminal Header */}
            <div className="h-9 w-full flex items-center justify-between px-3 border-b border-[var(--gray-400)]">
              <div className="flex space-x-2 items-center w-16">
                <div className="w-3 h-3 rounded-full bg-[#ed6a5f]" />
                <div className="w-3 h-3 rounded-full bg-[#f4bf4f]" />
                <div className="w-3 h-3 rounded-full bg-[#61c554]" />
              </div>
              <div className="flex-1 text-center text-[var(--gray-700)] font-mono text-[11px] font-medium tracking-normal">
                Terminal
              </div>
              <div className="w-16 flex justify-end text-[var(--gray-700)] font-mono text-[10px] cursor-pointer hover:text-white transition-colors tracking-normal">
                Get Kresh
              </div>
            </div>

            {/* Terminal Body */}
            <div 
              ref={terminalBodyRef}
              className="flex-1 p-5 font-mono text-[12px] leading-[1.8] tracking-normal text-[var(--primary)] font-mono overflow-y-auto"
            >
              <div className="space-y-1">
                {terminalLines.map((line, i) => (
                  <div key={i}>
                    {line.type === 'cmd' && (
                      <div className="flex items-start space-x-2">
                        <span className="text-[#61c554] shrink-0">~ $</span>
                        <span className="text-white">{line.text}</span>
                      </div>
                    )}
                    {line.type === 'info' && (
                      <div className="text-[var(--gray-700)] py-0.5">{line.text}</div>
                    )}
                    {line.type === 'success' && (
                      <div className="text-[#61c554] py-0.5">{line.text}</div>
                    )}
                  </div>
                ))}
              </div>

              {/* Input typing line */}
              {(phase === 'typing-npm' || phase === 'typing-kresh') && (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[#61c554] shrink-0">~ $</span>
                  <span className="text-white">{currentTypedText}</span>
                  <span className="w-1.5 h-3.5 bg-white/40 animate-pulse inline-block ml-0.5" />
                </div>
              )}

              {/* Idle waiting line */}
              {(phase === 'idle' || phase === 'kresh-prompt' || phase === 'completed') && (
                <div className="flex items-center space-x-2 mt-1">
                  <span className="text-[#61c554] shrink-0">~ $</span>
                  <span className="w-1.5 h-3.5 bg-white/40 animate-pulse inline-block ml-0.5" />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

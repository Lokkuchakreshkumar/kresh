'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Glass } from './Glass';
import { Button } from './Button';
import {
  Terminal as TerminalIcon,
  Folder,
  FolderOpen,
  FileCode,
  Check,
  ChevronDown,
  ChevronRight,
  Settings,
  Search,
  GitBranch,
  X,
  RotateCcw,
  Play
} from 'lucide-react';

export function InteractiveDemo() {
  const [phase, setPhase] = useState('idle'); // idle -> typing-npm -> running-npm -> kresh-prompt -> typing-kresh -> running-kresh -> vscode-reveal -> completed
  const [terminalLines, setTerminalLines] = useState([]);
  const [currentTypedText, setCurrentTypedText] = useState('');
  const [activeTab, setActiveTab] = useState('README.md');
  const [skillsExpanded, setSkillsExpanded] = useState(true);
  const [chakreshExpanded, setChakreshExpanded] = useState(false);
  const [showAndrejFolder, setShowAndrejFolder] = useState(false);
  const [vscodePulse, setVscodePulse] = useState(false);
  
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

  // Animation state machine
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
        await delay(speed + Math.random() * 30);
      }
      await delay(400);
    };

    const runSequence = async () => {
      // 1. Reset
      setTerminalLines([]);
      setCurrentTypedText('');
      setActiveTab('README.md');
      setChakreshExpanded(false);
      setShowAndrejFolder(false);
      setVscodePulse(false);
      setPhase('idle');
      
      await delay(1200);

      // 2. Typing npm install
      if (!active) return;
      setPhase('typing-npm');
      await typeText('npm i -g @chakresh/kresh');

      // 3. Running npm install
      if (!active) return;
      setPhase('running-npm');
      setTerminalLines((prev) => [...prev, { type: 'cmd', text: 'npm i -g @chakresh/kresh' }]);
      setCurrentTypedText('');
      
      await delay(400);
      setTerminalLines((prev) => [...prev, { type: 'info', text: '⠋ Fetching package metadata...' }]);
      await delay(700);
      setTerminalLines((prev) => [
        ...prev.slice(0, -1),
        { type: 'info', text: '⠙ Resolving dependency trees...' }
      ]);
      await delay(500);
      setTerminalLines((prev) => [
        ...prev.slice(0, -1),
        { type: 'success', text: '+ @chakresh/kresh@0.1.3' },
        { type: 'success', text: 'added 94 packages in 2.3s' }
      ]);

      await delay(1500);

      // 4. Kresh prompt
      if (!active) return;
      setPhase('kresh-prompt');
      await delay(600);

      // 5. Typing kresh install
      if (!active) return;
      setPhase('typing-kresh');
      await typeText('kresh i @Chakresh/12-principles-of-animation-c4bfa1', 50);

      // 6. Running kresh install
      if (!active) return;
      setPhase('running-kresh');
      setTerminalLines((prev) => [...prev, { type: 'cmd', text: 'kresh i @Chakresh/12-principles-of-animation-c4bfa1' }]);
      setCurrentTypedText('');

      await delay(500);
      setTerminalLines((prev) => [...prev, { type: 'info', text: '⠋ Resolving skill "@Chakresh/12-principles-of-animation-c4bfa1" from registry...' }]);
      await delay(900);
      setTerminalLines((prev) => [
        ...prev.slice(0, -1),
        { type: 'info', text: '⠙ Writing files to local directory...' }
      ]);
      await delay(800);
      setTerminalLines((prev) => [
        ...prev.slice(0, -1),
        { type: 'success', text: '✔ Successfully installed 12 Principles of Animation (v1.0.0) by @Chakresh' },
        { type: 'success', text: 'ℹ Saved to: ./skills/12-principles-of-animation-c4bfa1' }
      ]);

      await delay(800);

      // 7. VS Code Reveal
      if (!active) return;
      setPhase('vscode-reveal');
      setVscodePulse(true);
      await delay(300);
      setChakreshExpanded(true);
      await delay(500);
      setShowAndrejFolder(true);
      await delay(500);
      setActiveTab('SKILL.md');
      
      await delay(1200);
      setVscodePulse(false);
      setPhase('completed');

      // Wait 7 seconds and auto-replay
      await delay(7000);
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

  const handleRestart = () => {
    setPhase('restart');
  };

  const currentTabContent = activeTab === 'README.md' ? (
    <div className="font-mono text-xs sm:text-sm text-zinc-400 leading-relaxed select-none animate-fade-in iosevka-charon-medium">
      <div className="text-zinc-500 font-bold mb-4">// Welcome to Kresh Workspace</div>
      <div><span className="text-kresh-green font-bold"># Kresh Workspace</span></div>
      <div className="mt-2 text-zinc-400">Kresh packages are modular, reusable instruction sets called &quot;skills&quot;.</div>
      <div className="mt-2 text-zinc-400">Use the terminal on the right to install and publish skills.</div>
      <div className="mt-4 text-zinc-400">Example skills will appear in the <span className="text-kresh-green font-bold">skills/</span> folder once downloaded.</div>
    </div>
  ) : (
    <div className="font-mono text-xs sm:text-sm leading-relaxed animate-squash-in iosevka-charon-medium">
      <div className="text-zinc-500 font-bold mb-3">// File: skills/12-principles-of-animation-c4bfa1/SKILL.md</div>
      <div><span className="text-kresh-green font-bold"># 12 Principles of Animation</span></div>
      <div className="mt-2"><span className="text-zinc-300 font-semibold">## Purpose</span></div>
      <div className="text-zinc-400">Improve UI design with fluid motion standards and micro-animations.</div>
      <div className="mt-4"><span className="text-zinc-300 font-semibold">## Design Rules</span></div>
      <div className="text-zinc-400">1. **Squash and Stretch**: Provide elastic responses on trigger states.</div>
      <div className="text-zinc-400">2. **Anticipation**: Brief reverse animations before action starts.</div>
      <div className="text-zinc-400">3. **Slow In and Slow Out**: Use custom bezier motion transitions.</div>
    </div>
  );

  return (
    <div className="w-full flex flex-col items-center select-none relative">
      {/* Background Kresh Green Glow */}
      <div className="absolute -top-12 -left-12 w-64 h-64 bg-kresh-green/5 rounded-full blur-[100px] pointer-events-none" />
      <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-kresh-green/5 rounded-full blur-[100px] pointer-events-none" />

      {/* Custom styles mapping 12 principles */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes squash-in {
          0% { transform: scale(0.92, 1.15) translateY(12px); opacity: 0; }
          60% { transform: scale(1.04, 0.96); }
          80% { transform: scale(0.99, 1.01); }
          100% { transform: scale(1) translateY(0); opacity: 1; }
        }
        @keyframes folder-pop {
          0% { transform: scale(0.85); opacity: 0; filter: brightness(1.8); }
          60% { transform: scale(1.1); filter: brightness(1.2); }
          100% { transform: scale(1); opacity: 1; filter: brightness(1); }
        }
        .animate-squash-in {
          animation: squash-in 0.6s cubic-bezier(0.25, 1.4, 0.5, 1) forwards;
        }
        .animate-folder-pop {
          animation: folder-pop 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
      `}} />

      <div className="w-full flex flex-col mb-8 px-4 sm:px-0 z-10">
        <h2 className="text-3xl sm:text-4xl schibsted-grotesk-hero text-text-primary mt-1">
          Install and Manage Skills
        </h2>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 w-full px-4 sm:px-0 mb-16 z-10">
        {/* LEFT PANEL: VS CODE MOCKUP (lg:col-span-7) */}
        <div 
          className={`lg:col-span-7 rounded-xl border bg-[#0d0e12] overflow-hidden flex flex-col h-[580px] shadow-2xl relative transition-all duration-500 ${
            vscodePulse 
              ? 'border-kresh-green/60 shadow-[0_0_35px_rgba(46,204,113,0.15)] ring-1 ring-kresh-green/30' 
              : 'border-white/10'
          }`}
        >
          {/* Header Bar */}
          <div className="h-10 border-b border-white/10 bg-[#08090c] flex items-center px-4 justify-between select-none">
            <div className="flex space-x-1.5 items-center">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-600" />
              <div className="w-2.5 h-2.5 rounded-full bg-kresh-green/50" />
            </div>
            <div className="text-xs text-zinc-400 font-mono font-medium truncate max-w-[200px] sm:max-w-none iosevka-charon-regular">
              workspace — VS Code
            </div>
            <div className="w-12" />
          </div>

          <div className="flex-1 flex overflow-hidden">
            {/* Sidebar File Explorer */}
            <div className="w-48 sm:w-56 border-r border-white/5 bg-[#090a0d] flex flex-col font-sans select-none overflow-y-auto">
              <div className="p-3 text-[10px] uppercase font-bold text-kresh-green tracking-wider iosevka-charon-bold">
                Explorer
              </div>
              
              <div className="flex-1 px-2 space-y-1">
                {/* Src Directory */}
                <div>
                  <div className="flex items-center space-x-1.5 py-1 px-1.5 rounded text-xs text-zinc-400 hover:bg-white/5 cursor-pointer">
                    <ChevronRight className="w-3.5 h-3.5 text-zinc-600" />
                    <Folder className="w-4 h-4 text-zinc-500" />
                    <span className="font-medium">src</span>
                  </div>
                </div>

                {/* Skills Directory */}
                <div>
                  <div 
                    onClick={() => setSkillsExpanded(!skillsExpanded)}
                    className="flex items-center space-x-1.5 py-1 px-1.5 rounded text-xs text-white hover:bg-white/5 cursor-pointer"
                  >
                    {skillsExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-400" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-400" />}
                    {skillsExpanded ? <FolderOpen className="w-4 h-4 text-kresh-green" /> : <Folder className="w-4 h-4 text-kresh-green" />}
                    <span className="font-semibold">skills</span>
                  </div>

                  {skillsExpanded && (
                    <div className="pl-4 border-l border-white/5 ml-2.5 mt-1 space-y-1">
                      {/* Empty Placeholder before installation */}
                      {!showAndrejFolder && (
                        <div className="text-[10px] text-zinc-500 font-mono py-1 px-1.5 italic iosevka-charon-regular">
                          (No skills installed)
                        </div>
                      )}

                      {/* Skill subdirectory directly under skills/ */}
                      {showAndrejFolder && (
                        <div className="animate-folder-pop">
                          <div 
                            onClick={() => setChakreshExpanded(!chakreshExpanded)}
                            className="flex items-center space-x-1.5 py-1 px-1.5 rounded text-xs text-zinc-300 hover:bg-white/5 cursor-pointer"
                          >
                            {chakreshExpanded ? <ChevronDown className="w-3.5 h-3.5 text-zinc-500" /> : <ChevronRight className="w-3.5 h-3.5 text-zinc-500" />}
                            {chakreshExpanded ? <FolderOpen className="w-4 h-4 text-kresh-green/80" /> : <Folder className="w-4 h-4 text-kresh-green/80" />}
                            <span className="text-white font-semibold truncate text-[11px] font-mono iosevka-charon-regular">
                              12-principles-of-animation-c4bfa1
                            </span>
                          </div>

                          {/* SKILL.md file */}
                          {chakreshExpanded && (
                            <div className="pl-4 border-l border-white/5 ml-2.5 mt-1 space-y-1">
                              <div 
                                onClick={() => setActiveTab('SKILL.md')}
                                className={`flex items-center space-x-1.5 py-1 pl-2 pr-1.5 rounded text-xs cursor-pointer font-mono ${
                                  activeTab === 'SKILL.md' 
                                    ? 'bg-kresh-green/10 text-kresh-green font-bold shadow-[inset_2px_0_0_#2ecc71]' 
                                    : 'text-zinc-400 hover:bg-white/5'
                                }`}
                              >
                                <FileCode className="w-3.5 h-3.5 text-kresh-green/90" />
                                <span className="iosevka-charon-bold">SKILL.md</span>
                              </div>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  )}
                </div>

                {/* Other Static Files */}
                <div 
                  onClick={() => setActiveTab('README.md')}
                  className={`flex items-center space-x-1.5 py-1 px-2 rounded text-xs cursor-pointer ${
                    activeTab === 'README.md'
                      ? 'bg-kresh-green/10 text-kresh-green font-bold'
                      : 'text-zinc-400 hover:bg-white/5'
                  }`}
                >
                  <FileCode className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono iosevka-charon-regular">README.md</span>
                </div>
                
                <div className="flex items-center space-x-1.5 py-1 px-2 rounded text-xs text-zinc-400 hover:bg-white/5 cursor-pointer">
                  <FileCode className="w-4 h-4 text-zinc-500" />
                  <span className="font-mono iosevka-charon-regular">package.json</span>
                </div>
              </div>

              {/* Sidebar Footer Settings */}
              <div className="p-3 border-t border-white/5 flex items-center justify-between text-zinc-500 font-mono text-[10px] iosevka-charon-regular">
                <Settings className="w-4 h-4 hover:text-white cursor-pointer transition-colors" />
                <span>kresh workspace</span>
              </div>
            </div>

            {/* Editor Area */}
            <div className="flex-1 flex flex-col bg-[#0d0e12] overflow-hidden">
              {/* Tab Header */}
              <div className="h-9 border-b border-white/10 bg-[#08090c] flex items-center px-2">
                <div 
                  onClick={() => setActiveTab('README.md')}
                  className={`flex items-center space-x-1.5 h-full px-4 border-r border-white/5 text-xs font-mono cursor-pointer transition-colors iosevka-charon-regular ${
                    activeTab === 'README.md' 
                      ? 'bg-[#0d0e12] text-kresh-green border-t border-t-kresh-green/50' 
                      : 'bg-transparent text-zinc-500 hover:text-white'
                  }`}
                >
                  <span>README.md</span>
                </div>
                {showAndrejFolder && (
                  <div 
                    onClick={() => setActiveTab('SKILL.md')}
                    className={`flex items-center space-x-1.5 h-full px-4 border-r border-white/5 text-xs font-mono cursor-pointer transition-colors animate-folder-pop iosevka-charon-regular ${
                      activeTab === 'SKILL.md' 
                        ? 'bg-[#0d0e12] text-kresh-green border-t border-t-kresh-green/50' 
                        : 'bg-transparent text-zinc-500 hover:text-white'
                    }`}
                  >
                    <span>SKILL.md</span>
                  </div>
                )}
              </div>

              {/* Editor Workspace */}
              <div className="flex-1 p-5 overflow-auto">
                {currentTabContent}
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL: TERMINAL MOCKUP (lg:col-span-5) */}
        <div className="lg:col-span-5 rounded-xl border border-white/10 bg-[#0c0d12] overflow-hidden flex flex-col h-[580px] shadow-2xl relative">
          {/* Header Bar */}
          <div className="h-10 border-b border-white/10 bg-[#08090c] flex items-center px-4 justify-between">
            <div className="flex items-center space-x-2">
              <TerminalIcon className="w-4 h-4 text-kresh-green" />
              <span className="text-xs text-zinc-300 font-mono font-semibold iosevka-charon-regular">Terminal (bash)</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2.5 h-2.5 rounded-full bg-zinc-700 hover:bg-zinc-600 cursor-pointer" />
              <X className="w-3.5 h-3.5 text-zinc-500 hover:text-white cursor-pointer" />
            </div>
          </div>

          <div 
            ref={terminalBodyRef} 
            className="flex-1 p-4 font-mono text-[13px] sm:text-sm text-zinc-300 overflow-y-auto space-y-2 select-text iosevka-charon-medium selection:bg-kresh-green/20"
          >
            {terminalLines.map((line, i) => (
              <div key={i}>
                {line.type === 'cmd' && (
                  <div className="flex items-start space-x-2">
                    <span className="text-kresh-green shrink-0">~/projects/Kresh $</span>
                    <span className="text-white font-bold leading-relaxed">{line.text}</span>
                  </div>
                )}
                {line.type === 'info' && (
                  <div className="text-zinc-500 ml-4 py-0.5 leading-relaxed">{line.text}</div>
                )}
                {line.type === 'success' && (
                  <div className="text-kresh-green font-bold ml-4 py-0.5 leading-relaxed">{line.text}</div>
                )}
              </div>
            ))}

            {/* Input typing line */}
            {(phase === 'typing-npm' || phase === 'typing-kresh') && (
              <div className="flex items-center space-x-2">
                <span className="text-kresh-green shrink-0">~/projects/Kresh $</span>
                <span className="text-white font-bold">{currentTypedText}</span>
                <span className="w-1.5 h-3.5 bg-kresh-green animate-pulse inline-block" />
              </div>
            )}

            {/* Idle waiting line */}
            {(phase === 'idle' || phase === 'kresh-prompt') && (
              <div className="flex items-center space-x-2">
                <span className="text-kresh-green shrink-0">~/projects/Kresh $</span>
                <span className="w-1.5 h-3.5 bg-kresh-green animate-pulse inline-block" />
              </div>
            )}
          </div>

          {/* Floating Phase Indicator Badge */}
          <div className="absolute bottom-4 right-4 bg-white/5 border border-white/5 rounded-full px-3 py-1 flex items-center space-x-2 pointer-events-none select-none">
            <span className="w-1.5 h-1.5 rounded-full bg-kresh-green animate-pulse" />
            <span className="text-[10px] text-kresh-green font-mono capitalize iosevka-charon-regular">{phase.replace('-', ' ')}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

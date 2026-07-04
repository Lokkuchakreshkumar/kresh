"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import BlurText from '@/components/ui/BlurText';
import { TextRotator } from '@/components/ui/TextRotator';
import { CircleStack } from '@/components/ui/CircleStack';
import { InteractiveDemo } from '@/components/ui/InteractiveDemo';
import MagicBento from '@/components/ui/MagicBento';
import { Footer } from '@/components/layout/Footer';
import { Copy, Check, ChevronRight } from 'lucide-react';



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
      className={`transition-all duration-150 p-1.5 rounded-[6px] hover:bg-[var(--gray-100)] ${copied ? 'text-[var(--blue-700)]' : 'text-[var(--gray-700)] hover:text-[var(--primary)]'
        }`}
      aria-label="Copy to clipboard"
    >
      {copied ? (
        <Check className="w-4 h-4" />
      ) : (
        <Copy className="w-4 h-4" />
      )}
    </button>
  );
}

function PromptCopyBox({ promptText }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(promptText);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  return (
    <div
      onClick={handleCopy}
      className="w-full rounded-[6px] border border-[var(--gray-400)] bg-[var(--background-100)] shadow-card transition-all duration-150 cursor-pointer hover:border-[var(--gray-600)] hover:bg-[var(--gray-100)] select-none"
    >
      <div className="p-4 flex items-center justify-between group w-full min-w-0 gap-3">
        <div className="flex items-center gap-3 font-mono text-sm sm:text-base min-w-0">
          <span className="text-[var(--primary)] font-semibold truncate">
            {copied ? "Prompt copied!" : "Copy prompt for AI Agent"}
          </span>
        </div>
        <button
          type="button"
          className={`transition-all duration-150 p-1.5 rounded-[6px] ${copied ? 'text-[var(--blue-700)]' : 'text-[var(--gray-700)] group-hover:text-[var(--primary)]'
            }`}
          aria-label="Copy prompt"
        >
          {copied ? (
            <Check className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4 group-hover:scale-110 transition-transform" />
          )}
        </button>
      </div>
    </div>
  );
}

export default function Home() {
  const [session, setSession] = useState(null);
  const [mode, setMode] = useState('human');
  const [scrollImages, setScrollImages] = useState([
    { src: '/scroll/chatgpt_logo.png', name: 'ChatGPT' },
    { src: '/scroll/claude_logo.png', name: 'Claude' },
    { src: '/scroll/cursor_logo.png', name: 'Cursor' },
    { src: '/scroll/gemini_logo.png', name: 'Gemini' },
    { src: '/scroll/kimi_logo.png', name: 'Kimi' },
  ]);

  useEffect(() => {
    import('@/app/(auth)/actions').then(m => {
      m.getSessionAction().then(setSession);
    });
  }, []);

  useEffect(() => {
    try {
      fetch('/api/scroll-logos')
        .then(res => res.json())
        .then((data) => {
          if (data && Array.isArray(data) && data.length > 0) {
            setScrollImages(data);
          }
        })
        .catch((err) => {
          console.error("Failed to load scroll images from API:", err);
        });
    } catch (err) {
      console.error("Error fetching scroll images:", err);
    }
  }, []);

  return (
    <div className="min-h-screen bg-[var(--background-100)] text-[var(--primary)]">
      <Header />

      <main className="pb-16">
        {/* HERO SECTION */}
        <section className="relative w-full overflow-hidden mb-32 flex flex-col items-center justify-center min-h-screen pt-[120px] pb-[70px] border-b border-[var(--gray-200)]">


          <div className="relative z-20 max-w-6xl mx-auto px-6 text-center flex flex-col items-center w-full">
            {/* Premium Release Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-[var(--gray-200)] bg-[var(--background-200)] text-[12px] text-[var(--gray-900)] font-medium mb-6 select-none">
              <span className="w-1.5 h-1.5 rounded-full bg-[var(--blue-700)] animate-pulse" />
              <span>Kresh v0.1.3 is now public</span>
            </div>

            {/* Toggle Switcher */}
            <div className="flex p-0.5 rounded-[8px] bg-[var(--gray-200)] border border-[var(--gray-300)] max-w-[200px] w-full mx-auto mb-8 relative">
              <button
                type="button"
                onClick={() => setMode('human')}
                className={`flex-1 py-1.5 px-4 rounded-[6px] text-xs font-semibold uppercase transition-all duration-200 relative z-10 ${mode === 'human' ? 'text-[var(--background-100)]' : 'text-[var(--gray-700)] hover:text-[var(--primary)]'
                  }`}
              >
                Human
              </button>
              <button
                type="button"
                onClick={() => setMode('ai')}
                className={`flex-1 py-1.5 px-4 rounded-[6px] text-xs font-semibold uppercase transition-all duration-200 relative z-10 ${mode === 'ai' ? 'text-[var(--background-100)]' : 'text-[var(--gray-700)] hover:text-[var(--primary)]'
                  }`}
              >
                AI
              </button>
              {/* Active sliding background indicator */}
              <div
                className="absolute top-0.5 bottom-0.5 rounded-[6px] bg-[var(--primary)] transition-all duration-300 ease-out shadow-sm"
                style={{
                  left: mode === 'human' ? '2px' : 'calc(50% + 1px)',
                  width: 'calc(50% - 3px)'
                }}
              />
            </div>

            <h1 className="text-[var(--primary)] mb-8 flex flex-wrap justify-center items-center text-center max-w-4xl font-bold w-full text-5xl sm:text-7xl leading-[1.1] tracking-tight">
              <span>Install </span>
              <TextRotator
                words={['Intelligence.', 'Skills.', 'agent.md.', 'Design.md.', 'Loops.']}
                className="text-[var(--gray-700)]"
              />
            </h1>

            <p className="text-[16px] sm:text-[20px] text-[var(--gray-700)] font-medium max-w-xl leading-relaxed mb-10 mx-auto">
              AI Knows More With Kresh.
            </p>

            {mode === 'human' ? (
              <div className="relative w-full max-w-sm mb-8 mx-auto transition-all duration-300">
                <div className="w-full rounded-[6px] border border-[var(--gray-400)] bg-[var(--background-100)] shadow-card transition-colors duration-150">
                  <div className="p-4 flex items-center justify-between group cursor-text w-full min-w-0 gap-3">
                    <div className="flex items-center gap-3 font-mono text-base min-w-0">
                      <span className="text-[var(--gray-700)] shrink-0">$</span>
                      <span className="text-[var(--primary)] font-semibold truncate">npm i -g @chakresh/kresh</span>
                    </div>
                    <CopyButton text="npm i -g @chakresh/kresh" />
                  </div>
                </div>
              </div>
            ) : (
              <div className="relative w-full max-w-sm mb-8 mx-auto transition-all duration-300">
                <PromptCopyBox promptText="Install the Kresh CLI: npm i -g @chakresh/kresh. Then run kresh install @chakresh/kresh to pull in the Kresh skill — a registry of reusable skills, AGENTS.md/CLAUDE.md configs, design.md docs, and loops built for AI agents. Read the installed SKILL.md fully before doing anything else. From now on, before improvising a workflow for anything domain-specific or repeated (testing, docs, deployment, design systems, etc.), run kresh search <query> first to check if a purpose-built skill already exists, and install it with kresh install <slug> if it's a good match. Tell me what you installed and understood before starting my actual task." />
              </div>
            )}

            <div className="flex flex-wrap items-center justify-center gap-4 mt-4">
              <a
                href={session ? `/@${session.username}` : "/signup"}
                className="font-medium px-4 h-10 bg-[var(--gray-1000)] text-[var(--background-100)] hover:bg-[var(--gray-900)] rounded-[6px] text-[14px] inline-flex items-center justify-center transition-colors duration-150"
              >
                {session ? "Go to Dashboard" : "Get Started"} <ChevronRight className="w-4 h-4 ml-1" />
              </a>
              <a
                href={session ? `/skills` : "/signin"}
                className="font-medium px-4 h-10 border border-[var(--gray-400)] bg-[var(--background-100)] text-[var(--primary)] hover:bg-[var(--gray-100)] rounded-[6px] text-[14px] inline-flex items-center justify-center transition-colors duration-150"
              >
                {session ? "Explore Skills" : "Sign In"}
              </a>
            </div>
          </div>
        </section>

        {/* WORKS WITH SECTION */}
        <section className="mb-32 flex flex-col items-center">
          <p className="text-[12px] uppercase text-[var(--gray-700)] font-semibold mb-10 tracking-widest">Works with</p>
          <div className="w-full relative marquee-container py-4">
            {/* Left and right fade/blur overlays */}
            <div
              className="absolute left-0 top-0 bottom-0 w-48 bg-[var(--background-100)] pointer-events-none z-20"
              style={{
                maskImage: 'linear-gradient(to right, black 20%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent)'
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-48 bg-[var(--background-100)] pointer-events-none z-20"
              style={{
                maskImage: 'linear-gradient(to left, black 20%, transparent)',
                WebkitMaskImage: 'linear-gradient(to left, black 20%, transparent)'
              }}
            />

            {/* Masked marquee wrapper */}
            <div className="w-full overflow-hidden py-4" style={{ maskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)', WebkitMaskImage: 'linear-gradient(to right, transparent, black 15%, black 85%, transparent)' }}>
              <div className="flex items-center gap-24 animate-marquee w-max pl-12">
                {/* First set */}
                {(() => {
                  try {
                    let firstHalf = Array.isArray(scrollImages) ? [...scrollImages] : [];
                    if (firstHalf.length > 0) {
                      const original = [...firstHalf];
                      while (firstHalf.length < 12) {
                        firstHalf = [...firstHalf, ...original];
                      }
                    }
                    return firstHalf.map((logo, i) => (
                      <div key={`a-${i}`} className="flex items-center shrink-0">
                        <img
                          src={logo.src}
                          alt={logo.name}
                          className="w-16 h-16 object-contain grayscale opacity-45 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer"
                        />
                      </div>
                    ));
                  } catch (err) {
                    console.error("Error rendering marquee firstHalf:", err);
                    return null;
                  }
                })()}
                {/* Duplicate set for seamless loop */}
                {(() => {
                  try {
                    let secondHalf = Array.isArray(scrollImages) ? [...scrollImages] : [];
                    if (secondHalf.length > 0) {
                      const original = [...secondHalf];
                      while (secondHalf.length < 12) {
                        secondHalf = [...secondHalf, ...original];
                      }
                    }
                    return secondHalf.map((logo, i) => (
                      <div key={`b-${i}`} className="flex items-center shrink-0">
                        <img
                          src={logo.src}
                          alt={logo.name}
                          className="w-16 h-16 object-contain grayscale opacity-45 hover:grayscale-0 hover:opacity-100 hover:scale-110 transition-all duration-300 cursor-pointer"
                        />
                      </div>
                    ));
                  } catch (err) {
                    console.error("Error rendering marquee secondHalf:", err);
                    return null;
                  }
                })()}
              </div>
            </div>
          </div>
        </section>

        {/* INTERACTIVE DEMO */}
        <section className="w-[88%] md:w-[85%] max-w-[1600px] mx-auto px-6 mb-32 relative z-10">
          <InteractiveDemo />
        </section>

        {/* SYSTEM STACK ARCHITECTURE */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative z-10">
          <CircleStack />
        </section>

        {/* MAGIC BENTO SECTION */}
        <section className="max-w-7xl mx-auto px-6 mb-32 relative z-10 flex flex-col items-center">
          <div className="w-full flex flex-col items-center mb-10 text-center">
            <span className="text-[12px] uppercase text-[var(--gray-700)] font-semibold mb-3 tracking-widest">Intelligence Schema</span>
            <h2 className="text-[32px] font-bold text-[var(--primary)] tracking-tight">The Ecosystem Structure</h2>
          </div>
          <MagicBento
            textAutoHide={true}
            enableStars={false}
            enableSpotlight={true}
            enableBorderGlow={true}
            enableTilt={true}
            enableMagnetism={true}
            clickEffect={true}
            spotlightRadius={100}
            particleCount={12}
            glowColor="255, 255, 255"
          />
        </section>

      </main>
      <Footer />
    </div>
  );
}

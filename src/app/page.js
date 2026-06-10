"use client";

import React, { useState, useEffect } from 'react';
import { Header } from '@/components/layout/Header';
import BlurText from '@/components/ui/BlurText';
import { CircleStack } from '@/components/ui/CircleStack';
import { InteractiveDemo } from '@/components/ui/InteractiveDemo';
import MagicBento from '@/components/ui/MagicBento';
import { Footer } from '@/components/layout/Footer';
import { Button } from '@/components/ui/Button';
import { Glass } from '@/components/ui/Glass';
import {
  Copy, Check, ChevronRight
} from 'lucide-react';



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
      className={`transition-all duration-200 p-1.5 rounded-md hover:bg-text-primary/10 ${copied ? 'text-kresh-green' : 'text-text-secondary hover:text-text-primary'
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

export default function Home() {
  const [session, setSession] = useState(null);
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
    <div className="min-h-screen bg-background text-foreground selection:bg-kresh-green/30">
      <Header />

      <main className="pt-32 pb-16">
        {/* HERO SECTION */}
        {/* HERO SECTION */}
        <section className="max-w-4xl mx-auto px-6 mb-32 text-center flex flex-col items-center">
          <div className="relative z-10 flex flex-col items-center">
            <h1 className="text-text-primary mb-8 flex flex-row flex-wrap sm:flex-nowrap justify-center gap-x-3 gap-y-4 items-baseline whitespace-nowrap">
              {[
                { word: "Install", type: "grotsek" },
                { word: "Skills", type: "playwrite" },
                { word: "and", type: "grotsek" },
                { word: "Publish", type: "grotsek" },
                { word: "Skills.", type: "playwrite" }
              ].map((item, i) => {
                const fontClass = item.type === "playwrite"
                  ? "playwrite-gb-j-hero text-4xl sm:text-5xl text-text-primary"
                  : "schibsted-grotesk-hero text-5xl sm:text-6xl text-text-primary";
                return (
                  <BlurText
                    key={i}
                    text={item.word}
                    delay={i * 60 + 50}
                    animateBy="letters"
                    direction="bottom"
                    className={`${fontClass} leading-none inline-flex shrink-0`}
                  />
                );
              })}
            </h1>

            <p className="text-lg text-text-secondary font-semibold max-w-xl leading-relaxed mb-8 mx-auto">
              AI Knows More With Kresh.
            </p>

            <div className="relative w-full max-w-sm mb-6 mx-auto">
              <img
                src="/arrow.png"
                alt="Arrow pointing to installation command"
                className="absolute -left-32 -top-24 w-36 h-36 pointer-events-none hidden md:block select-none opacity-85 [html.light_&]:invert [html.light_&]:opacity-70"
              />
              <Glass className="p-4 flex items-center justify-between group cursor-text w-full">
                <div className="flex items-center gap-3 iosevka-charon-bold text-base">
                  <span className="text-kresh-green">$</span>
                  <span className="text-text-secondary font-bold">npm i -g @chakresh/kresh</span>
                </div>
                <CopyButton text="npm i -g @chakresh/kresh" />
              </Glass>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 mb-10">
              <a href={session ? `/@${session.username}` : "/signup"}>
                <Button className="font-semibold px-6 py-3">
                  {session ? "Go to Dashboard" : "Get Started"} <ChevronRight className="w-4 h-4 ml-1" />
                </Button>
              </a>
              <a href={session ? `/skills` : "/signin"}>
                <Button variant="glass" className="font-semibold px-6 py-3">
                  {session ? "Explore Skills" : "Sign In"}
                </Button>
              </a>
            </div>
          </div>
        </section>

        {/* WORKS WITH SECTION */}
        <section className="mb-32 flex flex-col items-center">
          <p className="text-xs uppercase text-text-secondary/70 font-semibold mb-10 tracking-wider">Works with</p>
          <div className="w-full relative marquee-container py-4">
            {/* Left and right fade/blur overlays to blend the edges beautifully without sharp cuts */}
            <div
              className="absolute left-0 top-0 bottom-0 w-48 bg-background pointer-events-none z-20 backdrop-blur-md"
              style={{
                maskImage: 'linear-gradient(to right, black 20%, transparent)',
                WebkitMaskImage: 'linear-gradient(to right, black 20%, transparent)'
              }}
            />
            <div
              className="absolute right-0 top-0 bottom-0 w-48 bg-background pointer-events-none z-20 backdrop-blur-md"
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
            <span className="text-xs uppercase text-text-secondary/70 font-semibold mb-3 tracking-wider">Intelligence Schema</span>
            <h2 className="text-3xl font-bold text-text-primary">The Ecosystem Structure</h2>
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

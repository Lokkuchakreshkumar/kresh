'use client';

import React, { useEffect, useState } from 'react';

const GRAIN_URL = `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`;

const LAYERS = [
  {
    id: 'LAYER 01',
    title: 'Application',
    desc: 'The developer\'s IDE, agent environment, or top-level UI executing user-facing tasks.',
    background: 'radial-gradient(circle at 20% 50%, #00f2fe 0%, transparent 60%), radial-gradient(circle at 80% 20%, #8a2be2 0%, transparent 50%), radial-gradient(circle at 60% 90%, #ff0844 0%, transparent 50%), #00f2fe',
    glow: 'rgba(0, 242, 254, 0.4)',
    textColor: 'text-black'
  },
  {
    id: 'LAYER 02',
    title: 'Kresh',
    desc: 'The open registry for installing, sharing, and composing modular intelligence packages.',
    background: 'radial-gradient(circle at 50% 70%, #2b1055 0%, #ff512f 30%, #4facfe 70%, #00f2fe 100%)',
    glow: 'rgba(255, 81, 47, 0.4)',
    textColor: 'text-black'
  },
  {
    id: 'LAYER 03',
    title: 'Model',
    desc: 'Core foundational models executing tasks under modular system-level guardrails.',
    background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #a18cd1 100%)',
    glow: 'rgba(254, 207, 239, 0.4)',
    textColor: 'text-black'
  }
];

export function CircleStack() {
  const [activeIndex, setActiveIndex] = useState(0);

  useEffect(() => {
    try {
      const timer = setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % LAYERS.length);
      }, 2500);

      return () => clearInterval(timer);
    } catch (err) {
      console.error('CircleStack timer registration error:', err);
    }
  }, []);

  try {
    return (
      <div className="w-full flex flex-col items-center">
        {/* Small uppercase section tag */}
        <div className="font-outfit font-semibold text-text-secondary/70 text-xs uppercase mb-12">
          System Stack Architecture
        </div>

        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 md:gap-16 items-center w-full max-w-5xl">
          {/* Left Side: 3D Circle Stack (md:col-span-6) */}
          <div className="md:col-span-6 flex justify-center items-center h-[380px] relative mt-12 md:mt-0">
            <div className="relative w-[280px] sm:w-[320px] md:w-[360px] h-full flex flex-col items-center justify-center">
              {/* The 3 stacked circles */}
              {LAYERS.map((layer, idx) => {
                const isActive = idx === activeIndex;
                const isAbove = idx < activeIndex;
                const verticalOffset = idx * 60; // Distance between each cylinder
                const zIndex = LAYERS.length - idx; // Top cylinder has highest z-index

                return (
                  <div
                    key={layer.id}
                    onClick={() => setActiveIndex(idx)}
                    className="absolute left-0 cursor-pointer group transition-all duration-700 ease-in-out hover:-translate-y-2"
                    style={{
                      top: `${80 + verticalOffset}px`,
                      zIndex: zIndex,
                      width: '100%',
                      height: '140px',
                    }}
                  >
                    <div className="relative w-full h-full transition-transform duration-700 ease-in-out" style={{
                      transform: isAbove ? 'translateY(-100px)' : isActive ? 'translateY(-10px)' : 'translateY(0px)',
                    }}>

                      {/* CYLINDER BODY (Sides + Bottom) - Perfect mathematical cylinder silhouette */}
                      <div
                        className="absolute left-0 w-full overflow-hidden transition-all duration-700 border-x border-b"
                        style={{
                          top: '50%', // Starts exactly at the middle of the top oval
                          height: '94px', // 24px (thickness) + 70px (bottom half of oval)
                          borderRadius: '0 0 50% 50% / 0 0 70px 70px',
                          borderColor: isActive ? 'transparent' : 'rgba(255,255,255,0.2)',
                        }}
                      >
                        {/* Inactive black fill */}
                        <div className={`absolute inset-0 bg-[#0a0a0c] transition-opacity duration-700 ${isActive ? 'opacity-0' : 'opacity-100'}`} />

                        {/* Active gradient */}
                        <div className={`absolute inset-0 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} style={{ background: layer.background }} />

                        {/* Grain */}
                        <div className={`absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} style={{ backgroundImage: GRAIN_URL }} />

                        {/* Shading */}
                        <div className={`absolute inset-0 bg-black/40 transition-opacity duration-700 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
                      </div>

                      {/* TOP OVAL (Face) */}
                      <div
                        className={`absolute inset-0 rounded-[50%] border bg-[#0a0a0c] overflow-hidden transition-all duration-700 flex items-center justify-center ${isActive ? 'border-white/80' : 'border-white/30'}`}
                        style={{
                          boxShadow: isActive ? `0 -10px 40px ${layer.glow}` : 'none'
                        }}
                      >
                        {/* Active Gradient Background */}
                        <div
                          className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                          style={{ background: layer.background }}
                        />

                        {/* Grain overlay */}
                        <div
                          className={`absolute inset-0 pointer-events-none mix-blend-color-dodge transition-opacity duration-700 ease-in-out ${isActive ? 'opacity-100' : 'opacity-0'}`}
                          style={{ backgroundImage: GRAIN_URL }}
                        />

                        {/* Text Content (Only visible when active) */}
                        <div
                          className={`z-10 flex flex-col items-center justify-center pointer-events-none transition-all duration-700 ease-in-out ${isActive ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}
                        >
                          <span className={`text-[10px] sm:text-xs font-mono uppercase font-bold ${layer.textColor} opacity-90 drop-shadow-sm`}>
                            {layer.id}
                          </span>
                          <span className={`text-xl sm:text-2xl md:text-3xl font-outfit font-extrabold mt-1 ${layer.textColor} drop-shadow-md`}>
                            {layer.title}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Right Side: Details / Text (md:col-span-6) */}
          <div className="md:col-span-6 flex flex-col justify-center items-center md:items-start text-center md:text-left space-y-6 sm:space-y-8 px-4 sm:px-0 relative z-10">
            <div className="relative h-[200px] md:h-[280px] w-full">
              {LAYERS.map((layer, idx) => {
                const isActive = idx === activeIndex;
                return (
                  <div
                    key={`desc-${layer.id}`}
                    className={`absolute inset-0 flex flex-col justify-center items-center md:items-start transition-all transform ${isActive
                        ? 'duration-500 delay-300 opacity-100 translate-y-0 pointer-events-auto'
                        : 'duration-300 opacity-0 translate-y-8 pointer-events-none'
                      }`}
                  >
                    <div className="flex items-center justify-center md:justify-start space-x-3 mb-4">
                      <span className="text-text-secondary/80 font-mono text-sm uppercase">
                        {layer.id}
                      </span>
                    </div>
                    <h3 className="text-3xl sm:text-4xl md:text-5xl font-outfit font-extrabold text-white mb-6 leading-tight text-center md:text-left">
                      {layer.title}
                    </h3>
                    <p className="text-zinc-400 font-sans text-base sm:text-lg leading-relaxed max-w-md mx-auto md:mx-0 text-center md:text-left">
                      {layer.desc}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Manual Control Indicators */}
            <div className="flex space-x-3 pt-4 justify-center md:justify-start">
              {LAYERS.map((_, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveIndex(idx)}
                  className={`h-1.5 rounded-full transition-all duration-500 ${idx === activeIndex
                    ? 'w-8 bg-white/80 shadow-[0_0_10px_rgba(255,255,255,0.5)]'
                    : 'w-2 bg-white/20 hover:bg-white/40'
                    }`}
                  aria-label={`Go to layer ${idx + 1}`}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  } catch (error) {
    console.error('CircleStack rendering error caught:', error);
    return (
      <div className="text-zinc-500 p-8 text-center">
        System Stack Architecture details are temporarily unavailable.
      </div>
    );
  }
}

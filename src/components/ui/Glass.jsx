"use client";

import React, { useId, useState, useEffect } from 'react';

// Generates a base64 displacement map canvas URL
function generateLensMap(width, height) {
  if (typeof window === 'undefined') return '';
  try {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');
    if (!ctx) return '';
    
    const imgData = ctx.createImageData(width, height);
    const data = imgData.data;
    
    const cx = width / 2;
    const cy = height / 2;
    const maxRadius = Math.min(cx, cy);
    
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        const dx = x - cx;
        const dy = y - cy;
        const distance = Math.sqrt(dx * dx + dy * dy);
        
        let strength = 0;
        if (distance < maxRadius) {
          const factor = distance / maxRadius;
          strength = Math.sqrt(1 - factor * factor); // Spherical lens curvature
        }
        
        const maxDisp = 18; 
        const offsetX = (dx / (distance || 1)) * strength * maxDisp;
        const offsetY = (dy / (distance || 1)) * strength * maxDisp;
        
        const idx = (y * width + x) * 4;
        data[idx] = Math.max(0, Math.min(255, Math.round(128 + offsetX)));
        data[idx + 1] = Math.max(0, Math.min(255, Math.round(128 + offsetY)));
        data[idx + 2] = 0;
        data[idx + 3] = 255;
      }
    }
    
    ctx.putImageData(imgData, 0, 0);
    return canvas.toDataURL();
  } catch (err) {
    console.error("Error generating lens map:", err);
    return '';
  }
}

export function Glass({ children, className = '', ...props }) {
  const uniqueId = useId().replace(/:/g, '-');
  const filterId = `glass-filter-${uniqueId}`;
  const [mapUrl, setMapUrl] = useState('');

  useEffect(() => {
    try {
      const url = generateLensMap(128, 128);
      setMapUrl(url);
    } catch (err) {
      console.error("Error setting map URL in Glass mount:", err);
    }
  }, []);

  return (
    <div className={`relative rounded-2xl ${className}`} {...props}>
      {/* SVG Filter Element - Always in DOM for binding */}
      <svg style={{ width: 0, height: 0, position: 'absolute' }} aria-hidden="true">
        <filter id={filterId} x="-20%" y="-20%" width="140%" height="140%">
          <feImage href={mapUrl || 'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'} result="lensMap" width="100%" height="100%" preserveAspectRatio="none" />
          <feDisplacementMap
            in="SourceGraphic"
            in2="lensMap"
            scale={mapUrl ? "25" : "0"}
            xChannelSelector="R"
            yChannelSelector="G"
            result="displaced"
          />
        </filter>
      </svg>

      {/* Filtered Background layer */}
      <div 
        className="glass absolute inset-0 rounded-[inherit] pointer-events-none"
        style={{
          backdropFilter: `blur(22px) saturate(170%) url(#${filterId})`,
          WebkitBackdropFilter: `blur(22px) saturate(170%) url(#${filterId})`,
          zIndex: 0
        }}
      />

      {/* Foreground Content layer */}
      <div className="relative z-10 w-full h-full rounded-[inherit]">
        {children}
      </div>

      {/* Specular highlight simulation based on GLASS.md concepts */}
      <div className="absolute inset-0 border border-border-color/10 pointer-events-none rounded-[inherit] z-20" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-text-primary/20 to-transparent pointer-events-none z-20" />
    </div>
  );
}

"use client";

import { useMemo } from 'react';

function fmt(dateStr) {
  try {
    return new Date(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  } catch { return dateStr; }
}

export function ActivityChart({ data }) {
  const points = useMemo(() =>
    (data || []).map(r => ({ day: r.day, count: Number(r.count) })),
  [data]);

  if (points.length === 0) {
    return (
      <div
        className="flex items-center justify-center rounded-[6px] border border-dashed border-[var(--gray-300)]"
        style={{ height: 176 }}
      >
        <p style={{ fontSize: 13, color: 'var(--gray-700)' }}>
          No activity yet. Run a CLI command to see data.
        </p>
      </div>
    );
  }

  /* ── SVG geometry (viewBox units, not px) ── */
  const VW = 100, VH = 120;
  const PL = 0, PR = 0, PT = 8, PB = 4;
  const IW = VW - PL - PR;
  const IH = VH - PT - PB;
  const n  = points.length;
  const mx = Math.max(...points.map(p => p.count), 1);

  const coords = points.map((p, i) => ({
    x: PL + (n === 1 ? IW / 2 : (i / (n - 1)) * IW),
    y: PT + IH - (p.count / mx) * IH,
    ...p,
  }));

  const line = coords.map((c, i) => `${i === 0 ? 'M' : 'L'}${c.x},${c.y}`).join(' ');
  const area = [
    `M${coords[0].x},${PT + IH}`,
    ...coords.map(c => `L${c.x},${c.y}`),
    `L${coords[n - 1].x},${PT + IH}Z`,
  ].join(' ');

  /* tick indices (up to 6) */
  const ticks = n <= 6
    ? coords.map((_, i) => i)
    : [0, Math.floor(n*0.2), Math.floor(n*0.4), Math.floor(n*0.6), Math.floor(n*0.8), n - 1];

  return (
    <div>
      <svg
        viewBox={`0 0 ${VW} ${VH}`}
        className="w-full"
        style={{ height: 140, overflow: 'visible' }}
        preserveAspectRatio="none"
      >
        <defs>
          <linearGradient id="statAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#006bff" stopOpacity="0.18" />
            <stop offset="100%" stopColor="#006bff" stopOpacity="0"    />
          </linearGradient>
        </defs>

        {/* Horizontal grid — 4 lines at 25% increments */}
        {[0, 0.33, 0.66, 1].map(f => (
          <line
            key={f}
            x1={PL} x2={PL + IW}
            y1={PT + f * IH} y2={PT + f * IH}
            stroke="var(--gray-200)"
            strokeWidth="0.5"
          />
        ))}

        {/* Gradient area */}
        <path d={area} fill="url(#statAreaGrad)" />

        {/* Line */}
        <path
          d={line}
          fill="none"
          stroke="#006bff"
          strokeWidth="1"
          strokeLinejoin="round"
          strokeLinecap="round"
        />

        {/* Vertex dots — only when ≤30 points, else too crowded */}
        {n <= 30 && coords.map((c, i) => (
          <circle
            key={i}
            cx={c.x} cy={c.y} r="1.2"
            fill="#006bff"
            stroke="var(--background-200)"
            strokeWidth="0.6"
          />
        ))}
      </svg>

      {/* X-axis labels */}
      <div className="flex items-center justify-between mt-2">
        {ticks.map(i => (
          <span key={i} className="font-mono shrink-0" style={{ fontSize: 11, color: 'var(--gray-700)' }}>
            {fmt(coords[i]?.day || '')}
          </span>
        ))}
      </div>
    </div>
  );
}

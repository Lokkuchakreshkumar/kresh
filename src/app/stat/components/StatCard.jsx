"use client";

export function StatCard({ label, value, icon: Icon, accent, sub }) {
  return (
    <div
      className="relative overflow-hidden rounded-[12px] border border-[var(--gray-300)] bg-[var(--background-200)] p-6 transition-colors duration-150 hover:border-[var(--gray-400)] hover:bg-[var(--background-100)] group"
      style={{ boxShadow: '0 2px 2px rgba(0,0,0,0.04)' }}
    >
      {/* Corner accent glow — purely decorative, very subtle */}
      <div
        aria-hidden
        className="pointer-events-none absolute -top-8 -right-8 w-24 h-24 rounded-full opacity-[0.07] group-hover:opacity-[0.12] transition-opacity duration-300"
        style={{ background: `radial-gradient(circle, ${accent}, transparent 70%)` }}
      />

      {/* Icon */}
      <div
        className="w-8 h-8 rounded-[6px] flex items-center justify-center mb-4"
        style={{
          background: `${accent}12`,
          border: `1px solid ${accent}24`,
        }}
      >
        <Icon className="w-4 h-4" style={{ color: accent }} />
      </div>

      {/* Value */}
      <div
        className="font-mono tabular-nums mb-1"
        style={{ fontSize: 32, fontWeight: 600, lineHeight: '40px', letterSpacing: '-1.28px', color: 'var(--primary)' }}
      >
        {Number(value || 0).toLocaleString()}
      </div>

      {/* Label */}
      <div style={{ fontSize: 14, fontWeight: 600, lineHeight: '20px', letterSpacing: '-0.28px', color: 'var(--primary)' }}>
        {label}
      </div>

      {/* Sub-label */}
      {sub && (
        <div className="mt-0.5" style={{ fontSize: 12, lineHeight: '16px', color: 'var(--secondary)' }}>
          {sub}
        </div>
      )}
    </div>
  );
}

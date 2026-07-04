"use client";

export function DistributionBar({ data, total, colors, emptyMessage }) {
  if (!data || data.length === 0 || total === 0) {
    return (
      <p className="text-center py-8" style={{ fontSize: 13, color: 'var(--gray-700)' }}>
        {emptyMessage || 'No data yet.'}
      </p>
    );
  }

  return (
    <div>
      {/* Segmented bar */}
      <div className="flex h-2 rounded-full overflow-hidden gap-px mb-5">
        {data.map((item, i) => {
          const pct = total > 0 ? (item.count / total) * 100 : 0;
          if (pct === 0) return null;
          return (
            <div
              key={item.label}
              className="h-full transition-all duration-700"
              style={{
                width: `${pct}%`,
                background: colors[i % colors.length],
                minWidth: 2,
              }}
              title={`${item.label}: ${item.count}`}
            />
          );
        })}
      </div>

      {/* Legend rows */}
      <div className="space-y-2.5">
        {data.map((item, i) => {
          const pct = total > 0 ? Math.round((item.count / total) * 100) : 0;
          return (
            <div key={item.label} className="flex items-center gap-2">
              {/* Color swatch */}
              <div
                className="w-2 h-2 rounded-sm shrink-0"
                style={{ background: colors[i % colors.length] }}
              />
              {/* Label */}
              <span
                className="flex-1 capitalize truncate"
                style={{ fontSize: 13, lineHeight: '16px', color: 'var(--primary)' }}
              >
                {item.label}
              </span>
              {/* Count */}
              <span className="font-mono shrink-0" style={{ fontSize: 12, color: 'var(--gray-800)' }}>
                {item.count.toLocaleString()}
              </span>
              {/* Percent */}
              <span
                className="font-mono shrink-0 w-8 text-right"
                style={{ fontSize: 12, color: 'var(--gray-700)' }}
              >
                {pct}%
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

'use client';

/**
 * Shared Recharts theming for the usage dashboard — brand colors, axis defaults,
 * and a tokenized tooltip so every chart reads as one system in both themes.
 */
import type { ReactNode } from 'react';

export const chartColors = {
  chlorophyll: 'var(--color-chlorophyll)',
  evergreen: 'var(--color-evergreen)',
  harvest: 'var(--color-harvest)',
  danger: 'var(--color-danger)',
  info: 'var(--color-info)',
  grid: 'var(--color-border)',
  axis: 'var(--color-muted-foreground)',
};

/** Fixed categorical order for per-model series (never cycled past the list). */
export const modelPalette = [
  'var(--color-chlorophyll)',
  'var(--color-harvest)',
  'var(--color-info)',
  'var(--color-danger)',
  'var(--color-evergreen)',
];

export const OTHER_COLOR = 'var(--color-border-strong)';

export const axisProps = {
  stroke: chartColors.axis,
  fontSize: 11,
  tickLine: false,
  axisLine: false,
} as const;

interface TooltipRow {
  label: string;
  value: string;
  color?: string;
}

/** A themed tooltip card. Charts pass a formatter via Recharts' `content`. */
export function ChartTooltip({
  title,
  rows,
}: {
  title?: ReactNode;
  rows: TooltipRow[];
}) {
  return (
    <div className="rounded-control border-border bg-surface border px-3 py-2 text-xs shadow-md">
      {title && <p className="text-foreground mb-1 font-medium">{title}</p>}
      <div className="space-y-0.5">
        {rows.map((r, i) => (
          <div key={i} className="flex items-center gap-2">
            {r.color && (
              <span
                className="inline-block h-2 w-2 shrink-0 rounded-[2px]"
                style={{ backgroundColor: r.color }}
              />
            )}
            <span className="text-muted-foreground">{r.label}</span>
            <span className="text-foreground ml-auto font-mono font-medium">
              {r.value}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

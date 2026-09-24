'use client';

import { Cell, Pie, PieChart, ResponsiveContainer, Tooltip } from 'recharts';
import { ChartFrame } from '@/components/shared/ChartFrame';
import { formatNumber, formatTokens } from '@/lib/format';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { ModelBucket } from '@/lib/usage/aggregate';
import { modelPalette, OTHER_COLOR, ChartTooltip } from './chart-theme';

interface Props {
  models: ModelBucket[];
}

function colorFor(model: string, index: number): string {
  return model === 'Other'
    ? OTHER_COLOR
    : modelPalette[index % modelPalette.length];
}

export function ModelUsageDonut({ models }: Props) {
  const reduced = usePrefersReducedMotion();
  const total = models.reduce((sum, m) => sum + m.requests, 0);
  const empty = total === 0;

  return (
    <ChartFrame
      title="Model Usage"
      description="Requests by model"
      empty={empty}
      emptyMessage="No requests in this period."
    >
      <div className="flex flex-col items-center gap-4 sm:flex-row">
        <div className="h-[200px] w-full max-w-[220px] shrink-0">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={models}
                dataKey="requests"
                nameKey="model"
                innerRadius={55}
                outerRadius={90}
                paddingAngle={2}
                stroke="var(--color-surface)"
                strokeWidth={2}
                isAnimationActive={!reduced}
              >
                {models.map((m, i) => (
                  <Cell key={m.model} fill={colorFor(m.model, i)} />
                ))}
              </Pie>
              <Tooltip
                content={({ active, payload }) => {
                  if (!active || !payload?.length) return null;
                  const m = payload[0].payload as ModelBucket;
                  const pct = total
                    ? ((m.requests / total) * 100).toFixed(0)
                    : '0';
                  return (
                    <ChartTooltip
                      title={m.model}
                      rows={[
                        {
                          label: 'Requests',
                          value: `${formatNumber(m.requests)} (${pct}%)`,
                        },
                        { label: 'Tokens', value: formatTokens(m.tokens) },
                        { label: 'Credits', value: formatNumber(m.credits) },
                      ]}
                    />
                  );
                }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>

        {/* Direct-labeled legend — identity is never color-alone. */}
        <ul className="flex-1 space-y-2 self-stretch">
          {models.map((m, i) => {
            const pct = total ? ((m.requests / total) * 100).toFixed(0) : '0';
            return (
              <li key={m.model} className="flex items-center gap-2 text-sm">
                <span
                  className="inline-block h-2.5 w-2.5 shrink-0 rounded-[3px]"
                  style={{ backgroundColor: colorFor(m.model, i) }}
                />
                <span className="text-foreground truncate font-mono text-xs">
                  {m.model}
                </span>
                <span className="text-muted-foreground ml-auto font-mono text-xs">
                  {formatNumber(m.requests)} · {pct}%
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    </ChartFrame>
  );
}

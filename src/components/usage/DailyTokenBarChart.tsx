'use client';

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartFrame } from '@/components/shared/ChartFrame';
import { formatTokens, formatNumber } from '@/lib/format';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { DailyBucket } from '@/lib/usage/aggregate';
import { axisProps, chartColors, ChartTooltip } from './chart-theme';

interface Props {
  daily: DailyBucket[];
}

export function DailyTokenBarChart({ daily }: Props) {
  const reduced = usePrefersReducedMotion();
  const empty = daily.every((d) => d.totalTokens === 0);

  return (
    <ChartFrame
      title="Daily Token Volume"
      description="Input vs output tokens per day"
      empty={empty}
      emptyMessage="No token usage in this period."
    >
      <ResponsiveContainer width="100%" height={280}>
        <BarChart
          data={daily}
          margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        >
          <CartesianGrid
            vertical={false}
            stroke={chartColors.grid}
            strokeDasharray="3 3"
          />
          <XAxis
            dataKey="label"
            {...axisProps}
            interval="preserveStartEnd"
            minTickGap={24}
          />
          <YAxis
            {...axisProps}
            tickFormatter={(v: number) => formatTokens(v)}
            width={48}
          />
          <Tooltip
            cursor={{ fill: 'var(--color-muted)', opacity: 0.4 }}
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as DailyBucket;
              return (
                <ChartTooltip
                  title={label as string}
                  rows={[
                    {
                      label: 'Input',
                      value: formatNumber(d.promptTokens),
                      color: chartColors.evergreen,
                    },
                    {
                      label: 'Output',
                      value: formatNumber(d.completionTokens),
                      color: chartColors.chlorophyll,
                    },
                    { label: 'Total', value: formatNumber(d.totalTokens) },
                  ]}
                />
              );
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(v) => (v === 'promptTokens' ? 'Input' : 'Output')}
          />
          <Bar
            dataKey="promptTokens"
            stackId="tokens"
            fill={chartColors.evergreen}
            stroke="var(--color-surface)"
            strokeWidth={2}
            isAnimationActive={!reduced}
          />
          <Bar
            dataKey="completionTokens"
            stackId="tokens"
            fill={chartColors.chlorophyll}
            stroke="var(--color-surface)"
            strokeWidth={2}
            radius={[4, 4, 0, 0]}
            isAnimationActive={!reduced}
          />
        </BarChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

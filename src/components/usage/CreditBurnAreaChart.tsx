'use client';

import {
  Area,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartFrame } from '@/components/shared/ChartFrame';
import { formatNumber } from '@/lib/format';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { DailyBucket } from '@/lib/usage/aggregate';
import { axisProps, chartColors, ChartTooltip } from './chart-theme';

interface Props {
  daily: DailyBucket[];
}

export function CreditBurnAreaChart({ daily }: Props) {
  const reduced = usePrefersReducedMotion();
  const empty = daily.every((d) => d.credits === 0);
  const total = daily.length ? daily[daily.length - 1].cumulativeCredits : 0;

  return (
    <ChartFrame
      title="Credit Burn"
      description={`${formatNumber(total)} credits spent this period`}
      empty={empty}
      emptyMessage="No credits spent in this period."
    >
      <ResponsiveContainer width="100%" height={280}>
        <ComposedChart
          data={daily}
          margin={{ top: 8, right: 8, bottom: 0, left: -8 }}
        >
          <defs>
            <linearGradient id="creditBurnFill" x1="0" y1="0" x2="0" y2="1">
              <stop
                offset="0%"
                stopColor={chartColors.chlorophyll}
                stopOpacity={0.35}
              />
              <stop
                offset="100%"
                stopColor={chartColors.chlorophyll}
                stopOpacity={0.02}
              />
            </linearGradient>
          </defs>
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
            tickFormatter={(v: number) => formatNumber(v)}
            width={48}
          />
          <Tooltip
            content={({ active, payload, label }) => {
              if (!active || !payload?.length) return null;
              const d = payload[0].payload as DailyBucket;
              return (
                <ChartTooltip
                  title={label as string}
                  rows={[
                    {
                      label: 'Spent that day',
                      value: formatNumber(d.credits),
                      color: chartColors.harvest,
                    },
                    {
                      label: 'Cumulative',
                      value: formatNumber(d.cumulativeCredits),
                      color: chartColors.chlorophyll,
                    },
                  ]}
                />
              );
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(v) =>
              v === 'cumulativeCredits' ? 'Cumulative' : 'Per day'
            }
          />
          <Area
            dataKey="cumulativeCredits"
            stroke={chartColors.chlorophyll}
            strokeWidth={2}
            fill="url(#creditBurnFill)"
            isAnimationActive={!reduced}
          />
          <Line
            dataKey="credits"
            stroke={chartColors.harvest}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reduced}
          />
        </ComposedChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

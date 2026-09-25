'use client';

import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartFrame } from '@/components/shared/ChartFrame';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { DailyBucket } from '@/lib/usage/aggregate';
import { axisProps, chartColors, ChartTooltip } from './chart-theme';

interface Props {
  daily: DailyBucket[];
}

export function RequestSuccessRateChart({ daily }: Props) {
  const reduced = usePrefersReducedMotion();
  const empty = daily.every((d) => d.requests === 0);

  return (
    <ChartFrame
      title="Success / Error Rate"
      description="Share of requests succeeding vs failing per day"
      empty={empty}
      emptyMessage="No requests in this period."
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
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
            domain={[0, 100]}
            tickFormatter={(v: number) => `${v}%`}
            width={40}
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
                      label: 'Success',
                      value: `${d.successRate.toFixed(0)}% (${d.success})`,
                      color: chartColors.chlorophyll,
                    },
                    {
                      label: 'Failed',
                      value: `${d.failedRate.toFixed(0)}% (${d.failed})`,
                      color: chartColors.danger,
                    },
                  ]}
                />
              );
            }}
          />
          <Legend
            iconType="circle"
            wrapperStyle={{ fontSize: 12, paddingTop: 8 }}
            formatter={(v) => (v === 'successRate' ? 'Success' : 'Failed')}
          />
          <Line
            dataKey="successRate"
            stroke={chartColors.chlorophyll}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reduced}
          />
          <Line
            dataKey="failedRate"
            stroke={chartColors.danger}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reduced}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

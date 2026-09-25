'use client';

import {
  CartesianGrid,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { ChartFrame } from '@/components/shared/ChartFrame';
import { formatLatency } from '@/lib/format';
import { usePrefersReducedMotion } from '@/hooks/usePrefersReducedMotion';
import type { DailyBucket } from '@/lib/usage/aggregate';
import { axisProps, chartColors, ChartTooltip } from './chart-theme';

const LATENCY_REFERENCE_MS = 5000;

interface Props {
  daily: DailyBucket[];
}

export function LatencyLineChart({ daily }: Props) {
  const reduced = usePrefersReducedMotion();
  const empty = daily.every((d) => d.requests === 0);

  return (
    <ChartFrame
      title="Avg Response Latency"
      description="Mean latency per day · reference line at 5s"
      empty={empty}
      emptyMessage="No requests in this period."
    >
      <ResponsiveContainer width="100%" height={280}>
        <LineChart
          data={daily}
          margin={{ top: 8, right: 8, bottom: 0, left: -4 }}
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
            tickFormatter={(v: number) => formatLatency(v)}
            width={52}
          />
          <ReferenceLine
            y={LATENCY_REFERENCE_MS}
            stroke={chartColors.harvest}
            strokeDasharray="4 4"
            strokeOpacity={0.7}
            label={{
              value: '5s',
              position: 'right',
              fill: chartColors.harvest,
              fontSize: 11,
            }}
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
                      label: 'Avg latency',
                      value: formatLatency(d.avgLatency),
                      color: chartColors.chlorophyll,
                    },
                    { label: 'Requests', value: String(d.requests) },
                  ]}
                />
              );
            }}
          />
          <Line
            dataKey="avgLatency"
            stroke={chartColors.chlorophyll}
            strokeWidth={2}
            dot={false}
            isAnimationActive={!reduced}
          />
        </LineChart>
      </ResponsiveContainer>
    </ChartFrame>
  );
}

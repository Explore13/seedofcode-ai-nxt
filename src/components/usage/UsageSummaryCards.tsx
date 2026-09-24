'use client';

import { Line, LineChart, ResponsiveContainer } from 'recharts';
import { StatCard, type TrendDirection } from '@/components/shared/StatCard';
import {
  formatCredits,
  formatLatency,
  formatNumber,
  formatTokens,
} from '@/lib/format';
import {
  percentChange,
  summarize,
  type DailyBucket,
} from '@/lib/usage/aggregate';
import type { UsageLog } from '@/lib/types';

interface SparklineProps {
  data: { v: number }[];
}

function Sparkline({ data }: SparklineProps) {
  if (data.every((d) => d.v === 0)) return null;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data} margin={{ top: 4, right: 2, bottom: 4, left: 2 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke="var(--color-chlorophyll)"
          strokeWidth={2}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function trend(
  curr: number,
  prev: number,
): {
  trendValue?: string;
  trendDirection: TrendDirection;
} {
  const pct = percentChange(curr, prev);
  if (pct === null) return { trendDirection: 'neutral' };
  const rounded = Math.abs(pct);
  return {
    trendValue: `${rounded.toFixed(0)}%`,
    trendDirection: pct > 0 ? 'up' : pct < 0 ? 'down' : 'neutral',
  };
}

interface UsageSummaryCardsProps {
  current: UsageLog[];
  previous: UsageLog[];
  daily: DailyBucket[];
}

export function UsageSummaryCards({
  current,
  previous,
  daily,
}: UsageSummaryCardsProps) {
  const now = summarize(current);
  const prev = summarize(previous);

  const cards = [
    {
      title: 'Total Requests',
      value: formatNumber(now.requests),
      ...trend(now.requests, prev.requests),
      spark: daily.map((d) => ({ v: d.requests })),
    },
    {
      title: 'Total Tokens',
      value: formatTokens(now.tokens),
      ...trend(now.tokens, prev.tokens),
      spark: daily.map((d) => ({ v: d.totalTokens })),
    },
    {
      title: 'Credits Spent',
      value: formatCredits(now.credits),
      ...trend(now.credits, prev.credits),
      spark: daily.map((d) => ({ v: d.credits })),
    },
    {
      title: 'Avg Latency',
      value: formatLatency(now.avgLatency),
      ...trend(now.avgLatency, prev.avgLatency),
      spark: daily.map((d) => ({ v: d.avgLatency })),
    },
  ];

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((c) => (
        <StatCard
          key={c.title}
          title={c.title}
          value={c.value}
          trendValue={c.trendValue}
          trendDirection={c.trendDirection}
          trendLabel="vs prev period"
          sparkline={<Sparkline data={c.spark} />}
        />
      ))}
    </div>
  );
}

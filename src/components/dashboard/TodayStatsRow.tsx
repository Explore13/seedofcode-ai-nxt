"use client";

import { useUsageToday } from '@/hooks/useUsageToday';
import { StatCard } from '../shared/StatCard';
import { formatNumber, formatTokens, formatCredits } from '@/lib/format';

export function TodayStatsRow() {
  const { data: usage, isLoading, isError } = useUsageToday();

  // Fallback for loading / error states
  const tokens = isLoading ? '...' : isError ? 'Error' : formatTokens(usage?.totalTokens || 0);
  const requests = isLoading ? '...' : isError ? 'Error' : formatNumber(usage?.totalRequests || 0);
  const credits = isLoading ? '...' : isError ? 'Error' : formatCredits(usage?.totalCost || 0);

  return (
    <>
      <StatCard title="Tokens Today" value={tokens} />
      <StatCard title="Requests Today" value={requests} />
      <StatCard title="Credits Spent Today" value={credits} />
    </>
  );
}

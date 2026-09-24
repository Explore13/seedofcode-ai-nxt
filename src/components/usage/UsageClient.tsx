'use client';

import Link from 'next/link';
import dynamic from 'next/dynamic';
import { useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useUsage } from '@/hooks/useUsage';
import { useUsageFilters } from '@/hooks/useUsageFilters';
import {
  bucketByDay,
  distinctModels,
  filterByModel,
  filterByRange,
} from '@/lib/usage/aggregate';
import { UsageFilters } from './UsageFilters';
import { UsageSummaryCards } from './UsageSummaryCards';
import { RequestHistoryTable } from './RequestHistoryTable';
import { CreditPointsTimeline } from './CreditPointsTimeline';
import { AlertCircle, LineChart } from 'lucide-react';

const UsageCharts = dynamic(() => import('./UsageCharts'), {
  ssr: false,
  loading: () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        <Skeleton className="rounded-card h-[340px]" />
        <Skeleton className="rounded-card h-[340px]" />
      </div>
      <Skeleton className="rounded-card h-[340px]" />
    </div>
  ),
});

export function UsageClient() {
  const filters = useUsageFilters();
  const { from, to, models } = filters;
  const { data, isLoading, isError, refetch } = useUsage(from, to);

  const all = useMemo(() => data ?? [], [data]);
  const availableModels = useMemo(() => distinctModels(all), [all]);

  const { currentRows, previousRows, daily } = useMemo(() => {
    const byModel = filterByModel(all, models);
    const current = filterByRange(byModel, from, to);
    const prevTo = new Date(from.getTime() - 1);
    const prevFrom = new Date(
      from.getTime() - Math.max(to.getTime() - from.getTime(), 0),
    );
    const previous = filterByRange(byModel, prevFrom, prevTo);
    return {
      currentRows: current,
      previousRows: previous,
      daily: bucketByDay(current, from, to),
    };
  }, [all, models, from, to]);

  const hasData = currentRows.length > 0;

  return (
    <div className="mx-auto max-w-6xl space-y-6 p-8">
      <div>
        <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
          Usage Analytics
        </h1>
        <p className="text-muted-foreground mt-2">
          Track requests, tokens, credits and latency across your API usage.
        </p>
      </div>

      <UsageFilters
        filters={filters}
        availableModels={availableModels}
        onPreset={filters.setPreset}
        onCustomRange={filters.setCustomRange}
        onModels={filters.setModels}
      />

      {isLoading && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="rounded-card h-28" />
            ))}
          </div>
          <Skeleton className="rounded-card h-[340px]" />
        </div>
      )}

      {isError && (
        <EmptyState
          icon={<AlertCircle className="h-8 w-8" />}
          title="Couldn't load usage"
          description="Something went wrong fetching your usage data. Please try again."
        >
          <Button variant="outline" onClick={() => refetch()}>
            Retry
          </Button>
        </EmptyState>
      )}

      {!isLoading && !isError && (
        <>
          <UsageSummaryCards
            current={currentRows}
            previous={previousRows}
            daily={daily}
          />

          {hasData ? (
            <UsageCharts rows={currentRows} from={from} to={to} />
          ) : (
            <EmptyState
              icon={<LineChart className="h-8 w-8" />}
              title="No requests in this period"
              description="Make your first API call to see analytics here."
            >
              <Button render={<Link href="/docs/quickstart" />}>
                Read the quickstart
              </Button>
            </EmptyState>
          )}

          <RequestHistoryTable />
          <CreditPointsTimeline />
        </>
      )}
    </div>
  );
}

'use client';

import { useEffect, useMemo, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import { useUsageInfinite } from '@/hooks/useUsageInfinite';
import { useWallet } from '@/hooks/useWallet';
import { formatCredits, formatNumber, formatTimestamp } from '@/lib/format';
import type { UsageLog } from '@/lib/types';
import { Coins, Zap } from 'lucide-react';

interface TimelineEntry {
  row: UsageLog;
  /** Wallet balance immediately after this event occurred. */
  balanceAfter: number;
}

export function CreditPointsTimeline() {
  const {
    data,
    isLoading,
    isError,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useUsageInfinite();
  const { data: wallet } = useWallet();

  const rows = useMemo(() => data?.pages.flatMap((p) => p.data) ?? [], [data]);

  // Running balance computed backward from the current wallet balance:
  // the newest event's "after" is the current balance; each older event's
  // "after" adds back the costs of every newer event.
  const entries = useMemo<TimelineEntry[]>(() => {
    const base = wallet?.balance ?? 0;
    let spentByNewer = 0;
    return rows.map((row) => {
      const balanceAfter = base - spentByNewer;
      spentByNewer += row.creditsCost;
      return { row, balanceAfter };
    });
  }, [rows, wallet]);

  // Auto-load next page when the sentinel scrolls into view.
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    const el = sentinelRef.current;
    if (!el || !hasNextPage) return;
    const observer = new IntersectionObserver(
      (obs) => {
        if (obs[0].isIntersecting && !isFetchingNextPage) fetchNextPage();
      },
      { rootMargin: '200px' },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  return (
    <div className="rounded-card border-border border p-6">
      <div className="mb-6 flex items-center gap-2">
        <Coins className="text-muted-foreground h-4 w-4" />
        <h3 className="text-foreground font-medium">Credit Points Timeline</h3>
      </div>

      {isError ? (
        <EmptyState
          icon={<Coins className="h-8 w-8" />}
          title="Couldn't load timeline"
          description="Something went wrong fetching your credit history."
        />
      ) : isLoading ? (
        <div className="space-y-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      ) : entries.length === 0 ? (
        <EmptyState
          icon={<Coins className="h-8 w-8" />}
          title="No credit activity yet"
          description="Credit deductions from your API usage will appear here."
        />
      ) : (
        <ol className="border-border relative ml-2 border-l">
          {entries.map(({ row, balanceAfter }) => (
            <li key={row.id} className="relative mb-5 pl-6 last:mb-0">
              <span className="border-surface bg-chlorophyll absolute top-1 -left-[7px] flex h-3.5 w-3.5 items-center justify-center rounded-full border-2">
                <Zap className="h-2 w-2 text-white" />
              </span>
              <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                <div>
                  <p className="text-foreground text-sm">
                    API Usage
                    <span className="text-danger ml-2 font-mono">
                      −{formatNumber(row.creditsCost)}
                    </span>
                    <span className="text-muted-foreground ml-2 font-mono text-xs">
                      {row.model}
                    </span>
                  </p>
                  <p className="text-muted-foreground mt-0.5 font-mono text-[11px]">
                    {formatTimestamp(row.createdAt)}
                  </p>
                </div>
                <span className="text-subtle-foreground font-mono text-xs">
                  Balance: {formatCredits(balanceAfter)}
                </span>
              </div>
            </li>
          ))}

          {/* Infinite-scroll sentinel + fallback control */}
          <li className="pl-6">
            <div ref={sentinelRef} />
            {hasNextPage ? (
              <Button
                variant="outline"
                size="sm"
                onClick={() => fetchNextPage()}
                disabled={isFetchingNextPage}
              >
                {isFetchingNextPage ? 'Loading…' : 'Load more'}
              </Button>
            ) : (
              <p className="text-muted-foreground text-xs">End of history.</p>
            )}
          </li>
        </ol>
      )}
    </div>
  );
}

'use client';

import { useMemo, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { EmptyState } from '@/components/shared/EmptyState';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { useUsagePage } from '@/hooks/useUsagePage';
import {
  formatCredits,
  formatLatency,
  formatNumber,
  formatTimestamp,
} from '@/lib/format';
import { isFailed } from '@/lib/usage/aggregate';
import type { UsageLog } from '@/lib/types';
import { modelPalette } from './chart-theme';
import {
  ArrowDown,
  ArrowUp,
  ChevronsUpDown,
  Filter,
  History,
  ListFilter,
} from 'lucide-react';

type StatusFilter = 'all' | 'success' | 'failed';
type SortKey = 'createdAt' | 'totalTokens' | 'latencyMs' | 'creditsCost';
type SortDir = 'asc' | 'desc';

function modelColor(model: string): string {
  let hash = 0;
  for (let i = 0; i < model.length; i++)
    hash = (hash * 31 + model.charCodeAt(i)) | 0;
  return modelPalette[Math.abs(hash) % modelPalette.length];
}

function totalTokens(r: UsageLog): number {
  return r.promptTokens + r.completionTokens;
}

export function RequestHistoryTable() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<StatusFilter>('all');
  const [models, setModels] = useState<string[]>([]);
  const [sortKey, setSortKey] = useState<SortKey>('createdAt');
  const [sortDir, setSortDir] = useState<SortDir>('desc');
  const [selected, setSelected] = useState<UsageLog | null>(null);

  const { data, isLoading, isError, isPlaceholderData } = useUsagePage(page);
  const rows = useMemo(() => data?.data ?? [], [data]);
  const meta = data?.meta;

  const pageModels = useMemo(
    () => [...new Set(rows.map((r) => r.model))].sort(),
    [rows],
  );

  const visible = useMemo(() => {
    let out = rows;
    if (status !== 'all') {
      out = out.filter((r) =>
        status === 'failed' ? isFailed(r.status) : r.status === 'success',
      );
    }
    if (models.length > 0) {
      const set = new Set(models);
      out = out.filter((r) => set.has(r.model));
    }
    const sorted = [...out].sort((a, b) => {
      let av: number;
      let bv: number;
      if (sortKey === 'createdAt') {
        av = new Date(a.createdAt).getTime();
        bv = new Date(b.createdAt).getTime();
      } else if (sortKey === 'totalTokens') {
        av = totalTokens(a);
        bv = totalTokens(b);
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }
      return sortDir === 'asc' ? av - bv : bv - av;
    });
    return sorted;
  }, [rows, status, models, sortKey, sortDir]);

  function toggleSort(key: SortKey) {
    if (sortKey === key) setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    else {
      setSortKey(key);
      setSortDir('desc');
    }
  }

  function SortHeader({
    label,
    sortableKey,
    align,
  }: {
    label: string;
    sortableKey: SortKey;
    align?: 'right';
  }) {
    const active = sortKey === sortableKey;
    return (
      <TableHead className={align === 'right' ? 'text-right' : undefined}>
        <button
          type="button"
          onClick={() => toggleSort(sortableKey)}
          className={`inline-flex items-center gap-1 ${align === 'right' ? 'flex-row-reverse' : ''} hover:text-foreground`}
        >
          {label}
          {active ? (
            sortDir === 'asc' ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          ) : (
            <ChevronsUpDown className="h-3 w-3 opacity-40" />
          )}
        </button>
      </TableHead>
    );
  }

  const statusOptions: { value: StatusFilter; label: string }[] = [
    { value: 'all', label: 'All' },
    { value: 'success', label: 'Success' },
    { value: 'failed', label: 'Failed' },
  ];

  return (
    <div className="rounded-card border-border border">
      {/* Toolbar */}
      <div className="border-border flex flex-wrap items-center justify-between gap-3 border-b p-4">
        <div className="flex items-center gap-2">
          <History className="text-muted-foreground h-4 w-4" />
          <h3 className="text-foreground font-medium">Request History</h3>
        </div>
        <div className="flex items-center gap-2">
          {/* Status toggle */}
          <div className="rounded-control border-border inline-flex items-center border p-0.5">
            {statusOptions.map((s) => (
              <button
                key={s.value}
                type="button"
                aria-pressed={status === s.value}
                onClick={() => setStatus(s.value)}
                className={`rounded-[7px] px-2.5 py-1 text-xs font-medium transition-colors ${
                  status === s.value
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground'
                }`}
              >
                {s.label}
              </button>
            ))}
          </div>
          {/* Model filter (current page) */}
          <DropdownMenu>
            <DropdownMenuTrigger
              disabled={pageModels.length === 0}
              className="rounded-control border-border text-foreground hover:bg-muted inline-flex h-7 items-center gap-1.5 border px-2.5 text-xs transition-colors disabled:opacity-50"
            >
              <Filter className="h-3.5 w-3.5" />
              {models.length === 0
                ? 'All models'
                : `${models.length} model${models.length > 1 ? 's' : ''}`}
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-52">
              <DropdownMenuLabel>Filter this page</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {pageModels.map((m) => (
                <DropdownMenuCheckboxItem
                  key={m}
                  checked={models.includes(m)}
                  onClick={(e) => {
                    e.preventDefault();
                    setModels((prev) =>
                      prev.includes(m)
                        ? prev.filter((x) => x !== m)
                        : [...prev, m],
                    );
                  }}
                  className="font-mono text-xs"
                >
                  {m}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>

      {isError ? (
        <div className="p-6">
          <EmptyState
            icon={<ListFilter className="h-8 w-8" />}
            title="Couldn't load history"
            description="Something went wrong fetching your request history."
          />
        </div>
      ) : isLoading ? (
        <div className="space-y-2 p-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <Skeleton key={i} className="h-9 w-full" />
          ))}
        </div>
      ) : rows.length === 0 ? (
        <div className="p-6">
          <EmptyState
            icon={<History className="h-8 w-8" />}
            title="No requests yet"
            description="Start using the API to see your history here."
          />
        </div>
      ) : (
        <>
          <div
            className={
              isPlaceholderData ? 'opacity-60 transition-opacity' : undefined
            }
          >
            <Table>
              <TableHeader>
                <TableRow>
                  <SortHeader label="Timestamp" sortableKey="createdAt" />
                  <TableHead>Model</TableHead>
                  <TableHead className="hidden text-right sm:table-cell">
                    Input
                  </TableHead>
                  <TableHead className="hidden text-right sm:table-cell">
                    Output
                  </TableHead>
                  <SortHeader
                    label="Total"
                    sortableKey="totalTokens"
                    align="right"
                  />
                  <SortHeader
                    label="Latency"
                    sortableKey="latencyMs"
                    align="right"
                  />
                  <SortHeader
                    label="Credits"
                    sortableKey="creditsCost"
                    align="right"
                  />
                  <TableHead>Status</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {visible.map((r) => (
                  <TableRow
                    key={r.id}
                    onClick={() => setSelected(r)}
                    className="cursor-pointer"
                  >
                    <TableCell className="text-muted-foreground font-mono text-xs">
                      {formatTimestamp(r.createdAt)}
                    </TableCell>
                    <TableCell>
                      <span className="inline-flex items-center gap-1.5">
                        <span
                          className="inline-block h-2 w-2 rounded-[2px]"
                          style={{ backgroundColor: modelColor(r.model) }}
                        />
                        <span className="font-mono text-xs">{r.model}</span>
                      </span>
                    </TableCell>
                    <TableCell className="hidden text-right font-mono text-xs sm:table-cell">
                      {formatNumber(r.promptTokens)}
                    </TableCell>
                    <TableCell className="hidden text-right font-mono text-xs sm:table-cell">
                      {formatNumber(r.completionTokens)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs font-semibold">
                      {formatNumber(totalTokens(r))}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatLatency(r.latencyMs)}
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs">
                      {formatCredits(r.creditsCost)}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant={isFailed(r.status) ? 'destructive' : 'outline'}
                      >
                        {r.status.toUpperCase()}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                {visible.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="text-muted-foreground py-8 text-center text-sm"
                    >
                      No requests match the current filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          <div className="border-border flex items-center justify-between border-t p-3">
            <p className="text-muted-foreground text-xs">
              Page {meta?.page ?? page} of {meta?.totalPages ?? 1} ·{' '}
              {formatNumber(meta?.total ?? 0)} requests
            </p>
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={(meta?.page ?? 1) <= 1}
                onClick={() => setPage((p) => Math.max(1, p - 1))}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={!meta || meta.page >= meta.totalPages}
                onClick={() => setPage((p) => p + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Row-expand drawer */}
      <Sheet
        open={selected !== null}
        onOpenChange={(o) => !o && setSelected(null)}
      >
        <SheetContent side="right" className="w-full sm:max-w-md">
          {selected && (
            <>
              <SheetHeader>
                <SheetTitle>Request detail</SheetTitle>
                <SheetDescription className="font-mono text-xs">
                  {selected.id}
                </SheetDescription>
              </SheetHeader>
              <div className="space-y-4 overflow-y-auto px-4 pb-4">
                <DetailRow
                  label="Timestamp"
                  value={formatTimestamp(selected.createdAt)}
                  mono
                />
                <DetailRow label="Model" value={selected.model} mono />
                <DetailRow
                  label="Status"
                  value={
                    <Badge
                      variant={
                        isFailed(selected.status) ? 'destructive' : 'outline'
                      }
                    >
                      {selected.status.toUpperCase()}
                    </Badge>
                  }
                />
                <DetailRow
                  label="Prompt tokens"
                  value={formatNumber(selected.promptTokens)}
                  mono
                />
                <DetailRow
                  label="Output tokens"
                  value={formatNumber(selected.completionTokens)}
                  mono
                />
                <DetailRow
                  label="Total tokens"
                  value={formatNumber(totalTokens(selected))}
                  mono
                />
                <DetailRow
                  label="Latency"
                  value={formatLatency(selected.latencyMs)}
                  mono
                />
                <DetailRow
                  label="Credits"
                  value={formatCredits(selected.creditsCost)}
                  mono
                />
                <DetailRow
                  label="API key"
                  value={selected.apiKeyId ?? '—'}
                  mono
                />

                {isFailed(selected.status) && (
                  <div className="rounded-control border-danger/30 bg-danger/5 text-muted-foreground border p-3 text-xs">
                    This request{' '}
                    {selected.status === 'timeout' ? 'timed out' : 'failed'}.
                    The API does not record a per-request error message.
                  </div>
                )}

                {selected.creditTransactions &&
                  selected.creditTransactions.length > 0 && (
                    <div>
                      <h4 className="text-foreground mb-2 text-xs font-medium">
                        Credit transactions
                      </h4>
                      <ul className="space-y-1">
                        {selected.creditTransactions.map((t) => (
                          <li
                            key={t.id}
                            className="flex items-center justify-between text-xs"
                          >
                            <span className="text-muted-foreground">
                              {t.reason}
                            </span>
                            <span className="font-mono">
                              {formatNumber(t.amount)}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
              </div>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}

function DetailRow({
  label,
  value,
  mono,
}: {
  label: string;
  value: React.ReactNode;
  mono?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4">
      <span className="text-muted-foreground text-xs">{label}</span>
      <span
        className={`text-foreground text-sm ${mono ? 'font-mono' : ''} text-right break-all`}
      >
        {value}
      </span>
    </div>
  );
}

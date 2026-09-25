/**
 * Client-side aggregation for the Usage Analytics page.
 *
 * The backend `GET /usage` endpoint returns only raw, paginated rows (no
 * server-side date/model filtering or bucketing — see `usage.api.ts`). Every
 * chart and summary figure on `/usage` is therefore derived here, in pure
 * functions over the fetched `UsageLog[]`.
 */
import {
  eachDayOfInterval,
  format,
  isWithinInterval,
  startOfDay,
} from 'date-fns';
import type { UsageLog, UsageStatus } from '@/lib/types';

/** A row's status counts as "failed" unless it succeeded. */
export function isFailed(status: UsageStatus): boolean {
  return status !== 'success';
}

/** Keep only rows whose model is in `models` (empty = keep all). */
export function filterByModel(rows: UsageLog[], models: string[]): UsageLog[] {
  if (models.length === 0) return rows;
  const set = new Set(models);
  return rows.filter((r) => set.has(r.model));
}

/** Keep only rows created within [from, to] inclusive. */
export function filterByRange(
  rows: UsageLog[],
  from: Date,
  to: Date,
): UsageLog[] {
  return rows.filter((r) =>
    isWithinInterval(new Date(r.createdAt), { start: from, end: to }),
  );
}

export interface UsageSummary {
  requests: number;
  tokens: number;
  credits: number;
  avgLatency: number;
}

export function summarize(rows: UsageLog[]): UsageSummary {
  if (rows.length === 0) {
    return { requests: 0, tokens: 0, credits: 0, avgLatency: 0 };
  }
  let tokens = 0;
  let credits = 0;
  let latency = 0;
  for (const r of rows) {
    tokens += r.promptTokens + r.completionTokens;
    credits += r.creditsCost;
    latency += r.latencyMs;
  }
  return {
    requests: rows.length,
    tokens,
    credits,
    avgLatency: Math.round(latency / rows.length),
  };
}

/** Percentage change from `prev` → `curr`; null when there is no baseline. */
export function percentChange(curr: number, prev: number): number | null {
  if (prev === 0) return curr === 0 ? 0 : null;
  return ((curr - prev) / prev) * 100;
}

export interface DailyBucket {
  /** `YYYY-MM-DD` key. */
  date: string;
  /** Short display label, e.g. "3 Sep". */
  label: string;
  promptTokens: number;
  completionTokens: number;
  totalTokens: number;
  credits: number;
  cumulativeCredits: number;
  requests: number;
  success: number;
  failed: number;
  /** Percentage of requests that succeeded (0 when no requests that day). */
  successRate: number;
  failedRate: number;
  /** Mean latency in ms across that day's requests (0 when none). */
  avgLatency: number;
}

/**
 * Bucket rows into one entry per calendar day across [from, to], filling gaps
 * with zeroed days so charts have a continuous x-axis.
 */
export function bucketByDay(
  rows: UsageLog[],
  from: Date,
  to: Date,
): DailyBucket[] {
  const days = eachDayOfInterval({
    start: startOfDay(from),
    end: startOfDay(to),
  });
  const byKey = new Map<string, DailyBucket>();

  for (const day of days) {
    const key = format(day, 'yyyy-MM-dd');
    byKey.set(key, {
      date: key,
      label: format(day, 'd MMM'),
      promptTokens: 0,
      completionTokens: 0,
      totalTokens: 0,
      credits: 0,
      cumulativeCredits: 0,
      requests: 0,
      success: 0,
      failed: 0,
      successRate: 0,
      failedRate: 0,
      avgLatency: 0,
    });
  }

  // Accumulate latency separately to average at the end.
  const latencySum = new Map<string, number>();

  for (const r of rows) {
    const key = format(new Date(r.createdAt), 'yyyy-MM-dd');
    const bucket = byKey.get(key);
    if (!bucket) continue; // outside the range window
    bucket.promptTokens += r.promptTokens;
    bucket.completionTokens += r.completionTokens;
    bucket.totalTokens += r.promptTokens + r.completionTokens;
    bucket.credits += r.creditsCost;
    bucket.requests += 1;
    if (isFailed(r.status)) bucket.failed += 1;
    else bucket.success += 1;
    latencySum.set(key, (latencySum.get(key) ?? 0) + r.latencyMs);
  }

  let cumulative = 0;
  const result: DailyBucket[] = [];
  for (const day of days) {
    const key = format(day, 'yyyy-MM-dd');
    const bucket = byKey.get(key)!;
    cumulative += bucket.credits;
    bucket.cumulativeCredits = cumulative;
    if (bucket.requests > 0) {
      bucket.successRate = (bucket.success / bucket.requests) * 100;
      bucket.failedRate = (bucket.failed / bucket.requests) * 100;
      bucket.avgLatency = Math.round(
        (latencySum.get(key) ?? 0) / bucket.requests,
      );
    }
    result.push(bucket);
  }
  return result;
}

/** A 7×24 grid of request counts: `grid[day][hour]`. Day 0 = Sunday. */
export interface HeatmapData {
  grid: number[][];
  max: number;
}

export function bucketByHourWeekday(rows: UsageLog[]): HeatmapData {
  const grid: number[][] = Array.from({ length: 7 }, () =>
    new Array(24).fill(0),
  );
  let max = 0;
  for (const r of rows) {
    const d = new Date(r.createdAt);
    const day = d.getDay();
    const hour = d.getHours();
    const next = grid[day][hour] + 1;
    grid[day][hour] = next;
    if (next > max) max = next;
  }
  return { grid, max };
}

export interface ModelBucket {
  model: string;
  requests: number;
  tokens: number;
  credits: number;
}

/**
 * Aggregate per model, sorted by request count desc. When there are more than
 * `topN` models the remainder is folded into a single "Other" bucket (charts
 * never cycle categorical hues past the palette).
 */
export function bucketByModel(rows: UsageLog[], topN = 4): ModelBucket[] {
  const byModel = new Map<string, ModelBucket>();
  for (const r of rows) {
    const b = byModel.get(r.model) ?? {
      model: r.model,
      requests: 0,
      tokens: 0,
      credits: 0,
    };
    b.requests += 1;
    b.tokens += r.promptTokens + r.completionTokens;
    b.credits += r.creditsCost;
    byModel.set(r.model, b);
  }
  const sorted = [...byModel.values()].sort((a, b) => b.requests - a.requests);
  if (sorted.length <= topN) return sorted;

  const head = sorted.slice(0, topN);
  const rest = sorted.slice(topN);
  const other = rest.reduce<ModelBucket>(
    (acc, b) => {
      acc.requests += b.requests;
      acc.tokens += b.tokens;
      acc.credits += b.credits;
      return acc;
    },
    { model: 'Other', requests: 0, tokens: 0, credits: 0 },
  );
  return [...head, other];
}

/** Distinct model names present in the rows, sorted alphabetically. */
export function distinctModels(rows: UsageLog[]): string[] {
  return [...new Set(rows.map((r) => r.model))].sort();
}

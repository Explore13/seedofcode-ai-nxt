'use client';

import { useCallback, useMemo } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { endOfDay, startOfDay, subDays } from 'date-fns';

export type RangePreset = 'today' | '7d' | '30d' | 'custom';

export interface UsageFilterState {
  preset: RangePreset;
  from: Date;
  to: Date;
  /** Selected model names; empty = all models. */
  models: string[];
}

function presetToRange(preset: RangePreset): { from: Date; to: Date } {
  const to = endOfDay(new Date());
  switch (preset) {
    case 'today':
      return { from: startOfDay(new Date()), to };
    case '7d':
      return { from: startOfDay(subDays(new Date(), 6)), to };
    case '30d':
    default:
      return { from: startOfDay(subDays(new Date(), 29)), to };
  }
}

/**
 * URL-param-driven usage filters (`?range=&from=&to=&model=`). Shareable and
 * survives reload; every change updates the URL, which TanStack Query keys off.
 */
export function useUsageFilters(): UsageFilterState & {
  setPreset: (preset: Exclude<RangePreset, 'custom'>) => void;
  setCustomRange: (from: Date, to: Date) => void;
  setModels: (models: string[]) => void;
} {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const state = useMemo<UsageFilterState>(() => {
    const rawPreset = (searchParams.get('range') as RangePreset | null) ?? '7d';
    const models =
      searchParams
        .get('model')
        ?.split(',')
        .map((m) => m.trim())
        .filter(Boolean) ?? [];

    if (rawPreset === 'custom') {
      const fromParam = searchParams.get('from');
      const toParam = searchParams.get('to');
      const from = fromParam
        ? startOfDay(new Date(fromParam))
        : presetToRange('7d').from;
      const to = toParam ? endOfDay(new Date(toParam)) : presetToRange('7d').to;
      return { preset: 'custom', from, to, models };
    }

    const preset: RangePreset = ['today', '7d', '30d'].includes(rawPreset)
      ? rawPreset
      : '7d';
    return { preset, ...presetToRange(preset), models };
  }, [searchParams]);

  const commit = useCallback(
    (next: URLSearchParams) => {
      router.replace(`${pathname}?${next.toString()}`, { scroll: false });
    },
    [pathname, router],
  );

  const setPreset = useCallback(
    (preset: Exclude<RangePreset, 'custom'>) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('range', preset);
      next.delete('from');
      next.delete('to');
      commit(next);
    },
    [searchParams, commit],
  );

  const setCustomRange = useCallback(
    (from: Date, to: Date) => {
      const next = new URLSearchParams(searchParams.toString());
      next.set('range', 'custom');
      next.set('from', from.toISOString().slice(0, 10));
      next.set('to', to.toISOString().slice(0, 10));
      commit(next);
    },
    [searchParams, commit],
  );

  const setModels = useCallback(
    (models: string[]) => {
      const next = new URLSearchParams(searchParams.toString());
      if (models.length === 0) next.delete('model');
      else next.set('model', models.join(','));
      commit(next);
    },
    [searchParams, commit],
  );

  return { ...state, setPreset, setCustomRange, setModels };
}

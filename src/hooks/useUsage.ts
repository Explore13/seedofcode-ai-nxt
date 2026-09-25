import { useQuery } from '@tanstack/react-query';
import { usageApi } from '@/lib/api';
import type { UsageLog } from '@/lib/types';

const PAGE_LIMIT = 100; // backend hard cap
const MAX_PAGES = 50; // safety cap → at most 5,000 rows fetched

/**
 * Fetch every usage row created on or after `earliest`, walking the paginated
 * `GET /usage` endpoint (newest-first) until we pass the boundary, run out of
 * pages, or hit the safety cap. The backend has no date filter, so the range is
 * applied here by stopping early once rows get older than `earliest`.
 */
async function fetchRowsSince(earliest: Date, models: string[] = []): Promise<UsageLog[]> {
  const rows: UsageLog[] = [];
  const boundary = earliest.getTime();

  for (let page = 1; page <= MAX_PAGES; page++) {
    const { data, meta } = await usageApi.list({ page, limit: PAGE_LIMIT, models });
    rows.push(...data);

    const last = data[data.length - 1];
    const reachedBoundary =
      last && new Date(last.createdAt).getTime() < boundary;
    if (
      reachedBoundary ||
      page >= meta.totalPages ||
      data.length < PAGE_LIMIT
    ) {
      break;
    }
  }
  return rows;
}

/**
 * Rows for the selected range plus the immediately-preceding window of equal
 * length (so summary cards can show a trend vs the previous period). Consumers
 * slice at `from` to separate current from previous.
 */
export function useUsage(from: Date, to: Date, models: string[] = []) {
  const rangeMs = Math.max(to.getTime() - from.getTime(), 0);
  const prevFrom = new Date(from.getTime() - rangeMs);

  return useQuery({
    queryKey: ['usage', 'range', from.toISOString(), to.toISOString(), models.join(',')],
    queryFn: () => fetchRowsSince(prevFrom, models),
  });
}

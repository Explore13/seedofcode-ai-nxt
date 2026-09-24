import { useInfiniteQuery } from '@tanstack/react-query';
import { usageApi } from '@/lib/api';

/**
 * Infinitely-scrolling usage rows (newest-first) for the credit points timeline.
 * Pages the backend `GET /usage?page=&limit=` endpoint.
 */
export function useUsageInfinite(limit = 25) {
  return useInfiniteQuery({
    queryKey: ['usage', 'infinite', limit],
    queryFn: ({ pageParam }) => usageApi.list({ page: pageParam, limit }),
    initialPageParam: 1,
    getNextPageParam: (last) =>
      last.meta.page < last.meta.totalPages ? last.meta.page + 1 : undefined,
  });
}

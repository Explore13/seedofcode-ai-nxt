import { keepPreviousData, useQuery } from '@tanstack/react-query';
import { usageApi } from '@/lib/api';

/** A single server page of raw usage rows (for the request-history table). */
export function useUsagePage(page: number, limit = 20) {
  return useQuery({
    queryKey: ['usage', 'page', page, limit],
    queryFn: () => usageApi.list({ page, limit }),
    placeholderData: keepPreviousData,
  });
}

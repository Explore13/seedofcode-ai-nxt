import { apiClient } from './client';
import { data, page } from './http';
import type {
  ApiEnvelope,
  Paginated,
  TodayUsageSummary,
  UsageLog,
  UsageQuery,
} from '@/lib/types';

/**
 * Usage analytics (backend prefix `/usage`, JWT).
 *
 * P8a note: the list endpoint supports ONLY `page` + `limit` (limit ≤ 100).
 * There is no server-side date/model filter — the analytics page fetches rows
 * and aggregates/filters client-side.
 */
export const usageApi = {
  list(query: UsageQuery = {}): Promise<Paginated<UsageLog>> {
    const params: Record<string, number> = {};
    if (query.page != null) params.page = query.page;
    if (query.limit != null) params.limit = query.limit;
    return apiClient
      .get<ApiEnvelope<UsageLog[]>>('/usage', { params })
      .then(page<UsageLog>);
  },

  today(): Promise<TodayUsageSummary> {
    return apiClient
      .get<ApiEnvelope<TodayUsageSummary>>('/usage/today')
      .then(data);
  },
};

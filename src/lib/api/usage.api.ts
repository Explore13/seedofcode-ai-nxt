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
 * P8a note: the list endpoint supports `page` + `limit` + `models`.
 * Date range is filtered client-side.
 */
export const usageApi = {
  list(query: UsageQuery = {}): Promise<Paginated<UsageLog>> {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const params: Record<string, any> = {};
    if (query.page != null) params.page = query.page;
    if (query.limit != null) params.limit = query.limit;
    if (query.models && query.models.length > 0) params.models = query.models.join(',');
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

import type { AxiosResponse } from 'axios';
import type { ApiEnvelope, Paginated, PageMeta } from '@/lib/types';

/** Unwrap the envelope to its `data` payload. */
export function data<T>(res: AxiosResponse<ApiEnvelope<T>>): T {
  return res.data.data;
}

/** Unwrap a paginated envelope to `{ data, meta }`. */
export function page<T>(res: AxiosResponse<ApiEnvelope<T[]>>): Paginated<T> {
  const meta: PageMeta = res.data.meta ?? {
    total: res.data.data?.length ?? 0,
    page: 1,
    limit: res.data.data?.length ?? 0,
    totalPages: 1,
  };
  return { data: res.data.data, meta };
}

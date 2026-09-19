import { apiClient } from './client';
import { data } from './http';
import type { ApiEnvelope, ModelInfo } from '@/lib/types';

/** Model discovery (backend prefix `/models`, Hybrid auth). */
export const modelsApi = {
  list(): Promise<ModelInfo[]> {
    return apiClient.get<ApiEnvelope<ModelInfo[]>>('/models').then(data);
  },

  get(name: string): Promise<ModelInfo> {
    return apiClient
      .get<ApiEnvelope<ModelInfo>>(`/models/${encodeURIComponent(name)}`)
      .then(data);
  },

  byFamily(family: string): Promise<ModelInfo[]> {
    return apiClient
      .get<ApiEnvelope<ModelInfo[]>>(
        `/models/family/${encodeURIComponent(family)}`,
      )
      .then(data);
  },
};

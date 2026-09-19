import { apiClient } from './client';
import { data } from './http';
import type {
  ApiEnvelope,
  ApiKey,
  CreateApiKeyPayload,
  CreateApiKeyResult,
  RegenerateApiKeyResult,
  UpdateApiKeyPayload,
} from '@/lib/types';

/** API key management (backend prefix `/apikeys`, JWT). */
export const apiKeysApi = {
  list(): Promise<ApiKey[]> {
    return apiClient.get<ApiEnvelope<ApiKey[]>>('/apikeys').then(data);
  },

  /** Create a key; the plaintext `rawKey` is returned exactly once. */
  create(payload: CreateApiKeyPayload): Promise<CreateApiKeyResult> {
    return apiClient
      .post<ApiEnvelope<CreateApiKeyResult>>('/apikeys', payload)
      .then(data);
  },

  update(id: string, payload: UpdateApiKeyPayload): Promise<ApiKey> {
    return apiClient
      .patch<ApiEnvelope<ApiKey>>(`/apikeys/${id}`, payload)
      .then(data);
  },

  remove(id: string): Promise<unknown> {
    return apiClient.delete<ApiEnvelope<unknown>>(`/apikeys/${id}`).then(data);
  },

  /** Rotate a key; returns the new one-time plaintext `rawKey`. */
  regenerate(id: string): Promise<RegenerateApiKeyResult> {
    return apiClient
      .post<ApiEnvelope<RegenerateApiKeyResult>>(`/apikeys/${id}/regenerate`)
      .then(data);
  },
};

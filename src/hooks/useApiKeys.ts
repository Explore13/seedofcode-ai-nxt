import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiKeysApi } from '@/lib/api';
import type { CreateApiKeyPayload, UpdateApiKeyPayload } from '@/lib/types';

const KEYS_QUERY_KEY = ['apikeys'] as const;

/** List all of the current user's API keys (newest first). */
export function useApiKeys() {
  return useQuery({
    queryKey: KEYS_QUERY_KEY,
    queryFn: () => apiKeysApi.list(),
  });
}

/** Create a key. Resolves to `{ rawKey, apiKey }` — the plaintext is one-time. */
export function useCreateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateApiKeyPayload) => apiKeysApi.create(payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS_QUERY_KEY }),
  });
}

/** Rename or enable/disable a key. */
export function useUpdateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: UpdateApiKeyPayload;
    }) => apiKeysApi.update(id, payload),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS_QUERY_KEY }),
  });
}

/** Soft-revoke a key (drops from the list). */
export function useDeleteApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.remove(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS_QUERY_KEY }),
  });
}

/** Rotate a key. Resolves to the new one-time plaintext `{ rawKey }`. */
export function useRegenerateApiKey() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => apiKeysApi.regenerate(id),
    onSuccess: () => qc.invalidateQueries({ queryKey: KEYS_QUERY_KEY }),
  });
}

import { useQuery } from '@tanstack/react-query';
import { modelsApi } from '@/lib/api';

/** Available models (enabled + disabled). Cached 5 min. */
export function useModels() {
  return useQuery({
    queryKey: ['models'],
    queryFn: () => modelsApi.list(),
    staleTime: 5 * 60 * 1000,
  });
}

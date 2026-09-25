import { useQuery } from '@tanstack/react-query';
import { usageApi } from '@/lib/api';

export function useUsageToday() {
  return useQuery({
    queryKey: ['usage', 'today'],
    queryFn: () => usageApi.today(),
  });
}

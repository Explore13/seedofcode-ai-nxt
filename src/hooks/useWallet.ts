import { useQuery } from '@tanstack/react-query';
import { creditsApi } from '@/lib/api';

export function useWallet() {
  return useQuery({
    queryKey: ['wallet'],
    queryFn: () => creditsApi.balance(),
    refetchInterval: 30000,
  });
}

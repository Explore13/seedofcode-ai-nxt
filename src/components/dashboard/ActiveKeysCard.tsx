'use client';

import { useApiKeys } from '@/hooks/useApiKeys';
import { StatCard } from '../shared/StatCard';

export function ActiveKeysCard() {
  const { data: keys, isLoading, isError } = useApiKeys();

  const activeCount = keys?.filter((k) => k.isActive).length || 0;
  const displayValue = isLoading ? '...' : isError ? 'Error' : activeCount;

  return (
    <StatCard title="Active API Keys" value={displayValue} className="h-full" />
  );
}

"use client";

import { useApiKeys } from '@/hooks/useApiKeys';
import { StatCard } from '../shared/StatCard';
import Link from 'next/link';
import { PlusIcon } from 'lucide-react';

export function ActiveKeysCard() {
  const { data: keys, isLoading, isError } = useApiKeys();

  const activeCount = keys?.filter((k) => k.isActive).length || 0;
  const displayValue = isLoading ? '...' : isError ? 'Error' : activeCount;

  return (
    <div className="relative group">
      <StatCard
        title="Active API Keys"
        value={displayValue}
        className="h-full"
      />
      <Link
        href="/api-keys"
        className="absolute top-4 right-4 flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
      >
        <PlusIcon className="h-3 w-3" />
        New Key
      </Link>
    </div>
  );
}

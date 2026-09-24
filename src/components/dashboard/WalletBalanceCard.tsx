'use client';

import { useWallet } from '@/hooks/useWallet';
import { formatNumber } from '@/lib/format';
import { StatCard } from '../shared/StatCard';
import { Coins } from 'lucide-react';

export function WalletBalanceCard() {
  const { data: wallet, isLoading, isError } = useWallet();

  const displayValue = isLoading
    ? '...'
    : isError
      ? 'Error'
      : formatNumber(wallet?.balance || 0);

  return (
    <StatCard
      title="Available Credits"
      value={displayValue}
      icon={<Coins className="h-6 w-6 text-chlorophyll" />}
      className="h-full"
    />
  );
}

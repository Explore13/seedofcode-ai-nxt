"use client";

import { useState } from 'react';
import { useWallet } from '@/hooks/useWallet';
import { formatCredits } from '@/lib/format';
import { StatCard } from '../shared/StatCard';
import { ComingSoonDialog } from '../shared/ComingSoonDialog';
import { PlusIcon } from 'lucide-react';

export function WalletBalanceCard() {
  const { data: wallet, isLoading, isError } = useWallet();
  const [showTopUp, setShowTopUp] = useState(false);

  // Fallback for loading / error states
  const displayValue = isLoading ? '...' : isError ? 'Error' : formatCredits(wallet?.balance || 0);

  return (
    <>
      <div className="relative group">
        <StatCard
          title="Available Credits"
          value={displayValue}
          className="h-full"
        />
        <button
          onClick={() => setShowTopUp(true)}
          className="absolute top-4 right-4 flex items-center justify-center gap-2 rounded-full border border-border bg-surface px-3 py-1.5 text-xs font-medium text-foreground opacity-0 transition-opacity group-hover:opacity-100 hover:bg-muted"
        >
          <PlusIcon className="h-3 w-3" />
          Top Up
        </button>
      </div>

      <ComingSoonDialog
        feature="Pricing & credits"
        open={showTopUp}
        onOpenChange={setShowTopUp}
      />
    </>
  );
}

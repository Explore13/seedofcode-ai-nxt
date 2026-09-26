import type { Metadata } from 'next';
import { WalletBalanceCard } from '@/components/dashboard/WalletBalanceCard';
import { TodayStatsRow } from '@/components/dashboard/TodayStatsRow';
import { ActiveKeysCard } from '@/components/dashboard/ActiveKeysCard';
import { QuickstartSnippet } from '@/components/dashboard/QuickstartSnippet';

export const metadata: Metadata = {
  title: 'Overview',
  robots: { index: false },
};

export default function HomePage() {
  return (
    <div className="mx-auto max-w-6xl space-y-8 p-8">
      <div>
        <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
          Overview
        </h1>
        <p className="text-muted-foreground mt-2">
          Welcome back. Here&apos;s a summary of your usage today.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <WalletBalanceCard />
        <TodayStatsRow />
        <ActiveKeysCard />
      </div>

      <div className="pt-4">
        <QuickstartSnippet />
      </div>
    </div>
  );
}

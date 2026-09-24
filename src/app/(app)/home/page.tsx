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
    <div className="p-8 max-w-6xl mx-auto space-y-8">
      <div>
        <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
          Overview
        </h1>
        <p className="mt-2 text-muted-foreground">
          Welcome back. Here&apos;s a summary of your usage today.
        </p>
      </div>

      <div className="grid gap-6 grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
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

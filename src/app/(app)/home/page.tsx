import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Overview',
  robots: { index: false },
};

export default function HomePage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
        Overview
      </h1>
      <p className="mt-2 text-muted-foreground">
        Dashboard coming in Phase 6.
      </p>
    </div>
  );
}

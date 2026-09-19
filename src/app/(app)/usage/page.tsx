import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Usage Analytics',
  robots: { index: false },
};

export default function UsagePage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
        Usage Analytics
      </h1>
      <p className="mt-2 text-muted-foreground">
        Full analytics dashboard coming in Phase 8.
      </p>
    </div>
  );
}

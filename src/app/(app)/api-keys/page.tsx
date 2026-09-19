import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'API Keys',
  robots: { index: false },
};

export default function ApiKeysPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
        API Keys
      </h1>
      <p className="mt-2 text-muted-foreground">
        Key management coming in Phase 7.
      </p>
    </div>
  );
}

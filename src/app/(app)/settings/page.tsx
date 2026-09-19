import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Settings',
  robots: { index: false },
};

export default function SettingsPage() {
  return (
    <div className="p-8">
      <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
        Settings
      </h1>
      <p className="mt-2 text-muted-foreground">
        Profile and preferences coming in Phase 9.
      </p>
    </div>
  );
}

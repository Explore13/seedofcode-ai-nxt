'use client';

import { useState } from 'react';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import type { ThemePreference } from '@/lib/theme';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { ComingSoonDialog } from '@/components/shared/ComingSoonDialog';
import { cn } from '@/lib/utils';
import { Monitor, Moon, Sun } from 'lucide-react';

const THEME_OPTIONS: {
  value: ThemePreference;
  label: string;
  icon: typeof Sun;
}[] = [
  { value: 'light', label: 'Light', icon: Sun },
  { value: 'dark', label: 'Dark', icon: Moon },
  { value: 'system', label: 'System', icon: Monitor },
];

function formatJoined(iso: string): string {
  return new Date(iso).toLocaleDateString('en-US', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });
}

function SettingsCard({
  title,
  description,
  children,
}: {
  title: string;
  description?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-card border-border bg-surface border p-6">
      <div className="mb-4">
        <h2 className="text-foreground font-medium">{title}</h2>
        {description && (
          <p className="text-muted-foreground mt-1 text-sm">{description}</p>
        )}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
      <span className="text-muted-foreground text-sm">{label}</span>
      <span className="text-foreground text-sm font-medium">{value}</span>
    </div>
  );
}

export function SettingsClient() {
  const user = useAuthStore((s) => s.user);
  const preference = useThemeStore((s) => s.preference);
  const setPreference = useThemeStore((s) => s.setPreference);
  const [billingOpen, setBillingOpen] = useState(false);

  return (
    <div className="mx-auto max-w-3xl space-y-6 p-8">
      <div>
        <h1 className="font-display text-display-sm text-foreground font-semibold tracking-tight">
          Settings
        </h1>
        <p className="text-muted-foreground mt-2">
          Manage your profile, appearance and billing.
        </p>
      </div>

      {/* Profile — read-only (the API exposes no profile-update endpoint) */}
      <SettingsCard title="Profile" description="Your account details.">
        {user ? (
          <div className="space-y-3">
            <Field label="Name" value={user.name?.trim() || '—'} />
            <Field
              label="Email"
              value={<span className="font-mono">{user.email}</span>}
            />
            <Field
              label="Plan"
              value={
                <Badge variant="outline" className="capitalize">
                  {user.plan}
                </Badge>
              }
            />
            <Field
              label="Email verified"
              value={
                user.verified ? (
                  <Badge variant="outline">Verified</Badge>
                ) : (
                  <Badge variant="destructive">Unverified</Badge>
                )
              }
            />
            <Field label="Joined" value={formatJoined(user.createdAt)} />
          </div>
        ) : (
          <div className="space-y-3">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-5 w-full" />
            ))}
          </div>
        )}
      </SettingsCard>

      {/* Appearance */}
      <SettingsCard
        title="Appearance"
        description="Choose how the portal looks."
      >
        <div
          role="group"
          aria-label="Theme preference"
          className="rounded-control border-border inline-flex items-center gap-1 border p-1"
        >
          {THEME_OPTIONS.map((opt) => {
            const Icon = opt.icon;
            const active = preference === opt.value;
            return (
              <button
                key={opt.value}
                type="button"
                aria-pressed={active}
                onClick={() => setPreference(opt.value)}
                className={cn(
                  'inline-flex items-center gap-1.5 rounded-[7px] px-3 py-1.5 text-sm font-medium transition-colors',
                  active
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="h-4 w-4" />
                {opt.label}
              </button>
            );
          })}
        </div>
      </SettingsCard>

      {/* Billing — deferred */}
      <SettingsCard title="Billing" description="Credits and payment.">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-muted-foreground text-sm">
            Self-serve billing is coming soon. Credits are provisioned manually
            for now.
          </p>
          <Button
            variant="outline"
            onClick={() => setBillingOpen(true)}
            className="shrink-0"
          >
            Manage billing
          </Button>
        </div>
      </SettingsCard>

      <ComingSoonDialog
        open={billingOpen}
        onOpenChange={setBillingOpen}
        feature="Billing & credits"
      />
    </div>
  );
}

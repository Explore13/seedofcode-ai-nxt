'use client';

import { useEffect, useRef, useState } from 'react';
import { authApi, creditsApi, ApiError } from '@/lib/api';
import { useAuthStore } from '@/store/auth.store';
import { useThemeStore } from '@/store/theme.store';
import { cn } from '@/lib/cn';

/* ─────────────────────────────────────────────────────────────────────────
 * Dev harness — Phase 0 verification surface.
 *   1. Renders the full token system (color / radius / type) in the live theme.
 *   2. Exercises the axios client end-to-end: register → me → wallet, plus a
 *      forced-401 to prove the refresh-and-retry-once interceptor.
 * Dev-only (the /dev route 404s in production).
 * ───────────────────────────────────────────────────────────────────────── */

type LogLevel = 'ok' | 'error' | 'info';
interface LogEntry {
  id: number;
  level: LogLevel;
  label: string;
  detail: string;
  time: string;
}

const TEST_PASSWORD = 'DevPass123!';

export function DevHarness() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  return (
    <div className="bg-background text-foreground min-h-dvh">
      <header className="border-border bg-background/80 sticky top-0 z-10 flex items-center justify-between border-b px-6 py-4 backdrop-blur">
        <div>
          <p className="text-accent font-mono text-xs">phase-0 harness</p>
          <h1 className="font-display text-2xl font-semibold">
            Design tokens &amp; API wiring
          </h1>
        </div>
        <ThemeToggle mounted={mounted} />
      </header>

      <main className="mx-auto flex max-w-6xl flex-col gap-12 px-6 py-10">
        <InterceptorPanel />
        <ColorTokens />
        <RadiusAndType />
      </main>
    </div>
  );
}

/* ── Theme toggle ─────────────────────────────────────────────────────────── */
function ThemeToggle({ mounted }: { mounted: boolean }) {
  const resolved = useThemeStore((s) => s.resolved);
  const toggle = useThemeStore((s) => s.toggle);
  return (
    <button
      type="button"
      onClick={toggle}
      className="rounded-control border-border bg-surface hover:bg-surface-2 border px-4 py-2 text-sm font-medium transition-colors"
      aria-label="Toggle color theme"
    >
      {mounted ? (resolved === 'dark' ? '☾ Dark' : '☀ Light') : 'Theme'}
    </button>
  );
}

/* ── Interceptor / API test panel ─────────────────────────────────────────── */
function InterceptorPanel() {
  const [log, setLog] = useState<LogEntry[]>([]);
  const [busy, setBusy] = useState(false);
  const idRef = useRef(0);
  const credsRef = useRef<{ email: string; password: string } | null>(null);

  const user = useAuthStore((s) => s.user);
  const accessToken = useAuthStore((s) => s.accessToken);
  const refreshToken = useAuthStore((s) => s.refreshToken);
  const status = useAuthStore((s) => s.status);

  function push(level: LogLevel, label: string, detail: string) {
    idRef.current += 1;
    const time = new Date().toLocaleTimeString();
    setLog((prev) => [
      { id: idRef.current, level, label, detail, time },
      ...prev,
    ]);
  }

  async function run(label: string, fn: () => Promise<void>) {
    if (busy) return;
    setBusy(true);
    try {
      await fn();
    } catch (error) {
      const message =
        error instanceof ApiError
          ? `${error.status ?? 'ERR'} — ${error.message}`
          : String(error);
      push('error', label, message);
    } finally {
      setBusy(false);
    }
  }

  const register = () =>
    run('Register', async () => {
      const email = `dev+${Date.now()}@seedofcode.dev`;
      const tokens = await authApi.register({
        email,
        password: TEST_PASSWORD,
        name: 'Dev Tester',
      });
      credsRef.current = { email, password: TEST_PASSWORD };
      useAuthStore.getState().setSession(tokens);
      push('ok', 'Register', `Created & signed in as ${email}`);
      const me = await authApi.me();
      useAuthStore.getState().setUser(me);
      push('ok', 'GET /auth/me', `verified=${me.verified}, plan=${me.plan}`);
    });

  const login = () =>
    run('Login', async () => {
      if (!credsRef.current) {
        push('info', 'Login', 'Register a test user first.');
        return;
      }
      const tokens = await authApi.login(credsRef.current);
      useAuthStore.getState().setSession(tokens);
      const me = await authApi.me();
      useAuthStore.getState().setUser(me);
      push('ok', 'Login', `Signed in as ${me.email}`);
    });

  const fetchWallet = () =>
    run('Wallet', async () => {
      const wallet = await creditsApi.balance();
      push('ok', 'GET wallet/balance', `balance = ${wallet.balance} credits`);
    });

  const breakThenFetch = () =>
    run('Refresh flow', async () => {
      if (!refreshToken) {
        push('info', 'Refresh flow', 'Sign in first (need a refresh token).');
        return;
      }
      const before = useAuthStore.getState().accessToken;
      // Corrupt the access token but keep the (valid) refresh token. We hit
      // /auth/me because it is JWT-authed AND @AllowUnverified — so a fresh
      // (unverified) test user still gets a clean 200 after the refresh,
      // proving the 401→refresh→retry path end to end.
      useAuthStore.getState().setAccessToken('invalid.access.token');
      push(
        'info',
        'Refresh flow',
        'Access token corrupted → calling /auth/me…',
      );
      const me = await authApi.me();
      const after = useAuthStore.getState().accessToken;
      const rotated =
        !!after && after !== before && after !== 'invalid.access.token';
      push(
        rotated ? 'ok' : 'error',
        'Refresh flow',
        rotated
          ? `401 → refreshed → retried 200 OK (${me.email}).`
          : 'Retry succeeded but the token was not rotated as expected.',
      );
    });

  const concurrentRefresh = () =>
    run('Concurrent refresh', async () => {
      if (!refreshToken) {
        push('info', 'Concurrent refresh', 'Sign in first.');
        return;
      }
      useAuthStore.getState().setAccessToken('invalid.access.token');
      push(
        'info',
        'Concurrent refresh',
        '3 parallel /auth/me on a dead token…',
      );
      const results = await Promise.all([
        authApi.me(),
        authApi.me(),
        authApi.me(),
      ]);
      push(
        'ok',
        'Concurrent refresh',
        `All 3 succeeded via one shared refresh (${results[0].email}).`,
      );
    });

  const logout = () =>
    run('Logout', async () => {
      await authApi.logout().catch(() => undefined);
      useAuthStore.getState().clear();
      credsRef.current = null;
      push('info', 'Logout', 'Session cleared.');
    });

  return (
    <section className="flex flex-col gap-4">
      <SectionTitle
        eyebrow="live"
        title="API client & interceptor"
        note="Exercises the real backend through the axios client."
      />

      <div className="grid gap-4 lg:grid-cols-[1fr_1.2fr]">
        {/* Controls + state */}
        <div className="rounded-card border-border bg-surface flex flex-col gap-4 border p-5">
          <div className="flex flex-wrap gap-2">
            <Btn onClick={register} disabled={busy}>
              Register test user
            </Btn>
            <Btn onClick={login} disabled={busy} variant="ghost">
              Re-login
            </Btn>
            <Btn onClick={fetchWallet} disabled={busy} variant="ghost">
              GET wallet
            </Btn>
            <Btn onClick={breakThenFetch} disabled={busy}>
              Force 401 → refresh
            </Btn>
            <Btn onClick={concurrentRefresh} disabled={busy} variant="ghost">
              Concurrent refresh
            </Btn>
            <Btn onClick={logout} disabled={busy} variant="danger">
              Logout
            </Btn>
          </div>

          <dl className="border-border grid grid-cols-2 gap-x-4 gap-y-2 border-t pt-4 text-sm">
            <StateRow label="Status" value={status} />
            <StateRow label="User" value={user?.email ?? '—'} />
            <StateRow
              label="Verified"
              value={user ? String(user.verified) : '—'}
            />
            <StateRow
              label="Access token"
              value={accessToken ? `present (${accessToken.length})` : 'none'}
            />
            <StateRow
              label="Refresh token"
              value={refreshToken ? 'present' : 'none'}
            />
          </dl>
        </div>

        {/* Log */}
        <div className="rounded-card border-border bg-surface flex max-h-96 flex-col gap-2 overflow-auto border p-5">
          {log.length === 0 ? (
            <p className="text-muted-foreground text-sm">
              No calls yet. Start with “Register test user”.
            </p>
          ) : (
            log.map((entry) => <LogRow key={entry.id} entry={entry} />)
          )}
        </div>
      </div>
    </section>
  );
}

function StateRow({ label, value }: { label: string; value: string }) {
  return (
    <>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="truncate font-mono text-xs">{value}</dd>
    </>
  );
}

function LogRow({ entry }: { entry: LogEntry }) {
  const dot =
    entry.level === 'ok'
      ? 'bg-success'
      : entry.level === 'error'
        ? 'bg-danger'
        : 'bg-info';
  return (
    <div className="rounded-chip border-border bg-surface-2 flex items-start gap-3 border px-3 py-2">
      <span className={cn('mt-1.5 size-2 shrink-0 rounded-full', dot)} />
      <div className="min-w-0">
        <p className="flex items-center gap-2 text-sm font-medium">
          {entry.label}
          <span className="text-subtle-foreground font-mono text-[11px]">
            {entry.time}
          </span>
        </p>
        <p className="text-muted-foreground font-mono text-xs break-words">
          {entry.detail}
        </p>
      </div>
    </div>
  );
}

/* ── Color tokens ─────────────────────────────────────────────────────────── */
const BRAND: Array<[string, string]> = [
  ['pine', 'var(--pine)'],
  ['moss', 'var(--moss)'],
  ['paper', 'var(--paper)'],
  ['evergreen', 'var(--evergreen)'],
  ['chlorophyll', 'var(--chlorophyll)'],
  ['harvest', 'var(--harvest)'],
];

const SEMANTIC: Array<[string, string]> = [
  ['background', 'var(--background)'],
  ['surface', 'var(--surface)'],
  ['surface-2', 'var(--surface-2)'],
  ['border', 'var(--border)'],
  ['border-strong', 'var(--border-strong)'],
  ['foreground', 'var(--foreground)'],
  ['muted-foreground', 'var(--muted-foreground)'],
  ['primary', 'var(--primary)'],
  ['accent', 'var(--accent)'],
  ['success', 'var(--success)'],
  ['warning', 'var(--warning)'],
  ['danger', 'var(--danger-color)'],
  ['info', 'var(--info-color)'],
  ['ring', 'var(--ring)'],
];

function ColorTokens() {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle
        eyebrow="palette"
        title="Color tokens"
        note="Should update instantly on theme toggle — no flash, no rebuild."
      />
      <div>
        <p className="text-muted-foreground mb-2 text-sm font-medium">Brand</p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {BRAND.map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </div>
      </div>
      <div>
        <p className="text-muted-foreground mb-2 text-sm font-medium">
          Semantic
        </p>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-7">
          {SEMANTIC.map(([name, value]) => (
            <Swatch key={name} name={name} value={value} />
          ))}
        </div>
      </div>

      {/* On-color contrast checks */}
      <div className="grid gap-3 sm:grid-cols-3">
        <ContrastCard
          label="primary"
          className="bg-primary text-primary-foreground"
        />
        <ContrastCard
          label="accent"
          className="bg-accent text-accent-foreground"
        />
        <ContrastCard
          label="surface"
          className="border-border bg-surface text-foreground border"
        />
      </div>
    </section>
  );
}

function Swatch({ name, value }: { name: string; value: string }) {
  return (
    <div className="rounded-control border-border overflow-hidden border">
      <div className="h-14 w-full" style={{ backgroundColor: value }} />
      <div className="bg-surface px-2 py-1.5">
        <p className="truncate text-xs font-medium">{name}</p>
      </div>
    </div>
  );
}

function ContrastCard({
  label,
  className,
}: {
  label: string;
  className: string;
}) {
  return (
    <div className={cn('rounded-card flex flex-col gap-1 p-4', className)}>
      <p className="text-sm font-semibold">{label}</p>
      <p className="text-sm">The quick brown fox jumps. 0123456789</p>
    </div>
  );
}

/* ── Radius + typography ──────────────────────────────────────────────────── */
function RadiusAndType() {
  return (
    <section className="flex flex-col gap-4">
      <SectionTitle
        eyebrow="form"
        title="Radius & typography"
        note="Hierarchical radii; Fraunces display, Geist UI, Geist Mono data."
      />

      <div className="flex flex-wrap gap-4">
        {(
          [
            ['chip · 6px', 'rounded-chip'],
            ['control · 10px', 'rounded-control'],
            ['card · 16px', 'rounded-card'],
            ['pill', 'rounded-pill'],
          ] as const
        ).map(([label, cls]) => (
          <div key={cls} className="flex flex-col items-center gap-2">
            <div
              className={cn(
                'border-border-strong bg-surface-2 size-20 border',
                cls,
              )}
            />
            <span className="text-muted-foreground text-xs">{label}</span>
          </div>
        ))}
      </div>

      <div className="rounded-card border-border bg-surface flex flex-col gap-3 border p-6">
        <p className="font-display text-display-sm font-semibold tracking-tight">
          Cultivated &amp; engineered
        </p>
        <p className="font-display text-3xl">Fraunces display serif</p>
        <p className="text-lg">
          Geist Sans body — the quick brown fox jumps over the lazy dog.
        </p>
        <p className="text-muted-foreground font-mono text-sm">
          soc_live_ab12cdef3456 · 892,400 tokens · 1.24s
        </p>
      </div>
    </section>
  );
}

/* ── Shared bits ──────────────────────────────────────────────────────────── */
function SectionTitle({
  eyebrow,
  title,
  note,
}: {
  eyebrow: string;
  title: string;
  note: string;
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="text-accent font-mono text-xs">{eyebrow}</span>
      <h2 className="font-display text-xl font-semibold">{title}</h2>
      <p className="text-muted-foreground text-sm">{note}</p>
    </div>
  );
}

function Btn({
  children,
  onClick,
  disabled,
  variant = 'primary',
}: {
  children: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  variant?: 'primary' | 'ghost' | 'danger';
}) {
  const styles: Record<typeof variant, string> = {
    primary:
      'bg-primary text-primary-foreground hover:bg-primary-hover border-transparent',
    ghost: 'bg-surface text-foreground hover:bg-surface-2 border-border',
    danger: 'bg-transparent text-danger hover:bg-danger/10 border-border',
  };
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={cn(
        'rounded-control border px-3 py-2 text-sm font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50',
        styles[variant],
      )}
    >
      {children}
    </button>
  );
}

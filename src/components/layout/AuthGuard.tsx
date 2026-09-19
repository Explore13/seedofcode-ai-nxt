'use client';

import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/auth.store';
import { authApi } from '@/lib/api';

/**
 * AuthGuard — the authoritative client-side auth gate for the (app) group.
 *
 * Lifecycle:
 * 1. Mount: hydrate the refresh token from localStorage → call GET /auth/me
 *    using the interceptor (which will auto-refresh the access token if needed).
 * 2. Verified → set user + status → render children.
 * 3. Unauthenticated → redirect to /login (no protected content shown).
 *
 * The guard renders a full-screen skeleton until auth state is resolved so
 * users never see a content flash on cold load.
 */
export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { status, setUser, setStatus, setSession, hydrateFromStorage } =
    useAuthStore();
  const hasRun = useRef(false);

  useEffect(() => {
    // Run only once per mount (Strict Mode fires effects twice in dev).
    if (hasRun.current) return;
    hasRun.current = true;

    const refreshToken = hydrateFromStorage();
    if (!refreshToken) {
      setStatus('unauthenticated');
      return;
    }

    // We have a persisted refresh token — attempt silent re-auth then fetch me.
    // The axios interceptor handles the /auth/refresh call on a 401.
    authApi
      .me()
      .then((user) => {
        setUser(user);
        setStatus('authenticated');
      })
      .catch(() => {
        // refresh failed or no network — treat as unauthenticated
        setStatus('unauthenticated');
      });
  }, [hydrateFromStorage, setSession, setStatus, setUser]);

  // Unknown → skeleton until resolved.
  if (status === 'unknown') {
    return <AuthSkeleton />;
  }

  // Unauthenticated → redirect and show nothing.
  if (status === 'unauthenticated') {
    if (typeof window !== 'undefined') {
      const next = encodeURIComponent(
        window.location.pathname + window.location.search,
      );
      router.replace(`/login?next=${next}`);
    }
    return null;
  }

  return <>{children}</>;
}

function AuthSkeleton() {
  return (
    <div className="flex min-h-dvh animate-pulse flex-col">
      {/* Sidebar stub */}
      <div className="fixed inset-y-0 left-0 w-60 border-r border-border bg-surface" />
      {/* Header stub */}
      <div className="fixed right-0 left-60 top-0 h-14 border-b border-border bg-surface" />
      {/* Content area */}
      <div className="ml-60 mt-14 flex flex-col gap-6 p-8">
        <div className="h-8 w-48 rounded-control bg-border" />
        <div className="grid grid-cols-1 gap-4 md:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-card bg-surface border border-border" />
          ))}
        </div>
        <div className="h-64 rounded-card bg-surface border border-border" />
      </div>
    </div>
  );
}

'use client';

import { useEffect } from 'react';
import { useThemeStore } from '@/store/theme.store';
import { getStoredPreference, resolveTheme } from '@/lib/theme';

/**
 * Syncs the theme store with the client after hydration, and keeps a `system`
 * preference tracking OS-level changes in real time. The actual pre-paint theme
 * is already applied by ThemeScript; this just brings React state into
 * agreement and wires up live updates. Renders nothing.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const hydrate = useThemeStore((s) => s.hydrate);
  const syncResolved = useThemeStore((s) => s.syncResolved);

  useEffect(() => {
    const preference = getStoredPreference();
    hydrate(preference, resolveTheme(preference));
  }, [hydrate]);

  useEffect(() => {
    const media = window.matchMedia('(prefers-color-scheme: dark)');
    const onChange = () => {
      // Only follow the OS when the user's preference is still "system".
      if (getStoredPreference() === 'system') {
        syncResolved(media.matches ? 'dark' : 'light');
      }
    };
    media.addEventListener('change', onChange);
    return () => media.removeEventListener('change', onChange);
  }, [syncResolved]);

  return <>{children}</>;
}

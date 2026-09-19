import { create } from 'zustand';
import {
  applyResolvedTheme,
  DEFAULT_PREFERENCE,
  persistPreference,
  resolveTheme,
  type ResolvedTheme,
  type ThemePreference,
} from '@/lib/theme';

interface ThemeState {
  preference: ThemePreference;
  resolved: ResolvedTheme;
  /** True once the store has synced with the DOM/localStorage on the client. */
  hydrated: boolean;
  setPreference: (preference: ThemePreference) => void;
  /** Flip between light and dark, committing an explicit (non-system) choice. */
  toggle: () => void;
  /** Called by ThemeProvider on mount and on system-theme changes. */
  hydrate: (preference: ThemePreference, resolved: ResolvedTheme) => void;
  syncResolved: (resolved: ResolvedTheme) => void;
}

export const useThemeStore = create<ThemeState>((set, get) => ({
  preference: DEFAULT_PREFERENCE,
  resolved: 'dark',
  hydrated: false,

  setPreference: (preference) => {
    const resolved = resolveTheme(preference);
    persistPreference(preference);
    applyResolvedTheme(resolved);
    set({ preference, resolved });
  },

  toggle: () => {
    const next: ThemePreference = get().resolved === 'dark' ? 'light' : 'dark';
    get().setPreference(next);
  },

  hydrate: (preference, resolved) => {
    applyResolvedTheme(resolved);
    set({ preference, resolved, hydrated: true });
  },

  syncResolved: (resolved) => {
    applyResolvedTheme(resolved);
    set({ resolved });
  },
}));

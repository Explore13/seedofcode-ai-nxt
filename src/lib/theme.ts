/**
 * Shared theme contract used by BOTH the no-flash inline script (which runs
 * before React hydrates) and the Zustand theme store. Keeping a single plain
 * string in localStorage — not a serialized store object — is what lets the
 * pre-paint script and the runtime store stay perfectly in sync.
 */

export type ThemePreference = 'light' | 'dark' | 'system';
export type ResolvedTheme = 'light' | 'dark';

export const THEME_STORAGE_KEY = 'soc-theme';
/**
 * The app boots dark by design (user_web.md §4.1). Light is fully first-class
 * and, once a user toggles, their explicit choice persists. A future Settings
 * control can also offer "system", which this module already supports.
 */
export const DEFAULT_PREFERENCE: ThemePreference = 'dark';

export function isThemePreference(value: unknown): value is ThemePreference {
  return value === 'light' || value === 'dark' || value === 'system';
}

/** Read the stored preference. SSR-safe (returns default when no `window`). */
export function getStoredPreference(): ThemePreference {
  if (typeof window === 'undefined') {
    return DEFAULT_PREFERENCE;
  }
  try {
    const raw = window.localStorage.getItem(THEME_STORAGE_KEY);
    return isThemePreference(raw) ? raw : DEFAULT_PREFERENCE;
  } catch {
    // localStorage can throw (private mode / disabled cookies). Fail soft.
    return DEFAULT_PREFERENCE;
  }
}

export function getSystemTheme(): ResolvedTheme {
  if (typeof window === 'undefined' || !window.matchMedia) {
    return 'dark';
  }
  return window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
}

export function resolveTheme(preference: ThemePreference): ResolvedTheme {
  return preference === 'system' ? getSystemTheme() : preference;
}

/** Apply a resolved theme to the document root (attribute + color-scheme). */
export function applyResolvedTheme(resolved: ResolvedTheme): void {
  if (typeof document === 'undefined') {
    return;
  }
  const root = document.documentElement;
  root.dataset.theme = resolved;
  root.style.colorScheme = resolved;
}

export function persistPreference(preference: ThemePreference): void {
  if (typeof window === 'undefined') {
    return;
  }
  try {
    window.localStorage.setItem(THEME_STORAGE_KEY, preference);
  } catch {
    // Ignore write failures (private mode); the in-memory store still works.
  }
}

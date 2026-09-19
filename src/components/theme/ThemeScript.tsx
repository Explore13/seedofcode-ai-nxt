import { DEFAULT_PREFERENCE, THEME_STORAGE_KEY } from '@/lib/theme';

/**
 * Blocking, no-flash theme initializer.
 *
 * Rendered as the first node inside <body>, this inline script runs
 * synchronously during HTML parse — before the browser paints — so the correct
 * `data-theme` is set on <html> without a light→dark flash on load. It mirrors
 * the logic in `lib/theme.ts` (which it cannot import, since it must be a
 * self-contained string that runs pre-hydration).
 */
export function ThemeScript() {
  const script = `
(function () {
  try {
    var key = '${THEME_STORAGE_KEY}';
    var pref = localStorage.getItem(key);
    if (pref !== 'light' && pref !== 'dark' && pref !== 'system') {
      pref = '${DEFAULT_PREFERENCE}';
    }
    var resolved = pref;
    if (pref === 'system') {
      resolved =
        window.matchMedia &&
        window.matchMedia('(prefers-color-scheme: dark)').matches
          ? 'dark'
          : 'light';
    }
    var root = document.documentElement;
    root.dataset.theme = resolved;
    root.style.colorScheme = resolved;
  } catch (e) {
    document.documentElement.dataset.theme = 'dark';
    document.documentElement.style.colorScheme = 'dark';
  }
})();
`.trim();

  // Content is a fixed, developer-authored string (no user input) — safe to inline.
  return <script dangerouslySetInnerHTML={{ __html: script }} />;
}

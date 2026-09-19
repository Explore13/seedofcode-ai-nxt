/**
 * Formatting helpers — key masking, token / credit / date display.
 * Every display-string utility lives here so formatting stays consistent
 * across all pages and components.
 */

/**
 * Mask an API key prefix for display.
 * `soc_live_ab12cdef3456ef78` → `soc_live_…ef78`
 * Keeps the first segment (mode prefix) and the last 4 chars visible.
 */
export function maskApiKey(keyPrefix: string): string {
  if (!keyPrefix) return '…';
  const parts = keyPrefix.split('_');
  // Expected format: soc_live_<random> or soc_test_<random>
  if (parts.length >= 3) {
    const mode = `${parts[0]}_${parts[1]}`; // "soc_live"
    const secret = parts.slice(2).join('_');
    const tail = secret.slice(-4);
    return `${mode}_…${tail}`;
  }
  // Fallback: show first 8 and last 4
  const tail = keyPrefix.slice(-4);
  const head = keyPrefix.slice(0, 8);
  return `${head}…${tail}`;
}

/**
 * Format a large number with locale-aware thousands separators.
 * 1234567 → "1,234,567"
 */
export function formatNumber(n: number): string {
  return n.toLocaleString('en-US');
}

/**
 * Format token counts for display.
 * Numbers ≥ 1M → "1.2M", ≥ 1K → "45.3K", else plain.
 */
export function formatTokens(n: number): string {
  if (n >= 1_000_000) return `${(n / 1_000_000).toFixed(1)}M`;
  if (n >= 1_000) return `${(n / 1_000).toFixed(1)}K`;
  return String(n);
}

/**
 * Format credits for display.
 * Shows the ⬡ symbol + locale number.
 */
export function formatCredits(n: number): string {
  return `⬡ ${formatNumber(n)}`;
}

/**
 * Format a latency in milliseconds for display.
 * < 1000ms → "842ms"
 * ≥ 1000ms → "1.24s"
 */
export function formatLatency(ms: number): string {
  if (ms < 1000) return `${Math.round(ms)}ms`;
  return `${(ms / 1000).toFixed(2)}s`;
}

/**
 * Format a date string for the request history table.
 * Returns "dd MMM yyyy · HH:mm:ss" in Geist Mono style.
 */
export function formatTimestamp(isoString: string): string {
  const d = new Date(isoString);
  const dd = String(d.getDate()).padStart(2, '0');
  const month = d.toLocaleString('en-US', { month: 'short' });
  const yyyy = d.getFullYear();
  const hh = String(d.getHours()).padStart(2, '0');
  const mm = String(d.getMinutes()).padStart(2, '0');
  const ss = String(d.getSeconds()).padStart(2, '0');
  return `${dd} ${month} ${yyyy} · ${hh}:${mm}:${ss}`;
}

/**
 * Format a date as a short label for chart x-axes.
 * "3 Sep", "14 Oct"
 */
export function formatDateShort(isoString: string): string {
  const d = new Date(isoString);
  const day = d.getDate();
  const month = d.toLocaleString('en-US', { month: 'short' });
  return `${day} ${month}`;
}

/**
 * Get the ISO date string (YYYY-MM-DD) for use as a query param or chart key.
 */
export function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

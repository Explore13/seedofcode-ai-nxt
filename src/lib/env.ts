/**
 * Centralised, validated access to public environment configuration.
 *
 * Next.js inlines `NEXT_PUBLIC_*` values at build time, so they must be
 * referenced as static property accesses (not via a dynamic key) for the
 * replacement to work in the browser bundle.
 */

function required(value: string | undefined, name: string): string {
  if (!value || value.trim() === '') {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        'Copy .env.example to .env.local and set it.',
    );
  }
  return value;
}

export const env = {
  /** Base URL for all API calls. Relative ("/api") in dev, absolute in prod. */
  apiBaseUrl: required(
    process.env.NEXT_PUBLIC_API_BASE_URL,
    'NEXT_PUBLIC_API_BASE_URL',
  ).replace(/\/$/, ''),

  /** The portal's own public origin. */
  appUrl: process.env.NEXT_PUBLIC_APP_URL ?? 'http://localhost:3000',

  /** Address shown in the "Coming soon" billing dialog and footer. */
  contactEmail: process.env.NEXT_PUBLIC_CONTACT_EMAIL ?? 'hello@seedofcode.dev',

  /** True when running the production build (not `next dev`). */
  isProduction: process.env.NODE_ENV === 'production',
} as const;

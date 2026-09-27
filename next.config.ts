import type { NextConfig } from 'next';
import createMDX from '@next/mdx';
import { withSentryConfig } from '@sentry/nextjs/config';

/**
 * Dev-time API proxy.
 *
 * In development the browser talks to the portal's own origin (e.g.
 * http://localhost:3000) and we transparently rewrite `/api/*` to the running
 * NestJS backend. This keeps requests same-origin, so there are no CORS
 * concerns locally and the backend's production CORS allowlist stays untouched.
 *
 * In production `NEXT_PUBLIC_API_BASE_URL` is set to the absolute API origin
 * (e.g. https://api.ai.seedofcode.dev/api). Because that base URL is absolute,
 * the browser calls the API host directly and these rewrites are never hit —
 * CORS is then handled by the backend allowlist. Set `BACKEND_PROXY_TARGET`
 * only in local/dev environments.
 */
const proxyTarget = process.env.BACKEND_PROXY_TARGET;

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  async rewrites() {
    // Only use proxy rewrites in local development!
    if (!proxyTarget || process.env.NODE_ENV === 'production') {
      return [];
    }
    // Strip any trailing slash to avoid `//api` in the resolved URL.
    const target = proxyTarget.replace(/\/$/, '');
    return [
      {
        source: '/api/:path*',
        destination: `${target}/api/:path*`,
      },
    ];
  },
};

const withMDXConfig = createMDX({})(nextConfig);

export default withSentryConfig(withMDXConfig, {
  org: 'explorer-rd',
  project: 'seedofcode-ai-nxt',
  // Pass the auth token
  authToken: process.env.SENTRY_AUTH_TOKEN,
  // Upload a larger set of source maps for prettier stack traces
  widenClientFileUpload: true,
  // Disable automatic source map upload in CI environments
  silent: !process.env.CI,
  // Use a fixed route (recommended)
  tunnelRoute: '/sentry-tunnel',
});

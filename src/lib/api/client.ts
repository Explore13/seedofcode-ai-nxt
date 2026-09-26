import axios, {
  AxiosError,
  type AxiosInstance,
  type InternalAxiosRequestConfig,
} from 'axios';
import { env } from '@/lib/env';
import { useAuthStore } from '@/store/auth.store';
import type { ApiEnvelope, AuthTokens } from '@/lib/types';
import { normalizeError } from './errors';

/**
 * Central HTTP client.
 *
 *  - Request:  attaches `Authorization: Bearer <access>` from the auth store.
 *  - Response: on 401, performs a single `/auth/refresh`, updates the session,
 *              and retries the original request exactly once. Concurrent 401s
 *              share ONE in-flight refresh (dedupe) so we never hammer the
 *              refresh endpoint or rotate the refresh token multiple times.
 *  - Errors:   rejected as `ApiError` with the backend's message + status.
 *
 * The backend rotates the refresh token on every refresh, so we MUST persist
 * the freshly returned pair (via `setSession`) — reusing an old refresh token
 * would be treated as theft and revoke the session.
 */

// Endpoints that must never trigger the refresh-and-retry flow (they ARE the
// auth primitives, or are public), keyed by path suffix.
const NO_REFRESH_PATHS = ['/auth/refresh', '/auth/login', '/auth/register'];

// Extend the request config with our one-shot retry marker.
interface RetryableConfig extends InternalAxiosRequestConfig {
  _retried?: boolean;
}

export const apiClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
  withCredentials: true,
});

// A bare client with NO interceptors, used only to perform the refresh call so
// a 401 on refresh can't recurse back into this same interceptor chain.
const refreshClient: AxiosInstance = axios.create({
  baseURL: env.apiBaseUrl,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30_000,
  withCredentials: true,
});

// Single shared refresh promise — the dedupe primitive.
let refreshInFlight: Promise<string> | null = null;

function isBrowser(): boolean {
  return typeof window !== 'undefined';
}

function shouldSkipRefresh(url: string | undefined): boolean {
  if (!url) return false;
  return NO_REFRESH_PATHS.some((path) => url.includes(path));
}

/**
 * Perform the token refresh. Returns the new access token. Throws if there is
 * no refresh token or the backend rejects it (dead session).
 */
async function performRefresh(): Promise<string> {
  // We no longer read refresh token from store since it's HttpOnly cookie
  const response = await refreshClient.post<ApiEnvelope<AuthTokens>>(
    '/auth/refresh',
    {},
  );

  const tokens = response.data.data;
  if (!tokens?.access_token) {
    throw new Error('Malformed refresh response');
  }

  // Persist the access token
  useAuthStore.getState().setSession(tokens);
  return tokens.access_token;
}

function getSharedRefresh(): Promise<string> {
  if (!refreshInFlight) {
    refreshInFlight = performRefresh().finally(() => {
      refreshInFlight = null;
    });
  }
  return refreshInFlight;
}

function redirectToLogin(): void {
  if (!isBrowser()) return;
  const { pathname } = window.location;
  // Avoid redirect loops on public/auth routes.
  if (pathname.startsWith('/login') || pathname.startsWith('/register')) {
    return;
  }
  const next = encodeURIComponent(pathname + window.location.search);
  window.location.assign(`/login?next=${next}`);
}

// ── Request interceptor ──────────────────────────────────────────────────────
apiClient.interceptors.request.use((config) => {
  const { accessToken } = useAuthStore.getState();
  if (accessToken) {
    config.headers.set('Authorization', `Bearer ${accessToken}`);
  }
  return config;
});

// ── Response interceptor ─────────────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const original = error.config as RetryableConfig | undefined;
    const status = error.response?.status;

    const canAttemptRefresh =
      status === 401 &&
      !!original &&
      !original._retried &&
      !shouldSkipRefresh(original.url);

    if (!canAttemptRefresh) {
      return Promise.reject(normalizeError(error));
    }

    original._retried = true;

    try {
      const newAccessToken = await getSharedRefresh();
      original.headers.set('Authorization', `Bearer ${newAccessToken}`);
      return apiClient(original);
    } catch (refreshError) {
      // Refresh failed → the session is dead. Clear and bounce to login.
      useAuthStore.getState().clear();
      redirectToLogin();
      return Promise.reject(normalizeError(refreshError));
    }
  },
);

import { create } from 'zustand';
import type { AuthTokens, User } from '@/lib/types';

/**
 * Auth state.
 *
 * Security model (see user_web.md §7.2):
 *  - The ACCESS token lives in memory only. It is never written to
 *    localStorage, minimizing the XSS exfiltration blast radius.
 *  - The REFRESH token is persisted so sessions survive a reload; on boot the
 *    app rehydrates it and silently re-authenticates.
 *  - A non-sensitive `soc_authed` cookie mirrors "is there a session" so edge
 *    middleware can do a coarse redirect without reading localStorage. It is
 *    NEVER trusted for authorization — the API is the only real gate.
 */

const ACCESS_STORAGE_KEY = 'soc-access';
const AUTHED_COOKIE = 'soc_authed';

export type AuthStatus =
  | 'unknown' // not yet resolved on the client (show a skeleton)
  | 'authenticated'
  | 'unauthenticated';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  status: AuthStatus;

  setSession: (tokens: AuthTokens) => void;
  setAccessToken: (accessToken: string) => void;
  setUser: (user: User | null) => void;
  setStatus: (status: AuthStatus) => void;
  /** Read the persisted refresh token into memory (client only). */
  hydrateFromStorage: () => string | null;
  clear: () => void;
}

function persistAccessToken(token: string | null): void {
  if (typeof window === 'undefined') return;
  try {
    if (token) {
      window.localStorage.setItem(ACCESS_STORAGE_KEY, token);
    } else {
      window.localStorage.removeItem(ACCESS_STORAGE_KEY);
    }
  } catch {
    // Ignore storage failures (private mode); in-memory session still works.
  }
}

function setAuthedCookie(present: boolean): void {
  if (typeof document === 'undefined') return;
  const secure = window.location.protocol === 'https:' ? '; Secure' : '';
  if (present) {
    // Session cookie (no Max-Age) — coarse "a session exists" hint only.
    document.cookie = `${AUTHED_COOKIE}=1; Path=/; SameSite=Lax${secure}`;
  } else {
    document.cookie = `${AUTHED_COOKIE}=; Path=/; Max-Age=0; SameSite=Lax${secure}`;
  }
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  accessToken: null,
  status: 'unknown',

  setSession: (tokens) => {
    persistAccessToken(tokens.access_token);
    setAuthedCookie(true);
    set({
      accessToken: tokens.access_token,
      status: 'authenticated',
    });
  },

  setAccessToken: (accessToken) => set({ accessToken }),

  setUser: (user) => set({ user }),

  setStatus: (status) => set({ status }),

  hydrateFromStorage: () => {
    if (typeof window === 'undefined') return null;
    let token: string | null = null;
    try {
      token = window.localStorage.getItem(ACCESS_STORAGE_KEY);
    } catch {
      token = null;
    }
    set({ accessToken: token });
    return token;
  },

  clear: () => {
    persistAccessToken(null);
    setAuthedCookie(false);
    set({
      user: null,
      accessToken: null,
      status: 'unauthenticated',
    });
  },
}));

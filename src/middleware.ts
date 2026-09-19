import { type NextRequest, NextResponse } from 'next/server';

/**
 * Edge middleware — COARSE redirect only.
 *
 * The `soc_authed=1` cookie is a non-secret signal written by the client after
 * a successful login. It is NOT trusted for authorization (the real gate is
 * the API JWT check in the AuthGuard). Its sole job here is to skip the
 * round-trip to the login page for users who very likely have an active
 * session, without exposing protected content (the AuthGuard does that).
 *
 * Security note: edge middleware runs before React renders, so it cannot read
 * localStorage or Zustand. We therefore only act on the cookie flag — never
 * on the access token which is in-memory only.
 */

const APP_ROUTES = ['/home', '/api-keys', '/usage', '/settings'];
const AUTH_ROUTES = ['/login', '/register', '/verify'];

function isAppRoute(pathname: string): boolean {
  return APP_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
}

function isAuthRoute(pathname: string): boolean {
  return AUTH_ROUTES.some(
    (route) => pathname === route || pathname.startsWith(route + '/'),
  );
}

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const authedCookie = request.cookies.get('soc_authed')?.value;
  const isAuthed = authedCookie === '1';

  // Logged-in users visiting /login or /register → send to /home.
  // (/verify is excluded: unverified users are still allowed there.)
  if (
    isAuthed &&
    (pathname === '/login' || pathname === '/register')
  ) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  // Definitely-logged-out users visiting app routes → send to /login.
  // The AuthGuard will also check and is the authoritative gate, but this
  // gives a faster, no-flash redirect for the common case.
  if (!isAuthed && isAppRoute(pathname)) {
    const next = encodeURIComponent(pathname + request.nextUrl.search);
    return NextResponse.redirect(
      new URL(`/login?next=${next}`, request.url),
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths EXCEPT static files, images, and Next.js
     * internals so the middleware only runs on navigatable routes.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};

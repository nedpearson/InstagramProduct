import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Middleware — guards all /app routes behind session cookie.
 *
 * Cookie strategy:
 *   Name: instaflow_session
 *   Value: "authenticated" (simple) or signed JWT (upgrade path)
 *
 * The session is set by:
 *   - /api/auth/login  (validates credentials, sets httpOnly cookie)
 *   - /signup page     (creates account + sets cookie)
 *
 * Public routes (never require auth):
 *   /, /login, /signup, /pricing, /api/*, /not-found
 */

const PUBLIC_PATHS = [
  '/',
  '/login',
  '/signup',
  '/pricing',
  '/not-found',
];

const PUBLIC_PREFIXES = [
  '/api/',
  '/_next/',
  '/favicon',
  '/robots',
  '/sitemap',
];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow all public paths and API routes
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }
  if (PUBLIC_PREFIXES.some(prefix => pathname.startsWith(prefix))) {
    return NextResponse.next();
  }

  // Require session cookie for all other routes (the /app/* pages)
  const session = request.cookies.get('instaflow_session');
  const isAuthenticated = session?.value && session.value.length > 5;

  if (!isAuthenticated) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match everything EXCEPT:
     * - _next/static
     * - _next/image
     * - favicon.ico
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};

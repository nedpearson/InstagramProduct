import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const url = req.nextUrl;

  const publicRoutes = ['/', '/pricing', '/signup', '/login', '/favicon.ico'];

  // PASS-THROUGH FOR WEBHOOKS AND APIS
  // Master Orchestrator, Stripe Webhooks, Meta Webhooks, Front-end marketing must NEVER be delayed by auth
  if (
    url.pathname.startsWith('/api') || 
    url.pathname.startsWith('/_next') || 
    publicRoutes.includes(url.pathname)
  ) {
    return NextResponse.next();
  }

  const basicAuth = req.headers.get('authorization');

  if (basicAuth) {
    const authValue = basicAuth.split(' ')[1];
    const decoded = Buffer.from(authValue, 'base64').toString();
    const [user, pwd] = decoded.split(':');

    const validUser = process.env.ADMIN_USERNAME || 'nedpearson@gmail.com';
    const validPwd = process.env.ADMIN_PASSWORD || '1Pearson2';

    if (user === validUser && pwd === validPwd) {
      return NextResponse.next();
    }
  }

  // If it's a Next.js client-side navigation (RSC) or prefetch, do NOT send WWW-Authenticate, 
  // as it forces the browser to aggressively pop up the login box over the public marketing pages.
  const isPrefetch = req.headers.get('rsc') === '1' || req.headers.get('next-router-prefetch') === '1' || req.headers.get('purpose') === 'prefetch';

  if (isPrefetch) {
    return new NextResponse('Unauthorized API Context', { status: 401 });
  }

  // Reject with Basic Auth challenge for physical direct visits
  return new NextResponse('Master Systems Authentication Required.', {
    status: 401,
    headers: { 'WWW-Authenticate': 'Basic realm="InstaFlow Master Dashboard"' },
  });
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};

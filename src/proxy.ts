import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  // Protect dashboard routes
  const protectedPaths = ['/overview', '/sectors', '/domination', '/trends', '/competitors', '/launches', '/revenue', '/system', '/automation', '/calendar', '/library', '/briefs', '/queue', '/settings', '/docs'];
  
  const isProtectedPath = protectedPaths.some(path => request.nextUrl.pathname.startsWith(path));

  if (isProtectedPath) {
    const sessionCookie = request.cookies.get('instaflow_session');
    
    // If no session, redirect to login
    if (!sessionCookie || sessionCookie.value !== 'authenticated') {
      const loginUrl = new URL('/login', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|assets|images).*)'],
};

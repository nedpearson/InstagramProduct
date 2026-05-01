import { NextResponse } from 'next/server';

// TikTok OAuth 2.0 Authorization URL generator
// Docs: https://developers.tiktok.com/doc/login-kit-web
export async function GET() {
  const clientKey = process.env.TIKTOK_CLIENT_KEY;
  if (!clientKey) {
    return NextResponse.json({ error: 'TIKTOK_CLIENT_KEY not configured in .env' }, { status: 500 });
  }

  const redirectUri = process.env.TIKTOK_REDIRECT_URI || 'https://instaflow.bridgebox.ai/api/auth/tiktok/callback';
  const scope = 'user.info.basic,video.publish,video.upload';
  const state = Math.random().toString(36).substring(2); // CSRF token

  const authUrl = new URL('https://www.tiktok.com/v2/auth/authorize/');
  authUrl.searchParams.set('client_key', clientKey);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', scope);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('state', state);

  return NextResponse.redirect(authUrl.toString());
}

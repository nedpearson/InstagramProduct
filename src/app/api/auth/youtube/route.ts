import { NextResponse } from 'next/server';

// YouTube / Google OAuth 2.0 Authorization URL generator
// Docs: https://developers.google.com/youtube/v3/guides/auth/server-side-web-apps
export async function GET() {
  const clientId = process.env.YOUTUBE_CLIENT_ID;
  if (!clientId) {
    return NextResponse.json({ error: 'YOUTUBE_CLIENT_ID not configured in .env' }, { status: 500 });
  }

  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'https://instaflow.bridgebox.ai/api/auth/youtube/callback';

  const authUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
  authUrl.searchParams.set('client_id', clientId);
  authUrl.searchParams.set('redirect_uri', redirectUri);
  authUrl.searchParams.set('response_type', 'code');
  authUrl.searchParams.set('scope', 'https://www.googleapis.com/auth/youtube.upload https://www.googleapis.com/auth/youtube');
  authUrl.searchParams.set('access_type', 'offline'); // Gets refresh token
  authUrl.searchParams.set('prompt', 'consent');
  authUrl.searchParams.set('state', Math.random().toString(36).substring(2));

  return NextResponse.redirect(authUrl.toString());
}

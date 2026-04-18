import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import { headers } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  headers(); // Force dynamic mode completely
  const url = new URL(request.url);
  const code = url.searchParams.get('code');
  const error = url.searchParams.get('error');

  // Derive the real origin (Railway containers resolve request.url to 0.0.0.0:8080)
  const forwardedHost = new Headers(request.headers).get('x-forwarded-host');
  const forwardedProto = new Headers(request.headers).get('x-forwarded-proto') || 'https';
  const realOrigin = forwardedHost
    ? `${forwardedProto}://${forwardedHost}`
    : (process.env.META_REDIRECT_URI
      ? new URL(process.env.META_REDIRECT_URI).origin
      : url.origin);

  if (error) {
    return NextResponse.redirect(new URL('/settings?error=oauth_denied', realOrigin));
  }

  if (!code) {
    return NextResponse.redirect(new URL('/settings?error=missing_code', realOrigin));
  }

  const clientId = process.env.META_APP_ID;
  const clientSecret = process.env.META_APP_SECRET;

  if (!clientId || !clientSecret) {
    console.error('[OAuth] Missing META_APP_ID or META_APP_SECRET. Halted.');
    return NextResponse.redirect(new URL('/settings?error=missing_env_credentials', realOrigin));
  }

  try {
    // Use the exact redirect URI registered with Meta
    const redirectUri = process.env.META_REDIRECT_URI || `${realOrigin}/api/auth/instagram/callback`;

    // 1. Exchange code for short-lived token
    const tokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?client_id=${clientId}&redirect_uri=${encodeURIComponent(redirectUri)}&client_secret=${clientSecret}&code=${code}`);
    const tokenData = await tokenResponse.json();

    if (tokenData.error) throw new Error(tokenData.error.message);

    const shortLivedToken = tokenData.access_token;

    // 2. Exchange for long-lived token
    const longTokenResponse = await fetch(`https://graph.facebook.com/v19.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${clientId}&client_secret=${clientSecret}&fb_exchange_token=${shortLivedToken}`);
    const longTokenData = await longTokenResponse.json();

    if (longTokenData.error) throw new Error(longTokenData.error.message);

    const longLivedToken = longTokenData.access_token;

    // 3. Get User's Pages, then find the IG Account connected to that page.
    // In a real flow, you fetch /me/accounts -> get page access tokens.
    // Then fetch /{page-id}?fields=instagram_business_account.
    // We will save the root user long-lived token as a skeleton requirement, marking the initial handshake.

    let workspace = await prisma.workspace.findFirst();
    if (!workspace) {
      workspace = await prisma.workspace.create({
        data: { 
          name: 'InstaFlow Production',
          owner: {
            create: { email: 'admin@instaflow.ai', name: 'System Admin' }
          }
        }
      });
    }

    const expiresAt = new Date();
    expiresAt.setDate(expiresAt.getDate() + 60); // 60 days approx

    // Save token securely internally (in a real app, encrypt this)
    await prisma.integrationToken.create({
      data: {
        workspaceId: workspace.id,
        provider: 'meta_graph',
        encryptedToken: longLivedToken
      }
    });

    console.log('[OAuth] Authorization successful. Tokens exchanged and stored.');

    return NextResponse.redirect(new URL('/settings?success=oauth_complete', realOrigin));

  } catch (err: any) {
    console.error('[OAuth Error]', err);
    return NextResponse.redirect(new URL('/settings?error=oauth_exchange_failed', realOrigin));
  }
}

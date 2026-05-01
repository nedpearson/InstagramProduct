import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// TikTok OAuth callback handler — exchanges auth code for access token
// Docs: https://developers.tiktok.com/doc/login-kit-web
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`https://instaflow.bridgebox.ai/settings?error=tiktok_denied`);
  }
  if (!code) {
    return NextResponse.json({ error: 'Missing auth code' }, { status: 400 });
  }

  const clientKey = process.env.TIKTOK_CLIENT_KEY!;
  const clientSecret = process.env.TIKTOK_CLIENT_SECRET!;
  const redirectUri = process.env.TIKTOK_REDIRECT_URI || 'https://instaflow.bridgebox.ai/api/auth/tiktok/callback';

  // Exchange code for access token
  const tokenRes = await fetch('https://open.tiktokapis.com/v2/oauth/token/', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      client_key: clientKey,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
      redirect_uri: redirectUri,
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    console.error('[TikTok OAuth] Token exchange error:', tokenData);
    return NextResponse.redirect(`https://instaflow.bridgebox.ai/settings?error=tiktok_token_failed`);
  }

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in;

  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 500 });
  }

  const existing = await prisma.integrationToken.findFirst({
    where: { provider: 'tiktok', workspaceId: workspace.id }
  });

  const tokenPayload = JSON.stringify({ accessToken, refreshToken, expiresIn });

  if (existing) {
    await prisma.integrationToken.update({
      where: { id: existing.id },
      data: { encryptedToken: tokenPayload },
    });
  } else {
    await prisma.integrationToken.create({
      data: {
        workspaceId: workspace.id,
        provider: 'tiktok',
        encryptedToken: tokenPayload,
      },
    });
  }
  process.env.TIKTOK_ACCESS_TOKEN = accessToken;

  console.log('[TikTok OAuth] ✅ Access token stored successfully!');
  return NextResponse.redirect(`https://instaflow.bridgebox.ai/settings?success=tiktok_connected`);
}

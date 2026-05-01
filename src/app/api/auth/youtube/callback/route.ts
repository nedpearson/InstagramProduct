import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// YouTube OAuth callback handler — exchanges auth code for access + refresh token
export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get('code');
  const error = searchParams.get('error');

  if (error) {
    return NextResponse.redirect(`https://instaflow.bridgebox.ai/settings?error=youtube_denied`);
  }
  if (!code) {
    return NextResponse.json({ error: 'Missing auth code' }, { status: 400 });
  }

  const clientId = process.env.YOUTUBE_CLIENT_ID!;
  const clientSecret = process.env.YOUTUBE_CLIENT_SECRET!;
  const redirectUri = process.env.YOUTUBE_REDIRECT_URI || 'https://instaflow.bridgebox.ai/api/auth/youtube/callback';

  // Exchange code for tokens
  const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      code,
      client_id: clientId,
      client_secret: clientSecret,
      redirect_uri: redirectUri,
      grant_type: 'authorization_code',
    }),
  });

  const tokenData = await tokenRes.json();

  if (tokenData.error) {
    console.error('[YouTube OAuth] Token exchange error:', tokenData);
    return NextResponse.redirect(`https://instaflow.bridgebox.ai/settings?error=youtube_token_failed`);
  }

  const accessToken = tokenData.access_token;
  const refreshToken = tokenData.refresh_token;
  const expiresIn = tokenData.expires_in;

  const workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    return NextResponse.json({ error: 'No workspace found' }, { status: 500 });
  }

  const existing = await prisma.integrationToken.findFirst({
    where: { provider: 'youtube', workspaceId: workspace.id }
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
        provider: 'youtube',
        encryptedToken: tokenPayload,
      },
    });
  }

  process.env.YOUTUBE_ACCESS_TOKEN = accessToken;

  console.log('[YouTube OAuth] ✅ Access token stored successfully!');
  return NextResponse.redirect(`https://instaflow.bridgebox.ai/settings?success=youtube_connected`);
}

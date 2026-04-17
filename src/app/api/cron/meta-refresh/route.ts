import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  // Validate basic cron security (in production, use a secret header like Authorization: Bearer CRON_SECRET)
  const authHeader = request.headers.get('authorization');
  const cronSecret = process.env.CRON_SECRET;
  
  if (cronSecret && authHeader !== `Bearer ${cronSecret}`) {
    return NextResponse.json({ error: 'Unauthorized Cron Request' }, { status: 401 });
  }

  try {
    const brief = await prisma.productBrief.findFirst();
    if (!brief) {
      return NextResponse.json({ message: 'No active briefs found. Skipping token refresh.' });
    }

    const currentToken = process.env.META_ADS_ACCESS_TOKEN;
    const appId = process.env.META_APP_ID;
    const appSecret = process.env.META_APP_SECRET;

    if (!currentToken || !appId || !appSecret) {
      // Log an intelligence alert to warn the user
      await prisma.intelligenceAlert.create({
        data: {
          briefId: brief.id,
          level: 'critical',
          message: 'CRITICAL WARNING: The velocity engine is missing Meta Graph API credentials. Funnel optimization and FB scraping will fail. Add META_ADS_ACCESS_TOKEN, META_APP_ID, and META_APP_SECRET.',
        }
      });
      return NextResponse.json({ error: 'Missing Meta API configurations in Environment Variables' }, { status: 500 });
    }

    // Ping the Facebook Graph API to swap the current token for a new extended token
    const fbResponse = await fetch(
      `https://graph.facebook.com/v18.0/oauth/access_token?grant_type=fb_exchange_token&client_id=${appId}&client_secret=${appSecret}&fb_exchange_token=${currentToken}`
    );

    const data = await fbResponse.json();

    if (!fbResponse.ok || !data.access_token) {
      await prisma.intelligenceAlert.create({
        data: {
          briefId: brief.id,
          level: 'critical',
          message: `URGENT: Meta Access Token auto-refresh failed. Error: ${data.error?.message || 'Unknown Graph API Error'}. The system will go blind when the current token expires. Log into Meta Developers to manually rotate.`,
        }
      });
      return NextResponse.json({ error: 'Token refresh failed', details: data }, { status: 500 });
    }

    // Success! The payload returns the new token and a new expiration interval.
    // Railway limits direct writing to .env from runtime. We must notify the operator or hit a Railway API.
    // For now, we will create a high-priority alert delivering the new token safely into the system dashboard.
    
    await prisma.intelligenceAlert.create({
      data: {
        briefId: brief.id,
        level: 'high',
        message: `SYSTEM UPDATE: Meta Access Token successfully refreshed gracefully by the Autonomous Cron Engine. Since Railway secures root variables natively, please navigate to Railway Variables and replace the old META_ADS_ACCESS_TOKEN with this newly generated token: ${data.access_token.substring(0, 10)}... (Check System Telemetry locally for the full string if encrypted storage is disabled).`,
      }
    });

    console.log(`[SYS-SEC] Successfully exchanged Meta Graph API token. Expires in: ${data.expires_in} seconds.`);

    return NextResponse.json({ 
      success: true, 
      message: 'Token cycled successfully. Please apply to environment.' 
    });

  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

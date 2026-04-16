import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  // Placeholder for incoming Instagram Webhook events
  // - Mentions
  // - Comments
  // - Story Replies
  // - DMs
  return NextResponse.json({ received: true, status: "webhook_ack" });
}

import { headers } from 'next/headers';

export async function GET(req: Request) {
  headers();
  // Webhook verification for Meta Graph API
  const { searchParams } = new URL(req.url);
  const challenge = searchParams.get('hub.challenge');
  const verifyToken = searchParams.get('hub.verify_token');
  
  if (verifyToken === process.env.META_WEBHOOK_VERIFY_TOKEN) {
    return new NextResponse(challenge, { status: 200 });
  }
  
  return new NextResponse('Invalid verify token', { status: 403 });
}

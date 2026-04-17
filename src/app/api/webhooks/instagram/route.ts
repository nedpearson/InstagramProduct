import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import crypto from 'crypto';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const bodyText = await req.text();
    // Validate signature if secret is set
    const signature = req.headers.get('x-hub-signature-256');
    if (process.env.META_APP_SECRET && signature) {
      const expectedSignature = `sha256=${crypto.createHmac('sha256', process.env.META_APP_SECRET).update(bodyText).digest('hex')}`;
      if (signature !== expectedSignature) {
        return NextResponse.json({ error: 'Invalid signature' }, { status: 401 });
      }
    }

    const payload = JSON.parse(bodyText);

    if (payload.object === 'instagram') {
      for (const entry of payload.entry || []) {
        for (const messaging of entry.messaging || []) {
          // Process DMs or Comments
          const senderId = messaging.sender?.id;
          const messageText = messaging.message?.text || '';
          
          if (senderId && messageText) {
            // Find active campaign context to hook this into
            const activeCampaign = await prisma.campaign.findFirst({ where: { status: 'active' }});

            if (activeCampaign) {
              await prisma.lead.upsert({
                where: { 
                  campaignId_igUsername: {
                    campaignId: activeCampaign.id,
                    igUsername: senderId
                  }
                },
                create: {
                  igUsername: senderId,
                  status: 'new',
                  source: 'instagram_dm',
                  campaignId: activeCampaign.id
                },
                update: {
                  status: 'contacted'
                }
              });
            }
          }
        }
      }
    }

    return NextResponse.json({ received: true, status: 'webhook_ack' });
  } catch (error) {
    console.error('Meta webhook parse error', error);
    return NextResponse.json({ error: 'Parse failed' }, { status: 500 });
  }
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

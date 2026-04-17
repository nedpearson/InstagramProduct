import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') || '';

  let event: Stripe.Event;

  try {
    if (process.env.STRIPE_WEBHOOK_SECRET) {
      event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET);
    } else {
      // Mock event for testing without webhook secret
      event = JSON.parse(body);
    }
  } catch (err: any) {
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    const session = event.data.object as any;

    if (event.type === 'checkout.session.completed') {
      const workspaceId = session.client_reference_id;
      if (workspaceId) {
        await prisma.billingEvent.create({
          data: {
            subscriptionId: session.subscription || session.id, // using session id as fallback
            type: 'subscription_created',
            amount: session.amount_total ? session.amount_total / 100 : 0,
            status: 'completed',
          }
        });
      }
    } else if (event.type === 'customer.subscription.deleted') {
      // Handle churn
      const subId = session.id;
      if (subId) {
        await prisma.billingEvent.create({
          data: {
            subscriptionId: subId,
            type: 'subscription_canceled',
            amount: 0,
            status: 'completed',
          }
        });
      }
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    return NextResponse.json({ error: 'Database update failed' }, { status: 500 });
  }
}

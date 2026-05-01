import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

/**
 * POST /api/billing/portal
 * Creates a Stripe Billing Portal session for the current subscriber.
 * Returns { url } to redirect the user to.
 */
export async function POST(req: Request) {
  try {
    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instaflow.bridgebox.ai';
    
    // Get current subscription with Stripe customer ID
    const sub = await prisma.subscription.findFirst({
      where: { stripeCustomerId: { not: null } },
    });

    if (!sub?.stripeCustomerId) {
      return NextResponse.json(
        { error: 'No active Stripe subscription found. Please subscribe first.' },
        { status: 400 }
      );
    }

    const portalSession = await stripe.billingPortal.sessions.create({
      customer: sub.stripeCustomerId,
      return_url: `${appUrl}/billing`,
    });

    return NextResponse.json({ url: portalSession.url });
  } catch (error: any) {
    console.error('[billing-portal] Error creating portal session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

/**
 * POST /api/billing/cancel
 * Cancels the current subscription at period end.
 */
export async function DELETE(req: Request) {
  try {
    const sub = await prisma.subscription.findFirst({
      where: { stripeSubId: { not: null } },
    });

    if (!sub?.stripeSubId) {
      return NextResponse.json(
        { error: 'No active subscription to cancel.' },
        { status: 400 }
      );
    }

    // Cancel at period end — user keeps access until then
    await stripe.subscriptions.update(sub.stripeSubId, {
      cancel_at_period_end: true,
    });

    // Log the cancellation intent
    await prisma.billingEvent.create({
      data: {
        subscriptionId: sub.id,
        type: 'cancellation_requested',
        metadata: JSON.stringify({ cancelAtPeriodEnd: true }),
      },
    });

    return NextResponse.json({ success: true, message: 'Subscription will cancel at period end.' });
  } catch (error: any) {
    console.error('[billing-cancel] Error cancelling subscription:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

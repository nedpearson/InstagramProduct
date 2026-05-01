import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// ─── Plan → Price ID mapping ──────────────────────────────────────────────────

const PRICE_MAP: Record<string, string | undefined> = {
  starter_monthly: process.env.STRIPE_PRICE_STARTER_MONTHLY,
  starter_annual:  process.env.STRIPE_PRICE_STARTER_ANNUAL,
  pro_monthly:     process.env.STRIPE_PRICE_PRO_MONTHLY,
  pro_annual:      process.env.STRIPE_PRICE_PRO_ANNUAL,
  agency_monthly:  process.env.STRIPE_PRICE_AGENCY_MONTHLY,
  agency_annual:   process.env.STRIPE_PRICE_AGENCY_ANNUAL,
};

export async function POST(req: Request) {
  const stripeKey = process.env.STRIPE_SECRET_KEY;
  if (!stripeKey) {
    return NextResponse.json({ error: 'Stripe not configured on server.' }, { status: 500 });
  }
  const stripe = new Stripe(stripeKey, { apiVersion: '2025-01-27.acacia' as any });
  try {
    const body = await req.json();
    const { planId, isAnnual, email } = body as {
      planId?: string;
      isAnnual?: boolean;
      email?: string;
    };

    // Validate planId
    const allowedPlans = ['starter', 'pro', 'agency'];
    if (!planId || !allowedPlans.includes(planId)) {
      return NextResponse.json({ error: 'Invalid plan selected.' }, { status: 400 });
    }

    const lookupKey = `${planId}_${isAnnual ? 'annual' : 'monthly'}`;
    const priceId = PRICE_MAP[lookupKey];

    if (!priceId) {
      return NextResponse.json(
        { error: `Stripe price not configured for ${lookupKey.toUpperCase()}. Please contact support.` },
        { status: 400 }
      );
    }

    // Fetch current subscription to re-use existing Stripe customer if available
    const activeSub = await prisma.subscription.findFirst();
    const existingCustomerId = activeSub?.stripeCustomerId ?? undefined;

    const appUrl = process.env.NEXT_PUBLIC_APP_URL ?? 'https://instaflow.bridgebox.ai';

    // Build checkout session params
    const sessionParams: Stripe.Checkout.SessionCreateParams = {
      payment_method_types: ['card'],
      line_items: [{ price: priceId, quantity: 1 }],
      mode: 'subscription',
      allow_promotion_codes: true,
      success_url: `${appUrl}/billing/return?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${appUrl}/billing/return?canceled=true`,
      client_reference_id: activeSub?.id ?? 'anonymous',
      metadata: { planId, isAnnual: String(isAnnual ?? false) },
      subscription_data: {
        metadata: { planId, source: 'instaflow_checkout' },
      },
    };

    // Prefer existing customer over email lookup to avoid duplicates
    if (existingCustomerId) {
      sessionParams.customer = existingCustomerId;
    } else if (email) {
      sessionParams.customer_email = email;
    }

    const session = await stripe.checkout.sessions.create(sessionParams);

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    console.error('[checkout] Error creating session:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

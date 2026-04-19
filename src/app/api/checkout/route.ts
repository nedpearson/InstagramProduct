import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || 'sk_test_mock', {
  apiVersion: '2025-01-27.acacia' as any,
});

export async function POST(req: Request) {
  try {
    const { planId, isAnnual } = await req.json();

    // Mapping plan IDs to hypothetical Stripe Price IDs (or dynamic amount)
    // For a real production system, these should be environment variables.
    const priceMap: Record<string, string> = {
      pro_monthly: process.env.STRIPE_PRICE_PRO_MONTHLY || 'price_mock_pro_mo',
      pro_annual: process.env.STRIPE_PRICE_PRO_ANNUAL || 'price_mock_pro_yr',
      agency_monthly: process.env.STRIPE_PRICE_AGENCY_MONTHLY || 'price_mock_agency_mo',
      agency_annual: process.env.STRIPE_PRICE_AGENCY_ANNUAL || 'price_mock_agency_yr',
    };

    const lookupKey = `${planId}_${isAnnual ? 'annual' : 'monthly'}`;
    const priceId = priceMap[lookupKey];

    if (!priceId || priceId.includes('mock')) {
      return NextResponse.json({ 
        error: `Stripe Configuration Incomplete. Please add ${lookupKey.toUpperCase()} (e.g. STRIPE_PRICE_PRO_MONTHLY) to your environment variables.` 
      }, { status: 400 });
    }

    // Get the global workspace/subscription for the reference ID
    const activeSub = await prisma.subscription.findFirst();
    const referenceId = activeSub ? activeSub.id : 'anonymous';

    // Build the checkout session
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://instaflow.bridgebox.ai'}/billing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL || 'https://instaflow.bridgebox.ai'}/billing?canceled=true`,
      client_reference_id: referenceId,
    });

    return NextResponse.json({ url: session.url });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

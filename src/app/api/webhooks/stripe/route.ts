import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import Stripe from 'stripe';

export const dynamic = 'force-dynamic';

// ─── Stripe client ────────────────────────────────────────────────────────────

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-01-27.acacia' as any,
});

// ─── Price ID → Plan ID mapping ───────────────────────────────────────────────

const PRICE_TO_PLAN: Record<string, string> = {
  [process.env.STRIPE_PRICE_STARTER_MONTHLY ?? '']: 'starter',
  [process.env.STRIPE_PRICE_STARTER_ANNUAL  ?? '']: 'starter',
  [process.env.STRIPE_PRICE_PRO_MONTHLY     ?? '']: 'pro',
  [process.env.STRIPE_PRICE_PRO_ANNUAL      ?? '']: 'pro',
  [process.env.STRIPE_PRICE_AGENCY_MONTHLY  ?? '']: 'agency',
  [process.env.STRIPE_PRICE_AGENCY_ANNUAL   ?? '']: 'agency',
};

function planFromPriceId(priceId: string): string {
  return PRICE_TO_PLAN[priceId] ?? 'starter';
}

function intervalFromPriceId(priceId: string): string {
  const annual = [
    process.env.STRIPE_PRICE_STARTER_ANNUAL,
    process.env.STRIPE_PRICE_PRO_ANNUAL,
    process.env.STRIPE_PRICE_AGENCY_ANNUAL,
  ];
  return annual.includes(priceId) ? 'annual' : 'monthly';
}

// ─── Idempotent subscription upsert ─────────────────────────────────────────

async function upsertSubscription(data: {
  stripeCustomerId: string;
  stripeSubId: string;
  planId: string;
  billingCycle: string;
  status: string;
  currentPeriodStart?: Date;
  currentPeriodEnd?: Date;
  cancelAtPeriodEnd?: boolean;
  mrr?: number;
}) {
  const existing = await prisma.subscription.findFirst({
    where: { stripeSubId: data.stripeSubId },
  });

  if (existing) {
    return prisma.subscription.update({
      where: { id: existing.id },
      data: {
        stripeCustomerId: data.stripeCustomerId,
        planId: data.planId,
        billingCycle: data.billingCycle,
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        mrr: data.mrr ?? existing.mrr,
      },
    });
  }

  // Try to update the global (first) subscription or create a new one
  const global = await prisma.subscription.findFirst();
  if (global) {
    return prisma.subscription.update({
      where: { id: global.id },
      data: {
        stripeCustomerId: data.stripeCustomerId,
        stripeSubId: data.stripeSubId,
        planId: data.planId,
        billingCycle: data.billingCycle,
        status: data.status,
        currentPeriodStart: data.currentPeriodStart,
        currentPeriodEnd: data.currentPeriodEnd,
        mrr: data.mrr ?? global.mrr,
      },
    });
  }

  return prisma.subscription.create({ data });
}

// ─── Idempotent billing event ─────────────────────────────────────────────────

async function recordEventIdempotent(
  stripeEventId: string,
  subscriptionId: string,
  type: string,
  opts?: { planId?: string; amount?: number; metadata?: object }
) {
  // Check if already processed
  const existing = await prisma.billingEvent.findFirst({
    where: { stripeEventId },
  });
  if (existing) return; // Already processed — skip

  await prisma.billingEvent.create({
    data: {
      subscriptionId,
      stripeEventId,
      type,
      planId: opts?.planId,
      amount: opts?.amount,
      metadata: opts?.metadata ? JSON.stringify(opts.metadata) : undefined,
    },
  });
}

// ─── Webhook handler ──────────────────────────────────────────────────────────

export async function POST(req: Request) {
  const body = await req.text();
  const signature = req.headers.get('stripe-signature') ?? '';

  // In production, STRIPE_WEBHOOK_SECRET must be set. No fallback to JSON.parse.
  if (!process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('[stripe-webhook] STRIPE_WEBHOOK_SECRET is not set — refusing request');
    return NextResponse.json(
      { error: 'Webhook secret not configured' },
      { status: 500 }
    );
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET
    );
  } catch (err: any) {
    console.error('[stripe-webhook] Signature verification failed:', err.message);
    return NextResponse.json(
      { error: `Webhook signature invalid: ${err.message}` },
      { status: 400 }
    );
  }

  console.log(`[stripe-webhook] Processing event: ${event.type} (${event.id})`);

  try {
    switch (event.type) {

      // ── Checkout completed → provision subscription ──────────────────────
      case 'checkout.session.completed': {
        const session = event.data.object as Stripe.Checkout.Session;
        if (session.mode !== 'subscription') break;

        const stripeSubId = session.subscription as string;
        const stripeCustomerId = session.customer as string;
        const amountTotal = session.amount_total ?? 0;

        // Fetch the actual subscription to get plan/period data
        const stripeSub = await stripe.subscriptions.retrieve(stripeSubId);
        const priceId = stripeSub.items.data[0]?.price?.id ?? '';
        const planId = planFromPriceId(priceId);
        const billingCycle = intervalFromPriceId(priceId);
        const mrr = billingCycle === 'annual'
          ? Math.round(amountTotal / 100 / 12)
          : Math.round(amountTotal / 100);

        const sub = await upsertSubscription({
          stripeCustomerId,
          stripeSubId,
          planId,
          billingCycle,
          status: 'active',
          currentPeriodStart: new Date((stripeSub as any).current_period_start * 1000),
          currentPeriodEnd: new Date((stripeSub as any).current_period_end * 1000),
          mrr,
        });

        await recordEventIdempotent(event.id, sub.id, 'subscription_created', {
          planId,
          amount: amountTotal / 100,
        });

        console.log(`[stripe-webhook] Provisioned plan=${planId} for customer=${stripeCustomerId}`);
        break;
      }

      // ── Subscription updated (plan change, renewal, etc.) ────────────────
      case 'customer.subscription.updated': {
        const stripeSub = event.data.object as Stripe.Subscription;
        const priceId = stripeSub.items.data[0]?.price?.id ?? '';
        const planId = planFromPriceId(priceId);
        const billingCycle = intervalFromPriceId(priceId);

        const status = stripeSub.status === 'active'
          ? 'active'
          : stripeSub.status === 'past_due'
          ? 'past_due'
          : stripeSub.status === 'trialing'
          ? 'trial'
          : stripeSub.status === 'canceled'
          ? 'cancelled'
          : stripeSub.status;

        const sub = await upsertSubscription({
          stripeCustomerId: stripeSub.customer as string,
          stripeSubId: stripeSub.id,
          planId,
          billingCycle,
          status,
          currentPeriodStart: new Date((stripeSub as any).current_period_start * 1000),
          currentPeriodEnd: new Date((stripeSub as any).current_period_end * 1000),
        });

        await recordEventIdempotent(event.id, sub.id, 'plan_updated', { planId });
        console.log(`[stripe-webhook] Updated sub=${stripeSub.id} plan=${planId} status=${status}`);
        break;
      }

      // ── Subscription cancelled ───────────────────────────────────────────
      case 'customer.subscription.deleted': {
        const stripeSub = event.data.object as Stripe.Subscription;

        const existing = await prisma.subscription.findFirst({
          where: { stripeSubId: stripeSub.id },
        });
        if (!existing) break;

        await prisma.subscription.update({
          where: { id: existing.id },
          data: {
            status: 'cancelled',
            mrr: 0,
            cancelledAt: new Date(),
          },
        });

        await recordEventIdempotent(event.id, existing.id, 'subscription_canceled', { amount: 0 });
        console.log(`[stripe-webhook] Cancelled sub=${stripeSub.id}`);
        break;
      }

      // ── Invoice paid → ensure status is active ───────────────────────────
      case 'invoice.payment_succeeded': {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubId = (invoice as any).subscription as string | null;
        if (!stripeSubId) break;

        const existing = await prisma.subscription.findFirst({
          where: { stripeSubId },
        });
        if (!existing) break;

        if (existing.status !== 'active') {
          await prisma.subscription.update({
            where: { id: existing.id },
            data: { status: 'active' },
          });
        }

        await recordEventIdempotent(event.id, existing.id, 'payment_succeeded', {
          amount: (invoice.amount_paid ?? 0) / 100,
        });
        console.log(`[stripe-webhook] Payment succeeded for sub=${stripeSubId} amount=$${(invoice.amount_paid ?? 0) / 100}`);
        break;
      }

      // ── Invoice payment failed → mark past_due ───────────────────────────
      case 'invoice.payment_failed': {
        const invoice = event.data.object as Stripe.Invoice;
        const stripeSubId = (invoice as any).subscription as string | null;
        if (!stripeSubId) break;

        const existing = await prisma.subscription.findFirst({
          where: { stripeSubId },
        });
        if (!existing) break;

        await prisma.subscription.update({
          where: { id: existing.id },
          data: { status: 'past_due' },
        });

        await recordEventIdempotent(event.id, existing.id, 'payment_failed', {
          amount: (invoice.amount_due ?? 0) / 100,
        });
        console.warn(`[stripe-webhook] Payment FAILED for sub=${stripeSubId}`);
        break;
      }

      default:
        console.log(`[stripe-webhook] Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error('[stripe-webhook] Handler error:', err);
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 });
  }
}

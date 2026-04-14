import { prisma } from '@/lib/prisma';
import type { PlanLimits } from '@/lib/plans';

// ─── USAGE METRIC KEYS ────────────────────────────────────────────────────────

export type UsageMetric =
  | 'ai_generations'
  | 'scheduled_posts'
  | 'social_accounts'
  | 'team_members'
  | 'workspaces'
  | 'automation_runs'
  | 'api_calls';

export const USAGE_TO_LIMIT: Record<UsageMetric, keyof PlanLimits> = {
  ai_generations: 'aiGenerations',
  scheduled_posts: 'scheduledPosts',
  social_accounts: 'socialAccounts',
  team_members: 'teamMembers',
  workspaces: 'workspaces',
  automation_runs: 'aiGenerations', // billed against AI generations
  api_calls: 'aiGenerations',
};

// ─── PERIOD HELPERS ───────────────────────────────────────────────────────────

/** Returns the start and end of the current billing period (calendar month) */
function currentPeriod(): { start: Date; end: Date } {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth(), 1);
  const end = new Date(now.getFullYear(), now.getMonth() + 1, 0, 23, 59, 59, 999);
  return { start, end };
}

// ─── CORE SERVICE ─────────────────────────────────────────────────────────────

/** Get current period usage for a metric. Returns 0 if no record. */
export async function getUsage(metric: UsageMetric): Promise<number> {
  const { start } = currentPeriod();
  const record = await prisma.usageRecord.findFirst({
    where: { metric, periodStart: { gte: start } },
  });
  return record?.count ?? 0;
}

/** Get all usage metrics for the current period */
export async function getAllUsage(): Promise<Record<UsageMetric, number>> {
  const { start } = currentPeriod();
  const records = await prisma.usageRecord.findMany({
    where: { periodStart: { gte: start } },
  });

  const base: Record<UsageMetric, number> = {
    ai_generations: 0,
    scheduled_posts: 0,
    social_accounts: 0,
    team_members: 0,
    workspaces: 0,
    automation_runs: 0,
    api_calls: 0,
  };

  for (const rec of records) {
    if (rec.metric in base) {
      base[rec.metric as UsageMetric] = rec.count;
    }
  }

  return base;
}

/** Increment a usage metric by `delta` (default 1). Returns new count. */
export async function incrementUsage(
  metric: UsageMetric,
  delta = 1
): Promise<number> {
  const { start, end } = currentPeriod();

  const record = await prisma.usageRecord.upsert({
    where: { metric_periodStart: { metric, periodStart: start } },
    create: { metric, count: delta, periodStart: start, periodEnd: end },
    update: { count: { increment: delta }, updatedAt: new Date() },
  });

  return record.count;
}

/** Sync a gauge metric (social_accounts, workspaces) from actual DB count */
export async function syncGaugeUsage(
  metric: UsageMetric,
  count: number
): Promise<void> {
  const { start, end } = currentPeriod();
  await prisma.usageRecord.upsert({
    where: { metric_periodStart: { metric, periodStart: start } },
    create: { metric, count, periodStart: start, periodEnd: end },
    update: { count, updatedAt: new Date() },
  });
}

/** Get subscription, or return a safe default trial subscription object */
export async function getSubscription() {
  const sub = await prisma.subscription.findFirst({
    include: { addOns: { where: { active: true } }, discounts: { where: { active: true } } },
  });

  if (!sub) {
    // Auto-provision a trial subscription if none exists
    const trialEndsAt = new Date(Date.now() + 14 * 24 * 60 * 60 * 1000);
    return prisma.subscription.create({
      data: {
        planId: 'starter',
        status: 'trial',
        billingCycle: 'monthly',
        trialEndsAt,
        mrr: 0,
      },
      include: { addOns: true, discounts: true },
    });
  }

  return sub;
}

/** Get days remaining in trial. Returns null if not in trial. */
export function trialDaysRemaining(trialEndsAt: Date | null): number | null {
  if (!trialEndsAt) return null;
  const diff = trialEndsAt.getTime() - Date.now();
  if (diff <= 0) return 0;
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

/** Record a billing event */
export async function recordBillingEvent(
  subscriptionId: string,
  type: string,
  opts?: { planId?: string; amount?: number; metadata?: object }
): Promise<void> {
  await prisma.billingEvent.create({
    data: {
      subscriptionId,
      type,
      planId: opts?.planId,
      amount: opts?.amount,
      metadata: opts?.metadata ? JSON.stringify(opts.metadata) : undefined,
    },
  });
}

import { NextResponse } from 'next/server';
import { getSubscription, getAllUsage, trialDaysRemaining } from '@/lib/usageService';
import { getPlan } from '@/lib/plans';
import { checkFeature } from '@/lib/featureGate';

export const dynamic = 'force-dynamic';

/**
 * GET /api/billing/status
 * Returns current subscription, usage, and entitlement state.
 * Used by UI components to gate features server-side.
 */
export async function GET() {
  try {
    const subscription = await getSubscription();
    const usage = await getAllUsage();
    const plan = getPlan(subscription.planId);
    const trialDays = trialDaysRemaining(subscription.trialEndsAt);

    // Derive billing state summary
    const isTrialing = subscription.status === 'trial' && (trialDays === null || trialDays > 0);
    const isActive = subscription.status === 'active';
    const isPastDue = subscription.status === 'past_due';
    const isCancelled = subscription.status === 'cancelled';
    const isExpiredTrial = subscription.status === 'trial' && trialDays !== null && trialDays <= 0;

    // Check common feature entitlements
    const entitlements = {
      advancedAnalytics: checkFeature(subscription.planId, 'advanced_analytics').allowed,
      dmAutomation: checkFeature(subscription.planId, 'dm_automation').allowed,
      teamCollaboration: checkFeature(subscription.planId, 'team_collaboration').allowed,
      whiteLabelReports: checkFeature(subscription.planId, 'white_label').allowed,
      apiAccess: checkFeature(subscription.planId, 'api_access').allowed,
      aiOptimization: checkFeature(subscription.planId, 'ai_optimization').allowed,
      abTesting: checkFeature(subscription.planId, 'experiment_tracking').allowed,
    };

    // Usage vs limits
    const limits = {
      aiGenerations: {
        used: usage.ai_generations,
        limit: plan.limits.aiGenerations,
        exceeded: plan.limits.aiGenerations !== null && usage.ai_generations >= plan.limits.aiGenerations,
      },
      scheduledPosts: {
        used: usage.scheduled_posts,
        limit: plan.limits.scheduledPosts,
        exceeded: plan.limits.scheduledPosts !== null && usage.scheduled_posts >= plan.limits.scheduledPosts,
      },
      socialAccounts: {
        used: usage.social_accounts,
        limit: plan.limits.socialAccounts,
        exceeded: plan.limits.socialAccounts !== null && usage.social_accounts >= plan.limits.socialAccounts,
      },
      teamMembers: {
        used: usage.team_members,
        limit: plan.limits.teamMembers,
        exceeded: plan.limits.teamMembers !== null && usage.team_members >= plan.limits.teamMembers,
      },
    };

    return NextResponse.json({
      subscription: {
        id: subscription.id,
        planId: subscription.planId,
        planName: plan.name,
        status: subscription.status,
        billingCycle: subscription.billingCycle,
        trialDaysRemaining: trialDays,
        currentPeriodEnd: subscription.currentPeriodEnd,
        stripeConnected: !!subscription.stripeCustomerId,
        mrr: subscription.mrr,
      },
      state: {
        isTrialing,
        isActive,
        isPastDue,
        isCancelled,
        isExpiredTrial,
        hasAccess: isTrialing || isActive || isPastDue,
      },
      entitlements,
      limits,
    });
  } catch (err: any) {
    console.error('[billing/status] Error:', err);
    return NextResponse.json({ error: 'Failed to fetch billing status' }, { status: 500 });
  }
}

import { hasFeature, isAtLeast, getLimit, type FeatureKey, type PlanId } from '@/lib/plans';

// ─── FEATURE GATE ─────────────────────────────────────────────────────────────

export interface GateResult {
  allowed: boolean;
  reason?: string;
  requiredPlan?: PlanId;
  upgradeMessage?: string;
}

const FEATURE_REQUIRED_PLAN: Partial<Record<FeatureKey, PlanId>> = {
  // Pro gated
  advanced_analytics: 'pro',
  ai_optimization: 'pro',
  performance_forecasting: 'pro',
  dm_automation: 'pro',
  comment_automation: 'pro',
  review_queue: 'pro',
  automation_templates: 'pro',
  bulk_actions: 'pro',
  team_collaboration: 'pro',
  experiment_tracking: 'pro',

  // Agency gated
  approval_chains: 'agency',
  strategy_assistant: 'agency',
  white_label: 'agency',
  branded_reports: 'agency',
  client_permissions: 'agency',
  priority_support: 'agency',

  // Enterprise gated
  api_access: 'enterprise',
  sso: 'enterprise',
  custom_integrations: 'enterprise',
  concierge_support: 'enterprise',
  sla_support: 'enterprise',
  dedicated_infrastructure: 'enterprise',
};

const UPGRADE_MESSAGES: Record<PlanId, string> = {
  starter: 'Upgrade to Starter to unlock this feature.',
  pro: 'Upgrade to Pro to unlock this feature.',
  agency: 'Upgrade to Agency to unlock this feature.',
  enterprise: 'Contact sales to unlock this feature.',
};

/**
 * Check if a plan can access a feature.
 * Returns { allowed: true } or { allowed: false, requiredPlan, upgradeMessage }
 */
export function checkFeature(planId: string, feature: FeatureKey): GateResult {
  const required = FEATURE_REQUIRED_PLAN[feature];

  if (!required) {
    // Feature has no gating requirement — available on all plans
    return { allowed: true };
  }

  if (isAtLeast(planId, required)) {
    return { allowed: true };
  }

  return {
    allowed: false,
    requiredPlan: required,
    reason: `This feature requires the ${required.charAt(0).toUpperCase() + required.slice(1)} plan.`,
    upgradeMessage: UPGRADE_MESSAGES[required],
  };
}

/**
 * Check if a plan can perform an action given its current usage level.
 */
export function checkLimit(
  planId: string,
  metric: 'workspaces' | 'socialAccounts' | 'aiGenerations' | 'scheduledPosts' | 'teamMembers',
  currentCount: number
): GateResult {
  const limit = getLimit(planId, metric);

  if (limit === null) return { allowed: true }; // unlimited

  if (currentCount < limit) return { allowed: true };

  const metricLabel: Record<string, string> = {
    workspaces: 'workspaces',
    socialAccounts: 'social accounts',
    aiGenerations: 'AI generations this month',
    scheduledPosts: 'scheduled posts this month',
    teamMembers: 'team seats',
  };

  return {
    allowed: false,
    reason: `You've reached your limit of ${limit} ${metricLabel[metric] ?? metric} on the ${planId} plan.`,
    upgradeMessage: 'Upgrade your plan or purchase an add-on to continue.',
  };
}

/**
 * Get usage warning level based on percentage used.
 * Returns null if no warning needed.
 */
export function usageWarningLevel(pct: number | null): 'warn' | 'critical' | null {
  if (pct === null) return null;
  if (pct >= 95) return 'critical';
  if (pct >= 80) return 'warn';
  return null;
}

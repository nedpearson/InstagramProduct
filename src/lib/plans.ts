// ─── PLAN DEFINITIONS — Single source of truth for all monetization logic ─────

export type PlanId = 'starter' | 'pro' | 'agency' | 'enterprise';

export type FeatureKey =
  | 'basic_analytics'
  | 'advanced_analytics'
  | 'content_calendar'
  | 'caption_generator'
  | 'reel_generator'
  | 'carousel_generator'
  | 'manual_approval'
  | 'ai_optimization'
  | 'performance_forecasting'
  | 'dm_automation'
  | 'comment_automation'
  | 'review_queue'
  | 'automation_templates'
  | 'bulk_actions'
  | 'team_collaboration'
  | 'approval_chains'
  | 'experiment_tracking'
  | 'strategy_assistant'
  | 'white_label'
  | 'branded_reports'
  | 'client_permissions'
  | 'api_access'
  | 'sso'
  | 'custom_integrations'
  | 'priority_support'
  | 'concierge_support'
  | 'sla_support'
  | 'dedicated_infrastructure';

export interface PlanLimits {
  workspaces: number | null;       // null = unlimited
  socialAccounts: number | null;
  aiGenerations: number | null;    // per month
  scheduledPosts: number | null;   // per month
  teamMembers: number | null;
}

export interface Plan {
  id: PlanId;
  name: string;
  price: { monthly: number; annual: number };
  badge?: string;
  target: string;
  tagline: string;
  color: 'zinc' | 'indigo' | 'violet' | 'amber';
  highlight?: boolean;
  enterprise?: boolean;
  limits: PlanLimits;
  features: FeatureKey[];
  lockedBehind?: PlanId; // null = this IS the top plan
}

export const PLANS: Record<PlanId, Plan> = {
  starter: {
    id: 'starter',
    name: 'Starter',
    price: { monthly: 79, annual: 63 }, // 20% off
    target: 'Solo creators & beginners',
    tagline: 'Everything you need to launch your first AI-powered Instagram funnel.',
    color: 'zinc',
    limits: {
      workspaces: 1,
      socialAccounts: 1,
      aiGenerations: 100,
      scheduledPosts: 30,
      teamMembers: 1,
    },
    features: [
      'basic_analytics',
      'content_calendar',
      'caption_generator',
      'reel_generator',
      'carousel_generator',
      'manual_approval',
    ],
  },

  pro: {
    id: 'pro',
    name: 'Pro',
    price: { monthly: 199, annual: 159 },
    badge: 'Most Popular',
    target: 'Serious creators & SMBs',
    tagline: 'Scale your automation with advanced AI, analytics, and team collaboration.',
    color: 'indigo',
    highlight: true,
    limits: {
      workspaces: 5,
      socialAccounts: 5,
      aiGenerations: 1000,
      scheduledPosts: null,
      teamMembers: 5,
    },
    features: [
      'basic_analytics',
      'advanced_analytics',
      'content_calendar',
      'caption_generator',
      'reel_generator',
      'carousel_generator',
      'manual_approval',
      'ai_optimization',
      'performance_forecasting',
      'dm_automation',
      'comment_automation',
      'review_queue',
      'automation_templates',
      'bulk_actions',
      'team_collaboration',
      'experiment_tracking',
    ],
  },

  agency: {
    id: 'agency',
    name: 'Agency',
    price: { monthly: 499, annual: 399 },
    badge: 'Best for Agencies',
    target: 'Agencies & power operators',
    tagline: 'Multi-client automation, white-label reporting, and full strategic intelligence.',
    color: 'violet',
    limits: {
      workspaces: 25,
      socialAccounts: 25,
      aiGenerations: 5000,
      scheduledPosts: null,
      teamMembers: 25,
    },
    features: [
      'basic_analytics',
      'advanced_analytics',
      'content_calendar',
      'caption_generator',
      'reel_generator',
      'carousel_generator',
      'manual_approval',
      'ai_optimization',
      'performance_forecasting',
      'dm_automation',
      'comment_automation',
      'review_queue',
      'automation_templates',
      'bulk_actions',
      'team_collaboration',
      'approval_chains',
      'experiment_tracking',
      'strategy_assistant',
      'white_label',
      'branded_reports',
      'client_permissions',
      'priority_support',
    ],
  },

  enterprise: {
    id: 'enterprise',
    name: 'Enterprise',
    price: { monthly: 999, annual: 799 },
    target: 'Large agencies & enterprise brands',
    tagline: 'Infinite scale, dedicated infrastructure, and custom integrations.',
    color: 'amber',
    enterprise: true,
    limits: {
      workspaces: null,
      socialAccounts: null,
      aiGenerations: null,
      scheduledPosts: null,
      teamMembers: null,
    },
    features: [
      'basic_analytics',
      'advanced_analytics',
      'content_calendar',
      'caption_generator',
      'reel_generator',
      'carousel_generator',
      'manual_approval',
      'ai_optimization',
      'performance_forecasting',
      'dm_automation',
      'comment_automation',
      'review_queue',
      'automation_templates',
      'bulk_actions',
      'team_collaboration',
      'approval_chains',
      'experiment_tracking',
      'strategy_assistant',
      'white_label',
      'branded_reports',
      'client_permissions',
      'api_access',
      'sso',
      'custom_integrations',
      'priority_support',
      'concierge_support',
      'sla_support',
      'dedicated_infrastructure',
    ],
  },
};

export const PLAN_ORDER: PlanId[] = ['starter', 'pro', 'agency', 'enterprise'];

// ─── ADD-ON DEFINITIONS ────────────────────────────────────────────────────────

export type AddOnType =
  | 'ai_credits'
  | 'extra_account'
  | 'extra_seat'
  | 'analytics_pack'
  | 'white_label'
  | 'priority_support';

export interface AddOnDef {
  type: AddOnType;
  name: string;
  description: string;
  pricePerUnit: number;
  unit: string;
  quantityLabel: string;
  minPlan?: PlanId; // minimum plan required
}

export const ADD_ONS: AddOnDef[] = [
  {
    type: 'ai_credits',
    name: 'AI Credit Pack',
    description: '500 additional AI content generations added to your monthly quota.',
    pricePerUnit: 15,
    unit: '500 credits',
    quantityLabel: 'packs',
  },
  {
    type: 'extra_account',
    name: 'Extra Social Account',
    description: 'Connect additional Instagram accounts beyond your plan limit.',
    pricePerUnit: 15,
    unit: 'account/month',
    quantityLabel: 'accounts',
  },
  {
    type: 'extra_seat',
    name: 'Extra Team Seat',
    description: 'Add team members beyond your plan&apos;s included seats.',
    pricePerUnit: 20,
    unit: 'seat/month',
    quantityLabel: 'seats',
  },
  {
    type: 'analytics_pack',
    name: 'Advanced Analytics Pack',
    description: 'Deep-dive analytics, custom reports, and competitor benchmarks.',
    pricePerUnit: 49,
    unit: '/month',
    quantityLabel: 'add-on',
  },
  {
    type: 'white_label',
    name: 'White Label Add-On',
    description: 'Remove InstaFlow branding from reports, portals, and exports.',
    pricePerUnit: 199,
    unit: '/month',
    quantityLabel: 'add-on',
    minPlan: 'agency',
  },
  {
    type: 'priority_support',
    name: 'Priority Concierge Support',
    description: 'Dedicated Slack channel, 2-hour SLA, and monthly strategy calls.',
    pricePerUnit: 99,
    unit: '/month',
    quantityLabel: 'add-on',
  },
];

// ─── HELPERS ──────────────────────────────────────────────────────────────────

export function getPlan(planId: string): Plan {
  return PLANS[planId as PlanId] ?? PLANS.starter;
}

export function planRank(planId: string): number {
  return PLAN_ORDER.indexOf(planId as PlanId);
}

export function isAtLeast(currentPlan: string, requiredPlan: PlanId): boolean {
  return planRank(currentPlan) >= planRank(requiredPlan);
}

export function hasFeature(planId: string, feature: FeatureKey): boolean {
  const plan = getPlan(planId);
  return plan.features.includes(feature);
}

export function getLimit(planId: string, metric: keyof PlanLimits): number | null {
  return getPlan(planId).limits[metric];
}

export function isWithinLimit(
  planId: string,
  metric: keyof PlanLimits,
  current: number
): boolean {
  const limit = getLimit(planId, metric);
  if (limit === null) return true; // unlimited
  return current < limit;
}

/** Returns 0–100 usage percentage, or null if unlimited */
export function usagePct(planId: string, metric: keyof PlanLimits, current: number): number | null {
  const limit = getLimit(planId, metric);
  if (limit === null) return null;
  return Math.min(100, Math.round((current / limit) * 100));
}

export function annualSavings(plan: Plan): number {
  return (plan.price.monthly - plan.price.annual) * 12;
}

export const FEATURE_LABELS: Record<FeatureKey, string> = {
  basic_analytics: 'Basic Analytics',
  advanced_analytics: 'Advanced Analytics',
  content_calendar: 'Content Calendar',
  caption_generator: 'Caption Generator',
  reel_generator: 'Reel Script Generator',
  carousel_generator: 'Carousel Generator',
  manual_approval: 'Manual Approval Mode',
  ai_optimization: 'AI Optimization Suggestions',
  performance_forecasting: 'Performance Forecasting',
  dm_automation: 'DM Workflow Builder',
  comment_automation: 'Comment Keyword Automation',
  review_queue: 'Review Queue',
  automation_templates: 'Automation Templates',
  bulk_actions: 'Bulk Actions',
  team_collaboration: 'Team Collaboration',
  approval_chains: 'Approval Chains',
  experiment_tracking: 'A/B Experiment Tracking',
  strategy_assistant: 'Strategy Assistant',
  white_label: 'White Label Reporting',
  branded_reports: 'Branded Client Reports',
  client_permissions: 'Client Permissions',
  api_access: 'API Access',
  sso: 'Single Sign-On (SSO)',
  custom_integrations: 'Custom Integrations',
  priority_support: 'Priority Support',
  concierge_support: 'Concierge Support',
  sla_support: 'SLA Support',
  dedicated_infrastructure: 'Dedicated Infrastructure',
};

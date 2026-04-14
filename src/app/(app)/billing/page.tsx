import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  CreditCard, Gem, Clock, ArrowRight, CheckCircle2,
  AlertTriangle, Settings2, Lock
} from 'lucide-react';
import { getSubscription, getAllUsage, trialDaysRemaining } from '@/lib/usageService';
import { getPlan, PLANS, PLAN_ORDER, ADD_ONS, usagePct, annualSavings, FEATURE_LABELS, type PlanId } from '@/lib/plans';
import { UsageMeter, UpgradePrompt, LockedFeature } from '@/components/BillingUI';

export const dynamic = 'force-dynamic';

// Plan display colors
const PLAN_ACC: Record<string, { bg: string; border: string; text: string; grad: string }> = {
  starter: { bg: 'bg-zinc-800/40', border: 'border-zinc-700/50', text: 'text-zinc-300', grad: 'from-zinc-700/20' },
  pro: { bg: 'bg-indigo-500/[0.07]', border: 'border-indigo-500/25', text: 'text-indigo-400', grad: 'from-indigo-500/10' },
  agency: { bg: 'bg-violet-500/[0.07]', border: 'border-violet-500/25', text: 'text-violet-400', grad: 'from-violet-500/10' },
  enterprise: { bg: 'bg-amber-500/[0.07]', border: 'border-amber-500/25', text: 'text-amber-400', grad: 'from-amber-500/10' },
  trial: { bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20', text: 'text-emerald-400', grad: 'from-emerald-500/08' },
};

export default async function BillingPage() {
  const [subscription, usage, [socialAccounts, workspaceCount, schedules]] = await Promise.all([
    getSubscription(),
    getAllUsage(),
    Promise.all([
      prisma.instagramAccount.count(),
      prisma.workspace.count(),
      prisma.schedule.count({ where: { status: 'pending' } }),
    ]),
  ]);

  const plan = getPlan(subscription.planId);
  const acc = PLAN_ACC[subscription.status === 'trial' ? 'trial' : subscription.planId] ?? PLAN_ACC.starter;
  const trialDays = trialDaysRemaining(subscription.trialEndsAt);
  const isTrialing = subscription.status === 'trial';

  // Compute actual usage (some from DB directly, some from usage records)
  const usageMap = {
    aiGenerations: usage.ai_generations,
    scheduledPosts: schedules,
    socialAccounts,
    workspaces: workspaceCount,
    teamMembers: usage.team_members,
  };

  // AI gen usage % for warning
  const aiPct = usagePct(plan.id, 'aiGenerations', usageMap.aiGenerations);
  const postPct = usagePct(plan.id, 'scheduledPosts', usageMap.scheduledPosts);

  const nextPlanId = PLAN_ORDER[PLAN_ORDER.indexOf(plan.id as PlanId) + 1] as PlanId | undefined;
  const nextPlan = nextPlanId ? PLANS[nextPlanId] : null;

  // Recent billing events
  const billingEvents = await prisma.billingEvent.findMany({
    where: { subscriptionId: subscription.id },
    orderBy: { createdAt: 'desc' },
    take: 8,
  });

  // Active add-ons
  const activeAddOns = subscription.addOns.filter(a => a.active);
  const activeDiscount = subscription.discounts.find(d => d.active);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" /><div className="mesh-bg-2" /><div className="mesh-bg-3" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Billing & Subscription · Account Management</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Billing</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Manage your plan, usage, and payment settings.</p>
        </div>
        <Link href="/pricing" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center gap-2">
          <Gem className="w-3.5 h-3.5" /> Upgrade Plan
        </Link>
      </div>

      {/* Trial Banner */}
      {isTrialing && trialDays !== null && (
        <div className="relative z-10 rounded-2xl bg-gradient-to-r from-emerald-500/[0.08] to-transparent border border-emerald-500/20 p-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-emerald-500/40 to-transparent" />
          <div className="w-10 h-10 rounded-xl bg-emerald-500/15 border border-emerald-500/20 flex items-center justify-center shrink-0 shadow-inner">
            <Clock className="w-5 h-5 text-emerald-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3 flex-wrap">
              <span className="text-[14px] font-bold text-white">
                {trialDays === 0 ? 'Trial expired' : `${trialDays} day${trialDays === 1 ? '' : 's'} left in your free trial`}
              </span>
              <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-[9px] font-black tracking-widest uppercase rounded-md">
                {trialDays > 0 ? 'Trial Active' : 'Expired'}
              </span>
            </div>
            <p className="text-[12px] text-zinc-500 font-medium mt-0.5">
              {trialDays > 0
                ? `Your free trial expires in ${trialDays} days. Add a payment method to avoid interruption.`
                : 'Your trial has ended. Add a payment method to restore access.'}
            </p>
          </div>
          <Link href="/pricing" className="shrink-0 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-[12px] rounded-xl transition-all shadow-lg active:scale-95 flex items-center gap-1.5">
            Add Payment Method <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}

      {/* Current Plan Card + Usage side-by-side */}
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-5 relative z-10">

        {/* Current Plan Card */}
        <div className={`xl:col-span-2 rounded-2xl border ${acc.border} bg-gradient-to-b ${acc.grad} to-[#08080b] p-6 flex flex-col relative overflow-hidden`}>
          <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
          <div className="ai-section-label mb-4">Current Plan</div>
          <div className="flex items-start justify-between mb-4">
            <div>
              <div className="flex items-center gap-2.5 mb-1">
                <span className="text-2xl font-black text-white tracking-tight">{plan.name}</span>
                {plan.badge && (
                  <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${acc.bg} ${acc.border} border ${acc.text}`}>
                    {plan.badge}
                  </span>
                )}
              </div>
              <div className="text-[12px] text-zinc-500 font-medium">{plan.tagline}</div>
            </div>
            <div className="text-right">
              <div className="text-2xl font-black text-white tabular-nums">
                ${subscription.billingCycle === 'annual' ? plan.price.annual : plan.price.monthly}
              </div>
              <div className="text-[10px] text-zinc-600 font-medium">/{subscription.billingCycle === 'annual' ? 'mo (annual)' : 'mo'}</div>
            </div>
          </div>

          {/* Status row */}
          <div className="flex items-center gap-3 mb-6">
            <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border shadow-inner ${
              subscription.status === 'active' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' :
              subscription.status === 'trial' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
              subscription.status === 'past_due' ? 'bg-red-500/10 border-red-500/20 text-red-400' :
              'bg-zinc-700/20 border-zinc-700/30 text-zinc-400'
            }`}>
              <span className={`w-1.5 h-1.5 rounded-full bg-current ${subscription.status === 'active' ? 'animate-pulse' : ''}`} />
              {subscription.status === 'trial' ? `Trial · ${trialDays}d left` : subscription.status.replace('_', ' ')}
            </span>
            <span className="text-[9px] font-bold tracking-widest text-zinc-600 uppercase">
              {subscription.billingCycle === 'annual' ? '⊛ Annual' : '⊛ Monthly'}
            </span>
          </div>

          {/* Plan limits summary */}
          <div className="space-y-2 mb-6">
            {[
              { label: 'Workspaces', value: plan.limits.workspaces },
              { label: 'Social Accounts', value: plan.limits.socialAccounts },
              { label: 'AI Generations/mo', value: plan.limits.aiGenerations },
              { label: 'Team Members', value: plan.limits.teamMembers },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between text-[12px]">
                <span className="text-zinc-500 font-medium">{row.label}</span>
                <span className="font-bold text-white">
                  {row.value === null ? <span className="text-emerald-400">Unlimited</span> : row.value.toLocaleString()}
                </span>
              </div>
            ))}
          </div>

          {activeDiscount && (
            <div className="mb-4 px-3 py-2.5 bg-emerald-500/[0.06] border border-emerald-500/15 rounded-xl flex items-center gap-2">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] text-emerald-400 font-bold">
                {activeDiscount.value}% discount applied
                {activeDiscount.code ? ` (code: ${activeDiscount.code})` : ''}
              </span>
            </div>
          )}

          <div className="flex gap-2 mt-auto">
            <Link href="/pricing" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] rounded-xl transition-all shadow-lg active:scale-95">
              <Gem className="w-3.5 h-3.5" /> Upgrade
            </Link>
            <button className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white font-bold text-[12px] rounded-xl transition-all shadow-inner active:scale-95 flex items-center gap-1.5">
              <Settings2 className="w-3.5 h-3.5 text-zinc-400" /> Manage
            </button>
          </div>
        </div>

        {/* Usage meters */}
        <div className="xl:col-span-3 glass-panel-ai ai-scan-panel rounded-2xl p-6 flex flex-col gap-5 border border-white/[0.05] hover:border-white/[0.09] transition-colors">
          <div className="flex items-center justify-between">
            <div>
              <div className="ai-section-label mb-1">Usage this period</div>
              <div className="text-[13px] font-bold text-white">Quota consumption</div>
            </div>
            {(aiPct !== null && aiPct >= 80) && (
              <UpgradePrompt
                title={`${aiPct}% of AI credits used`}
                description="Upgrade or purchase credits to continue generating."
                ctaLabel="Add Credits"
                accentColor="amber"
              />
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            <UsageMeter label="AI Generations" used={usageMap.aiGenerations} limit={plan.limits.aiGenerations} />
            <UsageMeter label="Scheduled Posts" used={usageMap.scheduledPosts} limit={plan.limits.scheduledPosts} />
            <UsageMeter label="Social Accounts" used={usageMap.socialAccounts} limit={plan.limits.socialAccounts} />
            <UsageMeter label="Workspaces" used={usageMap.workspaces} limit={plan.limits.workspaces} />
            <UsageMeter label="Team Members" used={usageMap.teamMembers} limit={plan.limits.teamMembers} />
          </div>

          {/* Upgrade nudge when on starter/pro */}
          {(plan.id === 'starter' || plan.id === 'pro') && nextPlan && (
            <div className="pt-4 border-t border-white/[0.05]">
              <div className="flex items-center justify-between">
                <div className="ai-section-label">Unlock on {nextPlan.name}</div>
                <Link href="/pricing" className="text-[10px] font-black text-indigo-400 hover:text-indigo-300 tracking-widest uppercase transition-colors">
                  View plans →
                </Link>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-3">
                {nextPlan.features
                  .filter(f => !plan.features.includes(f))
                  .slice(0, 4)
                  .map(f => (
                    <div key={f} className="flex items-center gap-2 text-[11px] text-zinc-500 font-medium">
                      <Lock className="w-3 h-3 text-indigo-400 shrink-0" />
                      {FEATURE_LABELS[f] ?? f}
                    </div>
                  ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add-Ons section */}
      <div className="relative z-10 space-y-3">
        <div className="flex items-center justify-between">
          <div className="ai-section-label">Add-Ons & Expansion</div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {ADD_ONS.map(addon => {
            const isActive = activeAddOns.some(a => a.type === addon.type);
            return (
              <div key={addon.type} className={`glass-panel-ai rounded-2xl p-5 border flex flex-col gap-3 transition-all duration-200 hover:-translate-y-px ${
                isActive ? 'border-emerald-500/20 bg-emerald-500/[0.04]' : 'border-white/[0.06] hover:border-indigo-500/20'
              }`}>
                <div className="flex items-start justify-between">
                  <div>
                    <div className="text-[13px] font-bold text-white mb-1">{addon.name}</div>
                    <div className="text-[10px] text-zinc-500 font-medium leading-relaxed">{addon.description}</div>
                  </div>
                  {isActive ? (
                    <span className="shrink-0 flex items-center gap-1 px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[9px] font-black text-emerald-400 tracking-widest uppercase">
                      <CheckCircle2 className="w-3 h-3" /> Active
                    </span>
                  ) : null}
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <div>
                    <span className="text-[18px] font-black text-white tabular-nums">${addon.pricePerUnit}</span>
                    <span className="text-[10px] text-zinc-600 font-medium ml-1">{addon.unit}</span>
                  </div>
                  <button className={`px-4 py-2 font-bold text-[11px] rounded-xl transition-all active:scale-95 border ${
                    isActive
                      ? 'bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-white'
                      : 'bg-indigo-600/80 hover:bg-indigo-500 border-indigo-500/30 text-white shadow-lg hover:shadow-indigo-500/20'
                  }`}>
                    {isActive ? 'Manage' : 'Add'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Billing Events History */}
      <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-300 relative z-10">
        <div className="px-6 py-5 border-b border-white/[0.05] flex items-center gap-4 bg-white/[0.01]">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center shrink-0 shadow-inner">
            <CreditCard className="w-5 h-5 text-indigo-400" />
          </div>
          <div>
            <div className="text-[14px] font-bold text-white">Billing History</div>
            <div className="ai-section-label mt-0.5">Events &amp; changes · This account</div>
          </div>
          <div className="ml-auto flex items-center gap-2 px-3 py-1.5 rounded-lg bg-amber-500/[0.08] border border-amber-500/20">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span className="text-[10px] font-bold text-amber-400 tracking-widest uppercase">Stripe not connected</span>
          </div>
        </div>

        {billingEvents.length === 0 ? (
          <div className="py-14 text-center flex flex-col items-center">
            <div className="w-12 h-12 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-4 border border-white/[0.07] shadow-inner">
              <CreditCard className="w-5 h-5 text-zinc-600" />
            </div>
            <div className="ai-section-label mb-2">Billing History · Empty</div>
            <p className="text-[14px] font-black text-white mb-1">No billing events yet</p>
            <p className="text-[11px] text-zinc-600 font-medium max-w-xs">
              Connect Stripe to enable payment processing, invoices, and transaction history.
            </p>
            <button className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] rounded-xl transition-all shadow-lg active:scale-95">
              Connect Stripe →
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-[#050505]/50 border-b border-white/[0.05]">
                <tr>
                  <th className="px-6 py-3.5 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase">Event</th>
                  <th className="px-6 py-3.5 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase">Plan</th>
                  <th className="px-6 py-3.5 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase">Amount</th>
                  <th className="px-6 py-3.5 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04]">
                {billingEvents.map(ev => (
                  <tr key={ev.id} className="hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-4">
                      <span className="text-[12px] font-semibold text-zinc-300">{ev.type.replace(/_/g, ' ')}</span>
                    </td>
                    <td className="px-6 py-4">
                      {ev.planId ? (
                        <span className="text-[9px] font-black tracking-[0.15em] uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2 py-1 rounded-md">
                          {ev.planId}
                        </span>
                      ) : <span className="text-zinc-600">—</span>}
                    </td>
                    <td className="px-6 py-4 text-[12px] font-bold text-white tabular-nums">
                      {ev.amount != null ? `$${ev.amount.toFixed(2)}` : '—'}
                    </td>
                    <td className="px-6 py-4 text-[11px] text-zinc-500 font-mono">
                      {ev.createdAt.toLocaleDateString()}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Danger Zone */}
      <div className="glass-panel-ai rounded-2xl border border-red-500/[0.12] p-6 relative z-10">
        <div className="ai-section-label mb-4 text-red-400/70">Danger Zone · Subscription Management</div>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="text-[14px] font-bold text-white mb-1">Cancel Subscription</div>
            <p className="text-[12px] text-zinc-500 font-medium">You will retain access until the end of your billing period.</p>
          </div>
          <button className="px-5 py-2.5 bg-red-500/[0.08] hover:bg-red-500/[0.15] border border-red-500/20 text-red-400 font-bold text-[12px] rounded-xl transition-all active:scale-95">
            Cancel Subscription
          </button>
        </div>
      </div>
    </div>
  );
}

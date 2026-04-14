'use client';

import { Lock, ArrowRight, Sparkles } from 'lucide-react';
import Link from 'next/link';
import type { PlanId } from '@/lib/plans';

interface UsageMeterProps {
  label: string;
  used: number;
  limit: number | null;
  unit?: string;
  warnAt?: number;
  criticalAt?: number;
}

export function UsageMeter({
  label, used, limit, unit = '',
  warnAt = 80,
  criticalAt = 95,
}: UsageMeterProps) {
  const unlimited = limit === null;
  const pct = unlimited ? 0 : Math.min(100, Math.round((used / limit!) * 100));
  const warn = !unlimited && pct >= warnAt && pct < criticalAt;
  const critical = !unlimited && pct >= criticalAt;

  const barColor = critical
    ? 'bg-red-500'
    : warn
    ? 'bg-amber-400'
    : 'bg-indigo-500';

  const textColor = critical
    ? 'text-red-400'
    : warn
    ? 'text-amber-400'
    : 'text-zinc-400';

  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-zinc-400">{label}</span>
        </div>
        <span className={`text-[11px] font-bold tabular-nums ${critical ? 'text-red-400' : warn ? 'text-amber-400' : 'text-zinc-500'}`}>
          {unlimited ? (
            <span className="text-emerald-400">∞ Unlimited</span>
          ) : (
            `${used.toLocaleString()} / ${limit!.toLocaleString()}${unit ? ` ${unit}` : ''}`
          )}
        </span>
      </div>
      <div className="h-1.5 bg-white/[0.06] rounded-full overflow-hidden">
        {unlimited ? (
          <div className="h-full bg-gradient-to-r from-emerald-500/60 to-emerald-400 rounded-full w-full" />
        ) : (
          <div
            className={`h-full rounded-full transition-all duration-500 ${barColor}`}
            style={{ width: `${pct}%` }}
          />
        )}
      </div>
      {(critical || warn) && !unlimited && (
        <div className={`text-[9px] font-bold tracking-widest uppercase ${critical ? 'text-red-400' : 'text-amber-400'}`}>
          {critical ? `⚠ Limit reached — upgrade to continue` : `${100 - pct}% remaining`}
        </div>
      )}
    </div>
  );
}

// ─── LOCKED FEATURE CARD ──────────────────────────────────────────────────────

interface LockedFeatureProps {
  feature: string;
  description: string;
  requiredPlan: PlanId;
  compact?: boolean;
}

const PLAN_COLORS: Record<PlanId, { badge: string; border: string; bg: string; text: string }> = {
  starter: { badge: 'bg-zinc-700 text-zinc-300', border: 'border-zinc-700/40', bg: 'bg-zinc-800/20', text: 'text-zinc-400' },
  pro: { badge: 'bg-indigo-500/15 text-indigo-400 border border-indigo-500/25', border: 'border-indigo-500/20', bg: 'bg-indigo-500/[0.05]', text: 'text-indigo-400' },
  agency: { badge: 'bg-violet-500/15 text-violet-400 border border-violet-500/25', border: 'border-violet-500/20', bg: 'bg-violet-500/[0.05]', text: 'text-violet-400' },
  enterprise: { badge: 'bg-amber-500/15 text-amber-400 border border-amber-500/25', border: 'border-amber-500/20', bg: 'bg-amber-500/[0.05]', text: 'text-amber-400' },
};

const PLAN_NAMES: Record<PlanId, string> = {
  starter: 'Starter',
  pro: 'Pro',
  agency: 'Agency',
  enterprise: 'Enterprise',
};

export function LockedFeature({ feature, description, requiredPlan, compact = false }: LockedFeatureProps) {
  const colors = PLAN_COLORS[requiredPlan];

  if (compact) {
    return (
      <div className={`relative flex items-center gap-3 p-3.5 rounded-xl border ${colors.border} ${colors.bg} overflow-hidden group`}>
        <Lock className={`w-3.5 h-3.5 shrink-0 ${colors.text}`} />
        <span className="text-[12px] font-semibold text-zinc-400">{feature}</span>
        <span className={`ml-auto text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${colors.badge}`}>
          {PLAN_NAMES[requiredPlan]}
        </span>
      </div>
    );
  }

  return (
    <div className={`relative rounded-2xl border ${colors.border} ${colors.bg} p-5 overflow-hidden group hover:brightness-110 transition-all duration-200`}>
      <div className="absolute top-0 right-0 left-0 h-px bg-gradient-to-r from-transparent via-white/[0.06] to-transparent" />
      {/* Blurred lock overlay */}
      <div className="flex items-start gap-3">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${colors.border} ${colors.bg}`}>
          <Lock className={`w-4 h-4 ${colors.text}`} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="text-[13px] font-bold text-white">{feature}</span>
            <span className={`text-[8px] font-black tracking-widest uppercase px-2 py-0.5 rounded-md ${colors.badge}`}>
              {PLAN_NAMES[requiredPlan]}
            </span>
          </div>
          <p className="text-[11px] text-zinc-500 font-medium leading-relaxed">{description}</p>
        </div>
      </div>
      <Link
        href="/billing"
        className={`mt-4 inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest uppercase ${colors.text} hover:opacity-80 transition-opacity`}
      >
        Unlock on {PLAN_NAMES[requiredPlan]} <ArrowRight className="w-3 h-3" />
      </Link>
    </div>
  );
}

// ─── UPGRADE PROMPT BANNER ────────────────────────────────────────────────────

interface UpgradePromptProps {
  title: string;
  description: string;
  ctaLabel?: string;
  accentColor?: 'indigo' | 'amber' | 'violet';
  requiredPlan?: PlanId;
}

export function UpgradePrompt({
  title, description,
  ctaLabel = 'View Plans',
  accentColor = 'indigo',
  requiredPlan,
}: UpgradePromptProps) {
  const colors = {
    indigo: { bg: 'from-indigo-500/[0.08]', border: 'border-indigo-500/20', icon: 'bg-indigo-500/10 border-indigo-500/15', text: 'text-indigo-400', cta: 'bg-indigo-600 hover:bg-indigo-500 shadow-indigo-500/20' },
    amber: { bg: 'from-amber-500/[0.08]', border: 'border-amber-500/20', icon: 'bg-amber-500/10 border-amber-500/15', text: 'text-amber-400', cta: 'bg-amber-600 hover:bg-amber-500 shadow-amber-500/20' },
    violet: { bg: 'from-violet-500/[0.08]', border: 'border-violet-500/20', icon: 'bg-violet-500/10 border-violet-500/15', text: 'text-violet-400', cta: 'bg-violet-600 hover:bg-violet-500 shadow-violet-500/20' },
  }[accentColor];

  return (
    <div className={`relative rounded-2xl bg-gradient-to-r ${colors.bg} to-transparent border ${colors.border} p-4 flex items-center gap-4`}>
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-white/[0.08] to-transparent" />
      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border shadow-inner ${colors.icon}`}>
        <Sparkles className={`w-4 h-4 ${colors.text}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-[13px] font-bold text-white leading-snug">{title}</p>
        <p className="text-[11px] text-zinc-500 font-medium mt-0.5">{description}</p>
      </div>
      <Link
        href="/billing"
        className={`shrink-0 px-4 py-2 ${colors.cta} text-white font-bold text-[11px] rounded-xl transition-all shadow-lg active:scale-95 whitespace-nowrap`}
      >
        {ctaLabel}
      </Link>
    </div>
  );
}

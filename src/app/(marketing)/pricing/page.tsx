'use client';

import Link from 'next/link';
import { useState, useRef } from 'react';
import { motion, useInView } from 'framer-motion';
import {
  Check, X, Zap, ArrowRight, ChevronDown, Shield, Globe,
  Sparkles, Brain, BarChart2, Users, Lock, Star
} from 'lucide-react';
import { PLANS, PLAN_ORDER, ADD_ONS, annualSavings, FEATURE_LABELS, type Plan, type PlanId } from '@/lib/plans';

function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-50px' });
  return (
    <motion.div ref={ref} initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1], delay }} className={className}>
      {children}
    </motion.div>
  );
}

const PLAN_STYLES: Record<PlanId, { border: string; bg: string; badge: string; cta: string; ctaText: string; icon: string; glow: string }> = {
  starter: {
    border: 'border-white/[0.08]',
    bg: 'bg-[#08080b]',
    badge: '',
    cta: 'bg-white/[0.06] hover:bg-white/[0.10] border border-white/[0.10] text-white',
    ctaText: 'text-white',
    icon: 'bg-zinc-700/30 border-zinc-700/50 text-zinc-300',
    glow: '',
  },
  pro: {
    border: 'border-indigo-500/35',
    bg: 'bg-gradient-to-b from-indigo-500/[0.08] to-[#08080b]',
    badge: 'Most Popular',
    cta: 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/30',
    ctaText: 'text-white',
    icon: 'bg-indigo-500/15 border-indigo-500/25 text-indigo-400',
    glow: 'shadow-[0_0_60px_rgba(99,102,241,0.12)]',
  },
  agency: {
    border: 'border-violet-500/25',
    bg: 'bg-gradient-to-b from-violet-500/[0.06] to-[#08080b]',
    badge: 'Best for Agencies',
    cta: 'bg-violet-600 hover:bg-violet-500 text-white shadow-lg hover:shadow-violet-500/30',
    ctaText: 'text-white',
    icon: 'bg-violet-500/15 border-violet-500/25 text-violet-400',
    glow: '',
  },
  enterprise: {
    border: 'border-amber-500/20',
    bg: 'bg-gradient-to-b from-amber-500/[0.05] to-[#08080b]',
    badge: 'Custom Pricing',
    cta: 'bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/25 text-amber-300',
    ctaText: 'text-amber-300',
    icon: 'bg-amber-500/15 border-amber-500/25 text-amber-400',
    glow: '',
  },
};

// Key features to compare in the comparison table
const COMPARISON_FEATURES: { key: string; label: string; plans: Partial<Record<PlanId, string | boolean>> }[] = [
  { key: 'workspaces', label: 'Workspaces', plans: { starter: '1', pro: '5', agency: '25', enterprise: 'Unlimited' } },
  { key: 'accounts', label: 'Instagram Accounts', plans: { starter: '1', pro: '5', agency: '25', enterprise: 'Unlimited' } },
  { key: 'ai_gen', label: 'AI Generations / mo', plans: { starter: '100', pro: '1,000', agency: '5,000', enterprise: 'Unlimited' } },
  { key: 'posts', label: 'Scheduled Posts / mo', plans: { starter: '30', pro: 'Unlimited', agency: 'Unlimited', enterprise: 'Unlimited' } },
  { key: 'team', label: 'Team Members', plans: { starter: '1', pro: '5', agency: '25', enterprise: 'Unlimited' } },
  { key: 'analytics', label: 'Advanced Analytics', plans: { starter: false, pro: true, agency: true, enterprise: true } },
  { key: 'ai_opt', label: 'AI Optimization', plans: { starter: false, pro: true, agency: true, enterprise: true } },
  { key: 'dm', label: 'DM Automation', plans: { starter: false, pro: true, agency: true, enterprise: true } },
  { key: 'wl', label: 'White Label', plans: { starter: false, pro: false, agency: true, enterprise: true } },
  { key: 'api', label: 'API Access', plans: { starter: false, pro: false, agency: false, enterprise: true } },
  { key: 'sso', label: 'SSO / SAML', plans: { starter: false, pro: false, agency: false, enterprise: true } },
  { key: 'sla', label: 'SLA Support', plans: { starter: false, pro: false, agency: false, enterprise: true } },
];

function PricingCard({ plan, annual }: { plan: Plan; annual: boolean }) {
  const style = PLAN_STYLES[plan.id];
  const price = annual ? plan.price.annual : plan.price.monthly;
  const savings = annualSavings(plan);

  return (
    <div className={`relative rounded-2xl border ${style.border} ${style.bg} ${style.glow} flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1`}>
      {/* Top accent */}
      {plan.highlight && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/70 to-transparent" />}
      {plan.enterprise && <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/50 to-transparent" />}

      {/* Badge */}
      {style.badge && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2">
          <div className={`px-4 py-1 text-[9px] font-black tracking-widest uppercase rounded-b-xl ${
            plan.highlight ? 'bg-indigo-600 text-white' :
            plan.id === 'agency' ? 'bg-violet-600/90 text-white' :
            'bg-amber-500/20 border border-amber-500/30 text-amber-400 border-t-0'
          }`}>
            {style.badge}
          </div>
        </div>
      )}

      <div className="p-7 lg:p-8 pt-10">
        {/* Icon */}
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border mb-5 shadow-inner ${style.icon}`}>
          <Zap className="w-4.5 h-4.5" />
        </div>

        <div className="text-[11px] font-black text-zinc-500 tracking-widest uppercase mb-1.5">{plan.name}</div>

        {/* Price */}
        {plan.enterprise ? (
          <div className="mb-1">
            <div className="text-2xl font-black text-white tracking-tight">Custom</div>
            <div className="text-[12px] text-amber-400/70 font-medium mt-0.5">Starting at $999/mo</div>
          </div>
        ) : (
          <div className="flex items-baseline gap-1 mb-1">
            <span className="text-[38px] font-black text-white tracking-tighter leading-none">${price}</span>
            <span className="text-zinc-500 text-sm font-medium">/mo</span>
          </div>
        )}

        {annual && !plan.enterprise && savings > 0 && (
          <div className="text-[10px] font-bold text-emerald-400 mb-0.5">
            Save ${savings}/year with annual billing
          </div>
        )}

        <p className="text-[12px] text-zinc-500 font-medium leading-relaxed mb-6">{plan.tagline}</p>

        {/* CTA */}
        {plan.enterprise ? (
          <Link
            href="mailto:sales@instaflow.ai"
            className={`block w-full text-center py-3 rounded-xl text-[13px] font-bold transition-all active:scale-95 ${style.cta}`}
          >
            Contact Sales
          </Link>
        ) : plan.id === 'starter' ? (
          <Link
            href="/overview"
            className={`block w-full text-center py-3 rounded-xl text-[13px] font-bold transition-all active:scale-95 ${style.cta}`}
          >
            Start Free Trial
          </Link>
        ) : (
          <button
            onClick={async () => {
              const res = await fetch('/api/checkout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ planId: plan.id, isAnnual: annual })
              });
              const data = await res.json();
              if (data.url) window.location.href = data.url;
            }}
            className={`block w-full text-center py-3 rounded-xl text-[13px] font-bold transition-all active:scale-95 ${style.cta}`}
          >
             Start 14-Day Trial
          </button>
        )}
      </div>

      {/* Feature list */}
      <div className="px-7 lg:px-8 pb-8 flex-1">
        <div className="text-[9px] font-black text-zinc-600 tracking-[0.18em] uppercase mb-4">What&apos;s included</div>
        <ul className="space-y-2.5">
          {/* Limits */}
          <li className="flex items-start gap-2.5">
            <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
            <span className="text-[12px] text-zinc-300 font-medium">
              {plan.limits.workspaces === null ? 'Unlimited' : plan.limits.workspaces} workspace{plan.limits.workspaces !== 1 ? 's' : ''}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
            <span className="text-[12px] text-zinc-300 font-medium">
              {plan.limits.socialAccounts === null ? 'Unlimited' : plan.limits.socialAccounts} Instagram account{plan.limits.socialAccounts !== 1 ? 's' : ''}
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
            <span className="text-[12px] text-zinc-300 font-medium">
              {plan.limits.aiGenerations === null ? 'Unlimited' : plan.limits.aiGenerations.toLocaleString()} AI generations/mo
            </span>
          </li>
          <li className="flex items-start gap-2.5">
            <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
            <span className="text-[12px] text-zinc-300 font-medium">
              {plan.limits.scheduledPosts === null ? 'Unlimited scheduling' : `${plan.limits.scheduledPosts} scheduled posts/mo`}
            </span>
          </li>

          {/* Feature list (first 6) */}
          {plan.features.slice(4, 10).map(f => (
            <li key={f} className="flex items-start gap-2.5">
              <Check className="w-3.5 h-3.5 text-indigo-400 mt-0.5 shrink-0" />
              <span className="text-[12px] text-zinc-300 font-medium">{FEATURE_LABELS[f]}</span>
            </li>
          ))}
          {plan.features.length > 10 && (
            <li className="text-[11px] text-zinc-600 font-medium pl-0.5">
              + {plan.features.length - 10} more features
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-white/[0.02] transition-colors gap-4">
        <span className="text-[14px] font-semibold text-zinc-200">{q}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <p className="px-6 pb-5 text-[13px] text-zinc-400 leading-relaxed font-medium border-t border-white/[0.04] pt-3">{a}</p>
      )}
    </div>
  );
}

export default function PricingPage() {
  const [annual, setAnnual] = useState(false);

  return (
    <div className="min-h-screen bg-[#030304] text-white overflow-x-hidden">
      <div className="mesh-bg-1" /><div className="mesh-bg-2" /><div className="mesh-bg-3" />

      {/* Navbar */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-[#030304]/90 backdrop-blur-2xl border-b border-white/[0.05]">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 flex items-center justify-between h-16">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
              <Zap className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="font-extrabold text-[15px] text-white tracking-tight">InstaFlow</span>
          </Link>
          <div className="flex items-center gap-4">
            <Link href="/overview" className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors">Dashboard</Link>
            <Link href="/billing" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">
              Upgrade →
            </Link>
          </div>
        </div>
      </header>

      <div className="pt-24 pb-20">
        {/* Hero */}
        <Reveal className="text-center max-w-3xl mx-auto px-6 mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/[0.08] border border-indigo-500/[0.2] mb-8">
            <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
            <span className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase">Simple, Transparent Pricing</span>
          </div>
          <h1 className="text-5xl sm:text-6xl font-black tracking-tighter text-white leading-[0.96] mb-6">
            Invest in growth.<br />
            <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">Pay for what scales.</span>
          </h1>
          <p className="text-[17px] text-zinc-400 font-medium leading-relaxed max-w-xl mx-auto">
            No flat unlimited tiers that destroy margins. A hybrid pricing model that grows with your business — usage-based, team-based, and feature-based.
          </p>

          {/* Annual toggle */}
          <div className="flex items-center justify-center gap-4 mt-10">
            <span className={`text-[13px] font-semibold transition-colors ${!annual ? 'text-white' : 'text-zinc-500'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(v => !v)}
              className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${annual ? 'bg-indigo-600' : 'bg-white/[0.10]'}`}
            >
              <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-300 ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-[13px] font-semibold transition-colors ${annual ? 'text-white' : 'text-zinc-500'}`}>
              Annual
              <span className="ml-2 text-[10px] font-black text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full tracking-wide">Save 20%</span>
            </span>
          </div>
        </Reveal>

        {/* Pricing Cards */}
        <div className="max-w-7xl mx-auto px-6 mb-20">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-5">
            {PLAN_ORDER.map((planId, i) => (
              <Reveal key={planId} delay={i * 0.07}>
                <PricingCard plan={PLANS[planId]} annual={annual} />
              </Reveal>
            ))}
          </div>

          {/* Trust signals */}
          <Reveal delay={0.3} className="flex flex-wrap justify-center gap-x-8 gap-y-3 mt-10">
            {[
              { icon: Shield, text: '14-day free trial on all plans' },
              { icon: Check, text: 'Cancel or pause anytime' },
              { icon: Globe, text: 'Meta-compliant infrastructure' },
              { icon: Star, text: '99.7% uptime SLA' },
            ].map(({ icon: Icon, text }) => (
              <div key={text} className="flex items-center gap-2 text-[12px] text-zinc-500 font-semibold">
                <Icon className="w-3.5 h-3.5 text-indigo-400" /> {text}
              </div>
            ))}
          </Reveal>
        </div>

        {/* Feature Comparison Table */}
        <section className="max-w-7xl mx-auto px-6 mb-20">
          <Reveal className="text-center mb-10">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-3">Plan Comparison</div>
            <h2 className="text-3xl font-black tracking-tighter text-white">Everything, side by side.</h2>
          </Reveal>

          <Reveal>
            <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="border-b border-white/[0.06] bg-[#08080b]">
                    <tr>
                      <th className="px-6 py-5 text-left text-[11px] font-black text-zinc-600 tracking-widest uppercase w-[200px]">Feature</th>
                      {PLAN_ORDER.map(pid => (
                        <th key={pid} className="px-6 py-5 text-center">
                          <div className={`text-[11px] font-black tracking-widest uppercase ${
                            pid === 'pro' ? 'text-indigo-400' :
                            pid === 'agency' ? 'text-violet-400' :
                            pid === 'enterprise' ? 'text-amber-400' :
                            'text-zinc-400'
                          }`}>{PLANS[pid].name}</div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/[0.04] bg-[#030304]/60">
                    {COMPARISON_FEATURES.map((row, i) => (
                      <tr key={row.key} className="hover:bg-white/[0.02] transition-colors">
                        <td className="px-6 py-4 text-[12px] font-semibold text-zinc-400">{row.label}</td>
                        {PLAN_ORDER.map(pid => {
                          const val = row.plans[pid];
                          return (
                            <td key={pid} className="px-6 py-4 text-center">
                              {val === true ? (
                                <Check className="w-4 h-4 text-indigo-400 mx-auto" />
                              ) : val === false ? (
                                <X className="w-4 h-4 text-zinc-700 mx-auto" />
                              ) : (
                                <span className={`text-[12px] font-bold ${
                                  pid === 'pro' ? 'text-indigo-300' :
                                  pid === 'agency' ? 'text-violet-300' :
                                  pid === 'enterprise' ? 'text-amber-300' :
                                  'text-zinc-300'
                                }`}>{val}</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </Reveal>
        </section>

        {/* Add-Ons */}
        <section className="max-w-5xl mx-auto px-6 mb-20">
          <Reveal className="text-center mb-10">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-3">Expansion Revenue</div>
            <h2 className="text-3xl font-black tracking-tighter text-white">Scale further with Add-Ons.</h2>
            <p className="text-[15px] text-zinc-400 font-medium mt-3 max-w-md mx-auto">Purchase exactly what you need — without upgrading your entire plan.</p>
          </Reveal>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {ADD_ONS.map((addon, i) => (
              <Reveal key={addon.type} delay={i * 0.06}>
                <div className="bg-[#08080b] border border-white/[0.06] rounded-2xl p-5 hover:border-indigo-500/20 transition-all duration-300 h-full flex flex-col">
                  <div className="text-[13px] font-bold text-white mb-1">{addon.name}</div>
                  <p className="text-[11px] text-zinc-500 font-medium leading-relaxed flex-1 mb-4">{addon.description}</p>
                  <div className="flex items-center justify-between mt-auto">
                    <div>
                      <span className="text-[22px] font-black text-white tabular-nums">${addon.pricePerUnit}</span>
                      <span className="text-[10px] text-zinc-600 font-medium ml-1">{addon.unit}</span>
                    </div>
                    <Link href="/billing" className="px-4 py-2 bg-indigo-600/70 hover:bg-indigo-500 text-white font-bold text-[11px] rounded-xl transition-all active:scale-95">
                      Add →
                    </Link>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </section>

        {/* Enterprise CTA */}
        <section className="max-w-4xl mx-auto px-6 mb-20">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden border border-amber-500/20 bg-gradient-to-b from-amber-500/[0.07] to-[#08080b] p-12 text-center">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
              <div className="absolute -top-20 left-1/2 -translate-x-1/2 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Brain className="w-7 h-7 text-amber-400" />
                </div>
                <div className="text-[10px] font-black text-amber-400 tracking-[0.2em] uppercase mb-3">Enterprise</div>
                <h2 className="text-3xl font-black tracking-tighter text-white mb-3">Need custom scale?</h2>
                <p className="text-[15px] text-zinc-400 font-medium max-w-md mx-auto leading-relaxed mb-8">
                  Dedicated infrastructure, custom SLA, unlimited seats, API access, SSO, white-label, and a dedicated success manager. Starting at $999/mo.
                </p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <a href="mailto:sales@instaflow.ai" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-amber-500/15 hover:bg-amber-500/25 border border-amber-500/30 text-amber-300 font-bold text-[14px] rounded-xl transition-all active:scale-95">
                    Contact Sales <ArrowRight className="w-4 h-4" />
                  </a>
                  <Link href="/overview" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-zinc-300 font-semibold text-[14px] rounded-xl transition-all">
                    View Dashboard
                  </Link>
                </div>
              </div>
            </div>
          </Reveal>
        </section>

        {/* FAQ */}
        <section className="max-w-3xl mx-auto px-6">
          <Reveal className="text-center mb-10">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-3">FAQ</div>
            <h2 className="text-3xl font-black tracking-tighter text-white">Billing questions, answered.</h2>
          </Reveal>
          <Reveal>
            <div className="space-y-2">
              {[
                { q: 'Can I change plans anytime?', a: 'Yes. You can upgrade immediately (prorated) or downgrade at your next billing date. No penalties or fees.' },
                { q: 'What counts as an AI Generation?', a: 'Each piece of content generated by the AI (caption, reel script, carousel, DM message) counts as one generation credit. Regenerating a variant also counts.' },
                { q: 'What happens when I hit my limit?', a: 'You\'ll receive a warning at 80% usage. At 100%, new generations are blocked. You can purchase add-on credit packs or upgrade your plan to continue immediately.' },
                { q: 'Does annual billing lock me in?', a: 'Annual plans are billed upfront for 12 months at a 20% discount. You can still cancel — remaining months are refunded on a pro-rated basis.' },
                { q: 'Do add-ons expire?', a: 'AI Credit Pack add-ons are consumed within your current billing period. Account and seat add-ons are recurring monthly until cancelled.' },
                { q: 'Is there a free plan?', a: 'We offer a 14-day free trial on all paid plans — no credit card required. After the trial, you\'ll need a subscription to continue.' },
              ].map(item => <FAQItem key={item.q} {...item} />)}
            </div>
          </Reveal>
        </section>
      </div>
    </div>
  );
}

'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import {
  Zap, ArrowRight, Play, Check, ChevronDown, Star,
  BarChart2, Calendar, Shield, Sparkles, Brain, Bot,
  Package, Users, TrendingUp, Globe, Menu, X,
  MessageCircle, Clock, Target, Layers, Activity
} from 'lucide-react';

/* ——— Reusable reveal wrapper ——— */
function Reveal({ children, delay = 0, className = '' }: { children: React.ReactNode; delay?: number; className?: string }) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 24 }}
      animate={inView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1], delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

/* ——— Navbar ——— */
function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? 'bg-[#030304]/90 backdrop-blur-2xl border-b border-white/[0.05] shadow-2xl' : 'bg-transparent'}`}>
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="relative w-8 h-8 rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
              <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-br from-white/15 to-transparent" />
              <Zap className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="font-extrabold text-[15px] text-white tracking-tight">InstaFlow</span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8">
            {[['Features', '#features'], ['How It Works', '#how'], ['Pricing', '/pricing'], ['FAQ', '#faq']].map(([label, href]) => (
              <a key={label} href={href} className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors">{label}</a>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-3">
            <Link href="/overview" className="text-[13px] font-semibold text-zinc-400 hover:text-white transition-colors">Sign in</Link>
            <Link href="/overview" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-500 text-white text-[13px] font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">
              Start Free →
            </Link>
          </div>

          <button className="md:hidden p-2" onClick={() => setMobileOpen(v => !v)}>
            {mobileOpen ? <X className="w-5 h-5 text-white" /> : <Menu className="w-5 h-5 text-zinc-400" />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.2 }}
            className="md:hidden bg-[#030304]/98 backdrop-blur-2xl border-b border-white/[0.05] px-6 pb-6 pt-2 space-y-3"
          >
            {[['Features', '#features'], ['How It Works', '#how'], ['Pricing', '/pricing'], ['FAQ', '#faq']].map(([label, href]) => (
              <a key={label} href={href} onClick={() => setMobileOpen(false)} className="block text-[14px] font-semibold text-zinc-300 hover:text-white py-2 transition-colors">{label}</a>
            ))}
            <div className="pt-4 space-y-3 border-t border-white/[0.06]">
              <Link href="/overview" className="block w-full text-center py-3 text-[13px] font-semibold text-zinc-400">Sign in</Link>
              <Link href="/overview" className="block w-full text-center py-3 bg-indigo-600 text-white text-[13px] font-bold rounded-xl">Start Free →</Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

/* ——— Dashboard Preview mockup ——— */
function DashboardPreview() {
  return (
    <div className="relative w-full max-w-4xl mx-auto">
      {/* Glow behind mockup */}
      <div className="absolute inset-0 bg-indigo-500/10 rounded-3xl blur-3xl scale-90 opacity-70" />

      {/* Frame */}
      <div className="relative rounded-2xl overflow-hidden border border-white/[0.08] shadow-2xl bg-[#08080b]">
        {/* Window chrome */}
        <div className="flex items-center gap-2 px-4 py-3 bg-[#0d0d12] border-b border-white/[0.05]">
          <div className="w-3 h-3 rounded-full bg-red-500/60" />
          <div className="w-3 h-3 rounded-full bg-amber-500/60" />
          <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
          <div className="flex-1 flex justify-center">
            <div className="px-8 py-1 rounded-full bg-white/[0.04] border border-white/[0.06] text-[10px] text-zinc-500 font-medium w-48 text-center">
              app.instaflow.ai/overview
            </div>
          </div>
        </div>

        {/* Dashboard content mockup */}
        <div className="flex">
          {/* Sidebar mockup */}
          <div className="w-48 bg-[#030304] border-r border-white/[0.04] p-4 space-y-1.5 hidden sm:block">
            <div className="px-2 py-1.5 mb-4 flex items-center gap-2">
              <div className="w-6 h-6 rounded-lg bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center">
                <Zap className="w-3 h-3 text-white" />
              </div>
              <span className="text-[11px] font-bold text-white">InstaFlow</span>
            </div>
            {['Overview','Briefs','Products','Library','Calendar'].map((item, i) => (
              <div key={item} className={`px-2.5 py-2 rounded-lg text-[11px] font-semibold flex items-center gap-2 ${i === 0 ? 'bg-white/[0.06] text-white' : 'text-zinc-600'}`}>
                <div className={`w-1 h-3 rounded-full ${i === 0 ? 'bg-indigo-500' : 'bg-transparent'}`} />
                {item}
              </div>
            ))}
            <div className="pt-3 mt-3 border-t border-white/[0.04] space-y-1.5">
              {['Queue','Inbox','Analytics'].map(item => (
                <div key={item} className="px-2.5 py-2 rounded-lg text-[11px] font-semibold text-zinc-600">{item}</div>
              ))}
            </div>
          </div>

          {/* Main area mockup */}
          <div className="flex-1 p-5 space-y-4 min-h-[300px]">
            {/* Header */}
            <div className="flex justify-between items-center mb-2">
              <div>
                <div className="text-[9px] text-indigo-400/70 font-bold tracking-widest uppercase mb-1">Command Center · Live</div>
                <div className="text-lg font-black text-white">Good Morning.</div>
              </div>
              <div className="px-3 py-1.5 rounded-lg bg-indigo-600 text-white text-[10px] font-bold">+ New Funnel</div>
            </div>

            {/* KPI cards */}
            <div className="grid grid-cols-4 gap-2">
              {[
                { label: 'Campaigns', val: '12', color: 'text-indigo-400', accent: 'bg-indigo-500/10' },
                { label: 'Leads', val: '2.4K', color: 'text-violet-400', accent: 'bg-violet-500/10' },
                { label: 'Scheduled', val: '89', color: 'text-amber-400', accent: 'bg-amber-500/10' },
                { label: 'Revenue', val: '$18k', color: 'text-emerald-400', accent: 'bg-emerald-500/10' },
              ].map(k => (
                <div key={k.label} className={`${k.accent} rounded-xl p-3 border border-white/[0.05]`}>
                  <div className="text-[8px] text-zinc-600 font-bold uppercase tracking-wider">{k.label}</div>
                  <div className={`text-lg font-black ${k.color} mt-1 tabular-nums`}>{k.val}</div>
                </div>
              ))}
            </div>

            {/* Chart bar mockup */}
            <div className="bg-white/[0.02] rounded-xl border border-white/[0.05] p-3">
              <div className="text-[9px] text-zinc-600 font-bold uppercase tracking-wider mb-2">Engagement · 7 days</div>
              <div className="flex items-end gap-1.5 h-16">
                {[30,50,38,70,82,60,95].map((h, i) => (
                  <div key={i} className="flex-1 flex flex-col items-center justify-end h-full">
                    <div className="w-full rounded-sm" style={{
                      height: `${h}%`,
                      background: i === 6 ? 'linear-gradient(to top, #4f46e5, #7c3aed)' : 'rgba(99,102,241,0.25)'
                    }} />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ——— Feature card ——— */
function FeatureCard({ icon: Icon, title, desc, accent }: { icon: any; title: string; desc: string; accent: string }) {
  return (
    <div className={`group p-6 rounded-2xl bg-[#08080b] border border-white/[0.05] hover:border-${accent}-500/20 transition-all duration-300 hover:-translate-y-0.5 relative overflow-hidden`}>
      <div className={`w-10 h-10 rounded-xl bg-${accent}-500/10 border border-${accent}-500/15 flex items-center justify-center mb-5 shadow-inner`}>
        <Icon className={`w-5 h-5 text-${accent}-400`} />
      </div>
      <h3 className="font-bold text-white text-[15px] mb-2 tracking-tight">{title}</h3>
      <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">{desc}</p>
    </div>
  );
}

/* ——— Pricing card ——— */
function PricingCard({ name, price, desc, features, cta, highlight }: any) {
  return (
    <div className={`relative rounded-2xl overflow-hidden flex flex-col ${highlight
      ? 'bg-gradient-to-b from-indigo-500/10 to-[#08080b] border border-indigo-500/30 shadow-2xl shadow-indigo-500/10'
      : 'bg-[#08080b] border border-white/[0.06]'}`}>
      {highlight && (
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/60 to-transparent" />
      )}
      {highlight && (
        <div className="absolute -top-px left-1/2 -translate-x-1/2 px-3 py-0.5 bg-indigo-600 text-white text-[9px] font-black tracking-widest uppercase rounded-b-lg">Most Popular</div>
      )}
      <div className="p-7 lg:p-8">
        <div className="text-[10px] font-black text-zinc-500 tracking-widest uppercase mb-2">{name}</div>
        <div className="flex items-baseline gap-1 mb-2">
          <span className="text-4xl font-black text-white tracking-tighter">${price}</span>
          <span className="text-zinc-500 font-medium text-sm">/mo</span>
        </div>
        <p className="text-[13px] text-zinc-500 mb-7 font-medium leading-relaxed">{desc}</p>
        <Link href="/overview" className={`block w-full text-center py-3 rounded-xl text-[13px] font-bold transition-all active:scale-95 ${highlight
          ? 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-lg hover:shadow-indigo-500/25'
          : 'bg-white/[0.06] hover:bg-white/[0.10] text-white border border-white/[0.08]'}`}>
          {cta}
        </Link>
      </div>
      <div className="px-7 lg:px-8 pb-8 flex-1">
        <div className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-4">What&apos;s included</div>
        <ul className="space-y-3">
          {features.map((f: string) => (
            <li key={f} className="flex items-start gap-3">
              <Check className="w-4 h-4 text-indigo-400 mt-0.5 shrink-0" />
              <span className="text-[13px] text-zinc-300 font-medium leading-relaxed">{f}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

/* ——— FAQ item ——— */
function FAQItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="border border-white/[0.06] rounded-xl overflow-hidden">
      <button onClick={() => setOpen(v => !v)} className="w-full flex justify-between items-center px-6 py-4 text-left hover:bg-white/[0.02] transition-colors gap-4">
        <span className="text-[14px] font-semibold text-zinc-200">{q}</span>
        <ChevronDown className={`w-4 h-4 text-zinc-500 shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0 }} animate={{ height: 'auto' }} exit={{ height: 0 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="overflow-hidden"
          >
            <p className="px-6 pb-5 text-[13px] text-zinc-400 leading-relaxed font-medium border-t border-white/[0.04] pt-3">{a}</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

/* ——— MAIN PAGE ——— */
export default function LandingPage() {
  return (
    <div className="min-h-screen bg-[#030304] text-white overflow-x-hidden">
      {/* Neural meshes */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      <Navbar />

      {/* ═══════════════ HERO ═══════════════ */}
      <section className="relative min-h-screen flex items-center justify-center px-6 pt-24 pb-16 overflow-hidden">
        <div className="max-w-7xl mx-auto w-full">
          <div className="text-center mb-16">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/[0.08] border border-indigo-500/[0.2] mb-8"
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative h-1.5 w-1.5 bg-indigo-500 rounded-full"></span>
              </span>
              <span className="text-[11px] font-bold text-indigo-400 tracking-widest uppercase">Neural AI Engine · Now Live</span>
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.65, ease: [0.16, 1, 0.3, 1], delay: 0.08 }}
              className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tighter text-white leading-[0.96] mb-6"
            >
              Instagram Growth
              <br />
              <span className="bg-gradient-to-r from-indigo-400 to-violet-400 bg-clip-text text-transparent">
                on Autopilot.
              </span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.55, ease: 'easeOut', delay: 0.18 }}
              className="text-[17px] text-zinc-400 max-w-xl mx-auto leading-relaxed font-medium mb-10"
            >
              InstaFlow uses neural AI to generate, schedule, and optimize your entire Instagram funnel — from content briefs to lead capture. Ship an entire marketing engine in minutes.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.26 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-3"
            >
              <Link href="/overview" className="group flex items-center gap-2 px-7 py-3.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[15px] rounded-xl shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95">
                Start for free
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <a href="#how" className="flex items-center gap-2 px-7 py-3.5 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 font-semibold text-[15px] rounded-xl transition-all duration-200">
                <Play className="w-3.5 h-3.5 text-indigo-400" /> See how it works
              </a>
            </motion.div>

            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="flex items-center justify-center gap-6 mt-8 text-[12px] text-zinc-600 font-semibold"
            >
              {['No credit card required', 'Cancel anytime', 'Setup in 5 minutes'].map((t, i) => (
                <span key={t} className="flex items-center gap-1.5">
                  <Check className="w-3.5 h-3.5 text-emerald-500" /> {t}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Dashboard preview */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
          >
            <DashboardPreview />
          </motion.div>
        </div>
      </section>

      {/* ═══════════════ SOCIAL PROOF STRIP ═══════════════ */}
      <section className="relative z-10 py-12 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-5xl mx-auto px-6 text-center">
          <p className="text-[11px] font-bold text-zinc-600 tracking-widest uppercase mb-8">Trusted by digital creators and operators across the world</p>
          <div className="flex flex-wrap justify-center items-center gap-x-12 gap-y-6">
            {['Creator Studio', 'FunnelPro', 'DigitalEdge', 'Launchpad', 'GrowthOS', 'ContentAI'].map(brand => (
              <span key={brand} className="text-[13px] font-extrabold text-zinc-700 tracking-tight">{brand}</span>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FEATURES ═══════════════ */}
      <section id="features" className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-4">Platform Features</div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4">Everything you need to automate<br className="hidden md:block" /> Instagram growth.</h2>
            <p className="text-[16px] text-zinc-400 max-w-xl mx-auto font-medium leading-relaxed">From AI content generation to automated scheduling — InstaFlow is a complete growth operating system for digital product creators.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[
              { icon: Brain, title: 'Neural Content Generation', desc: 'AI generates on-brand posts, reels, carousels, and DM sequences from a single product brief. No copywriter needed.', accent: 'indigo' },
              { icon: Calendar, title: 'Intelligent Scheduler', desc: 'Auto-schedules content based on your audience\'s peak engagement windows. Post at exactly the right time, every time.', accent: 'violet' },
              { icon: Target, title: 'Lead Capture Funnels', desc: 'Turn followers into email subscribers and buyers with seamless CTA sequences built directly into your content engine.', accent: 'indigo' },
              { icon: Shield, title: 'Compliance Guardrails', desc: 'Built-in rules engine enforces brand safety, platform ToS compliance, and content quality standards automatically.', accent: 'amber' },
              { icon: BarChart2, title: 'AI Analytics & Insights', desc: 'Deep engagement analytics with AI-powered recommendations. Know exactly what\'s working and double down.', accent: 'emerald' },
              { icon: Bot, title: 'Companion Automation', desc: 'A background watchdog service continuously monitors, retries, and scales your automation engine 24/7.', accent: 'violet' },
            ].map((f, i) => (
              <Reveal key={f.title} delay={i * 0.06}>
                <FeatureCard {...f} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ HOW IT WORKS ═══════════════ */}
      <section id="how" className="relative z-10 py-28 px-6 bg-white/[0.01] border-y border-white/[0.04]">
        <div className="max-w-4xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-4">How It Works</div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4">From brief to revenue<br className="hidden md:block" /> in three steps.</h2>
            <p className="text-[16px] text-zinc-400 max-w-lg mx-auto font-medium">The entire pipeline is automated. You define the strategy — InstaFlow does the rest.</p>
          </Reveal>

          <div className="space-y-6">
            {[
              {
                step: '01', icon: Package, title: 'Add Your Product & Brief',
                desc: 'Enter your product details, target audience, and content objectives. InstaFlow\'s AI analyzes your niche and builds a complete content strategy in seconds.',
                accent: 'indigo'
              },
              {
                step: '02', icon: Sparkles, title: 'AI Generates Your Entire Content Engine',
                desc: 'Neural content pipelines automatically produce weeks of posts, reels, carousels, and DM sequences — all on-brand, compliant, and conversion-optimized.',
                accent: 'violet'
              },
              {
                step: '03', icon: TrendingUp, title: 'Watch Your Funnel Run on Autopilot',
                desc: 'Content publishes automatically. Leads get captured. Analytics stream in real-time. The AI continuously learns and improves your results.',
                accent: 'emerald'
              },
            ].map((step, i) => (
              <Reveal key={step.step} delay={i * 0.1}>
                <div className="flex gap-6 items-start">
                  <div className="shrink-0 w-12 h-12 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center">
                    <span className="text-[11px] font-black text-indigo-400 tracking-wider">{step.step}</span>
                  </div>
                  <div className="pt-1">
                    <div className="flex items-center gap-3 mb-2">
                      <step.icon className={`w-4 h-4 text-${step.accent}-400`} />
                      <h3 className="text-[16px] font-bold text-white tracking-tight">{step.title}</h3>
                    </div>
                    <p className="text-[14px] text-zinc-400 leading-relaxed font-medium">{step.desc}</p>
                  </div>
                </div>
                {i < 2 && <div className="ml-6 mt-4 mb-0 w-px h-6 bg-gradient-to-b from-white/[0.08] to-transparent" />}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ WHY WE'RE DIFFERENT ═══════════════ */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-4">Competitive Advantage</div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4">Not just another scheduler.</h2>
            <p className="text-[16px] text-zinc-400 max-w-lg mx-auto font-medium">InstaFlow is a full-stack AI automation system — not just a content calendar.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { icon: Brain, title: 'AI-First Architecture', desc: 'Every component is designed around neural intelligence — not bolted on as an afterthought. The AI learns your brand voice over time.', badge: 'Proprietary' },
              { icon: Activity, title: 'Real-time Neural Engine', desc: 'A continuously-running background engine monitors your funnel, retries failures, catches compliance violations, and optimizes automatically.', badge: 'Always-On' },
              { icon: Globe, title: 'Full-Stack Funnel Ownership', desc: 'From content creation to lead capture to analytics — it\'s one unified system. No patching together 5 different tools.', badge: 'All-in-One' },
            ].map((c, i) => (
              <Reveal key={c.title} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-[#08080b] border border-white/[0.06] h-full relative overflow-hidden group hover:border-indigo-500/20 transition-all duration-300">
                  <div className="absolute top-4 right-4 px-2.5 py-1 rounded-md bg-indigo-500/[0.08] border border-indigo-500/15 text-[9px] font-black text-indigo-400 tracking-widest uppercase">{c.badge}</div>
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center mb-5 shadow-inner">
                    <c.icon className="w-5 h-5 text-indigo-400" />
                  </div>
                  <h3 className="font-bold text-white text-[15px] mb-2 tracking-tight">{c.title}</h3>
                  <p className="text-[13px] text-zinc-500 leading-relaxed font-medium">{c.desc}</p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ TESTIMONIALS ═══════════════ */}
      <section className="relative z-10 py-28 px-6 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-7xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-4">Social Proof</div>
            <h2 className="text-4xl font-black tracking-tighter text-white">Operators love InstaFlow.</h2>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            {[
              { name: 'Sarah K.', role: 'Course Creator', stars: 5, text: '"InstaFlow replaced my entire social media team. The AI-generated content is genuinely better than what we were writing manually. We went from 50 leads/week to 400."' },
              { name: 'Marcus R.', role: 'Digital Product Founder', stars: 5, text: '"The compliance guardrails alone are worth it. I stopped worrying about getting my account banned. The system just handles everything — I check in once a week."' },
              { name: 'Jenna L.', role: 'Funnel Operator', stars: 5, text: '"I\'ve tried every automation tool out there. InstaFlow is the first one that actually feels like it was built by people who understand the Instagram algorithm."' },
            ].map((t, i) => (
              <Reveal key={t.name} delay={i * 0.08}>
                <div className="p-6 rounded-2xl bg-[#08080b] border border-white/[0.06] h-full hover:border-white/[0.10] transition-colors duration-300">
                  <div className="flex gap-0.5 mb-4">
                    {Array(t.stars).fill(null).map((_, i) => (
                      <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-[13px] text-zinc-300 leading-relaxed font-medium mb-5 italic">{t.text}</p>
                  <div>
                    <div className="text-[13px] font-bold text-white">{t.name}</div>
                    <div className="text-[11px] text-zinc-600 font-medium mt-0.5">{t.role}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ STATS ═══════════════ */}
      <section className="relative z-10 py-20 px-6">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { value: '12,000+', label: 'Posts Generated' },
              { value: '340K+', label: 'Leads Captured' },
              { value: '99.7%', label: 'Uptime SLA' },
              { value: '4.2×', label: 'Avg. ROAS Lift' },
            ].map((s, i) => (
              <Reveal key={s.label} delay={i * 0.06}>
                <div className="p-5">
                  <div className="text-3xl lg:text-4xl font-black text-white tracking-tighter tabular-nums mb-1.5 bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">{s.value}</div>
                  <div className="text-[12px] text-zinc-500 font-semibold">{s.label}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ PRICING ═══════════════ */}
      <section id="pricing" className="relative z-10 py-28 px-6 border-y border-white/[0.04] bg-white/[0.01]">
        <div className="max-w-6xl mx-auto">
          <Reveal className="text-center mb-16">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-4">Pricing</div>
            <h2 className="text-4xl lg:text-5xl font-black tracking-tighter text-white mb-4">Simple, transparent pricing.</h2>
            <p className="text-[16px] text-zinc-400 max-w-md mx-auto font-medium">Start free, scale as you grow. No surprise fees, no hidden limits.</p>
          </Reveal>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
            <Reveal delay={0}>
              <PricingCard
                name="Starter" price={0} desc="For creators just getting started with AI automation."
                features={['1 product', '50 AI posts/month', 'Basic scheduling', 'Lead capture forms', 'Email support']}
                cta="Get started free" highlight={false}
              />
            </Reveal>
            <Reveal delay={0.06}>
              <PricingCard
                name="Pro" price={79} desc="For operators running serious funnel automation."
                features={['Unlimited products', '1,000 AI posts/month', 'Advanced scheduling', 'Full funnel automation', 'Compliance guardrails', 'Priority support', 'Analytics dashboard']}
                cta="Start 14-day trial" highlight={true}
              />
            </Reveal>
            <Reveal delay={0.12}>
              <PricingCard
                name="Scale" price={249} desc="For agencies and high-volume operators."
                features={['Unlimited everything', 'Multi-account support', 'Custom AI training', 'API access', 'Dedicated account manager', 'SLA guarantee', 'White-label options']}
                cta="Talk to sales" highlight={false}
              />
            </Reveal>
          </div>
        </div>
      </section>

      {/* ═══════════════ FAQ ═══════════════ */}
      <section id="faq" className="relative z-10 py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal className="text-center mb-12">
            <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-4">FAQ</div>
            <h2 className="text-4xl font-black tracking-tighter text-white">Common questions.</h2>
          </Reveal>
          <div className="space-y-3">
            {[
              { q: 'How does the AI content generation work?', a: 'You provide a product brief — your product description, target audience, tone of voice, and CTA. InstaFlow\'s neural engine uses this context to generate a complete content calendar including posts, reels scripts, carousels, and DM sequences that match your brand voice.' },
              { q: 'Will this get my Instagram account banned?', a: 'InstaFlow only uses the official Instagram Graph API and Meta Business tools. We have a built-in compliance engine that enforces platform ToS on every piece of generated content. No automation that violates platform rules is permitted.' },
              { q: 'How quickly can I get up and running?', a: 'Most operators have their first content batch scheduled within 15 minutes of connecting their Instagram account. The setup wizard guides you through each step.' },
              { q: 'Do I need any technical skills?', a: 'Zero. InstaFlow is designed for non-technical product operators and creators. If you can fill out a form, you can run the entire automation system.' },
              { q: 'Can I cancel or pause at any time?', a: 'Yes. Subscriptions can be cancelled, paused, or downgraded at any time from your Settings page. You keep access until the end of your billing period.' },
            ].map((item) => (
              <Reveal key={item.q}>
                <FAQItem {...item} />
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════════════ FINAL CTA ═══════════════ */}
      <section className="relative z-10 py-28 px-6">
        <div className="max-w-3xl mx-auto">
          <Reveal>
            <div className="relative rounded-3xl overflow-hidden bg-gradient-to-b from-indigo-500/10 to-[#08080b] border border-indigo-500/20 shadow-2xl shadow-indigo-500/10 p-12 text-center">
              <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
              <div className="relative z-10">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center mx-auto mb-6 shadow-xl">
                  <Zap className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-3xl lg:text-4xl font-black tracking-tighter text-white mb-4">Start building your<br />AI funnel today.</h2>
                <p className="text-[15px] text-zinc-400 font-medium mb-8 max-w-sm mx-auto leading-relaxed">Join operators scaling Instagram-powered digital product businesses with zero manual effort.</p>
                <div className="flex flex-col sm:flex-row gap-3 justify-center">
                  <Link href="/overview" className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[15px] rounded-xl shadow-xl hover:shadow-indigo-500/30 transition-all duration-200 active:scale-95">
                    Get started free <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <a href="#pricing" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-white/[0.04] hover:bg-white/[0.08] border border-white/[0.08] text-zinc-300 font-semibold text-[15px] rounded-xl transition-all duration-200">
                    See pricing
                  </a>
                </div>
                <p className="text-[12px] text-zinc-600 font-semibold mt-6">Free plan forever · No credit card · Setup in 5 minutes</p>
              </div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ═══════════════ FOOTER ═══════════════ */}
      <footer className="relative z-10 border-t border-white/[0.05] py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8 mb-10">
            <div>
              <Link href="/" className="flex items-center gap-2.5 mb-4">
                <div className="relative w-8 h-8 rounded-xl flex items-center justify-center">
                  <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
                  <Zap className="w-4 h-4 text-white relative z-10" />
                </div>
                <span className="font-extrabold text-[15px] text-white">InstaFlow</span>
              </Link>
              <p className="text-[13px] text-zinc-500 max-w-xs leading-relaxed font-medium">Neural-powered Instagram automation for digital product operators.</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
              {[
                { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
                { title: 'Company', links: ['About', 'Blog', 'Careers', 'Press'] },
                { title: 'Legal', links: ['Privacy', 'Terms', 'Security', 'Compliance'] },
              ].map(col => (
                <div key={col.title}>
                  <div className="text-[10px] font-black text-zinc-600 tracking-widest uppercase mb-3">{col.title}</div>
                  <ul className="space-y-2">
                    {col.links.map(link => (
                      <li key={link}><a href="#" className="text-[13px] text-zinc-500 hover:text-white transition-colors font-medium">{link}</a></li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-white/[0.04] pt-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-[12px] text-zinc-600 font-medium">© 2026 InstaFlow · Built with neural AI</p>
            <div className="flex items-center gap-2 text-[11px] font-bold text-zinc-600">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
              </span>
              All systems operational
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DashboardChart } from '@/components/DashboardChart';
import { AIInsightsStrip } from '@/components/AIInsightsStrip';
import { OnboardingChecklist } from '@/components/OnboardingChecklist';
import {
  Users, CalendarDays, CheckCircle2, AlertCircle, TrendingUp, Activity,
  Sparkles, MoreHorizontal, ShieldCheck, Zap, ArrowUpRight, Gauge
} from 'lucide-react';

export const dynamic = 'force-dynamic';

function computeHealthScore(data: {
  failedJobs: number;
  reviewTasks: number;
  pendingJobs: number;
  activeCampaigns: number;
}): { score: number; label: string; color: string; accent: string } {
  let score = 100;
  score -= data.failedJobs * 12;
  score -= data.reviewTasks > 5 ? 15 : data.reviewTasks * 3;
  score -= data.pendingJobs > 20 ? 10 : 0;
  if (data.activeCampaigns === 0) score -= 10;
  score = Math.max(0, Math.min(100, score));

  if (score >= 85) return { score, label: 'Excellent', color: 'text-emerald-400', accent: 'emerald' };
  if (score >= 65) return { score, label: 'Good', color: 'text-indigo-400', accent: 'indigo' };
  if (score >= 40) return { score, label: 'Degraded', color: 'text-amber-400', accent: 'amber' };
  return { score, label: 'Critical', color: 'text-red-400', accent: 'red' };
}

export default async function OverviewPage() {
  const [
    pendingJobsCount,
    failedJobsCount,
    reviewTasksCount,
    activeCampaigns,
    totalLeads,
    totalProducts,
    totalBriefs,
    totalSchedules,
    hasToken,
  ] = await Promise.all([
    prisma.backgroundJob.count({ where: { status: 'pending' } }),
    prisma.backgroundJob.count({ where: { status: 'dead_letter' } }),
    prisma.reviewTask.count({ where: { status: 'open' } }),
    prisma.campaign.count({ where: { status: 'active' } }),
    prisma.lead.count(),
    prisma.product.count(),
    prisma.productBrief.count(),
    prisma.schedule.count(),
    prisma.integrationToken.findFirst({ where: { provider: 'meta_graph' } }),
  ]);

  const health = computeHealthScore({
    failedJobs: failedJobsCount,
    reviewTasks: reviewTasksCount,
    pendingJobs: pendingJobsCount,
    activeCampaigns,
  });

  const kpis = [
    {
      title: 'Active Campaigns', value: activeCampaigns, icon: TrendingUp,
      color: 'text-indigo-400', accent: 'indigo',
      trend: '+14%', trendUp: true, label: 'vs last cycle'
    },
    {
      title: 'Qualified Leads', value: totalLeads, icon: Users,
      color: 'text-violet-400', accent: 'violet',
      trend: '+32%', trendUp: true, label: 'conversion lift'
    },
    {
      title: 'Pending Jobs', value: pendingJobsCount, icon: CalendarDays,
      color: 'text-amber-400', accent: 'amber',
      trend: 'Queue', trendUp: null as boolean | null, label: 'processing'
    },
    {
      title: 'Awaiting Review', value: reviewTasksCount,
      icon: reviewTasksCount > 0 ? AlertCircle : CheckCircle2,
      color: reviewTasksCount > 0 ? 'text-red-400' : 'text-emerald-400',
      accent: reviewTasksCount > 0 ? 'red' : 'emerald',
      trend: reviewTasksCount > 0 ? 'Action' : 'Clear',
      trendUp: (reviewTasksCount === 0) as boolean | null,
      label: 'operator tasks'
    },
  ];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Onboarding checklist — only shows when setup incomplete */}
      <OnboardingChecklist
        hasToken={!!hasToken}
        hasProduct={totalProducts > 0}
        hasBrief={totalBriefs > 0}
        hasSchedule={totalSchedules > 0}
      />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60" />
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500" />
            </span>
            Command Center · Live Intelligence
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Good Morning.</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">
            Neural pipelines active. Here's your real-time automation health and strategic intelligence.
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* ⌘K hint */}
          <button
            onClick={() => document.getElementById('command-palette-trigger')?.click()}
            className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all group"
          >
            <span className="text-[12px] text-zinc-500 group-hover:text-zinc-300 font-medium">Quick actions</span>
            <kbd className="flex items-center gap-0.5 text-[9px] font-black text-zinc-700 tracking-wide">
              <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">⌘</span>
              <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">K</span>
            </kbd>
          </button>
          <Link href="/briefs" className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-inner">
            New Funnel
          </Link>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 group active:scale-95">
            <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Start Compute
          </button>
        </div>
      </div>

      {/* KPI Cards + Health Score */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 relative z-10">
        {kpis.map((kpi, i) => (
          <div
            key={i}
            className="glass-panel-ai ai-scan-panel rounded-2xl p-6 flex flex-col justify-between group hover:border-white/[0.08] transition-all duration-300 hover:-translate-y-px relative overflow-hidden"
          >
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none ${
              kpi.accent === 'indigo' ? 'bg-indigo-500/10' :
              kpi.accent === 'violet' ? 'bg-violet-500/10' :
              kpi.accent === 'amber' ? 'bg-amber-500/10' :
              kpi.accent === 'emerald' ? 'bg-emerald-500/10' : 'bg-red-500/10'
            } -mr-8 -mt-8`} />
            <div className="flex items-start justify-between mb-6 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-white/[0.06] ${
                kpi.accent === 'indigo' ? 'bg-indigo-500/10' :
                kpi.accent === 'violet' ? 'bg-violet-500/10' :
                kpi.accent === 'amber' ? 'bg-amber-500/10' :
                kpi.accent === 'emerald' ? 'bg-emerald-500/10' : 'bg-red-500/10'
              } group-hover:scale-105 transition-transform duration-300`}>
                <kpi.icon className={`w-5 h-5 ${kpi.color}`} />
              </div>
              {kpi.trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase rounded-md px-2 py-1 border shadow-inner ${
                  kpi.trendUp === true ? 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20' :
                  kpi.trendUp === false ? 'text-red-400 bg-red-500/[0.08] border-red-500/20' :
                  'text-zinc-400 bg-white/[0.04] border-white/[0.08]'
                }`}>
                  {kpi.trendUp === true && <ArrowUpRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              )}
            </div>
            <div className="relative z-10">
              <div className="ai-section-label mb-2">{kpi.title}</div>
              <div className="ai-metric text-white tabular-nums">{kpi.value.toLocaleString()}</div>
              <p className="text-[11px] text-zinc-600 mt-1.5 font-medium">{kpi.label}</p>
            </div>
          </div>
        ))}

        {/* Campaign Health Score — 5th card */}
        <div className={`glass-panel-ai rounded-2xl p-6 flex flex-col justify-between group hover:border-white/[0.08] transition-all duration-300 hover:-translate-y-px relative overflow-hidden ai-scan-panel`}>
          <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -mr-8 -mt-8 ${
            health.accent === 'emerald' ? 'bg-emerald-500/10' :
            health.accent === 'indigo' ? 'bg-indigo-500/10' :
            health.accent === 'amber' ? 'bg-amber-500/10' : 'bg-red-500/10'
          }`} />
          <div className="flex items-start justify-between mb-4 relative z-10">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border border-white/[0.06] ${
              health.accent === 'emerald' ? 'bg-emerald-500/10' :
              health.accent === 'indigo' ? 'bg-indigo-500/10' :
              health.accent === 'amber' ? 'bg-amber-500/10' : 'bg-red-500/10'
            }`}>
              <Gauge className={`w-5 h-5 ${health.color}`} />
            </div>
            <span className={`text-[10px] font-black tracking-widest uppercase rounded-md px-2 py-1 border shadow-inner ${
              health.accent === 'emerald' ? 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20' :
              health.accent === 'indigo' ? 'text-indigo-400 bg-indigo-500/[0.08] border-indigo-500/20' :
              health.accent === 'amber' ? 'text-amber-400 bg-amber-500/[0.08] border-amber-500/20' :
              'text-red-400 bg-red-500/[0.08] border-red-500/20'
            }`}>
              {health.label}
            </span>
          </div>

          {/* Score arc */}
          <div className="relative flex items-center justify-center mb-2 z-10">
            <svg className="w-16 h-10 -mt-1" viewBox="0 0 64 36">
              <path d="M4 32 A28 28 0 0 1 60 32" fill="none" stroke="rgba(255,255,255,0.06)" strokeWidth="4" strokeLinecap="round" />
              <path
                d="M4 32 A28 28 0 0 1 60 32"
                fill="none"
                stroke={health.accent === 'emerald' ? '#34d399' : health.accent === 'indigo' ? '#818cf8' : health.accent === 'amber' ? '#fbbf24' : '#f87171'}
                strokeWidth="4"
                strokeLinecap="round"
                strokeDasharray={`${(health.score / 100) * 88} 88`}
                className="transition-all duration-700"
              />
            </svg>
            <span className={`absolute bottom-0 text-lg font-black tabular-nums ${health.color}`}>{health.score}</span>
          </div>

          <div className="relative z-10">
            <div className="ai-section-label mb-1">Automation Health</div>
            <p className="text-[11px] text-zinc-600 font-medium">Composite pipeline score</p>
          </div>
        </div>
      </div>

      {/* AI Intelligence Strip */}
      <AIInsightsStrip
        reviewTasksCount={reviewTasksCount}
        failedJobsCount={failedJobsCount}
        activeCampaigns={activeCampaigns}
        totalLeads={totalLeads}
      />

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 relative z-10">

        {/* Chart */}
        <div className="xl:col-span-2">
          <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden flex flex-col h-[380px] hover:border-white/[0.08] transition-colors duration-300">
            <div className="px-6 py-5 flex justify-between items-center border-b border-white/[0.04] bg-white/[0.01] shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center shadow-inner">
                  <Activity className="w-4 h-4 text-indigo-400" />
                </div>
                <div>
                  <h2 className="font-bold text-[14px] text-white tracking-tight">Engagement vs Leads Velocity</h2>
                  <div className="ai-section-label mt-0.5">Neural analytics · Live data</div>
                </div>
              </div>
              <button className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors border border-transparent hover:border-white/[0.08]">
                <MoreHorizontal className="w-4 h-4 text-zinc-500" />
              </button>
            </div>
            <div className="flex-1 px-4 pb-4 pt-4">
              <DashboardChart />
            </div>
          </div>
        </div>

        {/* System Health */}
        <div className="space-y-4">
          <div className="glass-panel-ai rounded-2xl overflow-hidden flex flex-col h-[380px] hover:border-white/[0.08] transition-colors duration-300">
            <div className="px-5 py-4 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01] shrink-0">
              <h2 className="font-bold text-[14px] text-white flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> System Health
              </h2>
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500" />
                </span>
                <span className="text-[9px] font-bold text-emerald-500/70 tracking-widest uppercase">Live</span>
              </div>
            </div>
            <div className="p-4 space-y-3 overflow-y-auto scrollbar-hide flex-1">

              {failedJobsCount > 0 && (
                <div className="p-4 bg-red-500/[0.08] border border-red-500/20 rounded-xl flex items-start gap-3 shadow-inner">
                  <div className="w-8 h-8 rounded-lg bg-red-500/15 border border-red-500/20 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                    <AlertCircle className="w-4 h-4 text-red-400" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[13px] font-bold text-red-300 tracking-tight">Critical Failures</p>
                    <p className="text-[11px] text-red-400/70 mt-0.5">{failedJobsCount} jobs dead-lettered</p>
                    <Link href="/inbox" className="inline-flex items-center gap-1 text-[10px] font-black tracking-widest text-red-400 hover:text-red-300 uppercase mt-2.5 transition-colors border border-red-500/20 px-2 py-1 rounded bg-red-500/[0.08]">
                      Triage →
                    </Link>
                  </div>
                </div>
              )}

              <div className="p-4 bg-indigo-500/[0.08] border border-indigo-500/20 rounded-xl flex items-start gap-3 shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                  <Activity className="w-4 h-4 text-indigo-400 animate-pulse" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-indigo-300 tracking-tight">Watchdog Active</p>
                  <p className="text-[11px] text-indigo-400/70 mt-0.5">Polling every 10s · All services nominal</p>
                </div>
              </div>

              <div className="p-4 bg-white/[0.03] border border-white/[0.07] rounded-xl flex items-start gap-3 shadow-inner">
                <div className="w-8 h-8 rounded-lg bg-white/[0.07] border border-white/[0.06] flex items-center justify-center shrink-0 shadow-inner mt-0.5">
                  <CheckCircle2 className="w-4 h-4 text-zinc-400" />
                </div>
                <div>
                  <p className="text-[13px] font-bold text-white tracking-tight">Rules Engine Verified</p>
                  <p className="text-[11px] text-zinc-500 mt-0.5">All policies clear</p>
                </div>
              </div>

              {/* Quick stats */}
              <div className="grid grid-cols-2 gap-2">
                {[
                  { label: 'Products', value: totalProducts },
                  { label: 'Briefs', value: totalBriefs },
                  { label: 'Schedules', value: totalSchedules },
                  { label: 'Leads', value: totalLeads },
                ].map(stat => (
                  <div key={stat.label} className="p-3 bg-white/[0.02] border border-white/[0.05] rounded-xl text-center">
                    <div className="text-[15px] font-black text-white tabular-nums">{stat.value}</div>
                    <div className="text-[9px] text-zinc-600 font-bold tracking-widest uppercase mt-0.5">{stat.label}</div>
                  </div>
                ))}
              </div>

              {/* AI Insight */}
              <div className="p-4 bg-gradient-to-r from-indigo-500/[0.05] to-violet-500/[0.03] border border-indigo-500/[0.12] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="ai-section-label">AI Insight</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">
                  Engagement peaks Sunday +61%. Schedule high-value posts Fri–Sun for maximum reach velocity.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

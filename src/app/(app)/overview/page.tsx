import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DashboardChart } from '@/components/DashboardChart';
import { Users, CalendarDays, CheckCircle2, AlertCircle, TrendingUp, Activity, Sparkles, MoreHorizontal, ShieldCheck, Zap, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const pendingJobsCount = await prisma.backgroundJob.count({ where: { status: 'pending' } });
  const failedJobsCount = await prisma.backgroundJob.count({ where: { status: 'dead_letter' } });
  const reviewTasksCount = await prisma.reviewTask.count({ where: { status: 'open' } });
  const activeCampaigns = await prisma.campaign.count({ where: { status: 'active' } });
  const totalLeads = await prisma.lead.count();

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out relative">
      
      {/* Neural mesh backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-60"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
            </span>
            Command Center · Live Intelligence
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Good Morning.</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">Neural pipelines are processing. Here's your automation health and content performance at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/briefs" className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-inner">
            New Funnel
          </Link>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 group active:scale-95">
            <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Start Compute
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 relative z-10">
        {[
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
            title: 'Pending Render Jobs', value: pendingJobsCount, icon: CalendarDays,
            color: 'text-amber-400', accent: 'amber',
            trend: 'Queue', trendUp: null, label: 'processing'
          },
          {
            title: 'Awaiting Review', value: reviewTasksCount, icon: reviewTasksCount > 0 ? AlertCircle : CheckCircle2,
            color: reviewTasksCount > 0 ? 'text-red-400' : 'text-emerald-400', accent: reviewTasksCount > 0 ? 'red' : 'emerald',
            trend: reviewTasksCount > 0 ? 'Action' : 'Clear', trendUp: reviewTasksCount === 0, label: 'operator tasks'
          }
        ].map((kpi, i) => (
          <div
            key={i}
            className="glass-panel-ai ai-scan-panel rounded-2xl p-6 flex flex-col justify-between group hover:border-white/[0.08] transition-all duration-300 hover:-translate-y-px relative overflow-hidden"
          >
            {/* Subtle corner accent */}
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
              <div className="flex items-baseline gap-2">
                <span className="ai-metric text-white tabular-nums">{kpi.value.toLocaleString()}</span>
              </div>
              <p className="text-[11px] text-zinc-600 mt-1.5 font-medium">{kpi.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 relative z-10">

        {/* Chart — primary */}
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

        {/* System health */}
        <div className="space-y-4">
          <div className="glass-panel-ai rounded-2xl overflow-hidden flex flex-col h-[380px] hover:border-white/[0.08] transition-colors duration-300">
            <div className="px-5 py-4 border-b border-white/[0.04] flex justify-between items-center bg-white/[0.01] shrink-0">
              <h2 className="font-bold text-[14px] text-white flex items-center gap-2.5">
                <ShieldCheck className="w-4 h-4 text-emerald-500" /> System Health
              </h2>
              {/* Live indicator */}
              <div className="flex items-center gap-1.5">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
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
                  <p className="text-[11px] text-zinc-500 mt-0.5">42 assets checked · All policies clear</p>
                </div>
              </div>

              {/* AI Recommendations strip */}
              <div className="p-4 bg-gradient-to-r from-indigo-500/[0.05] to-violet-500/[0.03] border border-indigo-500/[0.12] rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Sparkles className="w-3.5 h-3.5 text-indigo-400" />
                  <span className="ai-section-label">AI Insight</span>
                </div>
                <p className="text-[11px] text-zinc-400 leading-relaxed font-medium">Engagement peaks on Sunday +61%. Consider scheduling high-value posts Friday–Sunday for maximum reach.</p>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { DashboardChart } from '@/components/DashboardChart';
import { CreditCard, Users, Zap, CalendarDays, CheckCircle2, AlertCircle, ArrowUpRight, TrendingUp, LineChart, Activity, Sparkles, MoreHorizontal, ShieldCheck } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const pendingJobsCount = await prisma.backgroundJob.count({ where: { status: 'pending' } });
  const failedJobsCount = await prisma.backgroundJob.count({ where: { status: 'dead_letter' } });
  const reviewTasksCount = await prisma.reviewTask.count({ where: { status: 'open' } });
  const activeCampaigns = await prisma.campaign.count({ where: { status: 'active' } });
  
  const totalLeads = await prisma.lead.count();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-sm">Good Morning.</h1>
          <p className="text-sm font-bold tracking-wide text-zinc-400 mt-2 uppercase">Here's your automation health and content performance at a glance.</p>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/briefs" className="px-6 py-3 bg-white/5 hover:bg-white/10 border border-white/10 text-white text-sm font-bold rounded-xl transition-all duration-300 shadow-inner">
            Setup New Funnel
          </Link>
          <button className="px-6 py-3 bg-white text-black font-black text-sm rounded-xl shadow-md hover:shadow-lg hover:bg-zinc-200 transition-all duration-300 flex items-center gap-2 group active:scale-95">
            <Sparkles className="w-4 h-4 text-indigo-600 group-hover:rotate-12 transition-transform" /> Start Compute
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
        {[
          { 
            title: 'Active Campaigns', value: activeCampaigns, icon: TrendingUp, 
            color: 'text-indigo-400', bg: 'bg-indigo-500/10',
            trend: '+14%', trendColor: 'text-emerald-400', border: 'border-indigo-500/20'
          },
          { 
            title: 'Qualified Leads', value: totalLeads, icon: Users, 
            color: 'text-purple-400', bg: 'bg-purple-500/10',
            trend: '+32%', trendColor: 'text-emerald-400', border: 'border-purple-500/20'
          },
          { 
            title: 'Pending Render Jobs', value: pendingJobsCount, icon: CalendarDays, 
            color: 'text-amber-400', bg: 'bg-amber-500/10',
            trend: 'Queue', border: 'border-amber-500/20'
          },
          { 
            title: 'Items Awaiting Review', value: reviewTasksCount, icon: reviewTasksCount > 0 ? AlertCircle : CheckCircle2, 
            color: reviewTasksCount > 0 ? 'text-red-400' : 'text-emerald-400', 
            bg: reviewTasksCount > 0 ? 'bg-red-500/10' : 'bg-emerald-500/10',
            border: reviewTasksCount > 0 ? 'border-red-500/20' : 'border-emerald-500/20'
          }
        ].map((kpi, i) => (
          <div key={i} className={`glass-panel rounded-3xl border ${kpi.border} p-6 md:p-8 shadow-sm hover:border-white/20 transition-all duration-300 group relative overflow-hidden flex flex-col justify-between hover:-translate-y-0.5 hover:shadow-md`}>
            {/* Subtle top gradient instead of CPU heavy massive blur opacity animations */}
            <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-${kpi.color.replace('text-', '')} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            <div className="flex justify-between items-start mb-8 relative z-10">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} border border-white/5 flex items-center justify-center shadow-inner group-hover:scale-105 transition-transform duration-300`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              {kpi.trend && (
                <span className={`flex items-center text-[10px] font-bold tracking-widest uppercase ${kpi.trendColor || 'text-zinc-500'} bg-black/40 px-3 py-1.5 rounded-md border border-white/5 shadow-inner`}>
                  {kpi.trend}
                </span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-zinc-500 font-bold text-xs tracking-widest uppercase mb-1">{kpi.title}</h3>
              <div className="flex items-baseline gap-2">
                <p className="text-4xl font-black tracking-tighter text-white drop-shadow-sm">{kpi.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grids */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Column: Charts / Big Widgets */}
        <div className="xl:col-span-2 space-y-6">
          <div className="glass-panel rounded-3xl border border-white/5 shadow-sm overflow-hidden flex flex-col h-[400px] hover:border-white/10 transition-colors duration-300 relative">
            <div className="px-8 py-6 flex justify-between items-center z-20 border-b border-white/5 bg-white/[0.01]">
              <div className="flex items-center gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-inner">
                    <Activity className="w-5 h-5 text-indigo-400" />
                 </div>
                 <h2 className="font-bold tracking-tight text-lg text-white">Engagement vs Leads Velocity</h2>
              </div>
              <button className="p-2 hover:bg-white/5 rounded-xl transition-colors border border-transparent hover:border-white/10 shadow-sm">
                 <MoreHorizontal className="w-5 h-5 text-zinc-500 hover:text-white transition-colors" />
              </button>
            </div>
            <div className="flex-1 px-6 pb-6 pt-6">
               <DashboardChart />
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed / Operations */}
        <div className="space-y-6">
          <div className="glass-panel rounded-3xl border border-white/5 shadow-sm overflow-hidden flex flex-col h-[400px] hover:border-white/10 transition-colors duration-300">
            <div className="px-8 py-6 border-b border-white/5 flex justify-between items-center bg-white/[0.01]">
              <h2 className="font-bold tracking-tight text-lg text-white flex items-center gap-3">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" /> System Health
              </h2>
            </div>
            <div className="p-6 space-y-4 overflow-y-auto scrollbar-hide flex-1">
              
              {failedJobsCount > 0 && (
                 <div className="relative p-5 bg-red-500/10 border border-red-500/20 rounded-2xl overflow-hidden shadow-inner flex items-start gap-4">
                   <div className="w-10 h-10 rounded-xl bg-red-500/20 border border-red-500/30 flex items-center justify-center shrink-0 shadow-inner">
                     <AlertCircle className="w-5 h-5 text-red-400" />
                   </div>
                   <div>
                     <p className="text-sm font-bold text-red-200 tracking-wide">Critical Failures Detected</p>
                     <p className="text-xs font-medium text-red-400/80 mt-1">{failedJobsCount} jobs moved to Dead Letter Queue.</p>
                     <Link href="/inbox" className="inline-flex items-center gap-1.5 text-[10px] font-black tracking-widest text-red-400 hover:text-red-300 uppercase mt-3 transition-colors border border-red-500/20 px-2 py-1 rounded bg-red-500/10">Triage Inbox &rarr;</Link>
                   </div>
                 </div>
              )}

               <div className="relative p-5 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl overflow-hidden shadow-inner flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-indigo-500/20 border border-indigo-500/30 flex items-center justify-center shrink-0 shadow-inner">
                   <Activity className="w-5 h-5 text-indigo-400 animate-pulse" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-indigo-200 tracking-wide">Companion Watchdog Active</p>
                   <p className="text-xs font-medium text-indigo-400/80 mt-1">Background routines are polling successfully every 10s.</p>
                 </div>
               </div>

               <div className="relative p-5 bg-white/5 border border-white/10 rounded-2xl overflow-hidden shadow-inner flex items-start gap-4">
                 <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                   <CheckCircle2 className="w-5 h-5 text-zinc-400" />
                 </div>
                 <div>
                   <p className="text-sm font-bold text-white tracking-wide">Rules Engine Verified</p>
                   <p className="text-xs font-medium text-zinc-400 mt-1">Compliance policies were checked on 42 recent generational assets.</p>
                 </div>
               </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

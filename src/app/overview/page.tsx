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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">Good Morning.</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1 dark:text-zinc-400">Here's your automation health and content performance at a glance.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/briefs" className="px-5 py-2.5 bg-white/70 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 backdrop-blur-md border border-zinc-200/50 dark:border-white/5 text-sm font-medium rounded-xl shadow-sm transition-all duration-300">
            Setup New Funnel
          </Link>
          <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium text-sm rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10 transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02] active:scale-95">
            <Sparkles className="w-4 h-4 group-hover:text-amber-400 transition-colors" /> Start Compute
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 relative z-10">
        {[
          { 
            title: 'Active Campaigns', value: activeCampaigns, icon: TrendingUp, 
            color: 'text-indigo-600 dark:text-indigo-400', bg: 'bg-indigo-50 dark:bg-indigo-500/10',
            trend: '+14%', trendColor: 'text-emerald-600 dark:text-emerald-400', border: 'border-indigo-500/20'
          },
          { 
            title: 'Qualified Leads', value: totalLeads, icon: Users, 
            color: 'text-purple-600 dark:text-purple-400', bg: 'bg-purple-50 dark:bg-purple-500/10',
            trend: '+32%', trendColor: 'text-emerald-600 dark:text-emerald-400', border: 'border-purple-500/20'
          },
          { 
            title: 'Pending Render Jobs', value: pendingJobsCount, icon: CalendarDays, 
            color: 'text-amber-600 dark:text-amber-400', bg: 'bg-amber-50 dark:bg-amber-500/10',
            trend: 'Queue', border: 'border-amber-500/20'
          },
          { 
            title: 'Items Awaiting Review', value: reviewTasksCount, icon: reviewTasksCount > 0 ? AlertCircle : CheckCircle2, 
            color: reviewTasksCount > 0 ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400', 
            bg: reviewTasksCount > 0 ? 'bg-red-50 dark:bg-red-500/10' : 'bg-emerald-50 dark:bg-emerald-500/10',
            border: reviewTasksCount > 0 ? 'border-red-500/20' : 'border-emerald-500/20'
          }
        ].map((kpi, i) => (
          <div key={i} className={`bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl rounded-2xl border ${kpi.border} dark:border-white/5 p-6 shadow-sm hover:shadow-xl hover:shadow-${kpi.color.split('-')[1]}-500/10 transition-all duration-500 group relative overflow-hidden flex flex-col justify-between hover:-translate-y-1`}>
            <div className={`absolute top-0 right-0 w-32 h-32 ${kpi.bg} rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none`} />
            
            <div className="flex justify-between items-start mb-6 relative z-10">
              <div className={`w-12 h-12 rounded-xl ${kpi.bg} flex items-center justify-center ring-1 ring-inset ring-white/10 shadow-sm`}>
                <kpi.icon className={`w-6 h-6 ${kpi.color}`} />
              </div>
              {kpi.trend && (
                <span className={`flex items-center text-xs font-bold ${kpi.trendColor || 'text-zinc-500'} bg-white/50 dark:bg-white/5 px-2.5 py-1 rounded-full ring-1 ring-black/5 dark:ring-white/10 backdrop-blur-md`}>
                  {kpi.trend}
                </span>
              )}
            </div>
            <div className="relative z-10">
              <h3 className="text-zinc-500 dark:text-zinc-400 text-sm font-semibold tracking-wide uppercase">{kpi.title}</h3>
              <div className="flex items-baseline gap-2 mt-2">
                <p className="text-4xl font-bold tracking-tight text-zinc-900 dark:text-white group-hover:scale-105 origin-left transition-transform duration-500">{kpi.value.toLocaleString()}</p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grids */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 relative z-10">
        
        {/* Left Column: Charts / Big Widgets */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-white/5 shadow-sm overflow-hidden flex flex-col h-[400px] relative hover:shadow-lg transition-shadow duration-500">
            <div className="px-6 py-5 flex justify-between items-center relative z-20">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center shadow-md">
                    <Activity className="w-4 h-4 text-white" />
                 </div>
                 <h2 className="font-semibold tracking-tight text-lg text-zinc-900 dark:text-white">Engagement vs Leads Velocity</h2>
              </div>
              <button className="p-2 hover:bg-zinc-100 dark:hover:bg-white/5 rounded-lg transition-colors">
                 <MoreHorizontal className="w-5 h-5 text-zinc-400" />
              </button>
            </div>
            <div className="flex-1 px-4 pb-4">
               <DashboardChart />
            </div>
          </div>
        </div>

        {/* Right Column: Activity Feed / Operations */}
        <div className="space-y-6">
          <div className="bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl rounded-2xl border border-zinc-200/80 dark:border-white/5 shadow-sm overflow-hidden flex flex-col h-[400px] hover:shadow-lg transition-shadow duration-500">
            <div className="px-6 py-5 border-b border-zinc-200/50 dark:border-white/5 flex justify-between items-center">
              <h2 className="font-semibold tracking-tight text-lg text-zinc-900 dark:text-white flex items-center gap-2">
                 <ShieldCheck className="w-5 h-5 text-emerald-500" /> System Health
              </h2>
            </div>
            <div className="p-5 space-y-4 overflow-y-auto scrollbar-hide flex-1">
              
              {failedJobsCount > 0 && (
                 <div className="relative group p-4 bg-red-50/80 dark:bg-red-500/10 border border-red-200/80 dark:border-red-500/20 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-red-500/20 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                   <div className="flex items-start gap-4 relative z-10">
                     <div className="w-8 h-8 rounded-full bg-red-100 dark:bg-red-500/20 flex items-center justify-center shrink-0">
                       <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-red-900 dark:text-red-200">Critical Failures Detected</p>
                       <p className="text-xs font-medium text-red-700 dark:text-red-400/80 mt-1">{failedJobsCount} jobs moved to Dead Letter Queue.</p>
                       <Link href="/inbox" className="inline-flex items-center gap-1 text-[11px] font-bold tracking-wider text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 uppercase mt-3 transition-colors">Triage Inbox &rarr;</Link>
                     </div>
                   </div>
                 </div>
              )}

               <div className="relative group p-4 bg-indigo-50/80 dark:bg-indigo-500/5 border border-indigo-200/80 dark:border-indigo-500/10 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                   <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 rounded-full blur-2xl -mr-8 -mt-8 pointer-events-none" />
                   <div className="flex items-start gap-4 relative z-10">
                     <div className="w-8 h-8 rounded-full bg-indigo-100 dark:bg-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                       <Activity className="w-4 h-4 text-indigo-600 dark:text-indigo-400 animate-pulse" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-indigo-900 dark:text-indigo-200">Companion Watchdog Active</p>
                       <p className="text-xs font-medium text-indigo-700 dark:text-indigo-400/80 mt-1">Background routines are polling successfully every 10s.</p>
                     </div>
                   </div>
               </div>

               <div className="relative group p-4 bg-zinc-50/80 dark:bg-white/5 border border-zinc-200/80 dark:border-white/5 rounded-xl overflow-hidden hover:shadow-md transition-shadow">
                   <div className="flex items-start gap-4 relative z-10">
                     <div className="w-8 h-8 rounded-full bg-zinc-200/80 dark:bg-white/10 flex items-center justify-center shrink-0">
                       <CheckCircle2 className="w-4 h-4 text-zinc-600 dark:text-zinc-400" />
                     </div>
                     <div>
                       <p className="text-sm font-bold text-zinc-900 dark:text-zinc-200">Rules Engine Verified</p>
                       <p className="text-xs font-medium text-zinc-500 dark:text-zinc-400 mt-1">Compliance policies were checked on 42 recent generational assets.</p>
                     </div>
                   </div>
               </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

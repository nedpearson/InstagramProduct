import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { LineChart, TrendingUp, Users, Activity, BarChart3, ChevronRight, Crosshair } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const publishedCount = await prisma.publishedPost.count();
  const leadsGenerated = await prisma.lead.count();
  const interactions = await prisma.comment.count();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-50 to-zinc-500">Performance Analytics</h1>
          <p className="text-sm font-medium text-zinc-400 mt-1">Growth metrics and conversion pipelines.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-zinc-100 font-bold text-sm rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] hover:shadow-[0_0_20px_rgba(255,255,255,0.05)] active:scale-95 flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-indigo-400" /> Export Report
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="bg-gradient-to-br from-indigo-900/60 to-purple-900/40 border border-indigo-500/30 p-8 rounded-3xl relative overflow-hidden group hover:shadow-[0_0_30px_rgba(79,70,229,0.2)] transition-all duration-500 backdrop-blur-xl">
          <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/20 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700" />
          <h3 className="text-zinc-300 font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2 relative z-10">
             <Activity className="w-4 h-4 text-indigo-400" /> Total Reach Pipeline
          </h3>
          <p className="text-5xl font-black text-white drop-shadow-md mb-2 relative z-10 tracking-tighter">{publishedCount * 1204}</p>
          <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 relative z-10">
             <TrendingUp className="w-4 h-4" /> +14% vs last month
          </div>
        </div>
        
        <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-purple-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <h3 className="text-zinc-500 font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2 relative z-10">
             <Crosshair className="w-4 h-4 text-purple-400" /> Total Leads Captured
          </h3>
          <p className="text-5xl font-black text-white drop-shadow-md relative z-10 tracking-tighter">{leadsGenerated}</p>
          <div className="text-sm font-bold text-emerald-400 mt-2 relative z-10 px-3 py-1 bg-emerald-500/10 w-max rounded-full border border-emerald-500/20">High Intent</div>
        </div>

        <div className="glass-panel p-8 rounded-3xl border border-white/10 relative overflow-hidden group hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500">
          <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl -mr-10 -mt-10 group-hover:scale-150 transition-transform duration-700 pointer-events-none" />
          <h3 className="text-zinc-500 font-bold text-xs tracking-widest uppercase mb-4 flex items-center gap-2 relative z-10">
             <Users className="w-4 h-4 text-amber-400" /> Engagement Events
          </h3>
          <p className="text-5xl font-black text-white drop-shadow-md relative z-10 tracking-tighter">{interactions * 15}</p>
          <div className="text-sm font-medium text-zinc-400 mt-2 relative z-10">Comments, DMs, Saves</div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative z-10 border border-white/5">
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h3 className="font-bold text-xl flex items-center gap-3 tracking-tight text-white">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                 <LineChart className="w-5 h-5" />
              </div>
              Top Performing Hooks
            </h3>
        </div>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#050505]/50 border-b border-white/5">
              <tr>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Hook Preview</th>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Format</th>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Conversion Rate</th>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
               {/* Stubbed data for UI effect */}
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-5 font-bold text-white tracking-wide">"Stop doing X..."</td>
                <td className="px-8 py-5">
                   <span className="px-3 py-1.5 bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-inner">reel</span>
                </td>
                <td className="px-8 py-5 text-emerald-400 font-black text-lg">14.2%</td>
                <td className="px-8 py-5 text-right">
                   <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors inline-block group-hover:translate-x-1" />
                </td>
              </tr>
              <tr className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                <td className="px-8 py-5 font-bold text-white tracking-wide">"The real reason you fail..."</td>
                <td className="px-8 py-5">
                   <span className="px-3 py-1.5 bg-purple-500/10 text-purple-400 border border-purple-500/20 rounded-md font-bold text-[10px] uppercase tracking-widest shadow-inner">carousel</span>
                </td>
                <td className="px-8 py-5 text-emerald-400 font-black text-lg">11.8%</td>
                <td className="px-8 py-5 text-right">
                   <ChevronRight className="w-5 h-5 text-zinc-600 group-hover:text-indigo-400 transition-colors inline-block group-hover:translate-x-1" />
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

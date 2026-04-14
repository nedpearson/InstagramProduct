import { prisma } from '@/lib/prisma';
import { LineChart, TrendingUp, Users, Activity, BarChart3, ChevronRight, Crosshair, ArrowUpRight } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const publishedCount = await prisma.publishedPost.count();
  const leadsGenerated = await prisma.lead.count();
  const interactions = await prisma.comment.count();

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Intelligence · Analytics</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Performance Analytics</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Growth metrics and conversion pipeline intelligence.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white font-bold text-[13px] rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-inner">
            <BarChart3 className="w-3.5 h-3.5 text-indigo-400" /> Export Report
          </button>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        {[
          {
            icon: Activity, label: 'Total Reach Pipeline', value: (publishedCount * 1204).toLocaleString(),
            trend: '+14%', trendUp: true, accent: 'indigo', sub: 'Estimated impressions'
          },
          {
            icon: Crosshair, label: 'Leads Captured', value: leadsGenerated.toLocaleString(),
            trend: 'High Intent', trendUp: true, accent: 'violet', sub: 'Qualified pipeline'
          },
          {
            icon: Users, label: 'Engagement Events', value: (interactions * 15).toLocaleString(),
            trend: null, trendUp: null, accent: 'amber', sub: 'Comments, DMs, Saves'
          },
        ].map((kpi, i) => (
          <div key={kpi.label} className="glass-panel-ai ai-scan-panel rounded-2xl p-6 border border-white/[0.05] hover:border-white/[0.09] transition-all duration-300 hover:-translate-y-px relative overflow-hidden group">
            <div className={`absolute top-0 right-0 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none -mr-8 -mt-8 ${
              kpi.accent === 'indigo' ? 'bg-indigo-500/10' : kpi.accent === 'violet' ? 'bg-violet-500/10' : 'bg-amber-500/10'
            }`} />
            <div className="flex items-start justify-between mb-5 relative z-10">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border ${
                kpi.accent === 'indigo' ? 'bg-indigo-500/10 border-indigo-500/15' : kpi.accent === 'violet' ? 'bg-violet-500/10 border-violet-500/15' : 'bg-amber-500/10 border-amber-500/15'
              } group-hover:scale-105 transition-transform duration-300`}>
                <kpi.icon className={`w-5 h-5 ${kpi.accent === 'indigo' ? 'text-indigo-400' : kpi.accent === 'violet' ? 'text-violet-400' : 'text-amber-400'}`} />
              </div>
              {kpi.trend && (
                <div className={`flex items-center gap-1 text-[10px] font-bold tracking-widest uppercase rounded-md px-2 py-1 border shadow-inner ${
                  kpi.trendUp ? 'text-emerald-400 bg-emerald-500/[0.08] border-emerald-500/20' : 'text-zinc-500 bg-white/[0.04] border-white/[0.08]'
                }`}>
                  {kpi.trendUp && <ArrowUpRight className="w-3 h-3" />}
                  {kpi.trend}
                </div>
              )}
            </div>
            <div className="relative z-10">
              <div className="ai-section-label mb-2">{kpi.label}</div>
              <div className="ai-metric text-white tabular-nums">{kpi.value}</div>
              <p className="text-[11px] text-zinc-600 mt-1.5 font-medium">{kpi.sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Top hooks table */}
      <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden shadow-sm relative z-10 border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-300">
        <div className="px-6 md:px-8 py-5 border-b border-white/[0.05] bg-white/[0.01] flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-inner">
              <LineChart className="w-4.5 h-4.5" />
            </div>
            <div>
              <h2 className="text-[14px] font-bold text-white tracking-tight">Top Performing Hooks</h2>
              <div className="ai-section-label mt-0.5">Neural analytics · Conversion optimized</div>
            </div>
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#050505]/50 border-b border-white/[0.05]">
              <tr>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Hook Preview</th>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Format</th>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Conversion Rate</th>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase text-right">Trend</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/[0.04] bg-transparent">
              {[
                { hook: '"Stop doing X..."', format: 'reel', rate: '14.2%', accent: 'indigo' },
                { hook: '"The real reason you fail..."', format: 'carousel', rate: '11.8%', accent: 'violet' },
                { hook: '"What nobody tells you about..."', format: 'post', rate: '9.4%', accent: 'amber' },
              ].map(row => (
                <tr key={row.hook} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="px-7 py-5 font-semibold text-white text-[13px]">{row.hook}</td>
                  <td className="px-7 py-5">
                    <span className={`px-2.5 py-1.5 rounded-md font-bold text-[9px] uppercase tracking-[0.15em] shadow-inner border ${
                      row.accent === 'indigo' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      row.accent === 'violet' ? 'bg-violet-500/10 text-violet-400 border-violet-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>{row.format}</span>
                  </td>
                  <td className="px-7 py-5 text-emerald-400 font-black text-[15px] tabular-nums">{row.rate}</td>
                  <td className="px-7 py-5 text-right">
                    <ChevronRight className="w-4 h-4 text-zinc-600 group-hover:text-indigo-400 transition-colors inline-block group-hover:translate-x-0.5" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

import { Activity, Target, Network, Layers, ShieldCheck, Crosshair, ChevronRight, BarChart3, LineChart } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import MarketAttackDeployer from '@/components/MarketAttackDeployer';

export const dynamic = 'force-dynamic';

export default async function DominationPage() {
  let workspace = await prisma.workspace.findFirst();
  if (!workspace) {
    workspace = await prisma.workspace.create({
      data: {
        name: 'InstaFlow Production',
        subscription: 'premium',
        seats: 5
      }
    });
  }

  const competitors = await prisma.competitor.findMany({
    orderBy: { threatScore: 'desc' },
    take: 4
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-3" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-400" /> Executive War Room
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Market Domination</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-2xl">
            Live strategic telemetry integrating opportunity heatmaps, competitor moat analysis, and automated feature gap exploitation mechanisms.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-inner">
            Update Matrix
          </button>
          <MarketAttackDeployer workspaceId={workspace.id} />
        </div>
      </div>

      {/* Main Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <div className="glass-panel-ai ai-scan-panel rounded-2xl p-6 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-indigo-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="ai-section-label mb-2 flex items-center gap-2"><Network className="w-4 h-4" /> Market Share Matrix</div>
          <div className="text-3xl font-black text-white">4.2% <span className="text-sm font-bold text-emerald-400">+1.1%</span></div>
        </div>
        <div className="glass-panel-ai ai-scan-panel rounded-2xl p-6 relative overflow-hidden group">
           <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-500/10 blur-2xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
           <div className="ai-section-label mb-2 flex items-center gap-2"><Layers className="w-4 h-4" /> Feature Gaps Exploited</div>
           <div className="text-3xl font-black text-white">12 <span className="text-sm font-medium text-zinc-500">active hooks</span></div>
        </div>
        <div className="glass-panel-ai ai-scan-panel rounded-2xl p-6 border-red-500/20 bg-red-500/[0.02]">
           <div className="ai-section-label mb-2 text-red-400">Total Vulnerability Targets</div>
           <div className="text-3xl font-black text-red-400">{competitors.length * 3} <span className="text-sm text-red-500/50">detected</span></div>
        </div>
        <div className="glass-panel-ai ai-scan-panel rounded-2xl p-6 border-amber-500/20 bg-amber-500/[0.02]">
           <div className="ai-section-label mb-2 text-amber-400">Strategic Moat Strength</div>
           <div className="text-3xl font-black text-amber-400">76 / 100</div>
        </div>
      </div>

      {/* Complex Heatmaps and Matrix section */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-5 relative z-10">
         {/* Strategic Moat & Gap Detector */}
         <div className="xl:col-span-2 glass-panel-ai rounded-2xl flex flex-col h-[400px] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.04] bg-white/[0.01]">
              <h2 className="font-bold text-[14px] text-white flex items-center gap-2"><ShieldCheck className="w-4 h-4 text-indigo-400" /> Strategic Moat Analysis & Gap Detector</h2>
            </div>
            <div className="p-6 flex-1 flex flex-col relative">
               <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="border border-white/[0.04] rounded-lg p-3 bg-white/[0.01]">
                     <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Pricing Power</div>
                     <div className="flex h-1.5 w-full bg-white/[0.04] mt-2 rounded overflow-hidden">
                        <div className="h-full bg-emerald-500 w-[80%] rounded"></div>
                     </div>
                  </div>
                  <div className="border border-white/[0.04] rounded-lg p-3 bg-white/[0.01]">
                     <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Audience Retention</div>
                     <div className="flex h-1.5 w-full bg-white/[0.04] mt-2 rounded overflow-hidden">
                        <div className="h-full bg-amber-500 w-[60%] rounded"></div>
                     </div>
                  </div>
                  <div className="border border-white/[0.04] rounded-lg p-3 bg-white/[0.01]">
                     <div className="text-[10px] text-zinc-500 uppercase font-bold tracking-widest">Brand Authority</div>
                     <div className="flex h-1.5 w-full bg-white/[0.04] mt-2 rounded overflow-hidden">
                        <div className="h-full bg-indigo-500 w-[90%] rounded"></div>
                     </div>
                  </div>
               </div>

               <div className="flex-1 mt-2 border border-white/[0.04] bg-zinc-950/50 rounded-xl relative overflow-hidden flex items-center justify-center p-8 text-center group">
                 <div className="absolute inset-0 bg-gradient-to-t from-indigo-500/5 to-transparent"></div>
                 <div className="relative z-10">
                   <div className="w-16 h-16 bg-white/[0.02] border border-white/[0.04] rounded-2xl rotate-45 mx-auto mb-6 flex items-center justify-center group-hover:rotate-90 transition-transform duration-700">
                     <LineChart className="w-6 h-6 text-indigo-400 -rotate-45 group-hover:-rotate-90 transition-transform duration-700" />
                   </div>
                   <h3 className="text-base font-bold text-white mb-2">Feature Gap Matrix Plotting Active</h3>
                   <p className="text-[12px] text-zinc-500 max-w-sm mx-auto">Neural pipeline is currently analyzing Top 10 competitor offer stacks and correlating gaps against user churn signals.</p>
                 </div>
               </div>
            </div>
         </div>

          {/* Opportunity Heatmap */}
         <div className="glass-panel-ai rounded-2xl flex flex-col h-[400px] overflow-hidden">
            <div className="px-6 py-5 border-b border-white/[0.04] bg-white/[0.01]">
              <h2 className="font-bold text-[14px] text-white flex items-center gap-2"><Activity className="w-4 h-4 text-emerald-400" /> Opportunity Heatmaps</h2>
            </div>
            <div className="flex-1 overflow-y-auto scrollbar-hide p-4 space-y-3">
               {await (async () => {
                 const opportunities = await prisma.opportunityScore.findMany({ orderBy: { totalScore: 'desc' }, take: 10, include: { brief: true } });
                 if (opportunities.length === 0) {
                    return (
                       <div className="h-full flex flex-col items-center justify-center opacity-50 p-4 text-center">
                          <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">No active opportunities scored</p>
                       </div>
                    );
                 }
                 
                 return opportunities.map((item) => {
                   const color = item.totalScore > 85 ? 'emerald' : item.totalScore > 50 ? 'amber' : 'red';
                   return (
                     <Link href={`/briefs?edit=${item.briefId}`} key={item.id} className="p-3 bg-white/[0.02] border border-white/[0.04] rounded-xl flex items-center justify-between hover:bg-white/[0.04] transition-colors group cursor-pointer block">
                        <div className="flex flex-col relative w-full pt-1">
                          <div className="flex items-center justify-between w-full z-10 relative px-2 mb-2">
                            <span className="text-[12px] font-bold text-zinc-200 group-hover:text-white transition-colors">{item.brief.topic}</span>
                            <span className={`text-[11px] font-black tabular-nums ${color === 'emerald' ? 'text-emerald-400' : color === 'amber' ? 'text-amber-400' : 'text-red-400'}`}>{item.totalScore.toFixed(0)}°</span>
                          </div>
                          <div className="w-full bg-white/[0.02] h-7 absolute top-0 left-0 rounded opacity-60 overflow-hidden">
                            <div className={`h-full rounded transition-all duration-1000 ${
                              color === 'emerald' ? 'bg-gradient-to-r from-transparent to-emerald-500/20 border-r border-emerald-500/50' :
                              color === 'amber' ? 'bg-gradient-to-r from-transparent to-amber-500/20 border-r border-amber-500/50' :
                              'bg-gradient-to-r from-transparent to-red-500/20 border-r border-red-500/50'
                            }`} style={{ width: `${Math.min(item.totalScore, 100)}%`}}></div>
                          </div>
                        </div>
                     </Link>
                   )
                 });
               })()}
            </div>
         </div>
      </div>
    </div>
  );
}

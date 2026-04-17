import { ShieldCheck, Zap, Crosshair, Users, Target, Activity } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { deployGlobalScoutAgentAction } from '@/app/(app)/actions';

export const dynamic = 'force-dynamic';

export default async function CompetitorsPage() {
  const competitors = await prisma.competitor.findMany({
    orderBy: { threatScore: 'desc' }
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-3" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <Crosshair className="w-4 h-4 text-red-500" /> Tactical Intelligence
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Competitor War Room</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">
            Live tracking of competitor strategies, ad copy, monetization funnels, and vulnerability scoring.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <form action={deployGlobalScoutAgentAction}>
            <button type="submit" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 group active:scale-95">
              <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Deploy Scout Agent
            </button>
          </form>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <div className="glass-panel-ai rounded-2xl p-6">
          <div className="ai-section-label">Tracked Targets</div>
          <div className="text-2xl font-black text-white mt-1">{competitors.length}</div>
        </div>
        <div className="glass-panel-ai rounded-2xl p-6">
          <div className="ai-section-label">High Threat</div>
          <div className="text-2xl font-black text-red-400 mt-1">
            {competitors.filter(c => c.threatScore > 80).length}
          </div>
        </div>
        <div className="glass-panel-ai rounded-2xl p-6">
          <div className="ai-section-label">Offer Changes</div>
          <div className="text-2xl font-black text-white mt-1">2</div>
        </div>
        <div className="glass-panel-ai rounded-2xl p-6">
          <div className="ai-section-label">Ad Library Shifts</div>
          <div className="text-2xl font-black text-white mt-1">14</div>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="glass-panel-ai rounded-2xl border border-white/[0.04] p-6 relative z-10 overflow-hidden mb-6">
        <h3 className="text-sm font-bold text-white mb-4">Competitor Vulnerability Matrix</h3>
        <div className="w-full overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-white/[0.04] text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3 px-4">Entity Handle</th>
                    <th className="pb-3 px-4">Threat Score</th>
                    <th className="pb-3 px-4">Positioning Alignment</th>
                    <th className="pb-3 px-4">Exploitable Gaps</th>
                    <th className="pb-3 px-4 text-right">Surveillance</th>
                 </tr>
              </thead>
              <tbody className="text-sm text-zinc-300">
                 {competitors.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-zinc-500 italic">No competitors tracked inside the active Workspace yet.</td>
                   </tr>
                 )}
                 {competitors.map((comp) => {
                    const parsedGaps = comp.intelligenceData ? JSON.parse(comp.intelligenceData as string)?.opportunities : [];
                    return (
                       <tr key={comp.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-pointer">
                          <td className="py-4 px-4 font-bold text-white">{comp.handle} <div className="text-[10px] text-zinc-500 font-normal">{comp.brandName}</div></td>
                          <td className="py-4 px-4">
                             <div className="w-full max-w-[100px] bg-white/[0.04] h-2 rounded overflow-hidden">
                                <div className={`h-full ${comp.threatScore > 80 ? 'bg-red-500' : 'bg-amber-500'}`} style={{ width: `${comp.threatScore}%`}}></div>
                             </div>
                             <div className="text-[10px] text-zinc-500 font-bold mt-1 tabular-nums">{comp.threatScore}/100</div>
                          </td>
                          <td className="py-4 px-4 text-xs text-zinc-400 max-w-[200px] truncate">{comp.positioning}</td>
                          <td className="py-4 px-4">
                             {parsedGaps && parsedGaps.length > 0 ? (
                               <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 text-[11px] font-bold rounded">{parsedGaps.length} Attack Vectors</span>
                             ) : (
                               <span className="text-xs text-zinc-500 font-medium">Scanning...</span>
                             )}
                          </td>
                          <td className="py-4 px-4 text-right">
                             <Link href={`/competitors/${comp.id}`} className="px-3 py-1 bg-red-500/10 text-red-400 hover:bg-red-500/20 text-xs font-bold rounded transition-colors inline-block">View Moat Profile</Link>
                          </td>
                       </tr>
                    );
                 })}
              </tbody>
           </table>
        </div>
      </div>

      <div className="glass-panel-ai rounded-2xl border border-white/[0.04] p-6 relative z-10 overflow-hidden bg-gradient-to-br from-indigo-500/[0.03] to-transparent">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Zap className="w-4 h-4 text-indigo-400" />
            <h3 className="text-sm font-bold text-indigo-400 uppercase tracking-widest">Differentiation Engine Log</h3>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold tracking-widest uppercase">Hooks Harvested safely</span>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Original Traced Hook</div>
            <div className="text-sm text-zinc-400 italic">"The secret to Instagram growth is posting 3 times a day"</div>
            <div className="mt-3 text-[10px] text-indigo-500 uppercase tracking-widest mb-1 font-bold">IP-Safe Contrarian Matrix Output</div>
            <div className="text-sm text-white font-medium border-l-2 border-indigo-500 pl-3 py-1">"Why posting 3x a day on Instagram is killing your reach (Do this instead)"</div>
          </div>
          
          <div className="p-4 bg-white/[0.02] border border-white/[0.05] rounded-xl">
            <div className="text-[10px] text-zinc-500 uppercase tracking-widest mb-2 font-bold">Original Traced Offer</div>
            <div className="text-sm text-zinc-400 italic">"$47 eBook on DM sales scripts"</div>
            <div className="mt-3 text-[10px] text-indigo-500 uppercase tracking-widest mb-1 font-bold">IP-Safe Value Add Output</div>
            <div className="text-sm text-white font-medium border-l-2 border-indigo-500 pl-3 py-1">Free 7-Day Email Course on DM conversions + $97 Coaching Upsell</div>
          </div>
        </div>
      </div>

    </div>
  );
}

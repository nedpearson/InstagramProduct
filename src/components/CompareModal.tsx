'use client';

import Link from 'next/link';
import { X, Layers, TrendingUp, Zap, ShieldCheck, Trophy } from 'lucide-react';

export function CompareModal({ briefs }: { briefs: any[] }) {
  // Filter only briefs that have a blueprint generated
  const generatedBriefs = briefs
    .filter(b => b.blueprintData)
    .map(b => ({
      id: b.id,
      name: b.product?.name || b.niche,
      data: JSON.parse(b.blueprintData)
    }));

  if (generatedBriefs.length < 2) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <div className="relative w-full max-w-md bg-zinc-950 border border-white/[0.08] shadow-2xl rounded-2xl p-8 text-center flex flex-col items-center">
          <Link href="/briefs" scroll={false} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </Link>
          <div className="w-16 h-16 bg-amber-500/10 rounded-full flex items-center justify-center mb-6 border border-amber-500/20">
            <Layers className="w-8 h-8 text-amber-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Not Enough Data</h2>
          <p className="text-zinc-400 text-sm mb-6">Compare mode requires at least 2 fully generated Strategy Blueprints. Generate more strategies first.</p>
          <Link href="/briefs" scroll={false} className="w-full py-3.5 bg-zinc-800 hover:bg-zinc-700 text-white font-bold rounded-xl transition-all shadow-md block">
            Close
          </Link>
        </div>
      </div>
    );
  }

  // Calculate Awards
  const getWinner = (metricLabel: string, metricKey: string, invertLogic = false) => {
    let bestVal = invertLogic ? 999 : -1;
    let winner: any = null;
    generatedBriefs.forEach(b => {
      const val = b.data.opportunityIntelligence.scores[metricKey];
      if (invertLogic) {
        if (val < bestVal) { bestVal = val; winner = b; }
      } else {
        if (val > bestVal) { bestVal = val; winner = b; }
      }
    });
    return { label: metricLabel, winner, score: bestVal };
  };

  const highestMonetization = getWinner('Highest Monetization', 'monetization');
  const lowestCompetition = getWinner('Lowest Competition', 'competition', true);
  const highestVirality = getWinner('Highest Virality', 'virality');
  const bestOverall = getWinner('Best Overall Opportunity', 'composite');

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" />
      <div className="relative w-full max-w-7xl h-[90vh] bg-zinc-950 border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05] bg-white/[0.02] shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-fuchsia-500/20 text-fuchsia-400 text-[10px] uppercase font-black tracking-widest border border-fuchsia-500/30">AI Market Analysis</span>
              <h2 className="text-xl font-bold text-white">Strategy Comparison Matrix</h2>
            </div>
          </div>
          <Link href="/briefs" scroll={false} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors">
            <X className="w-4 h-4" />
          </Link>
        </div>

        <div className="flex-1 overflow-y-auto p-8 lg:p-10 space-y-12">
          
          {/* AI Recommended Winners */}
          <div>
             <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">AI Consultant Recommendations</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { title: bestOverall.label, b: bestOverall.winner, icon: Trophy, color: 'text-fuchsia-400', bg: 'bg-fuchsia-500/10', border: 'border-fuchsia-500/30', score: bestOverall.score },
                  { title: highestMonetization.label, b: highestMonetization.winner, icon: Zap, color: 'text-emerald-400', bg: 'bg-emerald-500/10', border: 'border-emerald-500/30', score: highestMonetization.score },
                  { title: lowestCompetition.label, b: lowestCompetition.winner, icon: ShieldCheck, color: 'text-amber-400', bg: 'bg-amber-500/10', border: 'border-amber-500/30', score: lowestCompetition.score },
                  { title: highestVirality.label, b: highestVirality.winner, icon: TrendingUp, color: 'text-indigo-400', bg: 'bg-indigo-500/10', border: 'border-indigo-500/30', score: highestVirality.score },
                ].map((award, i) => (
                  <div key={i} className={`p-5 rounded-2xl border ${award.border} ${award.bg} relative overflow-hidden flex flex-col justify-between`}>
                    <div className="flex items-center gap-3 mb-4">
                      <award.icon className={`w-5 h-5 ${award.color}`} />
                      <span className={`text-[10px] uppercase font-black tracking-widest ${award.color}`}>{award.title}</span>
                    </div>
                    <div className="text-lg font-bold text-white line-clamp-2 leading-tight drop-shadow-sm">{award.b?.name}</div>
                    <div className="mt-4 flex items-center justify-between">
                       <span className="text-zinc-400 text-xs font-bold uppercase tracking-widest">Score</span>
                       <span className={`text-xl font-black ${award.color}`}>{award.score}</span>
                    </div>
                  </div>
                ))}
             </div>
          </div>

          {/* Matrix Chart */}
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest text-zinc-500 mb-6">Side-By-Side Intelligence Matrix</h3>
            <div className="w-full overflow-x-auto pb-4">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr>
                    <th className="p-4 border-b border-white/5 bg-white/[0.02] text-sm font-bold text-zinc-400 whitespace-nowrap min-w-[200px]">Metric</th>
                    {generatedBriefs.map(b => (
                      <th key={b.id} className="p-4 border-b border-white/5 bg-white/[0.02] text-sm font-bold text-white whitespace-nowrap min-w-[250px]">
                        {b.name}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {[
                    { key: 'composite', label: 'Overall Composite Score' },
                    { key: 'demand', label: 'Market Demand' },
                    { key: 'competition', label: 'Competition Saturation (Inverted)' },
                    { key: 'virality', label: 'Virality Probability' },
                    { key: 'monetization', label: 'Monetization Potential' },
                  ].map((row, i) => (
                    <tr key={row.key} className={i % 2 === 0 ? 'bg-white/[0.01]' : ''}>
                      <td className="p-4 border-b border-white/5 text-[13px] font-bold text-zinc-300 uppercase tracking-wide">
                        {row.label}
                      </td>
                      {generatedBriefs.map(b => {
                        const score = b.data.opportunityIntelligence?.scores[row.key] || 0;
                        let colorClass = 'bg-red-500';
                        if (score >= 90) colorClass = 'bg-fuchsia-500';
                        else if (score >= 75) colorClass = 'bg-emerald-500';
                        else if (score >= 60) colorClass = 'bg-amber-500';

                        return (
                          <td key={b.id} className="p-4 border-b border-white/5 align-middle">
                            <div className="flex items-center gap-4">
                              <span className={`text-lg font-black w-8 ${colorClass.replace('bg-', 'text-')}`}>{score}</span>
                              <div className="flex-1 h-1.5 bg-black/40 rounded-full overflow-hidden border border-white/5">
                                <div className={`h-full ${colorClass}`} style={{ width: `${score}%` }}></div>
                              </div>
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                  <tr>
                     <td className="p-4 border-b border-white/5 text-[13px] font-bold text-zinc-300 uppercase tracking-wide">
                        AI Recommendation
                     </td>
                     {generatedBriefs.map(b => (
                        <td key={b.id} className="p-4 border-b border-white/5">
                           <span className="text-xs font-bold text-zinc-400 bg-white/5 px-2.5 py-1.5 rounded-lg inline-block">
                              {b.data.opportunityIntelligence?.recommendation}
                           </span>
                        </td>
                     ))}
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

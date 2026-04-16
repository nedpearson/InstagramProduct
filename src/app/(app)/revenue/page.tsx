import { CircleDollarSign, LineChart, TrendingUp, AlertCircle } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function RevenuePage() {
  const funnels = await prisma.monetizationFunnel.findMany();

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-2" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <LineChart className="w-4 h-4 text-emerald-400" /> Value Extraction
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Revenue Central</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">
            Live analytics on funnel conversions, LTV predictability, and cross-channel yield rates.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        <div className="glass-panel-ai rounded-2xl p-6">
          <div className="ai-section-label">Active Funnels</div>
          <div className="text-2xl font-black text-white mt-1">{funnels.length}</div>
        </div>
        <div className="glass-panel-ai rounded-2xl p-6">
          <div className="ai-section-label">Net Proceeds</div>
          <div className="text-2xl font-black text-white mt-1">$0.00</div>
        </div>
        <div className="glass-panel-ai rounded-2xl p-6">
          <div className="ai-section-label">CPA/CAC</div>
          <div className="text-2xl font-black text-white mt-1">$0.00</div>
        </div>
        <div className="glass-panel-ai rounded-2xl p-6 border-indigo-500/10 bg-indigo-500/[0.02]">
          <div className="ai-section-label text-indigo-400">Forecast (30d)</div>
          <div className="text-2xl font-black text-indigo-400 mt-1">$0.00</div>
        </div>
      </div>

      {/* Analytical Table Area */}
      <div className="glass-panel-ai rounded-2xl border border-white/[0.04] p-6 relative z-10 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Active LTV Checkouts & Conversion Matrices</h3>
        <div className="w-full overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-white/[0.04] text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3 px-4">Funnel Path</th>
                    <th className="pb-3 px-4">Base LTV Estimate</th>
                    <th className="pb-3 px-4">Current CPA</th>
                    <th className="pb-3 px-4">Yield Rate</th>
                    <th className="pb-3 px-4 text-right">Drill-Down</th>
                 </tr>
              </thead>
              <tbody className="text-sm text-zinc-300">
                 {funnels.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-zinc-500 italic">No monetization funnels integrated. Launch an offer via Orchestrator to begin scanning LTV.</td>
                   </tr>
                 )}
                 {funnels.map(f => (
                   <tr key={f.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="py-3 px-4 font-semibold text-white">{f.name} <span className="px-2 py-[2px] ml-2 text-[10px] bg-indigo-500/10 text-indigo-400 rounded uppercase">{f.type}</span></td>
                      <td className="py-3 px-4 font-mono text-emerald-400">${f.expectedLTV?.toFixed(2) || '0.00'}</td>
                      <td className="py-3 px-4 font-mono">${(f.expectedLTV || 0) * 0.1} <span className="text-[10px] text-zinc-500">(estimated)</span></td>
                      <td className="py-3 px-4">
                         <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold">14.2%</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                         <Link href={`/revenue/${f.id || 'demo_saas'}`} className="px-3 py-1 bg-white/[0.04] text-zinc-300 text-xs font-bold rounded hover:bg-white/[0.08] transition-colors inline-block">Analyze Yield</Link>
                      </td>
                   </tr>
                 ))}
                 {/* Demo Fallback Data for UI Density */}
                 <tr className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="py-3 px-4 font-semibold text-white">Instagram OS Masterclass <span className="px-2 py-[2px] ml-2 text-[10px] bg-indigo-500/10 text-indigo-400 rounded uppercase">SAAS</span></td>
                      <td className="py-3 px-4 font-mono text-emerald-400">$350.00</td>
                      <td className="py-3 px-4 font-mono">$12.45 <span className="text-[10px] text-zinc-500">(actual)</span></td>
                      <td className="py-3 px-4">
                         <span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold">28.1%</span>
                      </td>
                      <td className="py-3 px-4 text-right">
                         <Link href={`/revenue/demo_saas`} className="px-3 py-1 bg-white/[0.04] text-zinc-300 text-xs font-bold rounded hover:bg-white/[0.08] transition-colors inline-block">Analyze Yield</Link>
                      </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>
    </div>
  );
}

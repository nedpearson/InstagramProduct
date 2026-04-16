import { Activity, Zap, TrendingUp, AlertCircle, BarChart3, Radio } from 'lucide-react';
import Link from 'next/link';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function TrendsPage() {
  const trendingSignals = await prisma.trendSignal.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-1" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <Radio className="w-4 h-4 text-indigo-400" /> Live Market Signals
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Trend Radar</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">
            Autonomous scanning of niche growth patterns, viral hooks, and blue ocean opportunities.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 group active:scale-95">
            <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Force Scan
          </button>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
        <div className="glass-panel-ai ai-scan-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center">
              <Activity className="w-5 h-5 text-indigo-400" />
            </div>
            <div>
              <div className="ai-section-label">Active Scrapers</div>
              <div className="text-2xl font-black text-white">12 Agents</div>
            </div>
          </div>
        </div>
        <div className="glass-panel-ai ai-scan-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/15 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-emerald-400" />
            </div>
            <div>
              <div className="ai-section-label">Emerging Signals</div>
              <div className="text-2xl font-black text-white">{trendingSignals.length || 0} Found</div>
            </div>
          </div>
        </div>
        <div className="glass-panel-ai ai-scan-panel rounded-2xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/15 flex items-center justify-center">
              <BarChart3 className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="ai-section-label">Confidence Threshold</div>
              <div className="text-2xl font-black text-white">85%</div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Area */}
      {/* Main Content Area */}
      <div className="glass-panel-ai rounded-2xl border border-white/[0.04] p-6 relative z-10 overflow-hidden">
        <h3 className="text-sm font-bold text-white mb-4">Detected Signals & Launch Vectors</h3>
        <div className="w-full overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead>
                 <tr className="border-b border-white/[0.04] text-xs font-bold text-zinc-500 uppercase tracking-wider">
                    <th className="pb-3 px-4">Detected Trend</th>
                    <th className="pb-3 px-4 text-center">Momentum</th>
                    <th className="pb-3 px-4 text-center">Saturation</th>
                    <th className="pb-3 px-4">Recommended Monetzation</th>
                    <th className="pb-3 px-4 text-right">Action</th>
                 </tr>
              </thead>
              <tbody className="text-sm text-zinc-300">
                 {trendingSignals.length === 0 && (
                   <tr>
                     <td colSpan={5} className="py-8 text-center text-zinc-500 italic">No trends captured by TrendRadar Agent yet.</td>
                   </tr>
                 )}
                 {trendingSignals.map(signal => (
                   <tr key={signal.id} className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="py-3 px-4 font-semibold text-emerald-400">{signal.topic}</td>
                      <td className="py-3 px-4 text-center"><span className="px-2 py-1 bg-white/[0.04] rounded-lg text-white font-mono">{signal.momentum.toFixed(2)}x</span></td>
                      <td className="py-3 px-4 text-center"><span className="px-2 py-1 bg-amber-500/10 text-amber-400 rounded-lg text-xs font-bold pointer-events-none">Low</span></td>
                      <td className="py-3 px-4 text-xs font-medium text-zinc-400">Micro-SaaS / Digital Toolkit</td>
                      <td className="py-3 px-4 text-right">
                         <Link href={`/trends/${signal.id}`} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded hover:bg-indigo-500/40 transition-colors inline-block">Route to Pipeline</Link>
                      </td>
                   </tr>
                 ))}
                 {/* Native Mock Additions for visual population if DB is bare */}
                 <tr className="border-b border-white/[0.02] hover:bg-white/[0.02] transition-colors group cursor-pointer">
                      <td className="py-3 px-4 font-semibold text-emerald-400">AI Local Agency Outreach Hooks</td>
                      <td className="py-3 px-4 text-center"><span className="px-2 py-1 bg-white/[0.04] rounded-lg text-white font-mono">2.84x</span></td>
                      <td className="py-3 px-4 text-center"><span className="px-2 py-1 bg-emerald-500/10 text-emerald-400 rounded-lg text-xs font-bold">Very Low</span></td>
                      <td className="py-3 px-4 text-xs font-medium text-zinc-400">High-Ticket Consulting ($2,500)</td>
                      <td className="py-3 px-4 text-right">
                         <Link href={`/trends/mock-123`} className="px-3 py-1 bg-indigo-500/20 text-indigo-400 text-xs font-bold rounded hover:bg-indigo-500/40 transition-colors inline-block">Route to Pipeline</Link>
                      </td>
                 </tr>
              </tbody>
           </table>
        </div>
      </div>

    </div>
  );
}

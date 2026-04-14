import { prisma } from '@/lib/prisma';
import { Route, ShieldCheck, Terminal } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const rules = await prisma.automationRule.findMany();

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Operations · Rules Engine</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Rules & Policy Engine</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Configure systemic guardrails and flow-control patterns.</p>
        </div>
      </div>

      <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden shadow-sm relative z-10 border border-white/[0.05] hover:border-indigo-500/20 transition-colors duration-300">

        <div className="px-6 md:px-8 py-5 border-b border-white/[0.05] flex items-center gap-4 bg-white/[0.01]">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-tight">Active Guardrails</h2>
            <div className="ai-section-label mt-0.5">Policy enforcement · System-level</div>
          </div>
        </div>

        <div className="p-6 md:p-8">
          {rules.length === 0 ? (
            <div className="py-14 border border-dashed border-white/[0.07] rounded-2xl text-center flex flex-col items-center group">
              <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-5 border border-white/[0.07] shadow-inner group-hover:scale-105 transition-transform duration-300">
                <Route className="w-6 h-6 text-zinc-600" />
              </div>
              <div className="ai-section-label mb-3">Status · Default Mode</div>
              <p className="text-[13px] font-bold text-white mb-1.5">No explicit rules configured</p>
              <p className="text-[12px] text-zinc-600 font-medium max-w-xs">System is executing under default hardcoded boundaries.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {rules.map(rule => (
                <div key={rule.id} className="p-5 border border-white/[0.06] bg-white/[0.02] rounded-xl flex items-start lg:items-center justify-between gap-6 hover:border-indigo-500/20 transition-all shadow-inner group">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-3">
                      <Terminal className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                      <span className="font-bold font-mono text-[11px] tracking-widest text-zinc-200 uppercase">{rule.ruleType}</span>
                    </div>
                    <div className="bg-black/50 p-3.5 rounded-xl border border-white/[0.05] shadow-inner">
                      <pre className="text-[11px] font-mono text-zinc-400 overflow-x-auto leading-relaxed">{rule.ruleConfig}</pre>
                    </div>
                  </div>
                  <div className="shrink-0">
                    <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 shadow-inner ${
                      rule.isActive
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-white/[0.04] text-zinc-500 border border-white/[0.07]'
                    }`}>
                      <span className={`w-1.5 h-1.5 rounded-full bg-current ${rule.isActive ? 'animate-pulse' : ''}`} />
                      {rule.isActive ? 'Enforced' : 'Disabled'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Route, ShieldCheck, Terminal, AlertTriangle, Scale } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const rules = await prisma.automationRule.findMany();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-50 to-zinc-500">Rules & Policy Engine</h1>
          <p className="text-sm font-medium text-zinc-400 mt-1">Configure systemic guardrails and flow-control patterns.</p>
        </div>
      </div>

      <div className="glass-panel p-6 md:p-8 rounded-3xl shadow-sm relative overflow-hidden group hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 z-10 border border-white/5">
        <div className="absolute right-0 top-0 p-4 opacity-50"><Scale className="w-48 h-48 text-indigo-500/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" /></div>
        
        <div className="relative z-10">
            <h2 className="text-xl font-bold mb-8 flex items-center gap-3 tracking-tight text-white">
               <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                  <ShieldCheck className="w-5 h-5" />
               </div>
               Active Guardrails
            </h2>
            
            {rules.length === 0 ? (
                <div className="text-center p-12 py-20 bg-black/40 rounded-2xl border border-dashed border-white/10 relative overflow-hidden group/empty">
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-indigo-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />
                    <div className="w-16 h-16 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-white/10 shadow-inner group-hover/empty:scale-110 transition-transform duration-500 relative z-10">
                       <Route className="w-8 h-8 text-zinc-500" />
                    </div>
                    <p className="text-zinc-300 font-bold font-mono text-sm tracking-widest relative z-10">NO_EXPLICIT_RULES</p>
                    <p className="text-zinc-500 text-sm mt-2 font-medium relative z-10">System is executing under default hardcoded boundaries.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {rules.map(rule => (
                        <div key={rule.id} className="p-6 border border-white/10 bg-black/40 rounded-2xl flex items-start lg:items-center justify-between gap-6 hover:border-indigo-500/30 transition-all shadow-inner group/rule opacity-90 hover:opacity-100">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-3">
                                  <Terminal className="w-4 h-4 text-indigo-400" />
                                  <span className="font-bold font-mono text-sm tracking-wide text-zinc-100">{rule.ruleType}</span>
                                </div>
                                <div className="bg-black/60 p-4 rounded-xl border border-white/5 shadow-inner grow">
                                   <pre className="text-xs font-mono text-zinc-400 overflow-x-auto leading-relaxed">{rule.ruleConfig}</pre>
                                </div>
                            </div>
                            <div className="shrink-0 pt-1 lg:pt-0">
                                <span className={`px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest flex items-center gap-2 shadow-sm ${
                                  rule.isActive ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' : 
                                  'bg-white/5 text-zinc-400 ring-1 ring-white/10'
                                }`}>
                                   <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></span>
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

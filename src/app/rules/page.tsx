import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Route, ShieldCheck, Terminal, AlertTriangle, Scale } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const rules = await prisma.automationRule.findMany();

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Rules & Policy Engine</h1>
          <p className="text-sm text-zinc-500 mt-1">Configure systemic guardrails and flow-control patterns.</p>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
        <div className="absolute right-0 top-0 p-4 opacity-50"><Scale className="w-48 h-48 text-indigo-500/5 rotate-12 group-hover:rotate-6 transition-transform duration-700" /></div>
        
        <div className="relative z-10">
            <h2 className="text-xl font-semibold mb-6 flex items-center gap-2">
               <ShieldCheck className="w-5 h-5 text-indigo-500" />
               Active Guardrails
            </h2>
            
            {rules.length === 0 ? (
                <div className="text-center p-12 py-16 bg-zinc-50 dark:bg-zinc-900/20 rounded-xl border border-dashed border-zinc-200 dark:border-zinc-800/60">
                    <div className="w-12 h-12 bg-zinc-100 dark:bg-zinc-800 rounded-lg flex items-center justify-center mx-auto mb-3">
                       <Route className="w-6 h-6 text-zinc-400" />
                    </div>
                    <p className="text-zinc-600 dark:text-zinc-400 font-medium font-mono text-sm">NO_EXPLICIT_RULES</p>
                    <p className="text-zinc-500 text-sm mt-1">System is executing under default hardcoded boundaries.</p>
                </div>
            ) : (
                <div className="space-y-4">
                    {rules.map(rule => (
                        <div key={rule.id} className="p-5 border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-[#09090b] rounded-xl flex items-start lg:items-center justify-between gap-6 hover:border-indigo-500/30 transition-colors shadow-sm">
                            <div className="flex-1">
                                <div className="flex items-center gap-3 mb-2">
                                  <Terminal className="w-4 h-4 text-zinc-400" />
                                  <span className="font-semibold font-mono text-sm text-zinc-900 dark:text-zinc-100">{rule.ruleType}</span>
                                </div>
                                <div className="bg-zinc-50 dark:bg-[#121214] p-3 rounded-lg border border-zinc-100 dark:border-zinc-800">
                                   <pre className="text-xs font-mono text-zinc-600 dark:text-zinc-400 overflow-x-auto">{rule.ruleConfig}</pre>
                                </div>
                            </div>
                            <div className="shrink-0 pt-1 lg:pt-0">
                                <span className={`px-3 py-1 rounded-full text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5 ${
                                  rule.isActive ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 ring-1 ring-green-600/20' : 
                                  'bg-zinc-100 text-zinc-500 dark:bg-zinc-800 dark:text-zinc-400 ring-1 ring-zinc-500/20'
                                }`}>
                                   <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
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

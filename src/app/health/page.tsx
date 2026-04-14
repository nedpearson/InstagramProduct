import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Activity, MailMinus, AlertCircle, RefreshCw, ShieldCheck, HeartPulse, HardDrive } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SystemHealthPage() {
  const watchdogs = await prisma.watchdogHeartbeat.findMany();
  const deadLetters = await prisma.deadLetterJob.count();
  const reviewTasks = await prisma.reviewTask.count({ where: { status: 'open' } });
  const integrations = await prisma.integrationHealth.findMany({
      include: { account: true }
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-sm">System Health</h1>
          <p className="text-sm font-bold tracking-wide text-zinc-400 mt-2 uppercase">Live telemetry and operational status of background services.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-sm rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-inner">
            <RefreshCw className="w-4 h-4 text-indigo-400" /> Refresh Telemetry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
        <div className="glass-panel border border-red-500/20 p-7 rounded-3xl relative overflow-hidden group hover:border-red-500/30 transition-all duration-300">
            <div className="absolute right-4 top-4 opacity-10"><MailMinus className="w-20 h-20 text-red-400" /></div>
            <div className="relative z-10 flex flex-col h-full">
               <h3 className="text-red-400 font-bold mb-4 flex items-center gap-3 tracking-wide text-sm"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Dead Letters</h3>
               <div className="text-4xl font-black text-white tracking-tighter">{deadLetters}</div>
               <p className="text-xs font-medium text-red-400/60 mt-2 mb-6">Jobs that exhausted all retry attempts.</p>
               <Link href="/inbox" className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-red-400 hover:text-red-300 transition-colors w-max group/link">
                  Triage in Inbox <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
               </Link>
            </div>
        </div>
        
        <div className="glass-panel border border-amber-500/20 p-7 rounded-3xl relative overflow-hidden group hover:border-amber-500/30 transition-all duration-300">
            <div className="absolute right-4 top-4 opacity-10"><AlertCircle className="w-20 h-20 text-amber-400" /></div>
            <div className="relative z-10 flex flex-col h-full">
               <h3 className="text-amber-400 font-bold mb-4 flex items-center gap-3 tracking-wide text-sm"><div className="w-2 h-2 rounded-full bg-amber-500" /> Open Review Tasks</h3>
               <div className="text-4xl font-black text-white tracking-tighter">{reviewTasks}</div>
               <p className="text-xs font-medium text-amber-400/60 mt-2 mb-6">Actions halted awaiting human override.</p>
               <Link href="/queue" className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-amber-400 hover:text-amber-300 transition-colors w-max group/link">
                  Process Queue <span className="group-hover/link:translate-x-1 transition-transform">&rarr;</span>
               </Link>
            </div>
        </div>

        <div className="glass-panel border border-emerald-500/20 p-7 rounded-3xl relative overflow-hidden group hover:border-emerald-500/30 transition-all duration-300">
            <div className="absolute right-4 top-4 opacity-10"><HeartPulse className="w-20 h-20 text-emerald-400" /></div>
            <div className="relative z-10 flex flex-col h-full">
               <h3 className="text-emerald-400 font-bold mb-4 flex items-center gap-3 tracking-wide text-sm"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> Watchdog Services</h3>
               <div className="text-4xl font-black text-white tracking-tighter">{watchdogs.length}</div>
               <p className="text-xs font-medium text-emerald-400/60 mt-2 mb-6">Background nodes currently checking in.</p>
               <span className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-emerald-400">
                  <ShieldCheck className="w-5 h-5 text-emerald-400" /> Systems Healthy
               </span>
            </div>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-500 relative z-10 border border-white/5">
        <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h3 className="font-bold text-xl flex items-center gap-3 tracking-tight text-white">
              <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                 <HardDrive className="w-5 h-5" />
              </div>
              Integration Health
            </h3>
        </div>
        <div className="p-0">
            {integrations.length === 0 ? (
                <div className="p-16 text-center group/int">
                  <div className="w-20 h-20 bg-white/5 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-white/10 shadow-inner group-hover/int:scale-110 transition-transform duration-500">
                    <AlertCircle className="w-10 h-10 text-zinc-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2">No integrations found</h3>
                  <p className="text-zinc-400 font-medium max-w-sm mx-auto">No integration health records tracked. Connect an account in settings.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-[#050505]/50 border-b border-white/5">
                            <tr>
                                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Provider</th>
                                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Account</th>
                                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Last Output</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-white/5 bg-transparent">
                            {integrations.map(int => (
                                <tr key={int.id} className="hover:bg-white/[0.02] transition-colors group">
                                    <td className="px-8 py-5">
                                      <span className="font-bold tracking-widest text-[10px] uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-3 py-1.5 rounded-md shadow-inner">
                                        {int.provider}
                                      </span>
                                    </td>
                                    <td className="px-8 py-5 font-bold text-zinc-100">{int.account.username}</td>
                                    <td className="px-8 py-5">
                                        <span className={`px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 w-max shadow-sm ${
                                            int.healthStatus === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 ring-1 ring-emerald-500/30' :
                                            int.healthStatus === 'degraded' ? 'bg-amber-500/10 text-amber-400 ring-1 ring-amber-500/30' :
                                            'bg-red-500/10 text-red-400 ring-1 ring-red-500/30'
                                        }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></span>
                                            {int.healthStatus}
                                        </span>
                                    </td>
                                    <td className="px-8 py-5 text-zinc-500 font-mono text-xs font-medium group-hover:text-zinc-300 transition-colors">
                                        {int.lastSuccessAt ? int.lastSuccessAt.toLocaleString() : 'Never'}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}

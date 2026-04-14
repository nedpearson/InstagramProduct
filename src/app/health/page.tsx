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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">System Health & Watchdog</h1>
          <p className="text-sm text-zinc-500 mt-1">Live telemetry and operational status of background services.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-4 py-2 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-800 text-sm font-medium rounded-lg shadow-sm transition flex items-center gap-2">
            <RefreshCw className="w-4 h-4" /> Refresh Telemetry
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-500/10 border border-red-200 dark:border-red-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-50"><MailMinus className="w-16 h-16 text-red-500/20 dark:text-red-500/10" /></div>
            <div className="relative z-10 flex flex-col h-full">
               <h3 className="text-red-800 dark:text-red-400 font-semibold mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" /> Dead Letters</h3>
               <div className="text-4xl font-bold text-red-900 dark:text-red-300 mt-1">{deadLetters}</div>
               <p className="text-xs text-red-700/80 dark:text-red-400/80 mt-2 mb-4">Jobs that exhausted all retry attempts.</p>
               <Link href="/inbox" className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-red-700 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition">
                  Triage in Inbox &rarr;
               </Link>
            </div>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-500/10 border border-amber-200 dark:border-amber-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-50"><AlertCircle className="w-16 h-16 text-amber-500/20 dark:text-amber-500/10" /></div>
            <div className="relative z-10 flex flex-col h-full">
               <h3 className="text-amber-800 dark:text-amber-400 font-semibold mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-amber-500" /> Open Review Tasks</h3>
               <div className="text-4xl font-bold text-amber-900 dark:text-amber-300 mt-1">{reviewTasks}</div>
               <p className="text-xs text-amber-700/80 dark:text-amber-400/80 mt-2 mb-4">Actions halted awaiting human override.</p>
               <Link href="/queue" className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-amber-700 dark:text-amber-400 hover:text-amber-900 dark:hover:text-amber-300 transition">
                  Process Queue &rarr;
               </Link>
            </div>
        </div>

        <div className="bg-green-50 dark:bg-green-500/10 border border-green-200 dark:border-green-500/20 p-6 rounded-2xl relative overflow-hidden group">
            <div className="absolute right-0 top-0 p-4 opacity-50"><HeartPulse className="w-16 h-16 text-green-500/20 dark:text-green-500/10" /></div>
            <div className="relative z-10 flex flex-col h-full">
               <h3 className="text-green-800 dark:text-green-400 font-semibold mb-2 flex items-center gap-2"><div className="w-2 h-2 rounded-full bg-green-500 animate-pulse" /> Watchdog Services</h3>
               <div className="text-4xl font-bold text-green-900 dark:text-green-300 mt-1">{watchdogs.length}</div>
               <p className="text-xs text-green-700/80 dark:text-green-400/80 mt-2 mb-4">Background nodes currently checking in.</p>
               <span className="mt-auto inline-flex items-center gap-1 text-sm font-medium text-green-700 dark:text-green-400">
                  <ShieldCheck className="w-4 h-4" /> Systems Healthy
               </span>
            </div>
        </div>
      </div>

      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
        <div className="p-5 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20 flex justify-between items-center">
            <h3 className="font-semibold text-lg flex items-center gap-2">
              <HardDrive className="w-5 h-5 text-indigo-500" />
              Integration Health
            </h3>
        </div>
        <div className="p-0">
            {integrations.length === 0 ? (
                <div className="p-12 text-center text-zinc-500">
                  <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800/60">
                    <AlertCircle className="w-8 h-8 text-zinc-400" />
                  </div>
                  <h3 className="text-lg font-medium text-zinc-900 dark:text-zinc-100 mb-1">No integrations found</h3>
                  <p className="text-sm">No integration health records tracked. Connect an account.</p>
                </div>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-zinc-50 dark:bg-zinc-900/50 border-b border-zinc-200 dark:border-zinc-800/60">
                            <tr>
                                <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-xs">Provider</th>
                                <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-xs">Account</th>
                                <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-xs">Status</th>
                                <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-xs">Last Output</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                            {integrations.map(int => (
                                <tr key={int.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition">
                                    <td className="px-6 py-4">
                                      <span className="font-semibold tracking-wider text-xs bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 px-2 py-1 rounded">
                                        {int.provider}
                                      </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-zinc-900 dark:text-zinc-100">{int.account.username}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[10px] font-semibold uppercase tracking-wider flex items-center gap-1.5 w-max ${
                                            int.healthStatus === 'healthy' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 ring-1 ring-green-600/20' :
                                            int.healthStatus === 'degraded' ? 'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-600/20' :
                                            'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 ring-1 ring-red-600/20'
                                        }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                                            {int.healthStatus}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-zinc-500 font-mono text-xs">
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

import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { MailMinus, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const deadLetters = await prisma.deadLetterJob.findMany({
    include: { job: true },
    orderBy: { lastFailedAt: 'desc' }
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Operations · Operator Inbox</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Operator Inbox</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Resolve and replay automation failures and system alerts.</p>
        </div>
      </div>

      <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden shadow-sm relative z-10 border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-300">

        {/* Header Block */}
        <div className="px-6 md:px-8 py-5 border-b border-white/[0.05] flex items-center gap-4 bg-red-500/[0.04]">
          <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-400 border border-red-500/20 shadow-inner shrink-0">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-tight">Dead Letter Queue</h2>
            <p className="text-[12px] text-red-400/60 font-medium mt-0.5">Jobs that exhausted their retry count or suffered a fatal crash.</p>
          </div>
        </div>

        {deadLetters.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center bg-transparent group/empty">
            <div className="w-16 h-16 bg-emerald-500/[0.08] rounded-2xl flex items-center justify-center mb-5 border border-emerald-500/15 shadow-inner group-hover/empty:scale-105 transition-transform duration-300 text-emerald-400">
              <CheckCircle2 className="w-7 h-7" />
            </div>
            <div className="ai-section-label mb-3">Inbox Status · Clear</div>
            <p className="text-xl font-black text-white mb-2">Inbox Zero</p>
            <p className="text-[13px] text-zinc-500 font-medium max-w-xs">No failed jobs require triage. System is operating nominally.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#050505]/50 border-b border-white/[0.05]">
                <tr>
                  <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Job Context</th>
                  <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase w-full">Diagnostics</th>
                  <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] bg-transparent">
                {deadLetters.map(dlq => (
                  <tr key={dlq.id} className="hover:bg-white/[0.02] transition-colors group">
                    <td className="px-7 py-5 align-top">
                      <span className="inline-flex font-bold text-[9px] uppercase tracking-[0.15em] text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-2.5 py-1.5 rounded-md shadow-inner mb-2.5">
                        {dlq.job.jobType}
                      </span>
                      <div className="text-[11px] font-medium text-zinc-600 flex items-center gap-2 mt-1">
                        <ShieldAlert className="w-3.5 h-3.5" />
                        Module: <span className="text-zinc-400">{dlq.sourceModule}</span>
                      </div>
                    </td>
                    <td className="px-7 py-5 whitespace-normal align-top">
                      <div className="bg-red-500/[0.05] border border-red-500/[0.12] rounded-xl p-4 group-hover:border-red-500/20 transition-all shadow-inner">
                        <p className="font-mono text-[11px] text-red-300/90 break-words leading-relaxed">{dlq.failureReason}</p>
                      </div>
                    </td>
                    <td className="px-7 py-5 align-top text-right">
                      <div className="flex justify-end gap-2">
                        <button className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.07] text-zinc-400 border border-white/[0.08] rounded-xl text-[11px] font-bold transition-all shadow-inner active:scale-95">
                          Mark Resolved
                        </button>
                        <button className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 hover:border-transparent rounded-xl text-[11px] font-bold transition-all active:scale-95">
                          <RotateCcw className="w-3 h-3" /> Replay
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

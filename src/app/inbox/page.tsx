import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';
import { MailMinus, ShieldAlert, CheckCircle2, RotateCcw, AlertTriangle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const deadLetters = await prisma.deadLetterJob.findMany({
      include: { job: true },
      orderBy: { lastFailedAt: 'desc' }
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-50 to-zinc-500">Operator Inbox</h1>
          <p className="text-sm font-medium text-zinc-400 mt-1">Resolve and replay automation failures and system alerts.</p>
        </div>
      </div>
      
      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-red-500/10 transition-all duration-500 relative z-10 border border-white/5">
        
        {/* Header Block */}
        <div className="px-6 md:px-8 py-6 border-b border-white/5 bg-gradient-to-r from-red-500/10 to-transparent flex items-center gap-5">
           <div className="w-12 h-12 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400 border border-red-500/30 shadow-[0_0_15px_rgba(239,68,68,0.2)]">
             <AlertTriangle className="w-6 h-6" />
           </div>
           <div>
              <h2 className="text-xl font-bold text-white tracking-tight leading-tight">Dead Letter Queue</h2>
              <p className="text-red-300/70 text-sm font-medium mt-0.5">Jobs that exhausted their retry count or suffered a fatal crash.</p>
           </div>
        </div>

        <div className="p-0">
          {deadLetters.length === 0 ? (
            <div className="p-20 text-center relative overflow-hidden group/empty bg-black/40">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-emerald-500/5 opacity-0 group-hover/empty:opacity-100 transition-opacity duration-1000" />
              <div className="w-20 h-20 bg-emerald-500/10 rounded-2xl flex items-center justify-center mx-auto mb-6 border border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.1)] group-hover/empty:scale-110 transition-transform duration-500 relative z-10">
                 <CheckCircle2 className="w-10 h-10 text-emerald-500" />
              </div>
              <p className="text-2xl font-bold text-white relative z-10">Inbox Zero</p>
              <p className="text-zinc-400 font-medium text-sm mt-2 max-w-sm mx-auto relative z-10">There are no failed jobs requiring triage. System is operating normally.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-[#050505]/50 border-b border-white/5">
                     <tr>
                        <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Job Context</th>
                        <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px] w-full">Diagnostics</th>
                        <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 bg-transparent">
                     {deadLetters.map(dlq => (
                        <tr key={dlq.id} className="hover:bg-white/[0.02] transition-colors group">
                           <td className="px-8 py-6 align-top">
                              <span className="inline-flex font-bold text-[10px] uppercase tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-3 py-1.5 rounded-md shadow-inner mb-3">
                                {dlq.job.jobType}
                              </span>
                              <div className="text-xs font-medium text-zinc-500 flex items-center gap-2 mt-1">
                                 <ShieldAlert className="w-4 h-4 text-zinc-600" /> Module: <span className="text-zinc-300">{dlq.sourceModule}</span>
                              </div>
                           </td>
                           <td className="px-8 py-6 whitespace-normal align-top">
                              <div className="bg-red-500/5 border border-red-500/10 rounded-xl p-4 group-hover:border-red-500/20 transition-all shadow-inner">
                                <p className="font-mono text-xs text-red-300/90 break-words leading-relaxed">{dlq.failureReason}</p>
                              </div>
                           </td>
                           <td className="px-8 py-6 align-top text-right">
                              <div className="flex justify-end gap-3 opacity-90 group-hover:opacity-100 transition-opacity">
                                  <button className="px-4 py-2 bg-white/5 hover:bg-white/10 text-zinc-300 border border-white/10 rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(255,255,255,0.02)] active:scale-95">Mark Resolved</button>
                                  <button className="flex items-center gap-2 px-4 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500 hover:text-white border border-indigo-500/20 hover:border-transparent rounded-xl text-xs font-bold transition-all shadow-[0_0_15px_rgba(79,70,229,0.1)] active:scale-95">
                                    <RotateCcw className="w-3.5 h-3.5" /> Replay
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
    </div>
  );
}

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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Operator Inbox</h1>
          <p className="text-sm text-zinc-500 mt-1">Resolve and replay automation failures and system alerts.</p>
        </div>
      </div>
      
      <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl overflow-hidden shadow-sm">
        
        {/* Header Block */}
        <div className="px-6 py-5 border-b border-zinc-100 dark:border-zinc-800/50 bg-red-50/50 dark:bg-red-500/5 flex items-center gap-4">
           <div className="w-10 h-10 rounded-xl bg-red-100 dark:bg-red-500/10 flex items-center justify-center text-red-600 dark:text-red-400 border border-red-200 dark:border-red-500/20 shadow-sm">
             <AlertTriangle className="w-5 h-5" />
           </div>
           <div>
              <h2 className="text-lg font-semibold text-zinc-900 dark:text-zinc-100 leading-tight">Dead Letter Queue</h2>
              <p className="text-zinc-500 text-sm">Jobs that exhausted their retry count or suffered a fatal crash.</p>
           </div>
        </div>

        <div className="p-0">
          {deadLetters.length === 0 ? (
            <div className="p-16 text-center">
              <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-full flex items-center justify-center mx-auto mb-4 border border-zinc-100 dark:border-zinc-800/60 shadow-sm">
                 <CheckCircle2 className="w-8 h-8 text-green-500" />
              </div>
              <p className="text-lg font-medium text-zinc-900 dark:text-zinc-100">Inbox Zero</p>
              <p className="text-zinc-500 text-sm mt-1 max-w-sm mx-auto">There are no failed jobs requiring triage. System is operating normally.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
               <table className="w-full text-left text-sm whitespace-nowrap">
                  <thead className="bg-zinc-50 dark:bg-[#09090b] border-b border-zinc-200 dark:border-zinc-800/60">
                     <tr>
                        <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-xs">Job Context</th>
                        <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-xs w-full">Diagnostics</th>
                        <th className="px-6 py-4 font-medium text-zinc-500 uppercase tracking-wider text-xs text-right">Actions</th>
                     </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800/60">
                     {deadLetters.map(dlq => (
                        <tr key={dlq.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/20 transition group">
                           <td className="px-6 py-4 align-top">
                              <span className="inline-flex font-semibold text-[10px] uppercase tracking-widest text-indigo-700 bg-indigo-50 dark:text-indigo-400 dark:bg-indigo-500/10 ring-1 ring-indigo-600/20 px-2 py-0.5 rounded-full mb-2">
                                {dlq.job.jobType}
                              </span>
                              <div className="text-xs text-zinc-500 flex items-center gap-1.5 mt-1">
                                 <ShieldAlert className="w-3.5 h-3.5" /> Module: {dlq.sourceModule}
                              </div>
                           </td>
                           <td className="px-6 py-4 whitespace-normal align-top">
                              <div className="bg-red-50/50 dark:bg-red-500/5 border border-red-100 dark:border-red-500/10 rounded-lg p-3 group-hover:border-red-200 dark:group-hover:border-red-500/30 transition">
                                <p className="font-mono text-xs text-red-700 dark:text-red-400 break-words leading-relaxed">{dlq.failureReason}</p>
                              </div>
                           </td>
                           <td className="px-6 py-4 align-top text-right">
                              <div className="flex justify-end gap-2">
                                  <button className="px-3 py-1.5 bg-zinc-50 dark:bg-zinc-900 hover:bg-zinc-100 dark:hover:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 rounded-md text-xs font-medium transition shadow-sm">Mark Resolved</button>
                                  <button className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600/10 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 hover:bg-indigo-600 hover:text-white dark:hover:bg-indigo-500 dark:hover:text-white rounded-md text-xs font-medium transition shadow-sm">
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

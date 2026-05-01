'use client';

import { ShieldAlert, RotateCcw } from 'lucide-react';
import { markResolved, replayJob } from './actions';
import { useTransition } from 'react';

export function InboxRow({ dlq }: { dlq: any }) {
  const [isPending, startTransition] = useTransition();

  const handleResolve = () => {
    startTransition(() => {
      markResolved(dlq.id, dlq.jobId);
    });
  };

  const handleReplay = () => {
    startTransition(() => {
      replayJob(dlq.id, dlq.jobId);
    });
  };

  return (
    <tr className="hover:bg-white/[0.02] transition-colors group">
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
          <button
            onClick={handleResolve}
            disabled={isPending}
            className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.07] text-zinc-400 border border-white/[0.08] rounded-xl text-[11px] font-bold transition-all shadow-inner active:scale-95 disabled:opacity-50"
          >
            {isPending ? 'Processing...' : 'Mark Resolved'}
          </button>
          <button
            onClick={handleReplay}
            disabled={isPending}
            className="flex items-center gap-1.5 px-3.5 py-2 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-600 hover:text-white border border-indigo-500/20 hover:border-transparent rounded-xl text-[11px] font-bold transition-all active:scale-95 disabled:opacity-50"
          >
            <RotateCcw className={`w-3 h-3 ${isPending ? 'animate-spin' : ''}`} /> Replay
          </button>
        </div>
      </td>
    </tr>
  );
}

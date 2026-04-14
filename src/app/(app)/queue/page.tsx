import { prisma } from '@/lib/prisma';
import { processReviewTaskAction } from '@/app/(app)/actions';
import { AlertCircle, Check, X, FileText, Clock, MessageSquare } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  const [reviews, totalClosed] = await Promise.all([
    prisma.reviewTask.findMany({
      where: { status: 'open' },
      orderBy: { createdAt: 'asc' },
    }),
    prisma.reviewTask.count({ where: { status: { in: ['approved', 'rejected', 'resolved'] } } }),
  ]);

  const onSubmitForm = async (formData: FormData) => {
    'use server';
    const reviewId = formData.get('reviewId') as string;
    const action = formData.get('action') as 'approve' | 'reject';
    if (reviewId && action) {
      await processReviewTaskAction(reviewId, action);
    }
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" /><div className="mesh-bg-2" /><div className="mesh-bg-3" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Operations · Review Queue</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Review Queue</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Items requiring manual operator approval or rejection.</p>
        </div>
        <div className="flex items-center gap-3">
          {reviews.length > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-amber-500/[0.08] border border-amber-500/20 rounded-xl">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span className="text-[12px] font-bold text-amber-400 tabular-nums">{reviews.length} pending</span>
            </div>
          )}
          {totalClosed > 0 && (
            <div className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-[12px] font-bold text-zinc-400 tabular-nums">{totalClosed} resolved</span>
            </div>
          )}
        </div>
      </div>

      <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden shadow-sm transition-colors duration-300 relative z-10 border border-white/[0.05] hover:border-white/[0.09]">
        {reviews.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center">
            <div className="w-16 h-16 bg-emerald-500/[0.08] rounded-2xl flex items-center justify-center mb-5 ring-[6px] ring-emerald-500/[0.05] shadow-inner text-emerald-400 border border-emerald-500/15">
              <Check className="w-7 h-7" />
            </div>
            <div className="ai-section-label mb-3">Queue Status · Clear</div>
            <h3 className="text-xl font-black text-white mb-2">All tasks completed</h3>
            <p className="text-sm text-zinc-500 font-medium max-w-xs">No tasks pending. Neural automation is running smoothly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-[#050505]/50 border-b border-white/[0.05]">
                <tr>
                  <th className="px-7 py-4 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase">Target Entity</th>
                  <th className="px-7 py-4 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase w-full">Reason / Details</th>
                  <th className="px-7 py-4 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase">Age</th>
                  <th className="px-7 py-4 text-[9px] font-black text-zinc-600 tracking-[0.15em] uppercase text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] bg-transparent">
                {reviews.map(review => {
                  const ageMs = Date.now() - review.createdAt.getTime();
                  const ageHrs = Math.floor(ageMs / (1000 * 60 * 60));
                  const ageDays = Math.floor(ageHrs / 24);
                  const ageLabel = ageDays > 0 ? `${ageDays}d ago` : ageHrs > 0 ? `${ageHrs}h ago` : 'Just now';

                  return (
                    <tr key={review.id} className="group hover:bg-white/[0.02] transition-colors">
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shadow-inner border border-amber-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0">
                            <FileText className="w-5 h-5" />
                          </div>
                          <div>
                            <span className="font-bold text-white uppercase tracking-widest text-[10px] bg-white/[0.05] px-2 py-1 rounded-md border border-white/[0.08]">
                              {review.entityType}
                            </span>
                            <p className="text-[10px] font-mono text-zinc-600 mt-1.5 max-w-[120px] truncate">{review.entityId.slice(0, 12)}…</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-8 py-5 whitespace-normal">
                        <div className="flex items-start gap-3">
                          <div className="mt-0.5 w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-inner">
                            <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
                          </div>
                          <span className="text-[13px] text-zinc-300 font-medium line-clamp-2 leading-relaxed max-w-xl">{review.reason}</span>
                        </div>
                      </td>
                      <td className="px-8 py-5">
                        <div className="flex items-center gap-1.5 text-[11px] font-semibold text-zinc-600">
                          <Clock className="w-3 h-3" />
                          {ageLabel}
                        </div>
                      </td>
                      <td className="px-8 py-5 text-right">
                        <form action={onSubmitForm} className="flex gap-2 justify-end items-center">
                          <input type="hidden" name="reviewId" value={review.id} />
                          <button
                            name="action"
                            value="reject"
                            className="p-2.5 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-xl border border-transparent hover:border-red-500/25 outline-none active:scale-95"
                            title="Reject"
                          >
                            <X className="w-4 h-4" />
                          </button>
                          <button
                            name="action"
                            value="approve"
                            className="flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
                          >
                            <Check className="w-3.5 h-3.5" /> Approve
                          </button>
                        </form>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import { processReviewTaskAction } from '@/app/(app)/actions';
import { AlertCircle, Check, X, FileText, Activity } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function QueuePage() {
  const reviews = await prisma.reviewTask.findMany({
    where: { status: 'open' },
    orderBy: { createdAt: 'asc' },
  });

  // Wrapper for Server Actions within Map
  const onSubmitForm = async (formData: FormData) => {
    'use server';
    const reviewId = formData.get('reviewId') as string;
    const action = formData.get('action') as 'approve' | 'reject';
    if(reviewId && action) {
       await processReviewTaskAction(reviewId, action);
    }
  };

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Operations · Review Queue</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Review Queue</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Items requiring manual operator approval or rejection.</p>
        </div>
      </div>

      <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden shadow-sm transition-colors duration-300 relative z-10 border border-white/[0.05] hover:border-white/[0.09]">
        {reviews.length === 0 ? (
          <div className="py-20 text-center flex flex-col items-center relative overflow-hidden group/empty bg-transparent">
            <div className="w-16 h-16 bg-emerald-500/[0.08] rounded-2xl flex items-center justify-center mb-5 ring-[6px] ring-emerald-500/[0.05] group-hover/empty:scale-105 transition-transform duration-300 shadow-inner text-emerald-400 border border-emerald-500/15">
               <Check className="w-7 h-7" />
            </div>
            <div className="ai-section-label mb-3">Queue Status · Clear</div>
            <h3 className="text-xl font-black text-white mb-2">All tasks completed</h3>
            <p className="text-sm text-zinc-500 font-medium max-w-xs">No tasks pending. Neural automation is running smoothly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#050505]/50 border-b border-white/5">
                   <tr>
                     <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Target Entity</th>
                     <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase w-full">Reason / Details</th>
                     <th className="px-7 py-4 font-bold text-zinc-600 text-right text-[9px] tracking-[0.15em] uppercase">Review Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-white/5 bg-transparent">
                   {reviews.map(review => (
                     <tr key={review.id} className="group hover:bg-white/[0.02] transition-colors">
                       <td className="px-8 py-6">
                         <div className="flex items-center gap-5">
                           <div className="w-12 h-12 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-400 shadow-inner border border-orange-500/20 group-hover:scale-105 transition-transform duration-300 shrink-0 group-hover:bg-orange-500/20">
                             <FileText className="w-6 h-6" />
                           </div>
                           <div>
                             <p className="font-bold text-white uppercase tracking-widest text-[11px] group-hover:text-orange-400 transition-colors bg-white/5 px-2 py-1 rounded-md border border-white/10 w-fit">{review.entityType}</p>
                             <p className="text-xs font-mono font-medium text-zinc-500 mt-2">{review.entityId}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-8 py-6 whitespace-normal">
                         <div className="flex items-start gap-4">
                            <div className="mt-0.5 w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-500/20 shadow-inner">
                               <AlertCircle className="w-4 h-4 text-amber-400" />
                            </div>
                            <span className="text-zinc-300 font-medium line-clamp-2 leading-relaxed max-w-xl">
                               {review.reason}
                            </span>
                         </div>
                       </td>
                       <td className="px-8 py-6 text-right">
                         <form action={onSubmitForm} className="flex gap-3 justify-end items-center">
                           <input type="hidden" name="reviewId" value={review.id} />
                           <button name="action" value="reject" className="p-3 text-zinc-500 hover:bg-red-500/10 hover:text-red-400 transition-all rounded-xl border border-transparent hover:border-red-500/30 outline-none flex-shrink-0 active:scale-95 shadow-sm">
                             <X className="w-5 h-5" />
                           </button>
                           <button name="action" value="approve" className="flex items-center gap-2 px-6 py-3 bg-white text-black hover:shadow-lg font-black rounded-xl hover:bg-zinc-200 transition-all shadow-md active:scale-95 flex-shrink-0">
                             <Check className="w-5 h-5 flex-shrink-0" />
                             Approve
                           </button>
                         </form>
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

import { prisma } from '@/lib/prisma';
import { processReviewTaskAction } from '../actions';
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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white drop-shadow-sm">Review Queue</h1>
          <p className="text-sm font-bold tracking-wide text-zinc-400 mt-2 uppercase">Items requiring manual operator approval or rejection.</p>
        </div>
      </div>

      <div className="glass-panel rounded-3xl overflow-hidden shadow-sm transition-colors duration-300 relative z-10 border border-white/5 hover:border-white/10">
        {reviews.length === 0 ? (
          <div className="p-20 text-center flex flex-col items-center relative overflow-hidden group/empty bg-black/40">
            <div className="absolute inset-0 bg-gradient-to-b from-emerald-500/10 via-transparent to-transparent opacity-0 group-hover/empty:opacity-100 transition-opacity duration-500" />
            <div className="w-20 h-20 bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-[8px] ring-emerald-500/5 group-hover/empty:scale-105 transition-transform duration-300 shadow-inner text-emerald-400 border border-emerald-500/20">
               <Check className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-black text-white mb-2">All tasks completed</h3>
            <p className="text-sm text-zinc-400 font-medium max-w-sm">There are no operational tasks waiting for your review. Automation is running smoothly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#050505]/50 border-b border-white/5">
                   <tr>
                     <th className="px-8 py-5 font-bold text-zinc-500 text-[10px] tracking-widest uppercase">Target Entity</th>
                     <th className="px-8 py-5 font-bold text-zinc-500 text-[10px] tracking-widest uppercase w-full">Reason / Details</th>
                     <th className="px-8 py-5 font-bold text-zinc-500 text-right text-[10px] tracking-widest uppercase">Review Action</th>
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

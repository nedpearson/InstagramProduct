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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">Review Queue</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1 dark:text-zinc-400">Items requiring manual operator approval or rejection.</p>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5 rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-500 relative z-10">
        {reviews.length === 0 ? (
          <div className="p-16 text-center flex flex-col items-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="w-20 h-20 bg-emerald-50 dark:bg-emerald-500/10 rounded-full flex items-center justify-center mb-6 ring-8 ring-emerald-50/50 dark:ring-emerald-500/5 transition-all duration-500 group-hover:scale-110">
               <Check className="w-10 h-10 text-emerald-500 dark:text-emerald-400" />
            </div>
            <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">All tasks completed</h3>
            <p className="text-zinc-500 dark:text-zinc-400 font-medium max-w-sm">There are no operational tasks waiting for your review. Automation is running smoothly.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
             <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-zinc-50/50 dark:bg-zinc-900/50 border-b border-zinc-200/80 dark:border-white/5">
                   <tr>
                     <th className="px-6 py-4 font-semibold text-zinc-500 text-[10px] tracking-wider uppercase">Target Entity</th>
                     <th className="px-6 py-4 font-semibold text-zinc-500 text-[10px] tracking-wider uppercase w-full">Reason / Details</th>
                     <th className="px-6 py-4 font-semibold text-zinc-500 text-right text-[10px] tracking-wider uppercase">Review Action</th>
                   </tr>
                </thead>
                <tbody className="divide-y divide-zinc-200/50 dark:divide-white/5 bg-transparent">
                   {reviews.map(review => (
                     <tr key={review.id} className="group hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors">
                       <td className="px-6 py-5">
                         <div className="flex items-center gap-4">
                           <div className="w-10 h-10 rounded-xl bg-orange-50/80 dark:bg-orange-500/10 flex items-center justify-center text-orange-600 dark:text-orange-400 shadow-inner group-hover:scale-105 transition-transform duration-300 shrink-0">
                             <FileText className="w-5 h-5" />
                           </div>
                           <div>
                             <p className="font-bold text-zinc-900 dark:text-zinc-100 uppercase tracking-widest text-[11px] group-hover:text-orange-600 dark:group-hover:text-orange-400 transition-colors">{review.entityType}</p>
                             <p className="text-xs font-mono font-medium text-zinc-500 mt-1">{review.entityId}</p>
                           </div>
                         </div>
                       </td>
                       <td className="px-6 py-5 whitespace-normal">
                         <div className="flex items-start gap-3">
                            <div className="mt-0.5 w-6 h-6 rounded bg-amber-50 dark:bg-amber-500/10 flex items-center justify-center shrink-0 border border-amber-200/50 dark:border-amber-500/20">
                               <AlertCircle className="w-3.5 h-3.5 text-amber-600 dark:text-amber-400" />
                            </div>
                            <span className="text-zinc-600 dark:text-zinc-300 font-medium line-clamp-2 leading-relaxed">
                               {review.reason}
                            </span>
                         </div>
                       </td>
                       <td className="px-6 py-5 text-right">
                         <form action={onSubmitForm} className="flex gap-2 justify-end">
                           <input type="hidden" name="reviewId" value={review.id} />
                           <button name="action" value="reject" className="p-2.5 text-zinc-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-500/10 dark:hover:text-red-400 transition-colors rounded-xl border border-transparent hover:border-red-200 dark:hover:border-red-500/30 outline-none focus:ring-2 focus:ring-red-500/50 flex-shrink-0">
                             <X className="w-5 h-5" />
                           </button>
                           <button name="action" value="approve" className="flex items-center gap-2 px-5 py-2.5 bg-zinc-900 dark:bg-white text-white dark:text-zinc-900 font-bold rounded-xl hover:bg-zinc-800 dark:hover:bg-zinc-200 transition-all shadow-md active:scale-95 flex-shrink-0">
                             <Check className="w-4 h-4" />
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

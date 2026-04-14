import { generateBriefAction, createBriefAction } from '@/app/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FileText, Plus, Target, Sparkles, MessageSquare, Briefcase, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
  const briefs = await prisma.productBrief.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">Product Briefs</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1 dark:text-zinc-400">Configure foundational strategy and targets for AI generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium text-sm rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10 transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02] active:scale-95">
            <Plus className="w-4 h-4" /> New Brief
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {briefs.map((brief) => (
          <div key={brief.id} className="group bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5 p-6 rounded-3xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 flex flex-col justify-between relative overflow-hidden hover:-translate-y-1">
            
            {/* Soft decorative gradient */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            <div>
              <div className="flex justify-between items-start mb-6 relative z-10">
                <div className="flex items-start gap-4">
                   <div className="w-12 h-12 rounded-xl bg-white dark:bg-[#121214] flex items-center justify-center border border-zinc-200 dark:border-white/10 text-indigo-600 dark:text-indigo-400 shadow-sm shrink-0 group-hover:scale-105 transition-transform duration-500">
                     <FileText className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-lg text-zinc-900 dark:text-zinc-100 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{brief.product.name}</h3>
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold mt-2 tracking-widest uppercase ${
                       brief.status === 'active' 
                        ? 'bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-600/20 backdrop-blur-sm' 
                        : 'bg-zinc-100/80 text-zinc-700 dark:bg-white/5 dark:text-zinc-400 ring-1 ring-zinc-500/20 backdrop-blur-sm'
                     }`}>
                       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                       {brief.status}
                     </span>
                   </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-6 relative z-10">
                <div className="flex items-start gap-3 text-sm">
                   <div className="w-6 h-6 rounded bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-white/5 flex items-center justify-center shrink-0">
                     <Target className="w-3.5 h-3.5 text-zinc-500 dark:text-zinc-400" />
                   </div>
                   <span className="text-zinc-600 dark:text-zinc-400 font-medium line-clamp-2 leading-relaxed pt-0.5">{brief.targetAudience}</span>
                </div>
                <div className="flex items-start gap-3 text-sm">
                   <div className="w-6 h-6 rounded bg-indigo-50 dark:bg-indigo-500/10 border border-indigo-200 dark:border-indigo-500/20 flex items-center justify-center shrink-0">
                     <MessageSquare className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
                   </div>
                   <div className="flex flex-wrap gap-1 pt-0.5">
                      <span className="bg-white dark:bg-[#09090b] text-indigo-700 dark:text-indigo-400 text-xs font-bold tracking-tight px-2 py-r.5 rounded-md border border-zinc-200 dark:border-zinc-800 shadow-sm">{brief.ctaKeyword}</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-3 relative z-10 pt-4 border-t border-zinc-100 dark:border-zinc-800/60 mt-auto">
              <button className="flex-1 py-2.5 bg-white/50 dark:bg-white/5 hover:bg-white dark:hover:bg-white/10 text-sm font-semibold rounded-xl transition-colors border border-zinc-200/80 dark:border-white/5 text-zinc-700 dark:text-zinc-300">
                Edit Strategy
              </button>
              <form action={generateBriefAction.bind(null, brief.id)} className="flex-1">
                <button type="submit" className="w-full flex items-center justify-center gap-2 py-2.5 bg-zinc-900 dark:bg-white hover:bg-zinc-800 dark:hover:bg-zinc-200 text-white dark:text-zinc-900 text-sm font-bold rounded-xl transition-all shadow-md group border border-transparent">
                  <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                  Generate
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      
      {briefs.length === 0 && (
         <div className="col-span-full py-24 px-6 bg-white/40 dark:bg-[#121214]/40 backdrop-blur-xl border border-zinc-200 border-dashed dark:border-zinc-700/50 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800 rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-sm">
               <Briefcase className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">No briefs configured</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 font-medium">Define your first target persona and product brief to kick off the asset generation pipeline.</p>
            <form action={createBriefAction.bind(null, 'DEMO_PRODUCT_ID_NEEDS_REPLACEMENT')} className="relative z-10">
               <button type="submit" className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-xl font-medium shadow-lg shadow-black/10 transition-all duration-300 flex items-center gap-2 hover:scale-105 active:scale-95">
                  <Plus className="w-4 h-4" /> Create First Brief
               </button>
            </form>
         </div>
      )}
    </div>
  );
}

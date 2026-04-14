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
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 drop-shadow-sm">Product Briefs</h1>
          <p className="text-sm font-bold tracking-wide text-zinc-400 mt-2 uppercase">Configure foundational strategy and targets for AI generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white text-black font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02] active:scale-95">
            <Plus className="w-5 h-5 flex-shrink-0" /> New Brief
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {briefs.map((brief) => (
          <div key={brief.id} className="group glass-panel border border-white/5 p-6 md:p-8 rounded-3xl shadow-sm hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] transition-all duration-500 flex flex-col justify-between relative overflow-hidden hover:-translate-y-1">
            
            {/* Soft decorative gradient */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none group-hover:scale-150" />

            <div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-start gap-4">
                   <div className="w-14 h-14 rounded-2xl bg-[#050505] flex items-center justify-center border border-white/10 text-indigo-400 shadow-inner shrink-0 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                     <FileText className="w-7 h-7" />
                   </div>
                   <div>
                     <h3 className="font-bold text-xl text-white leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-sm">{brief.product.name}</h3>
                     <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold mt-3 tracking-widest uppercase shadow-inner border w-max block ${
                       brief.status === 'active' 
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                        : 'bg-white/5 text-zinc-400 border-white/10'
                     }`}>
                       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                       {brief.status}
                     </span>
                   </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex items-start gap-4 text-sm">
                   <div className="w-8 h-8 rounded-xl bg-black/40 border border-white/5 flex items-center justify-center shrink-0 shadow-inner">
                     <Target className="w-4 h-4 text-zinc-400" />
                   </div>
                   <span className="text-zinc-300 font-medium line-clamp-2 leading-relaxed pt-1.5">{brief.targetAudience}</span>
                </div>
                <div className="flex items-start gap-4 text-sm">
                   <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                     <MessageSquare className="w-4 h-4 text-indigo-400" />
                   </div>
                   <div className="flex flex-wrap gap-2 pt-1.5">
                      <span className="bg-black/50 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md border border-white/5 shadow-inner">{brief.ctaKeyword}</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10 pt-6 border-t border-white/5 mt-auto">
              <button className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-sm font-bold rounded-xl transition-colors border border-white/10 text-zinc-300 shadow-inner">
                Edit Strategy
              </button>
              <form action={generateBriefAction.bind(null, brief.id)} className="flex-1">
                <button type="submit" className="w-full h-full flex items-center justify-center gap-2 px-4 bg-white hover:bg-zinc-200 text-black text-sm font-black rounded-xl transition-all shadow-[0_0_15px_rgba(255,255,255,0.2)] group hover:shadow-[0_0_20px_rgba(255,255,255,0.3)]">
                  <Sparkles className="w-4 h-4 text-indigo-600 group-hover:scale-110 group-hover:rotate-12 transition-transform" />
                  Generate
                </button>
              </form>
            </div>
          </div>
        ))}
      </div>
      
      {briefs.length === 0 && (
         <div className="col-span-full py-32 px-8 glass-panel border border-white/10 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl" />
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-inner relative z-10 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <Briefcase className="w-10 h-10 text-zinc-500 group-hover:text-white transition-colors relative z-10" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-white mb-3">No briefs configured</h3>
            <p className="text-zinc-400 max-w-md mb-10 font-medium">Define your first target persona and product brief to kick off the asset generation pipeline.</p>
            <form action={createBriefAction.bind(null, 'DEMO_PRODUCT_ID_NEEDS_REPLACEMENT')} className="relative z-10">
               <button type="submit" className="px-8 py-4 bg-white text-black rounded-2xl font-black shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-3 relative z-10 hover:scale-105 active:scale-95">
                  <Plus className="w-5 h-5 flex-shrink-0" /> Create First Brief
               </button>
            </form>
         </div>
      )}
    </div>
  );
}

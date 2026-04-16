import { generateBriefAction, createBriefAction } from '@/app/(app)/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { FileText, Plus, Target, Sparkles, MessageSquare, Briefcase, Layers, TrendingUp } from 'lucide-react';
import { BlueprintModal } from '@/components/BlueprintModal';
import { CompareModal } from '@/components/CompareModal';

export const dynamic = 'force-dynamic';

export default async function BriefsPage({ searchParams }: { searchParams: Promise<{ edit?: string, compare?: string }> }) {
  const briefs = await prisma.productBrief.findMany({
    include: { 
      product: true, 
      competitors: { orderBy: { threatScore: 'desc' }},
      agentActivities: { orderBy: { createdAt: 'desc' }, take: 15 },
      intelligenceAlerts: { orderBy: { createdAt: 'desc' } },
      executionPlans: true,
      historicalSnapshots: { orderBy: { createdAt: 'desc' } }
    },
    orderBy: { createdAt: 'desc' },
  });

  const { edit, compare } = await searchParams;
  const editingBrief = edit ? briefs.find(b => b.id === edit) : null;
  const isComparing = compare === 'true';

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Workspace · Briefs</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Product Briefs</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Configure foundational strategy and targets for AI generation.</p>
        </div>
        <div className="flex items-center gap-3">
          <Link href="?compare=true" scroll={false} className="px-5 py-2.5 bg-black hover:bg-white/5 border border-white/10 text-zinc-300 font-bold text-[13px] rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95">
            <Layers className="w-3.5 h-3.5 flex-shrink-0" /> Compare Strategies
          </Link>
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 active:scale-95">
            <Plus className="w-3.5 h-3.5 flex-shrink-0" /> New Brief
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {briefs.map((brief) => {
          const hasBlueprint = !!brief.blueprintData;
          const bgData = hasBlueprint ? JSON.parse(brief.blueprintData!) : null;
          const oppScore = hasBlueprint && bgData.opportunityScore 
            ? bgData.opportunityScore 
            : (hasBlueprint && bgData.opportunityIntelligence?.scores?.composite ? bgData.opportunityIntelligence.scores.composite : '--');
          
          return (
          <div key={brief.id} className="group glass-panel-ai border border-white/[0.05] p-6 rounded-2xl shadow-sm hover:border-indigo-500/20 transition-all duration-300 flex flex-col justify-between relative overflow-hidden hover:-translate-y-px ai-scan-panel">

            <div>
              <div className="flex justify-between items-start mb-8 relative z-10">
                <div className="flex items-start gap-4">
                   <div className={`w-12 h-12 rounded-xl flex items-center justify-center border shadow-inner shrink-0 group-hover:scale-105 transition-transform duration-300 ${hasBlueprint ? 'bg-indigo-500/10 border-indigo-500/20 text-indigo-400' : 'bg-white/5 border-white/10 text-white/50'}`}>
                     <TrendingUp className="w-6 h-6" />
                   </div>
                   <div>
                     <h3 className="font-bold text-xl text-white leading-tight group-hover:text-indigo-400 transition-colors drop-shadow-sm">{brief.product.name}</h3>
                      <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold mt-3 tracking-widest uppercase shadow-inner border ${
                        brief.status === 'active' 
                         ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                         : 'bg-white/[0.05] text-zinc-400 border-white/[0.08]'
                      }`}>
                       <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                       {brief.status}
                     </span>
                   </div>
                </div>
              </div>
              
              <div className="space-y-4 mb-8 relative z-10">
                <div className="flex items-center justify-between text-sm bg-black/40 p-3 rounded-xl border border-white/5">
                   <div className="flex items-center gap-3">
                     <Target className="w-4 h-4 text-zinc-400" />
                     <span className="text-zinc-300 font-medium">Opp Score</span>
                   </div>
                   <div className={`font-black text-lg ${hasBlueprint ? 'text-indigo-400' : 'text-zinc-500'}`}>
                     {oppScore}
                   </div>
                </div>
                <div className="flex items-start gap-4 text-sm mt-4">
                   <div className="w-8 h-8 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0 shadow-inner">
                     <MessageSquare className="w-4 h-4 text-indigo-400" />
                   </div>
                   <div className="flex flex-wrap gap-2 pt-1.5">
                      <span className="bg-black/50 text-indigo-400 text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-md border border-white/5 shadow-inner">{brief.ctaKeyword || 'CTA'}</span>
                   </div>
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 relative z-10 pt-6 border-t border-white/5 mt-auto">
              {brief.status === 'processing' ? (
                <div className="flex-1 py-3 bg-fuchsia-500/10 text-fuchsia-400 text-[13px] font-bold rounded-xl border border-fuchsia-500/20 text-center flex items-center justify-center gap-2">
                  <div className="w-4 h-4 rounded-full border-2 border-fuchsia-500 border-t-transparent animate-spin"></div>
                  Agents running...
                </div>
              ) : (
                <Link href={`?edit=${brief.id}`} scroll={false} className="flex-1 py-3 bg-white/5 hover:bg-white/10 text-[13px] font-bold rounded-xl transition-colors border border-white/10 text-zinc-300 shadow-inner text-center block focus:outline-none flex items-center justify-center">
                  {hasBlueprint ? 'View 10k Blueprint' : 'View Blueprint'}
                </Link>
              )}
            </div>
          </div>
        )})}
      </div>
      
      {briefs.length === 0 && (
         <div className="col-span-full py-20 px-8 glass-panel-ai ai-scan-panel border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center justify-center text-center group relative overflow-hidden">
            <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-5 border border-white/[0.07] group-hover:scale-105 transition-transform duration-300 shadow-inner">
               <Briefcase className="w-7 h-7 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="ai-section-label mb-3">Product Briefs · Empty</div>
            <h3 className="text-xl font-black tracking-tight text-white mb-2">No briefs configured</h3>
            <p className="text-[13px] text-zinc-500 max-w-sm mb-7 font-medium leading-relaxed">Define your first target persona and product brief to kick off the asset generation pipeline.</p>
            <button className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[13px] shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2 active:scale-95">
               <Plus className="w-4 h-4" /> Create First Brief
            </button>
         </div>
      )}

      {/* Blueprint Modal Overlay */}
      {editingBrief && <BlueprintModal brief={editingBrief} />}

      {/* Compare Modal Overlay */}
      {isComparing && <CompareModal briefs={briefs} />}
    </div>
  );
}


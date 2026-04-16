import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, View, MapPin } from 'lucide-react';
import { ScheduleModal } from '@/components/ScheduleModal';
import { CalendarViewToggle } from '@/components/CalendarViewToggle';
import { AutoScheduleQueueButton } from '@/components/AutoScheduleQueueButton';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const assets = await prisma.contentAsset.findMany({
    where: { status: 'approved' },
    select: {
      id: true, title: true, assetType: true,
      variants: { select: { id: true, variantTag: true } }
    }
  });

  const schedules = await prisma.schedule.findMany({
    include: { variant: { include: { asset: true } } },
    orderBy: { scheduledFor: 'asc' },
    take: 50
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out flex flex-col h-[calc(100vh-4rem)]">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Workspace · Calendar</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Content Calendar</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Timeline and scheduling engine for all automation posts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center glass-panel rounded-xl p-1 shadow-sm">
             <button className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"><ChevronLeft className="w-4 h-4" /></button>
             <span className="px-4 text-sm font-bold text-zinc-100">This Week</span>
             <button className="p-2 text-zinc-400 hover:text-white transition-colors rounded-lg hover:bg-white/5"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <AutoScheduleQueueButton />
          <ScheduleModal assets={assets} />
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 relative z-10">
        
        {/* Timeline OR Calendar View */}
        <div className="flex-1 lg:w-2/3 glass-panel-ai ai-scan-panel rounded-2xl shadow-sm flex flex-col overflow-hidden border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-300">
           <CalendarViewToggle schedules={schedules} />
        </div>
        
        {/* Unscheduled Queue */}
        <div className="flex-1 lg:w-1/3 glass-panel-ai border border-white/[0.05] rounded-2xl shadow-inner flex flex-col overflow-hidden relative">

          <div className="p-5 md:p-6 border-b border-white/5 relative z-10 flex justify-between items-center bg-white/[0.01]">
            <h2 className="text-sm font-bold flex items-center gap-2 text-zinc-100 tracking-wide uppercase">Approved Queue</h2>
            <span className="px-2.5 py-1 bg-white/5 border border-white/10 rounded-md font-mono font-bold text-[10px] text-zinc-400 tracking-widest">{assets.length} Items</span>
          </div>
          <div className="flex-1 overflow-y-auto p-5 md:p-6 space-y-4 relative z-10 scrollbar-hide">
             {assets.map(asset => (
                <div key={asset.id} className="p-4 bg-white/5 border border-white/10 rounded-2xl shadow-inner hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] hover:border-white/20 hover:-translate-y-1 cursor-grab transition-all duration-300 group">
                   <div className="flex items-start justify-between mb-3 gap-3">
                     <p className="font-bold text-sm leading-snug group-hover:text-indigo-400 transition-colors text-zinc-200 line-clamp-2">{asset.title}</p>
                     <div className="w-2 h-2 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5 shadow-[0_0_8px_rgba(16,185,129,0.5)]" />
                   </div>
                   <div className="flex justify-between items-center pt-3 border-t border-white/5">
                     <span className="text-[10px] uppercase tracking-widest font-bold text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">{asset.assetType.replace('_',' ')}</span>
                     <span className="text-[10px] text-zinc-500 font-mono font-bold">{asset.variants.length} var</span>
                   </div>
                </div>
             ))}
             {assets.length === 0 && (
                <div className="h-full flex flex-col items-center justify-center opacity-50">
                  <p className="text-xs font-bold text-center text-zinc-500 uppercase tracking-widest">Queue Empty</p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

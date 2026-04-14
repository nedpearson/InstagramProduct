import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Calendar as CalendarIcon, Clock, ChevronLeft, ChevronRight, View, Plus, MapPin } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const assets = await prisma.contentAsset.findMany({
    where: { status: 'approved' },
    select: { id: true, title: true, assetType: true, variants: true }
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
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95">
            <Plus className="w-3.5 h-3.5" /> Schedule Content
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0 relative z-10">
        
        {/* Timeline View */}
        <div className="flex-1 lg:w-2/3 glass-panel-ai ai-scan-panel rounded-2xl shadow-sm flex flex-col overflow-hidden border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-300">
          <div className="p-5 md:p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center">
            <h2 className="text-sm font-bold flex items-center gap-3 tracking-wide text-zinc-100">
              <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
                 <CalendarIcon className="w-4 h-4" />
              </div>
              Upcoming Schedule
            </h2>
            <button className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-white/5"><View className="w-3.5 h-3.5" /> List View</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide">
            {schedules.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center group/empty">
                <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center mx-auto mb-5 border border-white/[0.07] shadow-inner group-hover/empty:scale-105 transition-transform duration-300">
                  <MapPin className="w-7 h-7 text-zinc-600" />
                </div>
                <div className="ai-section-label mb-3">Timeline · Empty</div>
                <p className="text-[15px] font-black text-white mb-2">No upcoming posts</p>
                <p className="text-[12px] text-zinc-600 font-medium">Approve assets from the review queue to schedule them here.</p>
              </div>
            ) : (
              <div className="space-y-8 relative before:absolute before:inset-0 before:ml-[1.125rem] before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-white/10 before:to-transparent">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Circle marker */}
                    <div className="flex items-center justify-center w-10 h-10 rounded-xl border border-indigo-500/30 bg-indigo-500/10 text-indigo-400 shadow-[0_0_15px_rgba(79,70,229,0.3)] shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 group-hover:scale-110 group-hover:bg-indigo-500/30 transition-all duration-300">
                      <Clock className="w-4 h-4" />
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-5 md:p-6 rounded-2xl border border-white/10 bg-black/40 shadow-inner group-hover:shadow-[0_0_20px_rgba(79,70,229,0.15)] group-hover:border-indigo-500/30 transition-all duration-300 backdrop-blur-sm -translate-y-1">
                      <div className="flex items-center justify-between mb-4">
                         <time className="text-xs font-bold font-mono tracking-wide text-zinc-400">
                           {new Date(schedule.scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                         </time>
                         <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 shadow-inner ${
                           schedule.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' :
                           schedule.status === 'failed' ? 'bg-red-500/10 text-red-400 border border-red-500/20' :
                           'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20'
                         }`}>
                           <span className="w-1.5 h-1.5 rounded-full bg-current shadow-[0_0_8px_currentColor]"></span>
                           {schedule.status}
                         </span>
                      </div>
                      <h4 className="font-bold text-base mb-2 text-zinc-100 group-hover:text-indigo-400 transition-colors leading-snug">{schedule.variant.asset.title}</h4>
                      <p className="text-sm font-medium text-zinc-500 truncate mb-5 pb-5 border-b border-white/5">Hook: {schedule.variant.hook || 'No hook provided.'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold tracking-widest bg-white/5 border border-white/10 px-2 py-1 rounded-md text-zinc-400">{schedule.variant.asset.assetType}</span>
                        <button className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 hover:bg-indigo-500/30 px-3 py-1.5 rounded-md">Edit Post</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
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

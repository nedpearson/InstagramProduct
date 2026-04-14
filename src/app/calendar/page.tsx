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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 flex flex-col h-[calc(100vh-4rem)]">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 flex-shrink-0">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">Content Calendar</h1>
          <p className="text-sm text-zinc-500 mt-1">Timeline and scheduling engine for all automation posts.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 rounded-lg p-1 shadow-sm">
             <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"><ChevronLeft className="w-4 h-4" /></button>
             <span className="px-3 text-sm font-medium">This Week</span>
             <button className="p-1.5 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition"><ChevronRight className="w-4 h-4" /></button>
          </div>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-md shadow-indigo-500/20 flex items-center gap-2 transition">
            <Plus className="w-4 h-4" /> Schedule Content
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 flex-1 min-h-0">
        
        {/* Timeline View */}
        <div className="flex-1 lg:w-2/3 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm flex flex-col overflow-hidden">
          <div className="p-4 border-b border-zinc-100 dark:border-zinc-800/50 flex justify-between items-center bg-zinc-50/50 dark:bg-[#09090b]/50">
            <h2 className="text-sm font-semibold flex items-center gap-2"><CalendarIcon className="w-4 h-4 text-indigo-500" /> Upcoming Schedule</h2>
            <button className="text-xs text-zinc-500 hover:text-zinc-900 dark:hover:text-white flex items-center gap-1 transition"><View className="w-3 h-3" /> List View</button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 scrollbar-hide">
            {schedules.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-zinc-500">
                <MapPin className="w-8 h-8 text-zinc-300 dark:text-zinc-700 mb-3" />
                <p>No content scheduled. Drag from the queue.</p>
              </div>
            ) : (
              <div className="space-y-6 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-gradient-to-b before:from-transparent before:via-zinc-200 dark:before:via-zinc-800 before:to-transparent">
                {schedules.map((schedule) => (
                  <div key={schedule.id} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                    {/* Circle marker */}
                    <div className={`flex items-center justify-center w-10 h-10 rounded-full border-4 border-white dark:border-[#121214] bg-indigo-100 text-indigo-600 dark:bg-indigo-500/20 dark:text-indigo-400 shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2`}>
                      <Clock className="w-4 h-4" />
                    </div>
                    {/* Card */}
                    <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl border border-zinc-200 dark:border-zinc-800/60 bg-white dark:bg-[#09090b] shadow-sm group-hover:shadow-md transition-shadow group-hover:border-indigo-500/30">
                      <div className="flex items-center justify-between mb-2">
                         <time className="text-xs font-semibold text-zinc-500">
                           {new Date(schedule.scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                         </time>
                         <span className={`px-2 py-0.5 rounded-full text-[10px] font-semibold uppercase tracking-wider ${
                           schedule.status === 'published' ? 'bg-green-50 text-green-700 dark:bg-green-500/10 dark:text-green-400 ring-1 ring-green-600/20 dark:ring-green-500/20' :
                           schedule.status === 'failed' ? 'bg-red-50 text-red-700 dark:bg-red-500/10 dark:text-red-400 ring-1 ring-red-600/20 dark:ring-red-500/20' :
                           'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 ring-1 ring-indigo-600/20 dark:ring-indigo-500/20'
                         }`}>
                           {schedule.status}
                         </span>
                      </div>
                      <h4 className="font-semibold text-sm mb-1 text-zinc-900 dark:text-zinc-100">{schedule.variant.asset.title}</h4>
                      <p className="text-xs text-zinc-500 truncate mb-3">Hook: {schedule.variant.hook || 'No hook provided.'}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] font-mono bg-zinc-100 dark:bg-zinc-800 px-1.5 py-0.5 rounded text-zinc-600 dark:text-zinc-400">{schedule.variant.asset.assetType}</span>
                        <button className="text-[10px] uppercase font-bold text-indigo-600 hover:text-indigo-800 transition">Edit</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Unscheduled Queue */}
        <div className="flex-1 lg:w-1/3 bg-zinc-50 dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-inner flex flex-col overflow-hidden relative">
          <div className="absolute inset-0 bg-[url('https://meshgradient.in/assets/images/mesh-3.png')] opacity-[0.03] dark:opacity-[0.05] pointer-events-none mix-blend-overlay bg-cover bg-center"></div>
          <div className="p-4 border-b border-zinc-200/50 dark:border-zinc-800/50 relative z-10 flex justify-between items-center">
            <h2 className="text-sm font-semibold flex items-center gap-2">Approved Queue</h2>
            <span className="px-2 py-0.5 bg-zinc-200 dark:bg-zinc-800 rounded font-mono text-[10px] text-zinc-600 dark:text-zinc-400">{assets.length} Items</span>
          </div>
          <div className="flex-1 overflow-y-auto p-4 space-y-3 relative z-10 scrollbar-hide">
             {assets.map(asset => (
                <div key={asset.id} className="p-3 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 rounded-xl shadow-sm hover:shadow active:scale-[0.98] cursor-grab transition-all group">
                   <div className="flex items-start justify-between mb-2">
                     <p className="font-semibold text-sm leading-snug group-hover:text-indigo-600 transition-colors">{asset.title}</p>
                     <div className="w-1.5 h-1.5 rounded-full bg-green-500 flex-shrink-0 mt-1" />
                   </div>
                   <div className="flex justify-between items-center">
                     <span className="text-[10px] uppercase tracking-wider font-semibold text-zinc-500 bg-zinc-100 dark:bg-zinc-800/60 px-1.5 py-0.5 rounded">{asset.assetType.replace('_',' ')}</span>
                     <span className="text-[10px] text-zinc-400 font-mono">{asset.variants.length} var</span>
                   </div>
                </div>
             ))}
             {assets.length === 0 && (
                <p className="text-xs text-center text-zinc-500 mt-10">No items waiting for scheduling.</p>
             )}
          </div>
        </div>
      </div>
    </div>
  );
}

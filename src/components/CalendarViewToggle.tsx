'use client';

import { useState } from 'react';
import { View, Calendar as CalendarIcon, MapPin, Clock } from 'lucide-react';
import { CalendarGrid } from '@/components/CalendarGrid';
import { PostPreviewModal } from '@/components/PostPreviewModal';

export function CalendarViewToggle({ schedules }: { schedules: any[] }) {
  const [view, setView] = useState<'list' | 'calendar'>('calendar');

  return (
    <>
      <div className="p-5 md:p-6 border-b border-white/5 bg-white/[0.02] flex justify-between items-center z-10 shrink-0">
        <h2 className="text-sm font-bold flex items-center gap-3 tracking-wide text-zinc-100">
          <div className="w-8 h-8 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner">
             <CalendarIcon className="w-4 h-4" />
          </div>
          Upcoming Schedule
        </h2>
        <button 
          onClick={() => setView(view === 'list' ? 'calendar' : 'list')}
          className="text-xs text-zinc-400 hover:text-white flex items-center gap-1.5 transition-colors font-bold uppercase tracking-widest px-3 py-1.5 rounded-lg hover:bg-white/5 border border-white/5 shadow-inner"
        >
          <View className="w-3.5 h-3.5" /> {view === 'list' ? 'Calendar View' : 'List View'}
        </button>
      </div>

      {view === 'calendar' ? (
        <CalendarGrid schedules={schedules} />
      ) : (
        <div className="flex-1 overflow-y-auto p-6 md:p-8 scrollbar-hide z-10">
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
                      <PostPreviewModal schedule={schedule} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </>
  );
}

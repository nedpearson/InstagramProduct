'use client';

import { useState } from 'react';
import { ChevronLeft, ChevronRight, Clock } from 'lucide-react';

export function CalendarGrid({ schedules }: { schedules: any[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));

  const monthName = currentDate.toLocaleString('default', { month: 'long', year: 'numeric' });

  // Map schedules to date strings (YYYY-MM-DD)
  const scheduledDates = schedules.reduce((acc, sch) => {
    const d = new Date(sch.scheduledFor);
    const dateStr = d.toISOString().split('T')[0];
    if (!acc[dateStr]) acc[dateStr] = [];
    acc[dateStr].push(sch);
    return acc;
  }, {} as Record<string, any[]>);

  const days = [];
  for (let i = 0; i < firstDayOfMonth; i++) {
    days.push(<div key={`empty-${i}`} className="min-h-[100px] border-b border-r border-white/5 bg-black/20" />);
  }

  for (let i = 1; i <= daysInMonth; i++) {
    const iterationDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), i);
    const dateStr = iterationDate.toISOString().split('T')[0];
    const daySchedules = scheduledDates[dateStr] || [];

    const isToday = new Date().toDateString() === iterationDate.toDateString();

    days.push(
      <div key={i} className={`min-h-[100px] border-b border-r border-white/5 p-2 relative ${isToday ? 'bg-indigo-500/5' : 'hover:bg-white/[0.02]'} transition-colors`}>
        <div className={`text-xs font-bold w-6 h-6 flex items-center justify-center rounded-full mb-1 border shadow-inner ${isToday ? 'bg-indigo-600 text-white border-indigo-400' : 'text-zinc-500 bg-white/5 border-white/10'}`}>
          {i}
        </div>
        <div className="space-y-1 mt-2">
          {daySchedules.map((sch: any, idx: number) => (
            <div key={idx} className={`text-[10px] truncate px-1.5 py-1 rounded border shadow-inner flex items-center gap-1 font-bold ${
               sch.status === 'published' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
               sch.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
               'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'
            }`}>
              <Clock className="w-2.5 h-2.5 shrink-0" />
              {new Date(sch.scheduledFor).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full relative z-10 w-full animate-in fade-in duration-300">
      <div className="flex items-center justify-between p-4 border-b border-white/5 bg-white/[0.02]">
        <h3 className="font-bold text-white tracking-wide">{monthName}</h3>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-zinc-400 border border-white/5 transition-colors">
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-lg bg-black/40 hover:bg-white/10 text-zinc-400 border border-white/5 transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>
      <div className="grid grid-cols-7 border-b border-white/5 bg-black/40 text-center text-[10px] font-bold text-zinc-500 tracking-widest uppercase py-2">
        <div>Sun</div><div>Mon</div><div>Tue</div><div>Wed</div><div>Thu</div><div>Fri</div><div>Sat</div>
      </div>
      <div className="flex-1 grid grid-cols-7 overflow-y-auto min-h-[300px] border-l border-white/5">
        {days}
      </div>
    </div>
  );
}

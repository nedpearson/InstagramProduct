import { Activity, Clock, Zap, Network } from 'lucide-react';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export default async function AutomationPage() {
  const jobs = await prisma.backgroundJob.findMany({
    take: 10,
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-3" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <Network className="w-4 h-4 text-violet-400" /> Nervous System
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Automation Monitor</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">
            Watchdog dashboard for scheduled jobs, retry mechanisms, subagent memory, and error logs.
          </p>
        </div>
      </div>

      <div className="glass-panel-ai rounded-2xl flex flex-col overflow-hidden relative z-10">
        <div className="px-6 py-4 border-b border-white/[0.04] bg-white/[0.01]">
          <h2 className="font-bold text-[14px] text-white">Job Queue History</h2>
        </div>
        <div className="p-0 overflow-y-auto min-h-[300px]">
          {jobs.length === 0 ? (
            <div className="p-8 text-center text-zinc-500 text-sm">
               No jobs recently executed. Queue is clean.
            </div>
          ) : (
            <div className="divide-y divide-white/[0.04]">
              {jobs.map((job) => (
                <div key={job.id} className="p-4 flex items-center justify-between hover:bg-white/[0.01]">
                   <div className="flex items-center gap-3">
                     <Clock className="w-4 h-4 text-zinc-500" />
                     <span className="text-sm font-mono text-zinc-300">{job.jobType}</span>
                   </div>
                   <div>
                     <span className={`px-2 py-1 text-[10px] rounded border ${
                       job.status === 'pending' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                       job.status === 'failed' ? 'bg-red-500/10 text-red-400 border-red-500/20' :
                       job.status === 'dead_letter' ? 'bg-red-500/20 text-red-300 border-red-500/30 font-bold' :
                       'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                     }`}>
                       {job.status.toUpperCase()}
                     </span>
                   </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

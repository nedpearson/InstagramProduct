import { ArrowLeft, Database, Activity, GitBranch, Terminal } from 'lucide-react';
import Link from 'next/link';

export default function EntityDrilldown({ 
  entityType, 
  entityId, 
  data, 
  backUrl 
}: { 
  entityType: string, 
  entityId: string, 
  data: any, 
  backUrl: string 
}) {
  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-1" />
      
      {/* Header */}
      <div className="flex flex-col gap-4 relative z-10 pt-2">
        <Link href={backUrl} className="flex items-center gap-2 text-zinc-500 hover:text-white transition-colors w-max text-sm font-bold">
          <ArrowLeft className="w-4 h-4" /> Back to Matrix
        </Link>
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <Terminal className="w-4 h-4 text-indigo-400" /> Neural Deep-Dive
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none capitalize">
            {entityType} Inspection
          </h1>
          <p className="text-sm font-mono text-zinc-500 mt-3 max-w-xl">
            UUID: {entityId}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
         <div className="glass-panel-ai rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Database className="w-5 h-5 text-indigo-400" />
              <div className="ai-section-label">Raw Entity DB Size</div>
            </div>
            <div className="text-2xl font-black text-white">{JSON.stringify(data).length} bytes</div>
         </div>
         <div className="glass-panel-ai rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <Activity className="w-5 h-5 text-emerald-400" />
              <div className="ai-section-label">Object Linkages</div>
            </div>
            <div className="text-2xl font-black text-white">{Object.keys(data).length} keys mapped</div>
         </div>
         <div className="glass-panel-ai rounded-2xl p-6">
            <div className="flex items-center gap-3 mb-4">
              <GitBranch className="w-5 h-5 text-amber-400" />
              <div className="ai-section-label">Pipeline Sync</div>
            </div>
            <div className="text-2xl font-black text-white">Active Node</div>
         </div>
      </div>

      <div className="glass-panel-ai rounded-2xl p-8 relative z-10 min-h-[400px]">
         <h3 className="text-sm font-bold text-white mb-6 uppercase tracking-widest border-b border-white/5 pb-4">Raw Schema Trace</h3>
         <div className="bg-black/50 border border-white/5 rounded-xl p-6 overflow-x-auto w-full">
            <pre className="font-mono text-[13px] leading-relaxed text-emerald-300/90 whitespace-pre-wrap word-break-all">
               {JSON.stringify(data, null, 2)}
            </pre>
         </div>
      </div>
    </div>
  );
}

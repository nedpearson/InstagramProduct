'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Crosshair, X, Calendar, Activity, Zap, ShieldCheck } from 'lucide-react';
import { deployTop10MarketAttackAction } from '@/app/(app)/actions';

export default function MarketAttackDeployer({ workspaceId }: { workspaceId: string }) {
  const [loading, setLoading] = useState(false);
  const [previewData, setPreviewData] = useState<any>(null);
  const [error, setError] = useState('');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleDeploy = async () => {
    setLoading(true);
    setError('');
    try {
      const result = await deployTop10MarketAttackAction(workspaceId);
      setPreviewData(result);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button 
        onClick={handleDeploy}
        disabled={loading}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 group active:scale-95 disabled:opacity-50"
      >
        {loading ? (
             <span className="animate-pulse">Mapping Core Array...</span>
        ) : (
            <><Crosshair className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Deploy Market Attack</>
        )}
      </button>

      {/* Massive 30-Day Preview Modal */}
      {mounted && previewData && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 lg:p-8 animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/80 backdrop-blur-xl" onClick={() => setPreviewData(null)} />
          
          <div className="relative w-full max-w-6xl h-full max-h-[90vh] glass-panel-ai rounded-3xl border border-white/[0.08] shadow-[0_0_80px_rgba(79,70,229,0.15)] flex flex-col overflow-hidden animate-in zoom-in-95 duration-500">
            {/* Header */}
            <div className="px-6 md:px-8 py-6 border-b border-white/[0.06] bg-black/40 flex items-center justify-between shrink-0">
               <div>
                 <div className="flex items-center gap-3 mb-2">
                    <span className="px-3 py-1 bg-indigo-500/20 border border-indigo-500/30 rounded-lg text-[10px] font-black uppercase tracking-widest text-indigo-400 flex items-center gap-1.5"><ShieldCheck className="w-3 h-3" /> Matrix Locked</span>
                    <span className="text-[12px] font-mono text-zinc-500">{previewData.id}</span>
                 </div>
                 <h2 className="text-2xl lg:text-3xl font-black text-white tracking-tight">30-Day Master Attack Sequence</h2>
                 <p className="text-[13px] text-zinc-400 mt-1">Autonomous orchestration targeting the top 10 highest-yielding opportunities staggered over {previewData.timeline}.</p>
               </div>
               <button onClick={() => setPreviewData(null)} className="p-3 bg-white/[0.04] hover:bg-white/[0.08] rounded-xl transition-colors border border-white/[0.05]">
                 <X className="w-5 h-5 text-white" />
               </button>
            </div>

            {/* Scrollable Timeline Array */}
            <div className="flex-1 overflow-y-auto scrollbar-hide p-6 md:p-8 bg-[#030304]/80">
               <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                 {previewData.targets.map((target: any, idx: number) => {
                     const isImminent = idx === 0;
                     return (
                       <div key={idx} className={`p-6 rounded-2xl border ${isImminent ? 'bg-indigo-500/[0.03] border-indigo-500/30 shadow-[0_0_30px_rgba(79,70,229,0.1)] relative overflow-hidden group' : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.1] hover:bg-white/[0.04] transition-colors'}`}>
                          {isImminent && <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent z-0"></div>}
                          
                          <div className="relative z-10 flex items-start justify-between mb-4">
                             <div className="flex items-center gap-2">
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-[13px] ${isImminent ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 'bg-white/[0.05] text-zinc-400'}`}>
                                  #{target.targetRank}
                                </div>
                                <span className={`text-[12px] font-bold ${isImminent ? 'text-indigo-400' : 'text-zinc-500'}`}>Target Acquired</span>
                             </div>
                             <div className="flex items-center gap-1.5 text-[11px] font-bold text-zinc-400 bg-black/40 px-2 py-1 rounded-md border border-white/5">
                                <Calendar className="w-3 h-3 text-zinc-500" />
                                Drop {idx + 1}
                             </div>
                          </div>

                          <h3 className="text-base font-bold text-white mb-2 leading-snug relative z-10">{target.assetSignal}</h3>
                          
                          <div className="flex items-center gap-3 mb-6 pb-5 border-b border-white/5 relative z-10">
                              <span className="text-[12px] font-black text-emerald-400 tabular-nums">Score: {target.score.toFixed(1)}</span>
                              <span className="w-1 h-1 rounded-full bg-white/10" />
                              <span className="text-[12px] font-bold text-zinc-400">${target.projectedPrice}</span>
                          </div>

                          <div className="space-y-4 relative z-10">
                             <div>
                               <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1.5 flex items-center gap-1.5"><Zap className="w-3 h-3" /> Funnel Funnel</div>
                               <div className="text-[12px] text-zinc-300 font-medium bg-black/30 p-2.5 rounded-lg border border-white/[0.03] uppercase">{target.monetization.replace(/_/g, ' ')}</div>
                             </div>
                             
                             <div>
                               <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-1.5">Launch Phase Date</div>
                               <div className="text-[13px] font-mono text-indigo-400">
                                   {new Date(target.staggeredDropDate).toLocaleString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                               </div>
                             </div>

                             <div className="pt-2">
                               <div className="text-[10px] text-zinc-500 uppercase font-black tracking-widest mb-2">Synthetic Neural Hooks</div>
                               <div className="flex flex-wrap gap-1.5">
                                  {target.synthesisData.hooks.map((hook: string) => (
                                      <span key={hook} className="px-2 py-1 bg-white/[0.03] border border-white/[0.05] rounded-md text-[10px] uppercase font-bold text-zinc-400">{hook}</span>
                                  ))}
                               </div>
                             </div>
                          </div>
                          
                          {isImminent && (
                             <div className="mt-6 pt-5 border-t border-indigo-500/20 relative z-10 flex flex-col gap-2">
                                <button
                                  onClick={async () => {
                                      // Call global force compute directly assuming backend can pick up pending orchestration
                                      await fetch('/api/execute-deploy', { method: 'POST' }).catch(()=>null);
                                      window.location.href = '/calendar';
                                  }}
                                  className="w-full py-3 bg-indigo-500 hover:bg-indigo-400 text-white rounded-xl text-[13px] font-black tracking-wide shadow-lg shadow-indigo-500/25 transition-colors uppercase"
                                >
                                  Execute Deployment Link
                                </button>
                                <div className="text-[10px] text-zinc-500 text-center uppercase tracking-widest font-bold">Injects target array into Calendar</div>
                             </div>
                          )}
                       </div>
                     );
                 })}
               </div>
            </div>
          </div>
        </div>
       , document.body)}
    </>
  );
}

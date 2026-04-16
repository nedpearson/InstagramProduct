'use client';
import { useState } from 'react';
import { Rocket, Box, CheckCircle, Zap, ShieldAlert, Cpu } from 'lucide-react';
import { deployBestOpportunityAction } from '@/app/(app)/actions';

export default function LaunchDeployer({ workspaceId, products }: { workspaceId: string, products: any[] }) {
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [autonomyMode, setAutonomyMode] = useState<'preview' | 'confirm' | 'autonomous'>('preview');
  const [status, setStatus] = useState<'idle' | 'analyzing' | 'queuing' | 'deployed' | 'error'>('idle');
  const [resultData, setResultData] = useState<any>(null);

  const handleMagicDeploy = async () => {
     setStatus('analyzing');
     try {
         // The DeployEngine inherently analyzes trends to pick the best product if none specified, 
         // but for precision we can pass the explicit workspace.
         const result = await deployBestOpportunityAction(workspaceId, autonomyMode, selectedProductId);
         setResultData(result);
         
         if (autonomyMode === 'preview') {
             setStatus('idle'); // Just previewed
         } else {
             setStatus('deployed');
         }
     } catch(e: any) {
         setStatus('error');
         setResultData(e.message || 'Deployment matrix execution blocked.');
     }
  };

  return (
    <div className="w-full flex flex-col gap-6">
        
       {/* UI Block 1: Product Selection & Configuration */}
       <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
           <div className="border border-white/[0.04] bg-white/[0.01] rounded-2xl p-6">
              <h3 className="text-[14px] font-bold text-white flex items-center gap-2 mb-4"><Box className="w-4 h-4 text-indigo-400" /> Select Asset / Product</h3>
              <div className="space-y-2 max-h-[200px] overflow-y-auto scrollbar-hide">
                 {products.map(p => (
                   <div 
                      key={p.id} 
                      onClick={() => setSelectedProductId(p.id)}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${selectedProductId === p.id ? 'bg-indigo-500/10 border-indigo-500/50' : 'bg-black/20 border-white/[0.04] hover:bg-white/[0.04]'}`}
                   >
                     <div className="text-[13px] font-bold text-white">{p.name}</div>
                     <div className="text-[11px] text-zinc-500">${p.price} Base</div>
                   </div>
                 ))}
                 {products.length === 0 && <div className="text-[12px] text-zinc-500 italic">No products mapped to active workspace.</div>}
              </div>
           </div>

           <div className="border border-white/[0.04] bg-white/[0.01] rounded-2xl p-6 flex flex-col justify-between">
              <div>
                <h3 className="text-[14px] font-bold text-white flex items-center gap-2 mb-4"><Cpu className="w-4 h-4 text-emerald-400" /> Autonomy Clearance</h3>
                <div className="flex flex-col gap-2">
                   {['preview', 'confirm', 'autonomous'].map((mode) => (
                      <div 
                        key={mode} 
                        onClick={() => setAutonomyMode(mode as any)}
                        className={`p-3 rounded-xl border flex items-center justify-between cursor-pointer transition-all ${autonomyMode === mode ? 'bg-emerald-500/10 border-emerald-500/50' : 'bg-black/20 border-white/[0.04] hover:bg-white/[0.04]'}`}
                      >
                         <span className="text-[13px] font-bold text-zinc-200 capitalize">{mode} Matrix</span>
                         {autonomyMode === mode && <CheckCircle className="w-4 h-4 text-emerald-400" />}
                      </div>
                   ))}
                </div>
              </div>
           </div>
       </div>

       {/* UI Block 2: One-Click Execution */}
       <div className="border border-indigo-500/20 bg-indigo-500/[0.02] rounded-2xl p-8 flex flex-col items-center justify-center text-center relative overflow-hidden group">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-indigo-500/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
          
          <button 
             onClick={handleMagicDeploy}
             disabled={status === 'analyzing' || status === 'queuing'}
             className="relative z-10 w-full max-w-sm py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] transition-all active:scale-[0.98] disabled:opacity-50 flex items-center justify-center gap-3 font-black text-lg tracking-tight"
          >
             {status === 'analyzing' ? <span className="animate-pulse">Synthesizing Launch...</span> : 
              status === 'queuing' ? <span className="animate-pulse">Queuing Nodes...</span> :
             <><Rocket className="w-5 h-5 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform" /> Deploy Next Best Thing</>}
          </button>
          
          {selectedProductId ? (
              <p className="mt-4 text-[12px] text-zinc-500 font-medium">Overriding Master Agent selection constraints. Locking target to explicit product override.</p>
          ) : (
              <p className="mt-4 text-[12px] text-emerald-500/80 font-bold flex items-center gap-1 justify-center"><Zap className="w-3 h-3" /> Fully autonomous pathing enabled. Target will be AI-generated.</p>
          )}

          {/* Results Output Console */}
          {resultData && (
             <div className="mt-8 w-full max-w-2xl bg-black border border-white/[0.08] rounded-xl p-4 text-left font-mono text-[11px] text-emerald-400 overflow-x-auto">
                 <div className="flex items-center gap-2 mb-2 text-zinc-500"><ShieldAlert className="w-3 h-3" /> NEURAL ENGINE OUTPUT:</div>
                 <pre>{JSON.stringify(resultData, null, 2)}</pre>
             </div>
          )}
       </div>

    </div>
  );
}

import { Rocket, Zap, Clock, PackageCheck, Target } from 'lucide-react';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import LaunchDeployer from '@/components/LaunchDeployer';
import ScrollButton from '@/components/ScrollButton';

export const dynamic = 'force-dynamic';

export default async function LaunchesPage() {
  const launches = await prisma.launch.findMany({
    orderBy: { targetDate: 'asc' }
  }).catch(() => []); // Fallback array if table doesn't exist
  
  const workspace = await prisma.workspace.findFirst();
  const products = workspace ? await prisma.product.findMany({ where: { workspaceId: workspace.id } }) : [];

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-1" />
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3 flex items-center gap-2">
            <Rocket className="w-4 h-4 text-emerald-400" /> Ground Control
          </div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">Launch Cockpit</h1>
          <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">
            Orchestrate multi-step product drops, predictive simulated forecasting, and automated hype ramps.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <ScrollButton targetId="deployer" className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white text-[13px] font-semibold rounded-xl transition-all duration-200 shadow-inner">
            Run Simulation
          </ScrollButton>
          <ScrollButton targetId="deployer" className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 group active:scale-95">
            <Zap className="w-3.5 h-3.5 group-hover:scale-110 transition-transform" /> Plan Drop
          </ScrollButton>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 relative z-10">
         <div className="glass-panel-ai rounded-2xl p-6 flex flex-col justify-between">
            <div className="ai-section-label mb-1">Upcoming Drops</div>
            <div className="text-3xl font-black text-white">{launches.length}</div>
         </div>
         <div className="glass-panel-ai rounded-2xl p-6 flex flex-col justify-between border-emerald-500/10 bg-emerald-500/[0.02]">
            <div className="ai-section-label mb-1 text-emerald-400/80">Simulated Target</div>
            <div className="text-3xl font-black text-emerald-400">$0.00</div>
         </div>
         <div className="glass-panel-ai rounded-2xl p-6 flex flex-col justify-between">
            <div className="ai-section-label mb-1">Readiness</div>
            <div className="text-3xl font-black text-white">100%</div>
         </div>
      </div>

      <div id="deployer" className="relative z-10 w-full mt-6 scroll-mt-24">
        <LaunchDeployer 
           workspaceId={workspace?.id || ''} 
           products={products} 
        />
      </div>

    </div>
  );
}

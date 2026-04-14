import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, Plus, Banknote, Tag, ArrowRight, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Workspace · Products</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Products Catalog</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Manage the digital products being promoted across your funnels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 flex items-center gap-2 active:scale-95">
            <Plus className="w-3.5 h-3.5 flex-shrink-0" /> New Product
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {products.map((product) => (
          <div key={product.id} className="group glass-panel-ai border border-white/[0.05] rounded-2xl shadow-sm hover:border-indigo-500/20 transition-all duration-300 relative overflow-hidden flex flex-col hover:-translate-y-px hover:shadow-md ai-scan-panel">

            {/* Visual Header */}
            <div className="h-32 w-full bg-indigo-900/10 border-b border-white/5 p-6 md:p-8 flex items-start justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
              <div className="w-12 h-12 bg-indigo-500/10 rounded-xl shadow-inner border border-indigo-500/20 flex items-center justify-center text-indigo-400 relative z-10 group-hover:scale-105 transition-transform duration-300">
                <Layers className="w-7 h-7" />
              </div>
              <span className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase shadow-inner border ${
                product.isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-white/[0.05] text-zinc-400 border-white/[0.08]'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {/* Content */}
            <div className="p-6 md:p-8 flex-1 flex flex-col relative z-10">
              <h3 className="font-bold text-2xl text-white mb-3 tracking-tight group-hover:text-indigo-400 transition-colors drop-shadow-sm">{product.name}</h3>
              <p className="text-zinc-400 font-medium text-sm line-clamp-3 mb-8 flex-1 leading-relaxed">{product.description}</p>
              
              <div className="flex items-center justify-between pt-5 border-t border-white/5 mt-auto">
                 <div className="flex items-baseline gap-1 text-white font-black text-2xl tracking-tighter drop-shadow-md">
                    <span className="text-zinc-500 text-lg font-bold">$</span>
                    <span>{product.price}</span>
                 </div>
                 <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500/10 group-hover:border-indigo-500/20 group-hover:text-indigo-400 transition-all shadow-inner">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-20 px-8 glass-panel-ai ai-scan-panel border border-dashed border-white/[0.08] rounded-2xl flex flex-col items-center justify-center text-center group relative overflow-hidden">
            <div className="w-16 h-16 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-5 border border-white/[0.07] group-hover:scale-105 transition-transform duration-300 shadow-inner">
               <Tag className="w-7 h-7 text-zinc-600 group-hover:text-indigo-400 transition-colors" />
            </div>
            <div className="ai-section-label mb-3">Products Catalog · Empty</div>
            <h3 className="text-xl font-black tracking-tight text-white mb-2">No products added</h3>
            <p className="text-[13px] text-zinc-500 max-w-sm mb-7 font-medium leading-relaxed">Add the digital products or courses you plan on building funnels for.</p>
            <button className="px-7 py-3 bg-indigo-600 hover:bg-indigo-500 text-white rounded-xl font-bold text-[13px] shadow-lg hover:shadow-indigo-500/25 transition-all flex items-center gap-2 active:scale-95">
                <Plus className="w-4 h-4" /> Add First Product
            </button>
         </div>
        )}
      </div>
    </div>
  );
}

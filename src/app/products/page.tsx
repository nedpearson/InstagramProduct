import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Package, Plus, Banknote, Tag, ArrowRight, Layers } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 drop-shadow-sm">Products Catalog</h1>
          <p className="text-sm font-bold tracking-wide text-zinc-400 mt-2 uppercase">Manage the digital products being promoted across your funnels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white text-black font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02] active:scale-95">
            <Plus className="w-5 h-5 flex-shrink-0" /> New Product
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {products.map((product) => (
          <div key={product.id} className="group glass-panel border border-white/5 rounded-3xl shadow-sm hover:shadow-[0_0_30px_rgba(79,70,229,0.15)] transition-all duration-500 relative overflow-hidden flex flex-col hover:-translate-y-1">
            
            <div className="absolute top-0 right-0 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl -mr-16 -mt-16 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none group-hover:scale-150" />

            {/* Visual Header */}
            <div className="h-32 w-full bg-indigo-900/10 border-b border-white/5 p-6 md:p-8 flex items-start justify-between relative overflow-hidden backdrop-blur-sm">
              <div className="absolute inset-0 opacity-[0.2]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
              <div className="w-14 h-14 bg-[#050505] rounded-2xl shadow-inner border border-white/10 flex items-center justify-center text-indigo-400 relative z-10 group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(79,70,229,0.4)]">
                <Layers className="w-7 h-7" />
              </div>
              <span className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[10px] font-bold tracking-widest uppercase shadow-inner border ${
                product.isActive 
                  ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                  : 'bg-white/5 text-zinc-400 border-white/10'
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
                 <button className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/30 group-hover:text-indigo-400 transition-all shadow-inner group-hover:shadow-[0_0_15px_rgba(79,70,229,0.3)]">
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                 </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-32 px-8 glass-panel border border-white/10 border-dashed rounded-[2.5rem] flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl" />
            <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mb-8 border border-white/10 rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-inner relative z-10 overflow-hidden">
               <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
               <Tag className="w-10 h-10 text-zinc-500 group-hover:text-white transition-colors relative z-10" />
            </div>
            <h3 className="text-3xl font-black tracking-tighter text-white mb-3">No products added</h3>
            <p className="text-zinc-400 max-w-md mb-10 font-medium">Add the digital products or courses you plan on building funnels for.</p>
            <button className="px-8 py-4 bg-white text-black rounded-2xl font-black shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-3 relative z-10 hover:scale-105 active:scale-95">
                <Plus className="w-5 h-5" /> Add First Product
            </button>
         </div>
        )}
      </div>
    </div>
  );
}

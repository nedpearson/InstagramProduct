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
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">Products Catalog</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1 dark:text-zinc-400">Manage the digital products being promoted across your funnels.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium text-sm rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10 transition-all duration-300 flex items-center gap-2 group hover:scale-[1.02] active:scale-95">
            <Plus className="w-4 h-4" /> New Product
          </button>
        </div>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {products.map((product) => (
          <div key={product.id} className="group bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-indigo-500/10 transition-all duration-500 relative overflow-hidden flex flex-col hover:-translate-y-1">
            
            <div className="absolute top-0 right-0 w-32 h-32 bg-indigo-500/10 rounded-full blur-3xl -mr-10 -mt-10 opacity-50 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

            {/* Visual Header */}
            <div className="h-28 w-full bg-gradient-to-br from-indigo-50 dark:from-indigo-900/10 to-purple-50 dark:to-purple-900/10 border-b border-zinc-100 dark:border-white/5 p-6 flex items-start justify-between relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.2] dark:opacity-[0.1]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='20' height='20' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%236366f1' fill-opacity='1' fill-rule='evenodd'%3E%3Ccircle cx='3' cy='3' r='3'/%3E%3Ccircle cx='13' cy='13' r='3'/%3E%3C/g%3E%3C/svg%3E")` }}></div>
              <div className="w-14 h-14 bg-white dark:bg-[#121214] rounded-2xl shadow-sm border border-zinc-200 dark:border-white/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 relative z-10 group-hover:scale-105 transition-transform duration-500">
                <Layers className="w-7 h-7" />
              </div>
              <span className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-bold tracking-widest uppercase ${
                product.isActive 
                  ? 'bg-emerald-50/80 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-600/20 backdrop-blur-sm' 
                  : 'bg-zinc-100/80 text-zinc-700 dark:bg-white/5 dark:text-zinc-400 ring-1 ring-zinc-500/20 backdrop-blur-sm'
              }`}>
                <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                {product.isActive ? 'Active' : 'Inactive'}
              </span>
            </div>
            
            {/* Content */}
            <div className="p-6 flex-1 flex flex-col relative z-10">
              <h3 className="font-bold text-xl text-zinc-900 dark:text-white mb-2 leading-tight group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{product.name}</h3>
              <p className="text-zinc-500 dark:text-zinc-400 text-sm line-clamp-3 mb-6 flex-1 leading-relaxed">{product.description}</p>
              
              <div className="flex items-center justify-between pt-4 border-t border-zinc-100 dark:border-white/5 mt-auto">
                 <div className="flex items-center gap-2 text-zinc-900 dark:text-white font-bold text-xl tracking-tight">
                    <span className="text-zinc-400 font-medium">$</span>
                    <span>{product.price}</span>
                 </div>
                 <button className="w-8 h-8 rounded-full bg-zinc-50 dark:bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-indigo-50 dark:group-hover:bg-indigo-500/10 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    <ArrowRight className="w-4 h-4" />
                 </button>
              </div>
            </div>
          </div>
        ))}

        {products.length === 0 && (
          <div className="col-span-full py-24 px-6 bg-white/40 dark:bg-[#121214]/40 backdrop-blur-xl border border-zinc-200 border-dashed dark:border-zinc-700/50 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-transparent to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            <div className="w-20 h-20 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center mb-6 border border-zinc-100 dark:border-zinc-800 rotate-3 group-hover:rotate-6 group-hover:scale-110 transition-all duration-500 shadow-sm">
               <Tag className="w-10 h-10 text-zinc-400" />
            </div>
            <h3 className="text-2xl font-bold tracking-tight text-zinc-900 dark:text-white mb-2">No products added</h3>
            <p className="text-zinc-500 dark:text-zinc-400 max-w-sm mb-8 font-medium">Add the digital products or courses you plan on building funnels for.</p>
            <button className="px-6 py-3 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white rounded-xl font-medium shadow-lg shadow-black/10 transition-all duration-300 flex items-center gap-2 relative z-10 hover:scale-105 active:scale-95">
                <Plus className="w-4 h-4" /> Add First Product
            </button>
         </div>
        )}
      </div>
    </div>
  );
}

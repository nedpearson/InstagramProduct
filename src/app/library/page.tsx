import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { Search, Filter, MoreHorizontal, FileText, Image as ImageIcon, MessageSquare, Video, Library } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function LibraryPage() {
  const assets = await prisma.contentAsset.findMany({
    orderBy: { createdAt: 'desc' },
    include: { variants: true, campaign: true }
  });

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Workspace · Content Library</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Content Library</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Manage and review all generated post variants and media.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 active:scale-95">
            Create Asset
          </button>
        </div>
      </div>

      <div className="glass-panel-ai ai-scan-panel border-white/[0.05] shadow-sm rounded-2xl overflow-hidden relative z-10 hover:border-white/[0.09] transition-colors duration-300">
        {/* Toolbar */}
        <div className="p-6 border-b border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-white/[0.01]">
          <div className="relative w-full md:w-80 group">
            <Search className="w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-white transition-colors" />
            <input type="text" placeholder="Search assets..." className="w-full pl-11 pr-4 py-3 border border-white/10 bg-black/40 rounded-xl text-sm font-bold outline-none focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 text-white transition-all shadow-inner placeholder:text-zinc-600" />
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-white/5 border border-white/10 text-white text-sm font-bold rounded-xl hover:bg-white/10 transition-colors shadow-inner">
             <Filter className="w-4 h-4 text-zinc-400" /> Filter View
          </button>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-[#050505]/50 border-b border-white/5">
              <tr>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Title</th>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Type</th>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Campaign</th>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Status</th>
                <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {assets.map(asset => (
                <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all duration-300 border border-indigo-500/20">
                          {asset.assetType === 'reel' ? <Video className="w-6 h-6" /> : 
                           asset.assetType === 'carousel' ? <ImageIcon className="w-6 h-6" /> :
                           asset.assetType === 'dm_sequence' ? <MessageSquare className="w-6 h-6" /> :
                           <FileText className="w-6 h-6" />}
                       </div>
                       <div>
                         <p className="font-bold tracking-tight text-white group-hover:text-indigo-400 transition-colors">{asset.title}</p>
                         <p className="text-xs font-medium text-zinc-500 mt-1">{asset.variants.length} active variant{(asset.variants.length !== 1) && 's'}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className="text-white font-bold tracking-widest uppercase text-[10px] bg-white/5 px-3 py-1.5 rounded-md border border-white/10 shadow-inner block w-max">{asset.assetType.replace('_', ' ')}</span>
                  </td>
                  <td className="px-8 py-5">
                    <div className="text-zinc-300 font-bold truncate max-w-[200px] flex items-center gap-3">
                       <div className="w-2 h-2 rounded-full bg-indigo-500 ring-2 ring-indigo-500/30"></div>
                       {asset.campaign.name}
                    </div>
                  </td>
                  <td className="px-8 py-5">
                    <span className={`px-3 py-1.5 rounded-md text-[10px] font-bold uppercase tracking-widest flex items-center gap-2 w-max shadow-inner border ${
                      asset.status === 'approved' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      asset.status === 'scheduled' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' :
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-8 py-5 text-right">
                    <button className="p-2.5 hover:bg-white/10 rounded-xl text-zinc-500 hover:text-white transition-colors outline-none border border-transparent hover:border-white/10">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-24 text-center">
                      <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden group">
                        <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                        <Library className="w-8 h-8 text-zinc-500 group-hover:text-white transition-colors relative z-10" />
                      </div>
                      <p className="text-white font-black text-xl mb-2">No assets found</p>
                      <p className="text-zinc-500 font-medium">Content generated by your campaigns will appear here.</p>
                   </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

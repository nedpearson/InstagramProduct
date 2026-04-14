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
    <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in zoom-in-95 duration-700 ease-out">
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 drop-shadow-sm">Content Library</h1>
          <p className="text-sm font-bold tracking-wide text-zinc-400 mt-2 uppercase">Manage and review all generated post variants and media.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-6 py-3 bg-white text-black font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-95">
            Create Asset
          </button>
        </div>
      </div>

      <div className="glass-panel border-white/5 shadow-sm rounded-3xl overflow-hidden relative z-10 hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-shadow duration-500">
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
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Title</th>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Type</th>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Campaign</th>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px]">Status</th>
                <th className="px-8 py-5 font-bold text-zinc-500 uppercase tracking-widest text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 bg-transparent">
              {assets.map(asset => (
                <tr key={asset.id} className="hover:bg-white/[0.02] transition-colors group cursor-pointer">
                  <td className="px-8 py-5 whitespace-nowrap">
                    <div className="flex items-center gap-5">
                       <div className="w-12 h-12 rounded-2xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner group-hover:scale-105 group-hover:bg-indigo-500/20 transition-all duration-300 border border-indigo-500/20">
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
                       <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_8px_rgba(79,70,229,0.8)]"></div>
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
                      <div className="w-20 h-20 bg-white/5 border border-white/10 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-inner relative overflow-hidden group">
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

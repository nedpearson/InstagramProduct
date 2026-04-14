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
      
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-3xl lg:text-4xl font-bold tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-zinc-900 to-zinc-500 dark:from-white dark:to-zinc-500">Content Library</h1>
          <p className="text-sm font-medium text-zinc-500 mt-1 dark:text-zinc-400">Manage and review all generated post variants and media.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="px-5 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium text-sm rounded-xl shadow-lg shadow-black/10 dark:shadow-white/10 transition-all duration-300 flex items-center gap-2 hover:scale-[1.02] active:scale-95">
            Create Asset
          </button>
        </div>
      </div>

      <div className="bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl border border-zinc-200/80 dark:border-white/5 shadow-sm rounded-2xl overflow-hidden relative z-10 hover:shadow-lg transition-shadow duration-500">
        {/* Toolbar */}
        <div className="p-5 border-b border-zinc-200/80 dark:border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-zinc-50/50 dark:bg-zinc-900/10">
          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input type="text" placeholder="Search assets..." className="w-full pl-9 pr-4 py-2 border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-[#121214] rounded-lg text-sm outline-none focus:ring-2 focus:ring-indigo-500/50 dark:text-white transition-all shadow-sm shadow-zinc-200/20 dark:shadow-none" />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800 text-sm font-medium rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors shadow-sm">
             <Filter className="w-4 h-4 text-zinc-400" /> Filter View
          </button>
        </div>

        {/* Data Grid */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm whitespace-nowrap">
            <thead className="bg-zinc-50/50 dark:bg-[#09090b]/50 border-b border-zinc-200/80 dark:border-white/5">
              <tr>
                <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Title</th>
                <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Type</th>
                <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Campaign</th>
                <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-[10px]">Status</th>
                <th className="px-6 py-4 font-semibold text-zinc-500 uppercase tracking-wider text-[10px] text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/50 dark:divide-white/5 bg-transparent">
              {assets.map(asset => (
                <tr key={asset.id} className="hover:bg-zinc-50/80 dark:hover:bg-white/[0.02] transition-colors group">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-4">
                       <div className="w-10 h-10 rounded-xl bg-indigo-50/50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400 shadow-inner group-hover:scale-105 transition-transform duration-300">
                          {asset.assetType === 'reel' ? <Video className="w-5 h-5" /> : 
                           asset.assetType === 'carousel' ? <ImageIcon className="w-5 h-5" /> :
                           asset.assetType === 'dm_sequence' ? <MessageSquare className="w-5 h-5" /> :
                           <FileText className="w-5 h-5" />}
                       </div>
                       <div>
                         <p className="font-bold tracking-tight text-zinc-900 dark:text-zinc-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">{asset.title}</p>
                         <p className="text-xs font-medium text-zinc-500 mt-0.5">{asset.variants.length} active variant{(asset.variants.length !== 1) && 's'}</p>
                       </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-zinc-700 dark:text-zinc-300 font-semibold tracking-wide capitalize text-xs bg-zinc-100 dark:bg-zinc-800/50 px-2.5 py-1 rounded-md border border-zinc-200 dark:border-zinc-700/50">{asset.assetType.replace('_', ' ')}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-zinc-700 dark:text-zinc-300 font-medium truncate max-w-[200px] flex items-center gap-2">
                       <div className="w-1.5 h-1.5 rounded-full bg-indigo-400"></div>
                       {asset.campaign.name}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 w-max ${
                      asset.status === 'approved' ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-400 ring-1 ring-emerald-600/20' :
                      asset.status === 'scheduled' ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-500/10 dark:text-indigo-400 ring-1 ring-indigo-600/20' :
                      'bg-amber-50 text-amber-700 dark:bg-amber-500/10 dark:text-amber-400 ring-1 ring-amber-600/20'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 hover:bg-zinc-200/50 dark:hover:bg-white/10 rounded-lg text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition-colors outline-none focus:ring-2 focus:ring-indigo-500">
                      <MoreHorizontal className="w-5 h-5" />
                    </button>
                  </td>
                </tr>
              ))}
              {assets.length === 0 && (
                <tr>
                   <td colSpan={5} className="py-24 text-center">
                      <div className="w-16 h-16 bg-zinc-50 dark:bg-zinc-800/50 rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <Library className="w-8 h-8 text-zinc-400" />
                      </div>
                      <p className="text-zinc-900 dark:text-white font-bold text-lg mb-1">No assets found</p>
                      <p className="text-zinc-500 text-sm">Content generated by your campaigns will appear here.</p>
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

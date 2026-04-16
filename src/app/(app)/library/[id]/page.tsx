import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles, Smartphone, ChevronLeft } from 'lucide-react';

function typeGradient(type: string) {
  const map: Record<string, string> = {
    caption:      'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    reel_script:  'from-[#f953c6] via-[#b91d73] to-[#f953c6]',
    dm_sequence:  'from-[#11998e] via-[#38ef7d] to-[#11998e]',
    bio_template: 'from-[#f7971e] via-[#ffd200] to-[#f7971e]',
  };
  return map[type] || 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]';
}

function splitCaption(body: string | null) {
  if (!body) return { caption: '', hashtags: '' };
  const idx = body.lastIndexOf('\n\n#');
  if (idx === -1) return { caption: body, hashtags: '' };
  return { caption: body.substring(0, idx).trim(), hashtags: body.substring(idx).trim() };
}

export default async function AssetDrilldownPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const asset = await prisma.contentAsset.findUnique({
    where: { id },
    include: { variants: true }
  });

  if (!asset) return notFound();

  const workspace = await prisma.workspace.findFirst({
    include: { instagramAccounts: { take: 1 } }
  });

  const igAccount = workspace?.instagramAccounts?.[0];
  const rawHandle = igAccount?.username || 'insta_growth_hq';
  const handle = rawHandle.startsWith('@') ? rawHandle.slice(1) : rawHandle;

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out overflow-y-auto h-full">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-3" />

      {/* Header */}
      <div className="relative z-10 pt-2">
        <div className="flex items-center gap-3 mb-4">
          <Link href="/library" className="flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors bg-white/5 py-1.5 px-3 rounded-lg hover:bg-white/10">
            <ChevronLeft className="w-4 h-4" /> Back to Matrix
          </Link>
        </div>
        <div className="ai-section-label mb-3">Live Feed · Visual Render</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-2">{asset.title}</h1>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xl">
              Simulating actual mobile consumption physics natively on edge cache. Status: <span className="text-emerald-400">{asset.status.toUpperCase()}</span>
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8 relative z-10 pb-20">
        {asset.variants.map((variant, idx) => {
          const { caption, hashtags } = splitCaption(variant.body);
          const isReel = asset.assetType === 'reel_script';
          const hook = variant.hook || asset.title;

          return (
            <div key={variant.id} className="flex flex-col gap-3 group">
              <div className="flex items-center justify-between px-2 mb-1">
                <div className="text-[11px] uppercase tracking-widest font-black text-zinc-500">
                  <span className="text-indigo-400 mr-2">V{String(idx + 1).padStart(2, '0')}</span> 
                  {variant.variantTag || 'Standard'}
                </div>
              </div>

              {/* Instagram Phone Mockup */}
              <div className="w-full max-w-[400px] mx-auto bg-black border-[7px] border-zinc-900 rounded-[35px] shadow-2xl flex flex-col overflow-hidden relative">
                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-3 pb-1">
                  <span className="text-[11px] font-bold text-white">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-[2px] items-end h-3">
                      {[3,5,7,9].map((h,i) => <div key={i} style={{height: h}} className="w-[3px] bg-white rounded-sm" />)}
                    </div>
                    <div className="text-[9px] text-white font-bold">5G</div>
                    <div className="w-5 h-2.5 rounded-sm border border-white flex items-center px-px">
                      <div className="w-3 h-1.5 bg-white rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* iPhone Notch */}
                <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-50">
                  <div className="w-28 h-5 bg-zinc-900 rounded-b-2xl"></div>
                </div>

                {/* Instagram app top bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 z-10">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar ring */}
                    <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-black flex items-center justify-center border border-black">
                         <Smartphone className="w-3.5 h-3.5 text-white" />
                      </div>
                    </div>
                    <div className="leading-tight">
                      <div className="text-[13px] font-bold text-white tracking-tight">{handle}</div>
                      <div className="text-[10px] text-zinc-500">Sponsored</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                </div>

                {/* Post image/video area */}
                <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900 flex items-center justify-center">
                  <div className={`absolute inset-0 bg-gradient-to-tr ${typeGradient(asset.assetType)} opacity-80`} />
                  
                  {isReel && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1.5 border border-white/10 z-20">
                      <div className="w-3.5 h-3.5 rounded-sm border-2 border-white" />
                      <span className="text-[10px] font-black text-white tracking-wider">REELS</span>
                    </div>
                  )}

                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10 drop-shadow-[0_4px_20px_rgba(0,0,0,0.8)]">
                    <h1 className="text-white font-black text-2xl uppercase tracking-tight leading-none mb-3">
                      {hook}
                    </h1>
                  </div>

                  {/* Gradient Fade for text contrast */}
                  <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent" />
                </div>

                {/* Interaction row */}
                <div className="px-4 py-3 flex items-center justify-between z-10 bg-black">
                  <div className="flex items-center gap-4">
                    <Heart className="w-6 h-6 text-white" />
                    <MessageCircle className="w-6 h-6 text-white" />
                    <Send className="w-6 h-6 text-white" />
                  </div>
                  <Bookmark className="w-6 h-6 text-white" />
                </div>

                {/* Likes & Caption */}
                <div className="px-4 py-1 flex-1 bg-black z-10 relative pb-16">
                  <div className="text-[13px] font-bold text-white mb-2">18,349 likes</div>
                  <div className="text-[12px] text-white leading-snug">
                    <span className="font-bold mr-1">{handle}</span>
                    <span className="text-zinc-300">{caption.length > 250 ? caption.substring(0,250)+'...' : caption}</span>
                  </div>
                  {hashtags && (
                    <div className="text-[11px] text-[#4d9de0] leading-snug mt-1">
                      {hashtags}
                    </div>
                  )}
                  
                  {/* Floating comment mock */}
                  <div className="absolute bottom-0 inset-x-0 px-4 py-3 border-t border-zinc-900 flex items-center gap-3 bg-black">
                    <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833ab4] to-[#fcb045] flex items-center justify-center flex-shrink-0 text-[9px] font-black text-white">
                      {handle.charAt(0).toUpperCase()}
                    </div>
                    <div className="flex-1 text-[11px] text-zinc-600">Add a comment…</div>
                    <Sparkles className="w-4 h-4 text-zinc-700" />
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

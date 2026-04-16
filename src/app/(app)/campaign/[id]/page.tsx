import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles, ChevronLeft, TrendingUp, Calendar, Zap, DollarSign, Clock } from 'lucide-react';

export const dynamic = 'force-dynamic';

function typeGradient(type: string) {
  const map: Record<string, string> = {
    caption:      'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    reel_script:  'from-[#f953c6] via-[#b91d73] to-[#f953c6]',
    dm_sequence:  'from-[#11998e] via-[#38ef7d] to-[#11998e]',
    bio_template: 'from-[#f7971e] via-[#ffd200] to-[#f7971e]',
  };
  return map[type] || 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]';
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    caption: 'Post', reel_script: 'Reel', dm_sequence: 'DM', bio_template: 'Bio'
  };
  return map[type] || 'Post';
}

function splitCaption(body: string | null) {
  if (!body) return { caption: '', hashtags: '' };
  const idx = body.lastIndexOf('\n\n#');
  if (idx === -1) {
    // Also check for inline hashtags
    const lines = body.split('\n');
    const hashIdx = lines.findIndex(l => l.trim().startsWith('#'));
    if (hashIdx !== -1) {
      return {
        caption: lines.slice(0, hashIdx).join('\n').trim(),
        hashtags: lines.slice(hashIdx).join(' ').trim()
      };
    }
    return { caption: body, hashtags: '' };
  }
  return { caption: body.substring(0, idx).trim(), hashtags: body.substring(idx).trim() };
}

function fakeLikes(id: string) {
  let n = 0;
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) & 0xffff;
  return ((n % 9000) + 1000).toLocaleString();
}

function fakeComments(id: string) {
  let n = 0;
  for (const c of id) n = (n * 17 + c.charCodeAt(0)) & 0xffff;
  return ((n % 400) + 50).toLocaleString();
}

export default async function CampaignDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const campaign = await prisma.campaign.findUnique({
    where: { id },
    include: {
      product: true,
      contentAssets: {
        include: {
          variants: {
            include: {
              schedules: { orderBy: { scheduledFor: 'asc' }, take: 1 }
            }
          }
        },
        orderBy: { createdAt: 'asc' }
      }
    }
  });

  if (!campaign) return notFound();

  const workspace = await prisma.workspace.findFirst({
    include: { instagramAccounts: { take: 1 } }
  });

  const igAccount = workspace?.instagramAccounts?.[0];
  const rawHandle = igAccount?.username || 'insta_growth_hq';
  const handle = rawHandle.startsWith('@') ? rawHandle.slice(1) : rawHandle;

  const totalAssets = campaign.contentAssets.length;
  const totalVariants = campaign.contentAssets.reduce((acc, a) => acc + a.variants.length, 0);
  const scheduledCount = campaign.contentAssets.reduce((acc, a) =>
    acc + a.variants.filter(v => v.schedules.length > 0).length, 0);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto animate-in fade-in duration-500 ease-out overflow-y-auto h-full space-y-8">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Header */}
      <div className="relative z-10 pt-2">
        <Link href="/sectors" className="inline-flex items-center gap-1.5 text-xs font-bold uppercase tracking-widest text-zinc-500 hover:text-white transition-colors bg-white/5 py-1.5 px-3 rounded-lg hover:bg-white/10 mb-5">
          <ChevronLeft className="w-4 h-4" /> Back to Sectors
        </Link>

        <div className="ai-section-label mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-fuchsia-400" /> Live Campaign · Visual Feed
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-2">{campaign.name}</h1>
            <p className="text-sm font-medium text-zinc-500">
              Product: <span className="text-zinc-300 font-bold">{campaign.product.name}</span>
              {' · '}
              Ends <span className="text-zinc-300 font-bold">{new Date(campaign.endDate!).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
            </p>
          </div>
          <div className="flex items-center gap-2">
            <span className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-[11px] font-black text-emerald-400 uppercase tracking-widest">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.8)]" /> Live
            </span>
            <Link href="/calendar" className="flex items-center gap-1.5 text-xs font-bold text-indigo-400 bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 px-3 py-1.5 rounded-lg transition-colors">
              <Calendar className="w-3.5 h-3.5" /> View Calendar
            </Link>
          </div>
        </div>
      </div>

      {/* Stats */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Content Pieces', value: totalAssets, icon: Zap, color: 'text-fuchsia-400' },
          { label: 'Total Variants', value: totalVariants, icon: Sparkles, color: 'text-indigo-400' },
          { label: 'Scheduled', value: scheduledCount, icon: Clock, color: 'text-emerald-400' },
          { label: 'Revenue Model', value: 'Multi-Funnel', icon: DollarSign, color: 'text-amber-400' },
        ].map(s => (
          <div key={s.label} className="glass-panel-ai rounded-2xl p-5 border border-white/[0.05] flex flex-col">
            <s.icon className={`w-5 h-5 ${s.color} mb-3`} />
            <div className={`text-2xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold text-zinc-600 mt-1 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Live Post Grid */}
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-black text-white">Live Post Previews</h2>
          <span className="text-[11px] text-zinc-500 font-bold uppercase tracking-widest">
            Exactly as your audience sees them on Instagram
          </span>
        </div>

        {campaign.contentAssets.length === 0 ? (
          <div className="text-center py-20 glass-panel-ai rounded-2xl border border-white/5">
            <Sparkles className="w-12 h-12 text-zinc-700 mx-auto mb-4" />
            <h3 className="text-lg font-black text-white mb-2">Generating Posts...</h3>
            <p className="text-sm text-zinc-600">Content is being created. Refresh in a moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {campaign.contentAssets.map((asset) => {
              const primaryVariant = asset.variants[0];
              if (!primaryVariant) return null;
              const { caption, hashtags } = splitCaption(primaryVariant.body);
              const isReel = asset.assetType === 'reel_script';
              const hook = primaryVariant.hook || asset.title;
              const scheduledFor = primaryVariant.schedules[0]?.scheduledFor;
              const likes = fakeLikes(asset.id);
              const comments = fakeComments(asset.id);

              let visualUrl = '';
              try {
                if (asset.mediaMetadata) {
                  const parsed = JSON.parse(asset.mediaMetadata);
                  if (parsed.visualUrl) visualUrl = parsed.visualUrl;
                }
              } catch (e) {}

              return (
                <div key={asset.id} className="flex flex-col gap-3 group">
                  {/* Schedule badge */}
                  <div className="flex items-center justify-between px-1">
                    <div className={`text-[10px] font-black px-2.5 py-1 rounded-full border ${
                      asset.assetType === 'reel_script' ? 'bg-rose-500/10 text-rose-400 border-rose-500/20' :
                      asset.assetType === 'dm_sequence' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                      'bg-purple-500/10 text-purple-400 border-purple-500/20'
                    } uppercase tracking-widest`}>
                      {typeLabel(asset.assetType)}
                    </div>
                    {scheduledFor && (
                      <div className="text-[10px] text-zinc-500 font-mono font-bold flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {new Date(scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      </div>
                    )}
                  </div>

                  {/* ── Instagram Phone Frame ── */}
                  <div className="w-full max-w-[380px] mx-auto bg-black border-[6px] border-zinc-900 rounded-[32px] shadow-2xl shadow-black/70 group-hover:shadow-purple-900/30 group-hover:border-zinc-800 transition-all duration-500 overflow-hidden">
                    {/* Status bar */}
                    <div className="flex items-center justify-between px-5 pt-3 pb-1 bg-black">
                      <span className="text-[11px] font-bold text-white">9:41</span>
                      <div className="flex items-center gap-1.5">
                        <div className="flex gap-[2px] items-end h-3">
                          {[3,5,7,9].map((h,i) => <div key={i} style={{height: h}} className="w-[3px] bg-white rounded-sm" />)}
                        </div>
                        <span className="text-[9px] text-white font-bold">5G</span>
                        <div className="w-5 h-2.5 rounded-sm border border-white flex items-center px-px">
                          <div className="w-3 h-1.5 bg-white rounded-[1px]" />
                        </div>
                      </div>
                    </div>

                    {/* Notch */}
                    <div className="absolute top-0 inset-x-0 h-6 flex justify-center z-30 pointer-events-none">
                      <div className="w-28 h-5 bg-zinc-900 rounded-b-2xl" />
                    </div>

                    {/* IG top bar */}
                    <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900 bg-black">
                      <div className="flex items-center gap-2.5">
                        <div className="w-8 h-8 rounded-full p-[2px] bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045]">
                          <div className="w-full h-full rounded-full bg-black flex items-center justify-center border border-black">
                            <span className="text-[11px] font-black text-white">{handle.charAt(0).toUpperCase()}</span>
                          </div>
                        </div>
                        <div className="leading-tight">
                          <div className="text-[13px] font-bold text-white">{handle}</div>
                          <div className="text-[10px] text-zinc-500">Sponsored</div>
                        </div>
                      </div>
                      <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                    </div>

                    {/* Post visual */}
                    <div className="relative w-full aspect-[4/5] overflow-hidden bg-zinc-900 group/visual">
                      {visualUrl ? (
                         <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover/visual:scale-105" style={{ backgroundImage: `url(${visualUrl})` }} />
                      ) : (
                         <div className={`absolute inset-0 bg-gradient-to-tr ${typeGradient(asset.assetType)}`} />
                      )}

                      {/* Contrast Overlay for Text */}
                      <div className="absolute inset-0 bg-black/40" />

                      {/* Noise grain */}
                      <div className="absolute inset-0 opacity-10" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.4'/%3E%3C/svg%3E")`
                      }} />

                      {isReel && (
                        <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 border border-white/10 z-10">
                          <div className="w-3 h-3 rounded-sm border-2 border-white" />
                          <span className="text-[9px] font-black text-white tracking-wider">REELS</span>
                        </div>
                      )}

                      {/* Hook text */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-10">
                        <div className="text-white font-black text-[20px] uppercase leading-[1.1] tracking-tight drop-shadow-[0_4px_25px_rgba(0,0,0,0.9)] w-full"
                          style={{ textShadow: '0 2px 15px rgba(0,0,0,0.8), 0 4px 30px rgba(0,0,0,0.5)' }}>
                          {hook.length > 90 ? hook.substring(0, 90) + '…' : hook}
                        </div>
                      </div>

                      {/* Bottom fade */}
                      <div className="absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-black to-transparent" />
                    </div>

                    {/* Actions */}
                    <div className="px-4 pt-2.5 pb-1 flex items-center justify-between bg-black">
                      <div className="flex items-center gap-4">
                        <Heart className="w-6 h-6 text-white" strokeWidth={1.8} />
                        <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.8} />
                        <Send className="w-6 h-6 text-white" strokeWidth={1.8} />
                      </div>
                      <Bookmark className="w-6 h-6 text-white" strokeWidth={1.8} />
                    </div>

                    {/* Likes + Caption + Hashtags */}
                    <div className="px-4 pb-2 bg-black">
                      <div className="text-[13px] font-bold text-white mb-1.5">
                        {likes} likes · <span className="text-zinc-400 font-medium">{comments} comments</span>
                      </div>
                      <div className="text-[12px] text-white leading-snug">
                        <span className="font-bold mr-1">{handle}</span>
                        <span className="text-zinc-300">
                          {caption.length > 200 ? caption.substring(0, 200) + '…' : caption}
                        </span>
                      </div>
                      {hashtags && (
                        <div className="text-[11px] text-[#4d9de0] leading-snug mt-1 line-clamp-2">
                          {hashtags}
                        </div>
                      )}
                    </div>

                    {/* Variants count */}
                    {asset.variants.length > 1 && (
                      <div className="px-4 py-2 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
                        <span className="text-[10px] text-zinc-600 font-bold uppercase tracking-widest">
                          {asset.variants.length} variants (A/B ready)
                        </span>
                        <span className="text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                          {asset.variants[1]?.variantTag}
                        </span>
                      </div>
                    )}

                    {/* Schedule footer */}
                    <div className="px-4 py-2.5 bg-black border-t border-zinc-900 flex items-center justify-between">
                      <div className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                        {scheduledFor
                          ? new Date(scheduledFor).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
                          : 'Not yet scheduled'}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.8)]" />
                        <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Pending Post</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Image, Tv2, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatDate(d: Date) {
  const now = new Date();
  const diff = Math.floor((new Date(d).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return `In ${diff} days`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    caption: 'Post',
    reel_script: 'Reel',
    dm_sequence: 'DM',
    bio_template: 'Bio',
    story: 'Story'
  };
  return map[type] || type;
}

function typeColor(type: string) {
  const map: Record<string, string> = {
    caption: 'from-indigo-500 to-purple-600',
    reel_script: 'from-rose-500 to-orange-500',
    dm_sequence: 'from-emerald-500 to-teal-500',
    bio_template: 'from-amber-500 to-yellow-400',
    story: 'from-pink-500 to-fuchsia-600'
  };
  return map[type] || 'from-indigo-500 to-purple-600';
}

function typeBadge(type: string) {
  const map: Record<string, string> = {
    caption: 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30',
    reel_script: 'bg-rose-500/15 text-rose-300 border-rose-500/30',
    dm_sequence: 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30',
    bio_template: 'bg-amber-500/15 text-amber-300 border-amber-500/30',
  };
  return map[type] || 'bg-indigo-500/15 text-indigo-300 border-indigo-500/30';
}

// Split caption body from hashtags for Instagram display
function splitCaption(body: string | null) {
  if (!body) return { caption: '', hashtags: '' };
  const hashtagStart = body.lastIndexOf('\n\n#');
  if (hashtagStart === -1) return { caption: body, hashtags: '' };
  return {
    caption: body.substring(0, hashtagStart).trim(),
    hashtags: body.substring(hashtagStart).trim()
  };
}

export default async function PreviewPage() {
  const schedules = await prisma.schedule.findMany({
    include: {
      variant: {
        include: {
          asset: true
        }
      }
    },
    orderBy: { scheduledFor: 'asc' },
    take: 30
  });

  const workspace = await prisma.workspace.findFirst({ 
    include: { instagramAccounts: { take: 1 } }
  });

  const igAccount = workspace?.instagramAccounts?.[0];
  const username = igAccount?.username || 'yourhandle';
  const profilePic = igAccount?.profilePicUrl;

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Header */}
      <div className="relative z-10 pt-2">
        <div className="ai-section-label mb-3">Workspace Â· Instagram Preview</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Post Preview</h1>
            <p className="text-sm font-medium text-zinc-500 mt-2">
              {schedules.length} posts scheduled Â· See exactly how each will appear on Instagram
            </p>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl border border-white/[0.07]">
              <div className="w-2 h-2 rounded-full bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.6)]" />
              <span className="text-xs font-bold text-emerald-400">@{username}</span>
            </div>
            <div className="flex items-center gap-2 px-4 py-2 glass-panel rounded-xl border border-white/[0.07]">
              <Sparkles className="w-3.5 h-3.5 text-rose-400" />
              <span className="text-xs font-bold text-zinc-300">Instagram Preview</span>
            </div>
          </div>
        </div>
      </div>

      {/* Stats bar */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { label: 'Posts Scheduled', value: schedules.filter(s => s.variant.asset.assetType === 'caption' || !s.variant.asset.assetType).length, color: 'text-indigo-400' },
          { label: 'Reels Scheduled', value: schedules.filter(s => s.variant.asset.assetType === 'reel_script').length, color: 'text-rose-400' },
          { label: 'DM Sequences', value: schedules.filter(s => s.variant.asset.assetType === 'dm_sequence').length, color: 'text-emerald-400' },
          { label: 'Days Covered', value: schedules.length, color: 'text-purple-400' },
        ].map(stat => (
          <div key={stat.label} className="glass-panel-ai rounded-2xl p-4 border border-white/[0.05] text-center">
            <div className={`text-3xl font-black ${stat.color}`}>{stat.value}</div>
            <div className="text-[11px] font-bold text-zinc-500 mt-1 uppercase tracking-widest">{stat.label}</div>
          </div>
        ))}
      </div>

      {/* Preview Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {schedules.map((schedule, idx) => {
          const asset = schedule.variant.asset;
          const variant = schedule.variant;
          const { caption, hashtags } = splitCaption(variant.body);
          const isReel = asset.assetType === 'reel_script';

          return (
            <div key={schedule.id} className="group flex flex-col gap-3">
              {/* Schedule Meta */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2">
                  <div className="w-6 h-6 rounded-lg bg-white/[0.05] border border-white/[0.08] flex items-center justify-center text-[10px] font-black text-zinc-500">
                    {idx + 1}
                  </div>
                  <div>
                    <div className="text-[12px] font-black text-zinc-200">{formatDate(schedule.scheduledFor)}</div>
                    <div className="text-[11px] text-zinc-600">{formatTime(schedule.scheduledFor)}</div>
                  </div>
                </div>
                <span className={`text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded-full border ${typeBadge(asset.assetType)}`}>
                  {typeLabel(asset.assetType)}
                </span>
              </div>

              {/* Instagram Phone Mockup */}
              <div className="bg-[#0a0a0a] border border-white/[0.08] rounded-3xl overflow-hidden shadow-2xl shadow-black/60 group-hover:shadow-indigo-500/10 group-hover:border-white/[0.15] transition-all duration-300">

                {/* Instagram App Header */}
                <div className="flex items-center justify-between px-4 py-3 border-b border-white/[0.05]">
                  <div className="flex items-center gap-3">
                    {/* Profile Avatar */}
                    <div className={`w-9 h-9 rounded-full bg-gradient-to-br ${typeColor(asset.assetType)} p-[2px] flex-shrink-0`}>
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden">
                        {profilePic ? (
                          <img src={profilePic} alt="profile" className="w-full h-full object-cover rounded-full" />
                        ) : (
                          <span className="text-[11px] font-black text-white">{username.charAt(0).toUpperCase()}</span>
                        )}
                      </div>
                    </div>
                    <div>
                      <div className="text-[13px] font-bold text-white leading-tight">@{username}</div>
                      <div className="text-[10px] text-zinc-500">Sponsored</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                </div>

                {/* Post Image / Reel placeholder */}
                <div className={`relative w-full aspect-square bg-gradient-to-br ${typeColor(asset.assetType)} flex-shrink-0 overflow-hidden`}>
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-6">
                    {isReel && (
                      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-sm rounded-lg px-2 py-1 flex items-center gap-1.5">
                        <div className="w-3 h-3 rounded-sm bg-white/80" />
                        <span className="text-[10px] font-bold text-white">REELS</span>
                      </div>
                    )}
                    <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/20 flex items-center justify-center mb-4 shadow-inner">
                      <Sparkles className="w-7 h-7 text-white opacity-80" />
                    </div>
                    <div className="text-white font-black text-[15px] leading-snug drop-shadow-lg max-w-[90%]">
                      {variant.hook || asset.title}
                    </div>
                  </div>
                  {/* Gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                </div>

                {/* Instagram Actions */}
                <div className="px-4 py-3 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-5">
                      <Heart className="w-6 h-6 text-zinc-300 cursor-pointer hover:text-red-400 transition-colors" strokeWidth={1.5} />
                      <MessageCircle className="w-6 h-6 text-zinc-300 cursor-pointer hover:text-white transition-colors" strokeWidth={1.5} />
                      <Send className="w-6 h-6 text-zinc-300 cursor-pointer hover:text-white transition-colors" strokeWidth={1.5} />
                    </div>
                    <Bookmark className="w-6 h-6 text-zinc-300 cursor-pointer hover:text-white transition-colors" strokeWidth={1.5} />
                  </div>

                  {/* Likes */}
                  <div className="text-[12px] font-bold text-zinc-200">
                    {(Math.floor(Math.random() * 900) + 100).toLocaleString()} likes
                  </div>

                  {/* Caption Preview */}
                  <div className="space-y-1">
                    <div className="text-[12px] text-zinc-200 leading-relaxed">
                      <span className="font-bold text-white">@{username} </span>
                      <span className="line-clamp-4">{caption.length > 200 ? caption.substring(0, 200) + 'â€¦' : caption}</span>
                    </div>
                    {hashtags && (
                      <div className="text-[11px] text-blue-400 font-medium line-clamp-1 opacity-70">
                        {hashtags.split(' ').slice(0, 5).join(' ')}â€¦
                      </div>
                    )}
                  </div>

                  {/* Timestamp */}
                  <div className="text-[10px] text-zinc-600 uppercase tracking-widest pb-1">
                    {formatDate(schedule.scheduledFor)} Â· {formatTime(schedule.scheduledFor)} Â· PENDING
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {schedules.length === 0 && (
        <div className="relative z-10 text-center py-20">
          <div className="w-20 h-20 rounded-2xl bg-white/[0.03] border border-white/[0.07] flex items-center justify-center mx-auto mb-6">
            <Sparkles className="w-10 h-10 text-zinc-700" />
          </div>
          <h2 className="text-xl font-black text-white">No posts scheduled yet</h2>
          <p className="text-sm text-zinc-600 mt-2">Schedule content from the Calendar page to see previews here.</p>
        </div>
      )}
    </div>
  );
}

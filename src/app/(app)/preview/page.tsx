import { prisma } from '@/lib/prisma';
import { Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Sparkles } from 'lucide-react';

export const dynamic = 'force-dynamic';

function formatScheduleLabel(d: Date) {
  const now = new Date();
  const diff = Math.floor((new Date(d).getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
  if (diff === 0) return 'Today';
  if (diff === 1) return 'Tomorrow';
  if (diff < 7) return `In ${diff} days`;
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
}

function formatTime(d: Date) {
  return new Date(d).toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
}

function typeLabel(type: string) {
  const map: Record<string, string> = {
    caption: 'Post', reel_script: 'Reel',
    dm_sequence: 'DM Sequence', bio_template: 'Bio',
  };
  return map[type] || 'Post';
}

function typeGradient(type: string) {
  const map: Record<string, string> = {
    caption:      'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]',
    reel_script:  'from-[#f953c6] via-[#b91d73] to-[#f953c6]',
    dm_sequence:  'from-[#11998e] via-[#38ef7d] to-[#11998e]',
    bio_template: 'from-[#f7971e] via-[#ffd200] to-[#f7971e]',
  };
  return map[type] || 'from-[#833ab4] via-[#fd1d1d] to-[#fcb045]';
}

function typeBadge(type: string) {
  const map: Record<string, string> = {
    caption:      'bg-purple-500/20 text-purple-300 border-purple-500/30',
    reel_script:  'bg-rose-500/20 text-rose-300 border-rose-500/30',
    dm_sequence:  'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
    bio_template: 'bg-amber-500/20 text-amber-300 border-amber-500/30',
  };
  return map[type] || 'bg-purple-500/20 text-purple-300 border-purple-500/30';
}

function splitCaption(body: string | null) {
  if (!body) return { caption: '', hashtags: '' };
  const idx = body.lastIndexOf('\n\n#');
  if (idx === -1) return { caption: body, hashtags: '' };
  return { caption: body.substring(0, idx).trim(), hashtags: body.substring(idx).trim() };
}

// Deterministic "like" count so it doesn't flicker on refresh
function fakeLikes(id: string) {
  let n = 0;
  for (const c of id) n = (n * 31 + c.charCodeAt(0)) & 0xffff;
  return ((n % 900) + 100).toLocaleString();
}

export default async function PreviewPage() {
  // Top 15 scheduled posts only
  const schedules = await prisma.schedule.findMany({
    include: { variant: { include: { asset: true } } },
    orderBy: { scheduledFor: 'asc' },
    take: 15,
  });

  const workspace = await prisma.workspace.findFirst({
    include: { instagramAccounts: { take: 1 } }
  });

  const igAccount = workspace?.instagramAccounts?.[0];
  // Strip any leading @ to avoid @@
  const rawHandle = igAccount?.username || 'yourhandle';
  const handle = rawHandle.startsWith('@') ? rawHandle.slice(1) : rawHandle;

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Header */}
      <div className="relative z-10 pt-2">
        <div className="ai-section-label mb-3">Workspace · Instagram Preview</div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">Post Preview</h1>
            <p className="text-sm font-medium text-zinc-500 mt-2">
              Top {schedules.length} scheduled posts · exactly as they'll appear on Instagram
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2.5 glass-panel rounded-xl border border-white/[0.08]">
            {/* Instagram gradient icon */}
            <div className="w-6 h-6 rounded-md bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex items-center justify-center">
              <div className="w-3.5 h-3.5 rounded-sm border-2 border-white/80" />
            </div>
            <span className="text-[13px] font-bold text-white">@{handle}</span>
            <span className="text-[11px] text-zinc-500">· {schedules.length} upcoming</span>
          </div>
        </div>
      </div>

      {/* Stats row */}
      <div className="relative z-10 grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { label: 'Posts', value: schedules.filter(s => s.variant.asset.assetType === 'caption').length, color: 'text-purple-400' },
          { label: 'Reels', value: schedules.filter(s => s.variant.asset.assetType === 'reel_script').length, color: 'text-rose-400' },
          { label: 'DM Sequences', value: schedules.filter(s => s.variant.asset.assetType === 'dm_sequence').length, color: 'text-emerald-400' },
          { label: 'Days Covered', value: schedules.length, color: 'text-indigo-400' },
        ].map(s => (
          <div key={s.label} className="glass-panel-ai rounded-2xl p-4 border border-white/[0.05] text-center">
            <div className={`text-3xl font-black ${s.color}`}>{s.value}</div>
            <div className="text-[10px] font-bold text-zinc-600 mt-1 uppercase tracking-widest">{s.label}</div>
          </div>
        ))}
      </div>

      {/* Instagram Phone Mockup Grid */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {schedules.map((schedule, idx) => {
          const asset = schedule.variant.asset;
          const variant = schedule.variant;
          const { caption, hashtags } = splitCaption(variant.body);
          const isReel = asset.assetType === 'reel_script';
          const hook = variant.hook || asset.title;
          const likes = fakeLikes(schedule.id);

          return (
            <div key={schedule.id} className="flex flex-col gap-3 group">

              {/* Schedule meta badge */}
              <div className="flex items-center justify-between px-1">
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-[11px] font-black text-zinc-500 tabular-nums">
                    {String(idx + 1).padStart(2, '0')}
                  </div>
                  <div>
                    <div className="text-[13px] font-black text-zinc-100 leading-tight">{formatScheduleLabel(schedule.scheduledFor)}</div>
                    <div className="text-[11px] text-zinc-600 font-medium">{formatTime(schedule.scheduledFor)}</div>
                  </div>
                </div>
                <div className={`text-[10px] font-black tracking-widest uppercase px-2.5 py-1 rounded-full border ${typeBadge(asset.assetType)}`}>
                  {typeLabel(asset.assetType)}
                </div>
              </div>

              {/* --- Instagram Phone Frame --- */}
              <div className="bg-black border border-zinc-800 rounded-[28px] overflow-hidden shadow-2xl shadow-black/70 group-hover:shadow-purple-900/20 group-hover:border-zinc-700 transition-all duration-300">

                {/* Status bar */}
                <div className="flex items-center justify-between px-5 pt-3 pb-1">
                  <span className="text-[11px] font-bold text-white">9:41</span>
                  <div className="flex items-center gap-1.5">
                    <div className="flex gap-[2px] items-end h-3">
                      {[3,5,7,9].map((h,i) => <div key={i} style={{height: h}} className="w-[3px] bg-white rounded-sm" />)}
                    </div>
                    <div className="text-[9px] text-white font-bold">WiFi</div>
                    <div className="w-5 h-2.5 rounded-sm border border-white flex items-center px-px">
                      <div className="w-3 h-1.5 bg-white rounded-[1px]" />
                    </div>
                  </div>
                </div>

                {/* Instagram app top bar */}
                <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-900">
                  <div className="flex items-center gap-2.5">
                    {/* Avatar ring */}
                    <div className="w-9 h-9 rounded-full p-[2px] bg-gradient-to-br from-[#833ab4] via-[#fd1d1d] to-[#fcb045] flex-shrink-0">
                      <div className="w-full h-full rounded-full bg-zinc-900 flex items-center justify-center border border-black">
                        <span className="text-[12px] font-black text-white">{handle.charAt(0).toUpperCase()}</span>
                      </div>
                    </div>
                    <div className="leading-tight">
                      <div className="text-[13px] font-bold text-white">{handle}</div>
                      <div className="text-[10px] text-zinc-500">Sponsored</div>
                    </div>
                  </div>
                  <MoreHorizontal className="w-5 h-5 text-zinc-500" />
                </div>

                {/* Post image area */}
                <div className="relative w-full aspect-square overflow-hidden">
                  <div className={`absolute inset-0 bg-gradient-to-br ${typeGradient(asset.assetType)}`} />
                  {/* Grain texture overlay */}
                  <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\'0 0 256 256\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cfilter id=\'noise\'%3E%3CfeTurbulence type=\'fractalNoise\' baseFrequency=\'0.9\' numOctaves=\'4\' stitchTiles=\'stitch\'/%3E%3C/filter%3E%3Crect width=\'100%25\' height=\'100%25\' filter=\'url(%23noise)\' opacity=\'0.4\'/%3E%3C/svg%3E")' }} />

                  {/* Reel indicator */}
                  {isReel && (
                    <div className="absolute top-3 right-3 flex items-center gap-1.5 bg-black/50 backdrop-blur-md rounded-lg px-2.5 py-1.5 border border-white/10">
                      <div className="w-3.5 h-3.5 rounded-sm border-2 border-white" />
                      <span className="text-[10px] font-black text-white tracking-wider">REELS</span>
                    </div>
                  )}

                  {/* Hook text centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                    <div className="text-white font-black text-[18px] leading-snug drop-shadow-2xl max-w-[85%]"
                      style={{ textShadow: '0 2px 20px rgba(0,0,0,0.5)' }}>
                      {hook.length > 80 ? hook.substring(0, 80) + '…' : hook}
                    </div>
                  </div>

                  {/* Bottom gradient fade */}
                  <div className="absolute bottom-0 inset-x-0 h-16 bg-gradient-to-t from-black/60 to-transparent" />
                </div>

                {/* Actions row */}
                <div className="px-4 pt-3 pb-1 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <Heart className="w-6 h-6 text-white" strokeWidth={1.8} />
                    <MessageCircle className="w-6 h-6 text-white" strokeWidth={1.8} />
                    <Send className="w-6 h-6 text-white" strokeWidth={1.8} />
                  </div>
                  <Bookmark className="w-6 h-6 text-white" strokeWidth={1.8} />
                </div>

                {/* Likes */}
                <div className="px-4 py-1">
                  <span className="text-[13px] font-bold text-white">{likes} likes</span>
                </div>

                {/* Caption */}
                <div className="px-4 pb-2 space-y-1">
                  <p className="text-[12px] text-white leading-snug">
                    <span className="font-bold">{handle}</span>{' '}
                    <span className="text-zinc-300">{caption.length > 160 ? caption.substring(0, 160) + '…' : caption}</span>
                  </p>
                  {hashtags && (
                    <p className="text-[11px] text-[#4d9de0] leading-snug line-clamp-1">
                      {hashtags.split(' ').slice(0, 6).join(' ')}
                    </p>
                  )}
                </div>

                {/* Comment input mock */}
                <div className="px-4 py-3 border-t border-zinc-900 flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-[#833ab4] to-[#fcb045] flex items-center justify-center text-[9px] font-black text-white flex-shrink-0">
                    {handle.charAt(0).toUpperCase()}
                  </div>
                  <div className="flex-1 text-[11px] text-zinc-600">Add a comment…</div>
                  <Sparkles className="w-4 h-4 text-zinc-700" />
                </div>

                {/* Schedule footer */}
                <div className="px-4 py-2.5 bg-zinc-950 border-t border-zinc-900 flex items-center justify-between">
                  <div className="text-[10px] text-zinc-600 font-medium uppercase tracking-widest">
                    {formatScheduleLabel(schedule.scheduledFor)} · {formatTime(schedule.scheduledFor)}
                  </div>
                  <div className="flex items-center gap-1.5">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_rgba(251,191,36,0.6)]" />
                    <span className="text-[10px] text-amber-400 font-bold uppercase tracking-widest">Pending</span>
                  </div>
                </div>
              </div>

            </div>
          );
        })}
      </div>

      {schedules.length === 0 && (
        <div className="relative z-10 text-center py-20">
          <h2 className="text-xl font-black text-white">No posts scheduled yet</h2>
          <p className="text-sm text-zinc-600 mt-2">Go to Calendar → Schedule Content to add posts.</p>
        </div>
      )}
    </div>
  );
}

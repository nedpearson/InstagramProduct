'use client';

import { useState, useTransition, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { scheduleContentAction } from '@/app/(app)/actions';
import { Plus, X, Calendar, Clock, Zap } from 'lucide-react';

interface Asset {
  id: string;
  title: string;
  assetType: string;
  variants: { id: string; variantTag: string | null }[];
}

interface ScheduleModalProps {
  assets: Asset[];
}

export function ScheduleModal({ assets }: ScheduleModalProps) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [selectedAssetId, setSelectedAssetId] = useState('');
  const [selectedVariantId, setSelectedVariantId] = useState('');
  const [scheduledFor, setScheduledFor] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    d.setHours(9, 0, 0, 0);
    return d.toISOString().slice(0, 16);
  });
  const [isPending, startTransition] = useTransition();
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const selectedAsset = assets.find(a => a.id === selectedAssetId);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!selectedVariantId || !scheduledFor) return;
    const fd = new FormData();
    fd.set('variantId', selectedVariantId);
    fd.set('scheduledFor', new Date(scheduledFor).toISOString());
    startTransition(async () => {
      await scheduleContentAction(fd);
      setSuccess(true);
      setTimeout(() => {
        setOpen(false);
        setSuccess(false);
        setSelectedAssetId('');
        setSelectedVariantId('');
      }, 1200);
    });
  }

  return (
    <>
      {/* Trigger Button */}
      <button
        onClick={() => setOpen(true)}
        className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 flex items-center gap-2 transition-all active:scale-95"
      >
        <Plus className="w-3.5 h-3.5" /> Schedule Content
      </button>

      {/* Modal Overlay */}
      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setOpen(false)} />
          <div className="relative w-full max-w-lg glass-panel-ai rounded-2xl border border-white/[0.1] shadow-2xl shadow-black/60 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-300">
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-5 border-b border-white/[0.07] bg-white/[0.02]">
              <div>
                <div className="ai-section-label mb-1">Content Calendar · New Post</div>
                <h2 className="text-[16px] font-black text-white tracking-tight">Schedule Content</h2>
              </div>
              <button onClick={() => setOpen(false)} className="p-2 rounded-lg hover:bg-white/[0.07] text-zinc-500 hover:text-white transition-colors">
                <X className="w-4 h-4" />
              </button>
            </div>

            {success ? (
              <div className="px-6 py-12 text-center">
                <div className="w-14 h-14 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-4 shadow-inner">
                  <Zap className="w-7 h-7 text-emerald-400" />
                </div>
                <p className="text-[15px] font-black text-white">Post Scheduled!</p>
                <p className="text-[12px] text-zinc-500 font-medium mt-1">Added to your content calendar.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="px-6 py-5 space-y-5">
                {/* Asset Selector */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Content Asset</label>
                  <select
                    value={selectedAssetId}
                    onChange={e => { setSelectedAssetId(e.target.value); setSelectedVariantId(''); }}
                    required
                    className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-[13px] font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                  >
                    <option value="" className="bg-zinc-900">Select an asset…</option>
                    {assets.map(a => (
                      <option key={a.id} value={a.id} className="bg-zinc-900">{a.title} ({a.assetType})</option>
                    ))}
                  </select>
                </div>

                {/* Variant Selector */}
                {selectedAsset && (
                  <div>
                    <label className="block text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Variant</label>
                    <select
                      value={selectedVariantId}
                      onChange={e => setSelectedVariantId(e.target.value)}
                      required
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-[13px] font-medium rounded-xl px-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all"
                    >
                      <option value="" className="bg-zinc-900">Select a variant…</option>
                      {selectedAsset.variants.map(v => (
                        <option key={v.id} value={v.id} className="bg-zinc-900">{v.variantTag || `Variant ${v.id.slice(-6)}`}</option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Date/Time */}
                <div>
                  <label className="block text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Schedule For</label>
                  <div className="relative">
                    <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500 pointer-events-none" />
                    <input
                      type="datetime-local"
                      value={scheduledFor}
                      onChange={e => setScheduledFor(e.target.value)}
                      required
                      min={new Date().toISOString().slice(0, 16)}
                      className="w-full bg-white/[0.04] border border-white/[0.08] text-white text-[13px] font-medium rounded-xl pl-11 pr-4 py-3 focus:outline-none focus:border-indigo-500/50 focus:bg-white/[0.06] transition-all [color-scheme:dark]"
                    />
                  </div>
                </div>

                {/* Submit */}
                <div className="flex gap-3 pt-2">
                  <button type="button" onClick={() => setOpen(false)} className="flex-1 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-zinc-300 font-bold text-[13px] rounded-xl transition-all active:scale-95">
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={isPending || !selectedVariantId}
                    className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold text-[13px] rounded-xl transition-all active:scale-95 flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Clock className="w-3.5 h-3.5" />
                    {isPending ? 'Scheduling…' : 'Schedule Post'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

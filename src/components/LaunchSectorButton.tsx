'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronRight, Loader2, Sparkles, Zap } from 'lucide-react';
import { createBriefWithSectorAction } from '@/app/(app)/actions';

interface Props {
  sectorName: string;
  sectorNiche: string;
  ctaKeyword: string;
  fullPipeline?: boolean;
}

export function LaunchSectorButton({ sectorName, sectorNiche, ctaKeyword, fullPipeline }: Props) {
  const [isPending, startTransition] = useTransition();
  const [status, setStatus] = useState<'idle' | 'generating' | 'redirecting'>('idle');
  const router = useRouter();

  function handleLaunch() {
    startTransition(async () => {
      setStatus('generating');
      try {
        const result = await createBriefWithSectorAction(sectorNiche, ctaKeyword, fullPipeline);
        setStatus('redirecting');
        if (result.campaignId) {
          router.push(`/campaign/${result.campaignId}`);
        } else {
          router.push('/preview');
        }
      } catch (e) {
        setStatus('idle');
      }
    });
  }

  if (fullPipeline) {
    return (
      <button
        onClick={handleLaunch}
        disabled={isPending}
        className="px-8 py-4 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-60 text-white font-black text-sm rounded-xl shadow-[0_0_30px_rgba(217,70,239,0.3)] hover:shadow-[0_0_50px_rgba(217,70,239,0.5)] transition-all active:scale-95 flex items-center gap-2.5 mx-auto uppercase tracking-wide"
      >
        {status === 'generating' ? (
          <><Loader2 className="w-4 h-4 animate-spin" /> Generating Full Pipeline...</>
        ) : status === 'redirecting' ? (
          <><Zap className="w-4 h-4 animate-pulse" /> Opening Campaign...</>
        ) : (
          <><Sparkles className="w-4 h-4" /> Launch All 5 Sectors Now</>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleLaunch}
      disabled={isPending}
      className="flex items-center gap-1.5 text-[12px] font-black text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500 px-4 py-2.5 rounded-xl transition-all disabled:opacity-60 uppercase tracking-wider shadow-lg hover:shadow-indigo-500/30 active:scale-95"
    >
      {status === 'generating' ? (
        <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating...</>
      ) : status === 'redirecting' ? (
        <><Zap className="w-3.5 h-3.5 animate-pulse" /> Opening...</>
      ) : (
        <><ChevronRight className="w-3.5 h-3.5" /> Launch Campaign</>
      )}
    </button>
  );
}

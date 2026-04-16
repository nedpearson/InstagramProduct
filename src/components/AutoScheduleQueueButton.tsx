'use client';

import { useTransition } from 'react';
import { Sparkles, Loader2 } from 'lucide-react';
import { autoScheduleQueueAction } from '@/app/(app)/actions';

export function AutoScheduleQueueButton() {
  const [isPending, startTransition] = useTransition();

  return (
    <button
      onClick={() => startTransition(() => autoScheduleQueueAction())}
      disabled={isPending}
      className="px-5 py-2.5 bg-fuchsia-600 hover:bg-fuchsia-500 disabled:opacity-50 disabled:cursor-not-allowed text-white font-bold text-[13px] rounded-xl shadow-[0_0_20px_rgba(192,38,211,0.2)] hover:shadow-[0_0_30px_rgba(192,38,211,0.4)] flex items-center gap-2 transition-all active:scale-95"
    >
      {isPending ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5" />} 
      Auto-Slot Unscheduled
    </button>
  );
}

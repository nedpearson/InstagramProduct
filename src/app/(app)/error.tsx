'use client';

import { AlertTriangle, RotateCcw } from 'lucide-react';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-6 relative">
      <div className="mesh-bg-1" />
      <div className="relative z-10 max-w-md w-full glass-panel-ai border border-red-500/20 p-8 rounded-2xl shadow-xl text-center">
        {/* Icon */}
        <div className="w-14 h-14 bg-red-500/[0.08] border border-red-500/20 rounded-2xl flex items-center justify-center mx-auto mb-5 shadow-inner">
          <AlertTriangle className="w-6 h-6 text-red-400" />
        </div>

        <div className="ai-section-label mb-3 justify-center flex">System Exception</div>
        <h2 className="text-xl font-black text-white tracking-tight mb-2">Something went wrong</h2>
        <p className="text-[13px] text-zinc-500 font-medium leading-relaxed mb-7 max-w-xs mx-auto">
          {error.message || 'An unexpected error occurred in the neural pipeline.'}
        </p>

        <button
          onClick={() => reset()}
          className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95"
        >
          <RotateCcw className="w-3.5 h-3.5" /> Retry
        </button>

        {error.digest && (
          <p className="mt-5 text-[10px] font-mono text-zinc-700">ref: {error.digest}</p>
        )}
      </div>
    </div>
  );
}

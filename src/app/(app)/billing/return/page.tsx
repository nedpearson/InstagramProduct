'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import { CheckCircle2, XCircle, Loader2, Zap } from 'lucide-react';

export default function BillingReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [status, setStatus] = useState<'loading' | 'success' | 'canceled'>('loading');

  useEffect(() => {
    const success = searchParams.get('success');
    const canceled = searchParams.get('canceled');
    const expired = searchParams.get('expired');

    if (success === 'true') {
      setStatus('success');
      // Redirect to billing after 3s to show the real state
      setTimeout(() => router.push('/billing'), 3000);
    } else if (canceled === 'true') {
      setStatus('canceled');
    } else if (expired === 'true') {
      setStatus('canceled');
    } else {
      router.push('/billing');
    }
  }, [searchParams, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-[#030304] flex items-center justify-center">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
      </div>
    );
  }

  if (status === 'success') {
    return (
      <div className="min-h-screen bg-[#030304] text-white flex flex-col items-center justify-center px-6">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[300px] bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="relative z-10 max-w-md w-full text-center">
          <div className="w-16 h-16 rounded-2xl bg-emerald-500/15 border border-emerald-500/25 flex items-center justify-center mx-auto mb-6 shadow-xl">
            <CheckCircle2 className="w-8 h-8 text-emerald-400" />
          </div>
          <h1 className="text-3xl font-black tracking-tighter text-white mb-3">
            Payment confirmed!
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium leading-relaxed mb-8">
            Your subscription is being activated. This usually takes a few seconds.
            You&apos;ll be redirected to your billing dashboard shortly.
          </p>
          <div className="flex items-center justify-center gap-2 text-[12px] text-zinc-500 font-medium">
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
            Activating your plan...
          </div>
          <div className="mt-6">
            <Link
              href="/billing"
              className="text-indigo-400 hover:text-indigo-300 text-[13px] font-bold transition-colors"
            >
              Go to billing dashboard →
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#030304] text-white flex flex-col items-center justify-center px-6">
      <div className="relative z-10 max-w-md w-full text-center">
        <div className="w-16 h-16 rounded-2xl bg-amber-500/15 border border-amber-500/25 flex items-center justify-center mx-auto mb-6 shadow-xl">
          <XCircle className="w-8 h-8 text-amber-400" />
        </div>
        <h1 className="text-3xl font-black tracking-tighter text-white mb-3">
          Payment not completed
        </h1>
        <p className="text-[15px] text-zinc-400 font-medium leading-relaxed mb-8">
          No charge was made. You can try again whenever you&apos;re ready.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/billing"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[14px] rounded-xl transition-all shadow-lg"
          >
            <Zap className="w-4 h-4" />
            View plans
          </Link>
          <Link
            href="/overview"
            className="inline-flex items-center justify-center px-6 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-zinc-300 font-semibold text-[14px] rounded-xl transition-all"
          >
            Return to dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}

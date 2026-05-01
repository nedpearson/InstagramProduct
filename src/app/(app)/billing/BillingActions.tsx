'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowRight, Settings2, Loader2, X } from 'lucide-react';

// ─── Manage Billing Portal Button ─────────────────────────────────────────────

export function ManageBillingButton() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleManage = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to open billing portal');
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleManage}
        disabled={loading}
        className="px-4 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white font-bold text-[12px] rounded-xl transition-all shadow-inner active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
      >
        {loading ? (
          <Loader2 className="w-3.5 h-3.5 animate-spin" />
        ) : (
          <Settings2 className="w-3.5 h-3.5 text-zinc-400" />
        )}
        {loading ? 'Opening...' : 'Manage'}
      </button>
      {error && <p className="text-[10px] text-red-400 font-medium">{error}</p>}
    </div>
  );
}

// ─── Cancel Subscription Button ───────────────────────────────────────────────

export function CancelSubscriptionButton() {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleCancel = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/billing/portal', { method: 'DELETE' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to cancel subscription');
      setDone(true);
      setConfirming(false);
      router.refresh();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div className="px-5 py-2.5 bg-emerald-500/[0.08] border border-emerald-500/20 text-emerald-400 font-bold text-[12px] rounded-xl">
        ✓ Cancellation scheduled — access continues until period end
      </div>
    );
  }

  if (confirming) {
    return (
      <div className="flex flex-col gap-2">
        <p className="text-[12px] text-amber-400 font-medium">
          Are you sure? You will lose access at the end of your billing period.
        </p>
        <div className="flex gap-2">
          <button
            onClick={handleCancel}
            disabled={loading}
            className="px-5 py-2.5 bg-red-600 hover:bg-red-500 text-white font-bold text-[12px] rounded-xl transition-all active:scale-95 flex items-center gap-1.5 disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            {loading ? 'Cancelling...' : 'Yes, Cancel Subscription'}
          </button>
          <button
            onClick={() => setConfirming(false)}
            className="px-4 py-2.5 bg-white/[0.04] border border-white/[0.08] text-zinc-400 font-bold text-[12px] rounded-xl transition-all hover:bg-white/[0.07]"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
        {error && <p className="text-[10px] text-red-400 font-medium">{error}</p>}
      </div>
    );
  }

  return (
    <button
      onClick={() => setConfirming(true)}
      className="px-5 py-2.5 bg-red-500/[0.08] hover:bg-red-500/[0.15] border border-red-500/20 text-red-400 font-bold text-[12px] rounded-xl transition-all active:scale-95"
    >
      Cancel Subscription
    </button>
  );
}

// ─── Checkout Button (Plan Upgrade) ──────────────────────────────────────────

interface CheckoutButtonProps {
  planId: string;
  isAnnual?: boolean;
  label?: string;
  className?: string;
}

export function CheckoutButton({ planId, isAnnual = false, label = 'Upgrade', className }: CheckoutButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleCheckout = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planId, isAnnual }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to start checkout');
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleCheckout}
        disabled={loading}
        className={className ?? 'flex items-center gap-1.5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] rounded-xl transition-all shadow-lg active:scale-95 disabled:opacity-50'}
      >
        {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <ArrowRight className="w-3.5 h-3.5" />}
        {loading ? 'Redirecting...' : label}
      </button>
      {error && <p className="text-[10px] text-red-400 font-medium max-w-xs">{error}</p>}
    </div>
  );
}

// ─── Add-On Purchase Button ───────────────────────────────────────────────────

interface AddOnButtonProps {
  addonType: string;
  addonPriceId?: string;
  isActive: boolean;
}

export function AddOnButton({ addonType, addonPriceId, isActive }: AddOnButtonProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleClick = async () => {
    // For now, manage = open billing portal; Add = open portal to add payment
    // Full add-on checkout requires separate Stripe prices per add-on
    setLoading(true);
    setError('');
    try {
      const res = await fetch('/api/billing/portal', { method: 'POST' });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Failed to open billing portal');
      window.location.href = data.url;
    } catch (err: any) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-1">
      <button
        onClick={handleClick}
        disabled={loading}
        className={`px-4 py-2 font-bold text-[11px] rounded-xl transition-all active:scale-95 border disabled:opacity-50 ${
          isActive
            ? 'bg-white/[0.04] border-white/[0.08] text-zinc-400 hover:text-white'
            : 'bg-indigo-600/80 hover:bg-indigo-500 border-indigo-500/30 text-white shadow-lg hover:shadow-indigo-500/20'
        }`}
      >
        {loading ? <Loader2 className="w-3 h-3 animate-spin inline" /> : isActive ? 'Manage' : 'Add'}
      </button>
      {error && <p className="text-[9px] text-red-400 font-medium">{error}</p>}
    </div>
  );
}

'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Home, ArrowLeft, Zap, Search, LayoutDashboard } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="relative min-h-screen bg-[#030304] flex flex-col items-center justify-center p-6 overflow-hidden">
      {/* Ambient mesh */}
      <div className="absolute top-0 left-1/4 w-[600px] h-[600px] rounded-full bg-indigo-600/[0.06] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] rounded-full bg-violet-600/[0.05] blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="relative z-10 text-center max-w-lg w-full"
      >
        {/* Logo */}
        <Link href="/overview" className="inline-flex items-center gap-2.5 mb-12 group">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-4 h-4 text-white relative z-10" />
          </div>
          <span className="font-extrabold tracking-tight text-[16px] text-white">InstaFlow</span>
        </Link>

        {/* Error code */}
        <div className="relative mb-6">
          <div className="text-[140px] font-black text-white/[0.04] leading-none select-none tabular-nums">404</div>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <div className="glass-panel-ai rounded-2xl px-6 py-4 border border-white/[0.07] shadow-2xl mb-4">
              <div className="text-[10px] font-black text-indigo-400 tracking-[0.18em] uppercase mb-2 flex items-center gap-2 justify-center">
                <span className="relative flex h-1.5 w-1.5">
                  <span className="animate-ping absolute h-full w-full rounded-full bg-red-400 opacity-75" />
                  <span className="relative h-1.5 w-1.5 bg-red-500 rounded-full" />
                </span>
                Route not found
              </div>
              <div className="font-mono text-[11px] text-zinc-500">
                <span className="text-red-400/70">404</span>{' '}
                <span className="text-zinc-600">·</span>{' '}
                <span className="text-violet-400/70">PAGE_NOT_FOUND</span>
              </div>
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-black text-white tracking-tight mb-3">
          This route doesn&apos;t exist
        </h1>
        <p className="text-[14px] text-zinc-500 font-medium leading-relaxed mb-8 max-w-sm mx-auto">
          The page you&apos;re looking for has moved, been removed, or was never part of the neural pipeline.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/overview"
            className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 w-full sm:w-auto justify-center"
          >
            <LayoutDashboard className="w-4 h-4" /> Go to Dashboard
          </Link>
          <button
            onClick={() => window.history.back()}
            className="flex items-center gap-2 px-6 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white font-bold text-[13px] rounded-xl transition-all shadow-inner active:scale-95 w-full sm:w-auto justify-center"
          >
            <ArrowLeft className="w-4 h-4" /> Go back
          </button>
        </div>

        {/* Quick links */}
        <div className="mt-10 pt-8 border-t border-white/[0.05]">
          <p className="text-[9px] font-black text-zinc-700 tracking-[0.18em] uppercase mb-4">
            Quick navigation
          </p>
          <div className="flex flex-wrap justify-center gap-2">
            {[
              { label: 'Overview', href: '/overview' },
              { label: 'Briefs', href: '/briefs' },
              { label: 'Calendar', href: '/calendar' },
              { label: 'Analytics', href: '/analytics' },
              { label: 'Settings', href: '/settings' },
            ].map(link => (
              <Link
                key={link.href}
                href={link.href}
                className="px-3.5 py-1.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.06] hover:border-indigo-500/25 text-zinc-400 hover:text-white font-semibold text-[11px] rounded-lg transition-all"
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

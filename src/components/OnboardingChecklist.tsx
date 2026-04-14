'use client';

import Link from 'next/link';
import { useState } from 'react';
import { Check, ChevronDown, ChevronUp, Zap, Package, FileText, Calendar, Settings2 } from 'lucide-react';

const STEPS = [
  { id: 'connect', icon: Settings2, label: 'Connect Instagram', desc: 'Link your Meta Business account via OAuth', href: '/settings' },
  { id: 'product', icon: Package, label: 'Add a product', desc: 'Create your first digital product to promote', href: '/products' },
  { id: 'brief', icon: FileText, label: 'Generate a content brief', desc: 'Let AI build your first content strategy', href: '/briefs' },
  { id: 'schedule', icon: Calendar, label: 'Schedule your first post', desc: 'Put automation on autopilot', href: '/calendar' },
];

interface OnboardingChecklistProps {
  hasToken: boolean;
  hasProduct: boolean;
  hasBrief: boolean;
  hasSchedule: boolean;
}

export function OnboardingChecklist({ hasToken, hasProduct, hasBrief, hasSchedule }: OnboardingChecklistProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  const statuses = [hasToken, hasProduct, hasBrief, hasSchedule];
  const completed = statuses.filter(Boolean).length;
  const total = STEPS.length;
  const allDone = completed === total;

  if (dismissed || allDone) return null;

  const pct = Math.round((completed / total) * 100);
  const nextStep = STEPS[statuses.findIndex(s => !s)];

  return (
    <div className="relative z-10 rounded-2xl bg-gradient-to-b from-indigo-500/[0.07] to-[#08080b] border border-indigo-500/20 overflow-hidden shadow-xl shadow-indigo-500/5">
      {/* Top accent line */}
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />

      {/* Header */}
      <div className="px-5 py-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="relative w-8 h-8 rounded-xl flex items-center justify-center shrink-0">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
            <Zap className="w-3.5 h-3.5 text-white relative z-10" />
          </div>
          <div>
            <div className="text-[13px] font-bold text-white tracking-tight">Get started with InstaFlow</div>
            <div className="ai-section-label mt-0.5">{completed} of {total} steps complete · {pct}%</div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setCollapsed(v => !v)}
            className="p-1.5 hover:bg-white/[0.05] rounded-lg transition-colors border border-transparent hover:border-white/[0.08] text-zinc-500 hover:text-white"
          >
            {collapsed ? <ChevronDown className="w-4 h-4" /> : <ChevronUp className="w-4 h-4" />}
          </button>
          <button
            onClick={() => setDismissed(true)}
            className="text-[9px] font-black text-zinc-700 hover:text-zinc-400 tracking-widest uppercase transition-colors"
          >
            Dismiss
          </button>
        </div>
      </div>

      {/* Progress bar */}
      <div className="px-5 pb-3">
        <div className="h-1 bg-white/[0.06] rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {/* Steps */}
      {!collapsed && (
        <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
          {STEPS.map((step, i) => {
            const done = statuses[i];
            const isNext = !done && statuses.slice(0, i).every(Boolean);
            return (
              <Link
                key={step.id}
                href={done ? '#' : step.href}
                onClick={done ? e => e.preventDefault() : undefined}
                className={`flex items-center gap-3 p-3 rounded-xl border transition-all duration-200 group ${
                  done
                    ? 'bg-emerald-500/[0.05] border-emerald-500/15 opacity-60 cursor-default'
                    : isNext
                    ? 'bg-indigo-500/[0.08] border-indigo-500/25 hover:border-indigo-500/40 hover:bg-indigo-500/[0.12]'
                    : 'bg-white/[0.02] border-white/[0.05] hover:border-white/[0.08] opacity-50'
                }`}
              >
                {/* Step status */}
                <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 border shadow-inner ${
                  done
                    ? 'bg-emerald-500/20 border-emerald-500/30'
                    : isNext
                    ? 'bg-indigo-500/15 border-indigo-500/25'
                    : 'bg-white/[0.04] border-white/[0.06]'
                }`}>
                  {done
                    ? <Check className="w-3 h-3 text-emerald-400" />
                    : <step.icon className={`w-3 h-3 ${isNext ? 'text-indigo-400' : 'text-zinc-600'}`} />
                  }
                </div>
                <div className="min-w-0">
                  <p className={`text-[12px] font-bold leading-snug truncate ${done ? 'text-emerald-400/80' : isNext ? 'text-white' : 'text-zinc-500'}`}>
                    {step.label}
                    {isNext && <span className="ml-2 text-[9px] font-black tracking-widest text-indigo-400 bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded uppercase">Next</span>}
                  </p>
                  <p className={`text-[10px] font-medium truncate ${done ? 'text-zinc-600' : 'text-zinc-600'}`}>{step.desc}</p>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}

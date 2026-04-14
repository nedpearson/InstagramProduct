import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import {
  Activity, MailMinus, AlertCircle, RefreshCw, ShieldCheck,
  HeartPulse, HardDrive, CheckCircle2, Cpu, Radio
} from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SystemHealthPage() {
  const watchdogs = await prisma.watchdogHeartbeat.findMany();
  const deadLetters = await prisma.deadLetterJob.count();
  const reviewTasks = await prisma.reviewTask.count({ where: { status: 'open' } });
  const integrations = await prisma.integrationHealth.findMany({ include: { account: true } });
  const pendingJobs = await prisma.backgroundJob.count({ where: { status: 'pending' } });

  const overallHealthy = deadLetters === 0 && reviewTasks === 0;

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Operations · System Health</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">System Health</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Live telemetry and operational status of background services.</p>
        </div>
        <div className="flex items-center gap-3">
          {overallHealthy ? (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-xl shadow-inner">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-500" />
              </span>
              <span className="text-[11px] font-bold text-emerald-400 tracking-widest uppercase">All systems nominal</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-4 py-2.5 bg-red-500/[0.08] border border-red-500/20 rounded-xl shadow-inner">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75" />
                <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-red-500" />
              </span>
              <span className="text-[11px] font-bold text-red-400 tracking-widest uppercase">Action required</span>
            </div>
          )}
          <button className="px-5 py-2.5 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-white font-bold text-[13px] rounded-xl transition-all active:scale-95 flex items-center gap-2 shadow-inner">
            <RefreshCw className="w-3.5 h-3.5 text-indigo-400" /> Refresh
          </button>
        </div>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
        {[
          {
            icon: MailMinus, label: 'Dead Letters', value: deadLetters,
            accent: 'red', desc: 'Jobs that exhausted all retries',
            href: '/inbox', cta: 'Triage inbox',
            pulse: deadLetters > 0,
          },
          {
            icon: AlertCircle, label: 'Open Review Tasks', value: reviewTasks,
            accent: 'amber', desc: 'Actions awaiting operator decision',
            href: '/queue', cta: 'Process queue',
            pulse: false,
          },
          {
            icon: HeartPulse, label: 'Watchdog Services', value: watchdogs.length,
            accent: 'emerald', desc: 'Background nodes checking in',
            href: null, cta: null,
            pulse: true,
          },
          {
            icon: Cpu, label: 'Pending Jobs', value: pendingJobs,
            accent: 'indigo', desc: 'Jobs queued for processing',
            href: null, cta: null,
            pulse: false,
          },
        ].map(card => {
          const accMap = ({
            red: { bg: 'bg-red-500/[0.06]', border: 'border-red-500/20', hover: 'hover:border-red-500/30', text: 'text-red-400', icon: 'bg-red-500/10 border-red-500/15' },
            amber: { bg: 'bg-amber-500/[0.06]', border: 'border-amber-500/20', hover: 'hover:border-amber-500/30', text: 'text-amber-400', icon: 'bg-amber-500/10 border-amber-500/15' },
            emerald: { bg: 'bg-emerald-500/[0.06]', border: 'border-emerald-500/20', hover: 'hover:border-emerald-500/30', text: 'text-emerald-400', icon: 'bg-emerald-500/10 border-emerald-500/15' },
            indigo: { bg: 'bg-indigo-500/[0.06]', border: 'border-indigo-500/20', hover: 'hover:border-indigo-500/30', text: 'text-indigo-400', icon: 'bg-indigo-500/10 border-indigo-500/15' },
          } as const)[card.accent as 'red' | 'amber' | 'emerald' | 'indigo']!;
          return (
            <div key={card.label} className={`glass-panel-ai rounded-2xl p-6 flex flex-col ${accMap.bg} ${accMap.border} ${accMap.hover} transition-all duration-300 relative overflow-hidden group border`}>
              <div className="flex items-start justify-between mb-5">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-inner border ${accMap.icon}`}>
                  <card.icon className={`w-5 h-5 ${accMap.text}`} />
                </div>
                {card.pulse && (
                  <span className="relative flex h-1.5 w-1.5 mt-1">
                    <span className={`animate-ping absolute h-full w-full rounded-full opacity-75 ${card.accent === 'emerald' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className={`relative h-1.5 w-1.5 rounded-full ${card.accent === 'emerald' ? 'bg-emerald-500' : 'bg-red-500'}`} />
                  </span>
                )}
              </div>
              <div className="ai-section-label mb-2">{card.label}</div>
              <div className={`ai-metric ${accMap.text} tabular-nums mb-1`}>{card.value}</div>
              <p className="text-[11px] text-zinc-600 font-medium mb-4 leading-snug">{card.desc}</p>
              {card.href && card.cta && (
                <Link href={card.href} className={`mt-auto inline-flex items-center gap-1.5 text-[10px] font-black tracking-[0.15em] uppercase ${accMap.text} hover:opacity-80 transition-opacity`}>
                  {card.cta} <span>→</span>
                </Link>
              )}
            </div>
          );
        })}
      </div>

      {/* Integration health table */}
      <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden shadow-sm relative z-10 border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-300">
        <div className="px-6 md:px-8 py-5 border-b border-white/[0.05] flex items-center gap-4 bg-white/[0.01]">
          <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/15 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
            <HardDrive className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-[15px] font-bold text-white tracking-tight">Integration Health</h2>
            <div className="ai-section-label mt-0.5">Meta Graph API · Connection registry</div>
          </div>
        </div>
        <div>
          {integrations.length === 0 ? (
            <div className="py-16 text-center flex flex-col items-center group/int">
              <div className="w-14 h-14 bg-white/[0.04] rounded-2xl flex items-center justify-center mb-5 border border-white/[0.07] shadow-inner group-hover/int:scale-105 transition-transform duration-300">
                <Radio className="w-6 h-6 text-zinc-600" />
              </div>
              <div className="ai-section-label mb-3">Status · No integrations</div>
              <p className="text-[15px] font-black text-white mb-2">No integrations tracked</p>
              <p className="text-[12px] text-zinc-600 font-medium max-w-xs">Connect your Instagram account in Settings to begin tracking integration health.</p>
              <Link href="/settings" className="mt-5 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[12px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95">
                Go to Settings →
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm whitespace-nowrap">
                <thead className="bg-[#050505]/50 border-b border-white/[0.05]">
                  <tr>
                    <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Provider</th>
                    <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Account</th>
                    <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Status</th>
                    <th className="px-7 py-4 font-bold text-zinc-600 text-[9px] tracking-[0.15em] uppercase">Last Success</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/[0.04] bg-transparent">
                  {integrations.map(int => (
                    <tr key={int.id} className="hover:bg-white/[0.02] transition-colors group">
                      <td className="px-7 py-5">
                        <span className="font-bold tracking-[0.15em] text-[9px] uppercase bg-indigo-500/10 text-indigo-400 border border-indigo-500/20 px-2.5 py-1.5 rounded-md shadow-inner">
                          {int.provider}
                        </span>
                      </td>
                      <td className="px-7 py-5 font-semibold text-zinc-200 text-[13px]">{int.account.username}</td>
                      <td className="px-7 py-5">
                        <span className={`px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-[0.15em] flex items-center gap-1.5 w-max shadow-inner border ${
                          int.healthStatus === 'healthy' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' :
                          int.healthStatus === 'degraded' ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' :
                          'bg-red-500/10 text-red-400 border-red-500/20'
                        }`}>
                          <span className={`w-1.5 h-1.5 rounded-full bg-current ${int.healthStatus === 'healthy' ? 'animate-pulse' : ''}`} />
                          {int.healthStatus}
                        </span>
                      </td>
                      <td className="px-7 py-5 text-zinc-500 font-mono text-[11px] group-hover:text-zinc-300 transition-colors">
                        {int.lastSuccessAt ? int.lastSuccessAt.toLocaleString() : '—'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Activity, ShieldCheck, ServerCrash, RefreshCw, CheckCircle2, AlertTriangle } from 'lucide-react';

export default function SystemAuditorPage() {
  const [loading, setLoading] = useState(false);
  const [report, setReport] = useState<any>(null);

  const runAudit = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/auditor', { method: 'POST' });
      const data = await res.json();
      setReport(data);
    } catch (error) {
      console.error(error);
    }
    setLoading(false);
  };

  useEffect(() => {
    runAudit();
  }, []);

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out relative">
      <div className="mesh-bg-1" />
      <div className="max-w-5xl mx-auto space-y-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="ai-section-label mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-indigo-400" /> Infrastructure
            </div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">System Auditor & Node Health</h1>
            <p className="text-sm font-medium text-zinc-500 mt-3 leading-relaxed max-w-xl">
              Live diagnostic telemetry array verifying end-to-end integration connectivity.
            </p>
          </div>
          <button
            onClick={runAudit}
            disabled={loading}
            className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all duration-200 mt-4 md:mt-2 disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Run Diagnostics
          </button>
        </div>

        {report && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Status Card */}
            <div className={`col-span-1 md:col-span-3 p-6 rounded-2xl border ${report.systemIntegrity.includes('VERIFIED') ? 'bg-emerald-500/5 border-emerald-500/20' : 'bg-rose-500/5 border-rose-500/20'} flex items-center justify-between`}>
              <div className="flex flex-col">
                <span className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-1">Global System State</span>
                <span className={`text-2xl flex items-center gap-2 font-bold ${report.systemIntegrity.includes('VERIFIED') ? 'text-emerald-400' : 'text-rose-400'}`}>
                  {report.systemIntegrity.includes('VERIFIED') ? <ShieldCheck className="w-7 h-7" /> : <ServerCrash className="w-7 h-7" />}
                  {report.systemIntegrity}
                </span>
              </div>
              <Activity className={`w-12 h-12 opacity-20 ${report.systemIntegrity.includes('VERIFIED') ? 'text-emerald-500' : 'text-rose-500'}`} />
            </div>

            {/* Connection Map */}
            <div className="col-span-1 md:col-span-2 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.05] pb-2">Component Connection Status</h3>
              <div className="space-y-3">
                {Object.entries(report.connectionStatus || {}).map(([key, val]: any) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-zinc-400 font-mono text-sm">{key}</span>
                    <span className={`text-xs font-bold px-2 py-1 rounded-md ${val.includes('PASS') ? 'bg-emerald-500/10 text-emerald-400' : 'bg-rose-500/10 text-rose-400'}`}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mt-6 mb-4 border-b border-white/[0.05] pb-2">Master Database Status</h3>
              <div className="space-y-3">
                {Object.entries(report.systemMap || {}).map(([key, val]: any) => (
                  <div key={key} className="flex items-center justify-between">
                    <span className="text-zinc-400 font-mono text-sm">{key}</span>
                    <span className={`text-xs font-bold ${typeof val === 'string' && val.includes('Healthy') ? 'text-emerald-400' : typeof val === 'string' && val.includes('Offline') ? 'text-rose-400' : 'text-zinc-300'}`}>
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Auto-Healing Log */}
            <div className="col-span-1 p-6 rounded-2xl bg-white/[0.02] border border-white/[0.05] flex flex-col">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider mb-4 border-b border-white/[0.05] pb-2 flex items-center justify-between">
                Healing Log
                <span className="text-[10px] bg-indigo-500/20 text-indigo-400 px-2 py-0.5 rounded-full">{report.issuesFixed?.length || 0} Actions</span>
              </h3>
              
              <div className="flex-1 space-y-3">
                {report.issuesFixed?.length > 0 ? (
                  report.issuesFixed.map((issue: string, i: number) => (
                    <div key={i} className="flex gap-2 text-xs text-zinc-300 items-start">
                      <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{issue}</span>
                    </div>
                  ))
                ) : (
                  <div className="text-xs text-zinc-500 italic h-full flex items-center justify-center pt-8">No self-healing actions triggered in this cycle.</div>
                )}
              </div>

              {report.remainingRisks?.length > 0 && (
                <div className="mt-6 pt-4 border-t border-white/[0.05]">
                  <h4 className="text-[11px] font-bold text-rose-400 uppercase mb-2 flex items-center gap-1"><AlertTriangle className="w-3 h-3" /> Remaining Risks</h4>
                  <ul className="space-y-1">
                    {report.remainingRisks.map((r: string, i: number) => (
                      <li key={i} className="text-xs text-zinc-400 break-words leading-relaxed">• {r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

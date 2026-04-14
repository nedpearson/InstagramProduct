import { prisma } from '@/lib/prisma';
import { saveManualTokenAction } from '@/app/(app)/actions';
import { Fingerprint, Shield, Zap, Lock, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ searchParams }: { searchParams: { success?: string; error?: string } }) {
  const settings = await prisma.settings.findFirst();
  const token = await prisma.integrationToken.findFirst({ where: { provider: 'meta_graph' } });
  const isConnected = !!token;

  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-6 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Banners */}
      {searchParams.success === 'oauth_complete' && (
        <div className="relative z-20 flex items-start gap-3 p-4 bg-emerald-500/[0.08] border border-emerald-500/20 rounded-xl animate-in slide-in-from-top-4 duration-400 shadow-inner">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-bold text-emerald-300">Integration Successful</p>
            <p className="text-[12px] text-emerald-400/60 font-medium mt-0.5">Meta Instagram account connected. Long-lived tokens stored in the vault.</p>
          </div>
        </div>
      )}
      {searchParams.error && (
        <div className="relative z-20 flex items-start gap-3 p-4 bg-red-500/[0.08] border border-red-500/20 rounded-xl animate-in slide-in-from-top-4 duration-400 shadow-inner">
          <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-[13px] font-bold text-red-300">Integration Failed</p>
            <p className="text-[12px] text-red-400/60 font-medium mt-0.5">Code: {searchParams.error}. Check Meta App credentials and redirect URI configuration.</p>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10 pt-2">
        <div>
          <div className="ai-section-label mb-3">Platform · Settings</div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white">System Preferences</h1>
          <p className="text-sm font-medium text-zinc-500 mt-2">Configure global automation rules and official Meta integration.</p>
        </div>
      </div>

      <div className="space-y-5 relative z-10">

        {/* Module 1: Automation Controls */}
        <div className="glass-panel-ai rounded-2xl overflow-hidden border border-white/[0.05] hover:border-white/[0.09] transition-colors duration-300">
          <div className="px-6 md:px-8 py-5 border-b border-white/[0.05] flex items-center gap-4 bg-white/[0.01]">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 shadow-inner shrink-0">
              <Zap className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white tracking-tight">Automation Controls</h2>
              <p className="text-[12px] text-zinc-600 font-medium mt-0.5">Define how aggressively background workers operate.</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-5 max-w-3xl">
            <div>
              <label className="block text-[10px] font-bold mb-2.5 text-zinc-500 tracking-[0.15em] uppercase">Global Operating Mode</label>
              <div className="relative">
                <select
                  className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 px-4 text-[13px] font-semibold focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 outline-none transition-all shadow-inner text-white appearance-none hover:bg-white/[0.05] cursor-pointer"
                  defaultValue={settings?.automationMode || 'semi-auto'}
                >
                  <option value="manual" className="bg-zinc-900 text-white">Level 0: Manual — All actions require review</option>
                  <option value="semi-auto" className="bg-zinc-900 text-white">Level 1: Semi-Auto — Review only DMs and flags</option>
                  <option value="full-auto" className="bg-zinc-900 text-white">Level 2: Full-Auto — Autonomously publish & reply</option>
                </select>
                <ChevronRight className="w-4 h-4 text-zinc-600 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
              </div>
              <div className="mt-4 p-4 rounded-xl border border-amber-500/20 bg-amber-500/[0.05] flex items-start gap-3 shadow-inner">
                <Shield className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                <p className="text-[11px] text-amber-300/70 leading-relaxed font-medium">Level 2 allows the companion agent to bypass the review queue entirely. Monitor rate limits closely to prevent temporary Meta restrictions.</p>
              </div>
            </div>

            <button className="px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl shadow-lg hover:shadow-indigo-500/25 transition-all active:scale-95">
              Save Preferences
            </button>
          </div>
        </div>

        {/* Module 2: Meta Integration */}
        <div className="glass-panel-ai ai-scan-panel rounded-2xl overflow-hidden border border-white/[0.05] hover:border-indigo-500/20 transition-colors duration-300">
          <div className="px-6 md:px-8 py-5 border-b border-white/[0.05] flex items-center gap-4 bg-indigo-500/[0.03]">
            <div className="w-10 h-10 rounded-xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center text-indigo-400 shadow-inner shrink-0">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-[15px] font-bold text-white tracking-tight">Meta Integration</h2>
              <p className="text-[12px] text-zinc-600 font-medium mt-0.5">Connect via the official Instagram Graph API.</p>
            </div>
          </div>

          <div className="p-6 md:p-8 space-y-7 max-w-3xl">

            {/* Connection status card */}
            <div className={`p-5 rounded-xl border flex flex-col md:flex-row gap-5 justify-between items-start md:items-center ${
              isConnected
                ? 'bg-emerald-500/[0.06] border-emerald-500/20'
                : 'bg-indigo-500/[0.05] border-indigo-500/20'
            }`}>
              <div>
                <div className={`flex items-center gap-2 mb-1 ${isConnected ? 'text-emerald-400' : 'text-indigo-400'}`}>
                  {isConnected && (
                    <span className="relative flex h-1.5 w-1.5">
                      <span className="animate-ping absolute h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                      <span className="relative h-1.5 w-1.5 bg-emerald-500 rounded-full"></span>
                    </span>
                  )}
                  <span className="text-[13px] font-bold">{isConnected ? 'Instagram Connected' : 'Standard OAuth Flow'}</span>
                </div>
                <p className={`text-[12px] font-medium leading-relaxed max-w-sm ${isConnected ? 'text-emerald-400/60' : 'text-zinc-500'}`}>
                  {isConnected
                    ? 'Long-lived graph token is securely vaulted and background sync is active.'
                    : 'Requires META_APP_ID matching the target environment. No credentials are stored externally.'}
                </p>
              </div>

              {isConnected ? (
                <div className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-bold text-[12px] rounded-xl shadow-inner whitespace-nowrap">
                  <CheckCircle2 className="w-4 h-4" /> Configured
                </div>
              ) : (
                <a
                  href={`https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID || ''}&redirect_uri=http://localhost:3000/api/auth/instagram/callback&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`}
                  className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-[#1877F2] hover:bg-[#166FE5] text-white font-bold text-[13px] rounded-xl transition-all shadow-lg hover:shadow-blue-500/20 active:scale-95 whitespace-nowrap"
                >
                  Login with Meta
                </a>
              )}
            </div>

            {/* Divider */}
            <div className="relative flex items-center gap-4">
              <div className="flex-1 h-px bg-white/[0.05]" />
              <span className="text-[9px] font-black uppercase tracking-[0.18em] text-zinc-700 shrink-0">Manual Override</span>
              <div className="flex-1 h-px bg-white/[0.05]" />
            </div>

            {/* Token vault */}
            <div>
              <p className="text-[13px] font-bold text-white mb-1.5">Secure Token Vault</p>
              <p className="text-[12px] text-zinc-500 mb-5 max-w-xl leading-relaxed font-medium">Paste a long-lived access token from the Graph API Explorer. It will be injected securely into the local SQLite keystore.</p>
              <form action={saveManualTokenAction} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                <div className="flex-1 relative group/input">
                  <Fingerprint className="w-4 h-4 text-zinc-600 absolute left-3.5 top-1/2 -translate-y-1/2 group-focus-within/input:text-indigo-400 transition-colors" />
                  <input
                    name="token" type="password" placeholder="EAACX..."
                    className="w-full bg-white/[0.03] border border-white/[0.08] rounded-xl py-3 pl-10 pr-4 text-[13px] font-medium focus:ring-1 focus:ring-indigo-500/40 focus:border-indigo-500/40 outline-none shadow-inner transition-all placeholder:text-zinc-600 text-white"
                  />
                </div>
                <button type="submit" className="px-6 py-3 bg-white/[0.05] hover:bg-white/[0.08] border border-white/[0.08] text-white font-bold text-[13px] rounded-xl transition-all shadow-inner active:scale-95 whitespace-nowrap">
                  Vault Token
                </button>
              </form>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

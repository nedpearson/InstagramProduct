import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { saveManualTokenAction } from '@/app/(app)/actions';
import { Fingerprint, Shield, Zap, Lock, Settings as SettingsIcon, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage({ searchParams }: { searchParams: { success?: string, error?: string } }) {
  const settings = await prisma.settings.findFirst();
  const token = await prisma.integrationToken.findFirst({
    where: { provider: 'meta_graph' }
  });

  const isConnected = !!token;

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-700 ease-out">
      
      {/* Ambient backgrounds */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Notifications */}
      {searchParams.success === 'oauth_complete' && (
        <div className="glass-panel border-emerald-500/30 bg-emerald-500/10 p-4 rounded-2xl flex items-start gap-3 shadow-[0_0_30px_rgba(16,185,129,0.15)] relative z-20 animate-in slide-in-from-top-4 duration-500">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          <div>
             <h3 className="text-emerald-300 font-bold tracking-tight">Integration Successful</h3>
             <p className="text-sm text-emerald-200/70 font-medium">Your Meta Instagram account has been securely connected and long-lived tokens stored in the vault.</p>
          </div>
        </div>
      )}

      {searchParams.error && (
        <div className="glass-panel border-red-500/30 bg-red-500/10 p-4 rounded-2xl flex items-start gap-3 shadow-[0_0_30px_rgba(239,68,68,0.15)] relative z-20 animate-in slide-in-from-top-4 duration-500">
          <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          <div>
             <h3 className="text-red-300 font-bold tracking-tight">Integration Failed</h3>
             <p className="text-sm text-red-200/70 font-medium">Code: {searchParams.error}. Please check your Meta App credentials and configuration.</p>
          </div>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 relative z-10">
        <div>
          <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-200 to-zinc-600 drop-shadow-sm">System Preferences</h1>
          <p className="text-sm font-bold tracking-wide text-zinc-400 mt-2 uppercase">Configure global automation rules and official Meta integration.</p>
        </div>
      </div>

      <div className="space-y-6 relative z-10">
        {/* Module 1: Automation */}
        <div className="glass-panel border-white/5 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(255,255,255,0.05)] transition-all duration-500 group">
            <div className="p-6 md:p-8 border-b border-white/5 bg-white/[0.01]">
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-zinc-400 shadow-inner group-hover:scale-110 transition-transform duration-500">
                    <Zap className="w-6 h-6 group-hover:text-amber-400 transition-colors drop-shadow-sm" />
                 </div>
                 <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Automation Controls</h2>
               </div>
               <p className="text-sm text-zinc-400 max-w-2xl font-medium mt-3 leading-relaxed">Define how aggressive the background workers will operate when a schedule is reached. Higher levels bypass manual oversight.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6 max-w-3xl">
                <div>
                    <label className="block text-xs font-bold mb-3 text-zinc-500 tracking-widest uppercase">Global Operating Mode</label>
                    <div className="relative">
                      <select 
                          className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-sm font-bold focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none transition-all shadow-inner text-white appearance-none hover:bg-white/5 cursor-pointer"
                          defaultValue={settings?.automationMode || 'semi-auto'}
                      >
                          <option value="manual" className="bg-zinc-900 text-white">Level 0: Manual (All Actions Require Review)</option>
                          <option value="semi-auto" className="bg-zinc-900 text-white">Level 1: Semi-Auto (Review Only DMs and Flags)</option>
                          <option value="full-auto" className="bg-zinc-900 text-white">Level 2: Full-Auto (Autonomously Publish & Reply)</option>
                      </select>
                      <ChevronRight className="w-4 h-4 text-zinc-500 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none rotate-90" />
                    </div>
                    <div className="mt-5 p-4 rounded-xl border border-amber-500/20 bg-amber-500/5 flex items-start gap-3 shadow-inner">
                       <Shield className="w-5 h-5 text-amber-500 shrink-0 drop-shadow-[0_0_8px_rgba(245,158,11,0.6)]" />
                       <p className="text-xs text-amber-200/80 text-balance leading-relaxed font-medium">Level 2 will allow the companion agent to bypass the queue UI completely. Ensure rate limits are monitored to prevent temporary bans from Meta.</p>
                    </div>
                </div>
                
                <div className="pt-4">
                    <button className="px-8 py-3.5 bg-white text-black font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.3)] transition-all cursor-pointer active:scale-95">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>

        {/* Module 2: Security & Meta */}
        <div className="glass-panel border-white/5 rounded-3xl overflow-hidden hover:shadow-[0_0_30px_rgba(59,130,246,0.15)] transition-all duration-500 group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -mr-20 -mt-20 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none" />
            <div className="p-6 md:p-8 border-b border-white/5 bg-blue-900/10 backdrop-blur-sm relative z-10">
               <div className="flex items-center gap-4 mb-2">
                 <div className="w-12 h-12 rounded-2xl bg-[#050505] border border-white/10 flex items-center justify-center text-blue-400 shadow-inner group-hover:scale-110 transition-transform duration-500 group-hover:shadow-[0_0_20px_rgba(59,130,246,0.4)]">
                    <Lock className="w-6 h-6" />
                 </div>
                 <h2 className="text-2xl font-black text-white tracking-tight drop-shadow-sm">Authentication Handshake</h2>
               </div>
               <p className="text-sm text-zinc-400 max-w-2xl font-medium mt-3 leading-relaxed">Connect via the official Instagram Graph API. Stealth browser engines are disabled by default for account safety.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-8 max-w-3xl relative z-10">
                <div className={`p-[1px] rounded-[1.25rem] bg-gradient-to-b ${isConnected ? 'from-emerald-500/50 to-emerald-500/10' : 'from-blue-500/30 to-indigo-500/10'}`}>
                  <div className={`bg-black/60 p-6 md:p-8 rounded-2xl flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden backdrop-blur-md`}>
                      <div className="absolute inset-0 bg-[url('https://transparenttextures.com/patterns/cubes.png')] opacity-[0.03] mix-blend-overlay"></div>
                      
                      <div className="relative z-10 w-full md:w-auto">
                        <h3 className={`font-black tracking-tight text-xl mb-1 ${isConnected ? 'text-emerald-400 drop-shadow-[0_0_8px_rgba(16,185,129,0.5)]' : 'text-blue-300 drop-shadow-[0_0_8px_rgba(59,130,246,0.4)]'}`}>
                          {isConnected ? 'Instagram Connected' : 'Standard OAuth Flow'}
                        </h3>
                        <p className={`text-sm max-w-sm leading-relaxed font-medium ${isConnected ? 'text-emerald-200/60' : 'text-blue-200/60'}`}>
                            {isConnected 
                              ? 'Long-lived graph token is securely vaulted and background sync is active.' 
                              : <span className="flex flex-col gap-1">Requires <code className="bg-black/50 px-2 py-1 rounded text-blue-300 font-mono text-xs border border-blue-500/20 w-max shadow-inner">META_APP_ID</code> matching the target environment.</span>
                            }
                        </p>
                      </div>

                      {isConnected ? (
                        <div className="w-full md:w-auto text-center px-8 py-3.5 bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 font-black text-sm rounded-2xl shadow-inner relative z-10 flex items-center justify-center gap-2">
                           <CheckCircle2 className="w-5 h-5 flex-shrink-0" /> Configured
                        </div>
                      ) : (
                        <a 
                            href={`https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID || ''}&redirect_uri=http://localhost:3000/api/auth/instagram/callback&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`}
                            className="w-full md:w-auto text-center px-8 py-4 bg-gradient-to-b from-[#1877F2] to-[#166FE5] hover:from-[#166FE5] hover:to-[#0C5DC7] text-white font-black text-sm rounded-2xl shadow-[0_0_30px_rgba(24,119,242,0.4)] transition-all hover:scale-105 active:scale-95 relative z-10 whitespace-nowrap"
                        >
                            Login with Meta
                        </a>
                      )}
                  </div>
                </div>

                <div className="relative py-6">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-white/5" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-[#121212] px-4 text-[10px] font-bold uppercase tracking-widest text-zinc-600">Manual Override</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-black text-white mb-2 text-lg flex items-center gap-2 drop-shadow-sm">
                       Secure Token Vault
                    </h3>
                    <p className="text-sm text-zinc-400 mb-6 max-w-xl leading-relaxed font-medium">If using the Graph API Explorer, paste your long-lived access token directly. This token will be injected securely into the SQLite keystore vault.</p>
                    <form action={saveManualTokenAction} className="flex flex-col sm:flex-row gap-3 max-w-2xl">
                        <div className="flex-1 relative group/input">
                           <Fingerprint className="w-5 h-5 text-zinc-500 absolute left-4 top-1/2 -translate-y-1/2 group-focus-within/input:text-indigo-400 transition-colors" />
                           <input 
                               name="token"
                               type="password" 
                               placeholder="EAACX..." 
                               className="w-full bg-black/40 border border-white/10 rounded-xl py-4 pl-12 pr-4 text-sm font-bold focus:ring-1 focus:ring-indigo-500/50 focus:border-indigo-500/50 outline-none shadow-inner transition-all placeholder:text-zinc-600 text-white focus:bg-black" 
                           />
                        </div>
                        <button type="submit" className="px-8 py-4 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black text-sm rounded-xl transition-all whitespace-nowrap shadow-inner hover:shadow-[0_0_15px_rgba(255,255,255,0.05)] active:scale-95">
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

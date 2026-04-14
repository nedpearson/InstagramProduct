import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { saveManualTokenAction } from '@/app/actions';
import { Fingerprint, Shield, Zap, Lock, Settings as SettingsIcon } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="p-4 lg:p-8 max-w-5xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-zinc-900 dark:text-white">System Settings</h1>
          <p className="text-sm text-zinc-500 mt-1">Configure global automation rules and official Meta integration.</p>
        </div>
      </div>

      <div className="space-y-6">
        {/* Module 1: Automation */}
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-indigo-50 dark:bg-indigo-500/10 flex items-center justify-center text-indigo-600 dark:text-indigo-400">
                    <Zap className="w-4 h-4" />
                 </div>
                 <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Automation Controls</h2>
               </div>
               <p className="text-sm text-zinc-500 max-w-2xl">Define how aggressive the background workers will operate when a schedule is reached.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-6 max-w-3xl">
                <div>
                    <label className="block text-sm font-semibold mb-2 text-zinc-900 dark:text-zinc-100">Global Operating Mode</label>
                    <select 
                        className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg py-2.5 px-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none transition shadow-sm text-zinc-900 dark:text-zinc-100"
                        defaultValue={settings?.automationMode || 'semi-auto'}
                    >
                        <option value="manual">Level 0: Manual (All Actions Require Review)</option>
                        <option value="semi-auto">Level 1: Semi-Auto (Review Only DMs and Flags)</option>
                        <option value="full-auto">Level 2: Full-Auto (Autonomously Publish & Reply)</option>
                    </select>
                    <p className="text-xs text-zinc-500 mt-2 text-balance leading-relaxed">Level 2 will allow the companion agent to bypass the queue UI. This can result in high API usage and rate limiting from Meta if a loop occurs.</p>
                </div>
                
                <div className="pt-4">
                    <button className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-medium text-sm rounded-lg shadow-md shadow-indigo-500/20 transition cursor-pointer">
                        Save Preferences
                    </button>
                </div>
            </div>
        </div>

        {/* Module 2: Security & Meta */}
        <div className="bg-white dark:bg-[#121214] border border-zinc-200 dark:border-zinc-800/60 rounded-2xl shadow-sm overflow-hidden">
            <div className="p-6 md:p-8 border-b border-zinc-100 dark:border-zinc-800/50 bg-zinc-50/50 dark:bg-zinc-900/20">
               <div className="flex items-center gap-3 mb-2">
                 <div className="w-8 h-8 rounded-lg bg-blue-50 dark:bg-blue-500/10 flex items-center justify-center text-blue-600 dark:text-blue-400">
                    <Shield className="w-4 h-4" />
                 </div>
                 <h2 className="text-xl font-semibold text-zinc-900 dark:text-white">Authentication Handshake</h2>
               </div>
               <p className="text-sm text-zinc-500 max-w-2xl">Connect via the official Instagram Graph API. Stealth browser engines are disabled by default for account safety.</p>
            </div>
            
            <div className="p-6 md:p-8 space-y-8 max-w-3xl">
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 p-5 rounded-xl border border-blue-100/50 dark:border-blue-900/50 flex flex-col md:flex-row gap-6 justify-between items-center relative overflow-hidden">
                    <div className="relative z-10 w-full md:w-auto">
                      <h3 className="font-semibold text-blue-900 dark:text-blue-300 mb-1">Standard OAuth Flow</h3>
                      <p className="text-sm text-blue-800/80 dark:text-blue-400/80 max-w-sm leading-relaxed">
                          Requires <code>META_APP_ID</code> and <code>META_APP_SECRET</code> in the local environment file.
                      </p>
                    </div>
                    <a 
                        href={`https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID || ''}&redirect_uri=http://localhost:3000/api/auth/instagram/callback&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`}
                        className="w-full md:w-auto text-center px-6 py-2.5 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium text-sm rounded-lg shadow-md transition relative z-10 whitespace-nowrap"
                    >
                        Login with Meta
                    </a>
                </div>

                <div className="relative py-4">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-[#121214] px-4 text-xs font-semibold uppercase tracking-wider text-zinc-400">Manual Override</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-semibold text-zinc-900 dark:text-zinc-100 mb-1 text-sm flex items-center gap-2">
                       <Lock className="w-4 h-4 text-amber-500" /> Secure Token Storage
                    </h3>
                    <p className="text-xs text-zinc-500 mb-4 max-w-xl">If using the Graph API Explorer, paste your long-lived access token directly. This token will be injected securely into the SQLite keystore vault.</p>
                    <form action={saveManualTokenAction} className="flex gap-3 max-w-2xl">
                        <div className="flex-1 relative">
                           <Fingerprint className="w-4 h-4 text-zinc-400 absolute left-3 top-1/2 -translate-y-1/2" />
                           <input 
                               name="token"
                               type="password" 
                               placeholder="EAACX..." 
                               className="w-full bg-white dark:bg-[#09090b] border border-zinc-200 dark:border-zinc-800 rounded-lg py-2.5 pl-10 pr-3 text-sm focus:ring-2 focus:ring-indigo-500/50 outline-none shadow-sm transition placeholder:text-zinc-400 dark:text-zinc-100" 
                           />
                        </div>
                        <button type="submit" className="px-6 py-2.5 bg-zinc-900 hover:bg-zinc-800 dark:bg-white dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium text-sm rounded-lg transition shadow-md whitespace-nowrap">
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

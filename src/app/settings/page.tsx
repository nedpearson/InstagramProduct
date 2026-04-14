import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { saveManualTokenAction } from '@/app/actions';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Automation Controls</h2>
            
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium mb-1">Global Operating Mode</label>
                    <select 
                        className="w-full bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                        defaultValue={settings?.automationMode || 'semi-auto'}
                    >
                        <option value="manual">Manual (Approval Required)</option>
                        <option value="semi-auto">Semi-Auto (Standard)</option>
                        <option value="full-auto">Full-Auto (Risky)</option>
                    </select>
                    <p className="text-xs text-zinc-500 mt-1">Controls how aggressive the companion worker operates on scheduled actions.</p>
                </div>
                
                <div className="pt-4 border-t border-zinc-100 dark:border-zinc-800">
                    <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm rounded-md transition shadow-sm">
                        Save Changes
                    </button>
                </div>
            </div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
            <h2 className="text-xl font-semibold mb-6">Instagram / Meta Auth</h2>
            
            <div className="space-y-6">
                <div className="bg-blue-50 dark:bg-blue-950/20 p-4 rounded-lg border border-blue-100 dark:border-blue-900">
                    <h3 className="font-semibold text-blue-800 dark:text-blue-400 mb-2">Connect via Official API</h3>
                    <p className="text-sm text-blue-700 dark:text-blue-500 mb-4">
                        Requires <strong>META_APP_ID</strong> and <strong>META_APP_SECRET</strong> inside `.env`. Clicking below redirects you to Facebook for OAuth consent.
                    </p>
                    <a 
                        href={`https://www.facebook.com/v19.0/dialog/oauth?client_id=${process.env.META_APP_ID || ''}&redirect_uri=http://localhost:3000/api/auth/instagram/callback&scope=instagram_basic,instagram_content_publish,pages_show_list,pages_read_engagement`}
                        className="block text-center w-full px-4 py-2 bg-[#1877F2] hover:bg-[#166FE5] text-white font-medium text-sm rounded-md transition shadow-sm"
                    >
                        Authenticate with Facebook
                    </a>
                </div>

                <div className="relative">
                    <div className="absolute inset-0 flex items-center" aria-hidden="true">
                        <div className="w-full border-t border-zinc-200 dark:border-zinc-800" />
                    </div>
                    <div className="relative flex justify-center">
                        <span className="bg-white dark:bg-zinc-900 px-2 text-sm text-zinc-500">OR</span>
                    </div>
                </div>

                <div>
                    <h3 className="font-medium text-sm mb-2">Provide Long-Lived Token Directly</h3>
                    <p className="text-xs text-zinc-500 mb-3">Copy your token from the Graph API Explorer instead.</p>
                    <form action={saveManualTokenAction} className="flex gap-2">
                        <input 
                            name="token"
                            type="password" 
                            placeholder="EAACX..." 
                            className="flex-1 bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-md py-2 px-3 text-sm focus:ring-2 focus:ring-blue-500 outline-none" 
                        />
                        <button type="submit" className="px-4 py-2 bg-zinc-800 hover:bg-zinc-900 dark:bg-zinc-100 dark:hover:bg-zinc-200 dark:text-zinc-900 text-white font-medium text-sm rounded-md transition shadow-sm whitespace-nowrap">
                            Save Token
                        </button>
                    </form>
                </div>
            </div>
        </div>
      </div>
    </div>
  );
}

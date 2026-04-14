import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SettingsPage() {
  const settings = await prisma.settings.findFirst();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">System Settings</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Automation Controls</h2>
        
        <div className="space-y-4 max-w-md">
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
    </div>
  );
}

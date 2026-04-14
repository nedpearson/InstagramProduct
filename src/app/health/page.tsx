import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function SystemHealthPage() {
  const watchdogs = await prisma.watchdogHeartbeat.findMany();
  const deadLetters = await prisma.deadLetterJob.count();
  const reviewTasks = await prisma.reviewTask.count({ where: { status: 'open' } });
  const integrations = await prisma.integrationHealth.findMany({
      include: { account: true }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">System Health & Watchdog</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-6 rounded-xl text-center">
            <h3 className="text-red-700 dark:text-red-400 font-semibold mb-2">Dead Letters</h3>
            <div className="text-4xl font-bold text-red-800 dark:text-red-300">{deadLetters}</div>
            <Link href="/inbox" className="text-sm text-red-600 dark:text-red-500 mt-2 inline-block hover:underline">Triage in Inbox</Link>
        </div>
        
        <div className="bg-amber-50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900 p-6 rounded-xl text-center">
            <h3 className="text-amber-700 dark:text-amber-400 font-semibold mb-2">Open Review Tasks</h3>
            <div className="text-4xl font-bold text-amber-800 dark:text-amber-300">{reviewTasks}</div>
            <Link href="/queue" className="text-sm text-amber-600 dark:text-amber-500 mt-2 inline-block hover:underline">Process Queue</Link>
        </div>

        <div className="bg-green-50 dark:bg-green-950/20 border border-green-200 dark:border-green-900 p-6 rounded-xl text-center">
            <h3 className="text-green-700 dark:text-green-400 font-semibold mb-2">Watchdog Services</h3>
            <div className="text-4xl font-bold text-green-800 dark:text-green-300">{watchdogs.length}</div>
            <span className="text-sm text-green-600 dark:text-green-500 mt-2 block">Pinging Active</span>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="p-4 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-950/50">
            <h3 className="font-semibold">Integration Health</h3>
        </div>
        <div className="p-0">
            {integrations.length === 0 ? (
                <div className="p-8 text-center text-zinc-500 text-sm">No integration health records tracked. Connect an account.</div>
            ) : (
                <table className="w-full text-left text-sm whitespace-nowrap">
                    <thead className="bg-zinc-50 dark:bg-zinc-900 border-b border-zinc-200 dark:border-zinc-800">
                        <tr>
                            <th className="px-6 py-3 font-medium text-zinc-500">Provider</th>
                            <th className="px-6 py-3 font-medium text-zinc-500">Account</th>
                            <th className="px-6 py-3 font-medium text-zinc-500">Status</th>
                            <th className="px-6 py-3 font-medium text-zinc-500">Last Output</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                        {integrations.map(int => (
                            <tr key={int.id}>
                                <td className="px-6 py-4 font-medium uppercase tracking-wide text-xs">{int.provider}</td>
                                <td className="px-6 py-4">{int.account.username}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                                        int.healthStatus === 'healthy' ? 'bg-green-100 text-green-800' :
                                        int.healthStatus === 'degraded' ? 'bg-amber-100 text-amber-800' :
                                        'bg-red-100 text-red-800'
                                    }`}>
                                        {int.healthStatus}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-zinc-500">
                                    {int.lastSuccessAt ? int.lastSuccessAt.toLocaleString() : 'Never'}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            )}
        </div>
      </div>
    </div>
  );
}

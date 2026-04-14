import { prisma } from '@/lib/prisma';
import Link from 'next/link';
import { revalidatePath } from 'next/cache';

export const dynamic = 'force-dynamic';

export default async function InboxPage() {
  const deadLetters = await prisma.deadLetterJob.findMany({
      include: { job: true },
      orderBy: { lastFailedAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Operator Inbox</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>
      
      <div className="bg-red-50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-red-800 dark:text-red-400 mb-2">Dead Letter Queue (Failures)</h2>
        <p className="text-red-700 dark:text-red-500 text-sm mb-6">
          Jobs that exhausted their retry count or suffered a fatal crash require manual triage.
        </p>

        {deadLetters.length === 0 ? (
          <div className="text-center p-8 bg-white/50 dark:bg-zinc-900/50 rounded-lg border border-red-100 dark:border-red-900/50">
            <p className="text-red-700 dark:text-red-600 font-medium">No dead letters. System is operating normally.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {deadLetters.map(dlq => (
              <div key={dlq.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-zinc-900 dark:text-zinc-100 uppercase text-xs tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {dlq.job.jobType}
                    </span>
                    <span className="text-zinc-500 text-sm">Target: {dlq.sourceModule}</span>
                  </div>
                  <p className="font-medium text-red-600 dark:text-red-400 mt-2">{dlq.failureReason}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                    <button className="px-4 py-2 bg-zinc-800 text-white hover:bg-zinc-700 rounded text-sm font-medium transition">Mark Resolved</button>
                    <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm font-medium transition">Replay Job</button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

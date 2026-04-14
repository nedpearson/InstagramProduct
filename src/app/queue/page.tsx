import { processReviewTaskAction } from '@/app/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ReviewQueuePage() {
  const tasks = await prisma.reviewTask.findMany({
    where: { status: 'pending' },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Review Queue</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900 p-6 rounded-xl shadow-sm">
        <h2 className="text-lg font-semibold text-amber-800 dark:text-amber-400 mb-2">Attention Required</h2>
        <p className="text-amber-700 dark:text-amber-500 text-sm mb-6">
          The following actions require human approval before safely proceeding. Our local companion service handles full-auto tasks, but unsupported or flagged actions pause here.
        </p>

        {tasks.length === 0 ? (
          <div className="text-center p-8 bg-white/50 dark:bg-zinc-900/50 rounded-lg border border-amber-100 dark:border-amber-900/50">
             <p className="text-amber-700 dark:text-amber-600 font-medium">Queue is perfectly clear 🚀</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tasks.map(task => (
              <div key={task.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-4 rounded-lg flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-3 mb-1">
                    <span className="font-semibold text-lg text-zinc-900 dark:text-zinc-100 uppercase text-xs tracking-wider bg-zinc-100 dark:bg-zinc-800 px-2 py-1 rounded">
                      {task.entityType.replace('_', ' ')}
                    </span>
                    <span className="text-zinc-500 text-sm">ID: {task.entityId.slice(0,8)}</span>
                  </div>
                  <p className="font-medium text-zinc-800 dark:text-zinc-200">{task.reason}</p>
                </div>
                <div className="flex gap-2 w-full md:w-auto">
                  <form action={processReviewTaskAction.bind(null, task.id, 'reject')} className="flex-1 md:flex-none">
                     <button type="submit" className="w-full px-3 py-2 bg-red-100 text-red-700 hover:bg-red-200 rounded text-sm font-medium transition">Reject</button>
                  </form>
                  <form action={processReviewTaskAction.bind(null, task.id, 'approve')} className="flex-1 md:flex-none">
                    <button type="submit" className="w-full px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded text-sm font-medium transition">Approve & Continue</button>
                  </form>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function CalendarPage() {
  const assets = await prisma.contentAsset.findMany({
    where: { status: 'approved' },
    select: { id: true, title: true, assetType: true, variants: true }
  });

  const schedules = await prisma.schedule.findMany({
    include: { variant: { include: { asset: true } } },
    orderBy: { scheduledFor: 'asc' },
    take: 50
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Content Calendar</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
          <h2 className="text-xl font-semibold mb-6">Upcoming Schedule</h2>
          {schedules.length === 0 ? (
            <p className="text-sm text-zinc-500">No scheduled content. Drag items here to schedule.</p>
          ) : (
            <div className="space-y-4">
              {schedules.map((schedule) => (
                <div key={schedule.id} className="flex items-center gap-4 p-4 border border-zinc-100 dark:border-zinc-800 rounded-lg hover:border-blue-500 transition">
                  <div className="flex-shrink-0 text-center w-16 bg-zinc-50 dark:bg-zinc-950 p-2 rounded-md">
                    <div className="text-xs uppercase text-zinc-500 font-bold">{new Date(schedule.scheduledFor).toLocaleString('default', { month: 'short' })}</div>
                    <div className="text-xl font-bold">{new Date(schedule.scheduledFor).getDate()}</div>
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold text-lg">{schedule.variant.asset.title}</div>
                    <div className="text-xs text-zinc-500 flex gap-2 items-center">
                      <span className="font-mono bg-zinc-100 dark:bg-zinc-800 px-1 py-0.5 rounded">{schedule.variant.asset.assetType}</span>
                      <span>Hook: {schedule.variant.hook}</span>
                    </div>
                  </div>
                  <div>
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      schedule.status === 'published' ? 'bg-green-100 text-green-800' :
                      schedule.status === 'failed' ? 'bg-red-100 text-red-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {schedule.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="bg-zinc-50 dark:bg-zinc-950 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-inner h-[600px] overflow-y-auto">
          <h2 className="text-lg font-semibold mb-4">Approved Queue</h2>
          <div className="space-y-3">
            {assets.map(asset => (
              <div key={asset.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-3 rounded-lg shadow-sm cursor-grab hover:ring-2 hover:ring-blue-500 transition">
                <div className="font-medium text-sm mb-1">{asset.title}</div>
                <div className="flex justify-between items-center text-xs text-zinc-500">
                  <span className="font-mono">{asset.assetType}</span>
                  <span>{asset.variants.length} var</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

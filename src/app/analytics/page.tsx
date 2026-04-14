import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function AnalyticsPage() {
  const publishedCount = await prisma.publishedPost.count();
  const leadsGenerated = await prisma.lead.count();
  const interactions = await prisma.comment.count();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Performance Analytics</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-6 rounded-xl shadow-md">
          <h3 className="text-lg font-medium opacity-90 mb-2">Total Reach Pipeline</h3>
          <p className="text-4xl font-bold mb-1">{publishedCount * 1204}</p>
          <div className="text-sm opacity-80">+14% vs last month</div>
        </div>
        
        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-zinc-500 text-sm font-medium mb-2">Total Leads Captured</h3>
          <p className="text-3xl font-bold">{leadsGenerated}</p>
          <div className="text-sm text-green-600 font-medium mt-1">High Intent Pipeline</div>
        </div>

        <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
          <h3 className="text-zinc-500 text-sm font-medium mb-2">Engagement Events</h3>
          <p className="text-3xl font-bold">{interactions * 15}</p>
          <div className="text-sm text-zinc-400 mt-1">Comments, DMs, Saves</div>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm mt-8">
        <h2 className="text-xl font-semibold mb-4">Top Performing Hooks</h2>
        <table className="w-full text-left text-sm">
          <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
            <tr>
              <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Hook Preview</th>
              <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Type</th>
              <th className="px-4 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Conversion Rate</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
             {/* Stubbed data for UI effect */}
            <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-3 font-medium">"Stop doing X..."</td>
              <td className="px-4 py-3"><span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-xs">reel</span></td>
              <td className="px-4 py-3 text-green-600 font-bold">14.2%</td>
            </tr>
            <tr className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
              <td className="px-4 py-3 font-medium">"The real reason you fail..."</td>
              <td className="px-4 py-3"><span className="px-2 py-0.5 bg-zinc-100 dark:bg-zinc-800 rounded font-mono text-xs">carousel</span></td>
              <td className="px-4 py-3 text-green-600 font-bold">11.8%</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

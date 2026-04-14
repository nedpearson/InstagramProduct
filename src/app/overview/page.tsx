import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function OverviewPage() {
  const products = await prisma.product.count();
  const campaigns = await prisma.campaign.count();
  const contentAssets = await prisma.contentAsset.count();
  const leads = await prisma.lead.count();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">System Overview</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        {[
          { label: 'Products', value: products },
          { label: 'Campaigns', value: campaigns },
          { label: 'Content Assets', value: contentAssets },
          { label: 'Leads Generated', value: leads },
        ].map((stat) => (
          <div key={stat.label} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
            <h3 className="text-sm font-medium text-zinc-500 mb-1">{stat.label}</h3>
            <p className="text-3xl font-bold">{stat.value}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl p-6 shadow-sm">
        <h2 className="text-xl font-semibold mb-4">Pending Background Jobs</h2>
        <PendingJobsList />
      </div>
    </div>
  );
}

async function PendingJobsList() {
  const jobs = await prisma.backgroundJob.findMany({
    orderBy: { createdAt: 'desc' },
    take: 5
  });

  if (jobs.length === 0) {
    return <p className="text-zinc-500 text-sm">No jobs in the queue.</p>
  }

  return (
    <ul className="space-y-3">
      {jobs.map(job => (
        <li key={job.id} className="flex justify-between items-center text-sm border-b border-zinc-100 dark:border-zinc-800 pb-2">
          <span>{job.jobType}</span>
          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
            job.status === 'completed' ? 'bg-green-100 text-green-800' :
            job.status === 'failed' ? 'bg-red-100 text-red-800' :
            'bg-blue-100 text-blue-800'
          }`}>
            {job.status}
          </span>
        </li>
      ))}
    </ul>
  );
}

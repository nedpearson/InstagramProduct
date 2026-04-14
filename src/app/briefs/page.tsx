import { generateBriefAction, createBriefAction } from '@/app/actions';
import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function BriefsPage() {
  const briefs = await prisma.productBrief.findMany({
    include: { product: true },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Master Product Briefs</h1>
        <div className="space-x-4">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition">
            New Brief
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {briefs.map((brief) => (
          <div key={brief.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm flex flex-col justify-between">
            <div>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{brief.product.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  brief.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                }`}>
                  {brief.status}
                </span>
              </div>
              <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{brief.targetAudience}</p>
              
              <div className="space-y-1 mb-6">
                <div className="text-xs flex justify-between">
                  <span className="text-zinc-500">CTA Keyword</span>
                  <span className="font-mono font-medium">{brief.ctaKeyword}</span>
                </div>
                <div className="text-xs flex justify-between">
                  <span className="text-zinc-500">Mode</span>
                  <span className="font-medium capitalize">{brief.approvalMode}</span>
                </div>
              </div>
            </div>
            
            <div className="flex gap-2">
              <button className="flex-1 py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium rounded-md transition border border-zinc-200 dark:border-zinc-700">
                Edit Brief
              </button>
              <form action={generateBriefAction.bind(null, brief.id)} className="flex-1">
                <button type="submit" className="w-full py-2 bg-blue-600 hover:bg-blue-700 focus:bg-blue-800 disabled:opacity-50 text-white text-sm font-medium rounded-md transition shadow-sm">
                  Generate
                </button>
              </form>
            </div>
          </div>
        ))}
        {briefs.length === 0 && (
          <div className="col-span-full text-center p-12 bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl relative overflow-hidden">
            <h3 className="text-lg font-medium text-zinc-900 dark:text-white mb-2">No briefs found</h3>
            <p className="text-zinc-500 mb-6">Create a master product brief to start generating content.</p>
            {/* Find a product ID or just pass a hardcoded demo ID for this template */}
            <form action={createBriefAction.bind(null, 'DEMO_PRODUCT_ID_NEEDS_REPLACEMENT')} className="relative z-10 w-max mx-auto">
              <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-md font-medium transition shadow-lg relative z-10 cursor-pointer">
                Create First Brief
              </button>
            </form>
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-950/20 dark:to-purple-950/20 pointer-events-none" />
          </div>
        )}
      </div>
    </div>
  );
}

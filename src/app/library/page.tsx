import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ContentLibraryPage() {
  const assets = await prisma.contentAsset.findMany({
    include: {
      campaign: {
        include: { product: true }
      },
      variants: true
    },
    orderBy: { createdAt: 'desc' }
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Content Library</h1>
        <div className="space-x-4">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition">
            Create Asset
          </button>
        </div>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-zinc-50 dark:bg-zinc-950 border-b border-zinc-200 dark:border-zinc-800">
              <tr>
                <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Title</th>
                <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Type</th>
                <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Campaign</th>
                <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Status</th>
                <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Variants</th>
                <th className="px-6 py-3 font-semibold text-zinc-700 dark:text-zinc-300">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {assets.map((asset) => (
                <tr key={asset.id} className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50 transition">
                  <td className="px-6 py-4 font-medium">{asset.title}</td>
                  <td className="px-6 py-4">
                    <span className="px-2 py-1 bg-zinc-100 dark:bg-zinc-800 rounded text-xs font-mono">
                      {asset.assetType}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {asset.campaign.name}
                    <div className="text-xs text-zinc-500 mt-1">{asset.campaign.product.name}</div>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      asset.status === 'approved' ? 'bg-green-100 text-green-800' :
                      asset.status === 'published' ? 'bg-purple-100 text-purple-800' :
                      'bg-orange-100 text-orange-800'
                    }`}>
                      {asset.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-center">{asset.variants.length}</td>
                  <td className="px-6 py-4">
                    <button className="text-blue-600 hover:text-blue-800 dark:hover:text-blue-400 font-medium">View</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

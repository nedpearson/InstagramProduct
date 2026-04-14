import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ProductsPage() {
  const products = await prisma.product.findMany({
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Products Catalog</h1>
        <div className="space-x-4">
          <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition">
            New Product
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {products.map((product) => (
          <div key={product.id} className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-lg">{product.name}</h3>
                <span className={`px-2 py-0.5 rounded text-xs font-semibold ${
                  product.isActive ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-800 dark:bg-zinc-800 dark:text-zinc-300'
                }`}>
                  {product.isActive ? 'Active' : 'Inactive'}
                </span>
            </div>
            <p className="text-zinc-500 text-sm line-clamp-2 mb-4">{product.description}</p>
            <div className="font-medium mb-4">${product.price}</div>
            
            <button className="w-full py-2 bg-zinc-100 dark:bg-zinc-800 hover:bg-zinc-200 dark:hover:bg-zinc-700 text-sm font-medium rounded-md transition border border-zinc-200 dark:border-zinc-700">
                Manage Details
            </button>
          </div>
        ))}
        {products.length === 0 && (
          <div className="col-span-full py-12 text-center text-zinc-500">
            No products configured.
          </div>
        )}
      </div>
    </div>
  );
}

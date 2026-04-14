import { prisma } from '@/lib/prisma';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function RulesPage() {
  const rules = await prisma.automationRule.findMany();

  return (
    <div className="p-8 max-w-6xl mx-auto space-y-6">
      <div className="flex justify-between items-center bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl">
        <h1 className="text-3xl font-bold tracking-tight">Rules & Policy Engine</h1>
        <Link href="/" className="text-sm font-medium text-blue-600 hover:underline">Back Home</Link>
      </div>

      <div className="bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 rounded-xl shadow-sm">
        <h2 className="text-xl font-semibold mb-6">Active Automation Guards</h2>
        {rules.length === 0 ? (
            <div className="text-zinc-500 text-sm">No structured rules defined currently. Using system defaults.</div>
        ) : (
            <div className="space-y-4">
                {rules.map(rule => (
                    <div key={rule.id} className="p-4 border border-zinc-200 dark:border-zinc-800 rounded-lg flex items-center justify-between">
                        <div>
                            <span className="font-medium font-mono text-sm">{rule.ruleType}</span>
                            <pre className="text-xs text-zinc-500 mt-2">{rule.ruleConfig}</pre>
                        </div>
                        <div>
                            <span className={`px-2 py-1 rounded text-xs font-semibold ${rule.isActive ? 'bg-green-100 text-green-800' : 'bg-zinc-100 text-zinc-500'}`}>{rule.isActive ? 'Active' : 'Disabled'}</span>
                        </div>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
}

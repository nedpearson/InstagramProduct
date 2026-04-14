import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen p-8 bg-zinc-50 dark:bg-zinc-950 text-zinc-900 dark:text-zinc-50">
      <h1 className="text-4xl font-bold mb-4 tracking-tight">Instagram Automation Hub</h1>
      <p className="text-lg mb-8 text-zinc-600 dark:text-zinc-400 max-w-xl text-center">
        The ultimate control center for scheduling, generation, and analytics for Instagram content.
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-5xl w-full">
        {/* Navigation Cards */}
        {[
          { text: 'Overview', href: '/overview' },
          { text: 'Product Briefs', href: '/briefs' },
          { text: 'Products', href: '/products' },
          { text: 'Content Library', href: '/library' },
          { text: 'Calendar', href: '/calendar' },
          { text: 'Review Queue', href: '/queue' },
          { text: 'Operator Inbox', href: '/inbox' },
          { text: 'System Health', href: '/health' },
          { text: 'Rules Engine', href: '/rules' },
          { text: 'Analytics', href: '/analytics' },
          { text: 'Settings', href: '/settings' },
        ].map((item) => (
          <Link key={item.href} href={item.href} className="group relative overflow-hidden rounded-xl bg-white dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 p-6 hover:shadow-lg transition-all hover:-translate-y-1">
            <h3 className="text-xl font-semibold mb-2">{item.text}</h3>
            <p className="text-zinc-500 text-sm">Manage your {item.text.toLowerCase()} directly.</p>
          </Link>
        ))}
      </div>
    </div>
  );
}

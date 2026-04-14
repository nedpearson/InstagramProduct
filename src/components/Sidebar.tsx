'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard,
  FileText,
  Package,
  Library,
  Calendar,
  AlertCircle,
  Inbox,
  Activity,
  ShieldCheck,
  LineChart,
  Settings,
  Menu,
  Bell,
  Search,
  Command,
  X,
  Sparkles
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Overview', href: '/overview', icon: LayoutDashboard },
  { name: 'Product Briefs', href: '/briefs', icon: FileText },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Content Library', href: '/library', icon: Library },
  { name: 'Calendar', href: '/calendar', icon: Calendar },
];

const operations = [
  { name: 'Review Queue', href: '/queue', icon: AlertCircle },
  { name: 'Operator Inbox', href: '/inbox', icon: Inbox },
  { name: 'System Health', href: '/health', icon: Activity },
  { name: 'Rules Engine', href: '/rules', icon: ShieldCheck },
  { name: 'Analytics', href: '/analytics', icon: LineChart },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <div className="flex h-screen bg-[#fafafa] dark:bg-[#09090b] text-[#111827] dark:text-[#f8fafc] font-sans antialiased overflow-hidden">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm lg:hidden"
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-white/60 dark:bg-[#121214]/60 backdrop-blur-xl border-r border-zinc-200/80 dark:border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-16 px-6 border-b border-zinc-200/80 dark:border-white/5 bg-white/40 dark:bg-white/[0.02]">
          <Link href="/overview" className="flex items-center gap-2 group cursor-pointer text-zinc-900 dark:text-white">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-500/20 group-hover:scale-105 transition-transform duration-300 ease-out">
               <Sparkles className="w-4 h-4 text-white" />
            </div>
            <span className="font-bold tracking-tight text-lg">InstaFlow</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-4rem)] scrollbar-hide py-6 px-3 space-y-8">
          <div>
            <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-3">Workspace</div>
            <nav className="space-y-1 relative">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname === '/' && item.href === '/overview');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium z-10 ${
                      isActive 
                        ? 'text-indigo-700 dark:text-indigo-300' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'
                    }`}
                  >
                    {isActive && mounted && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg -z-10 ring-1 ring-indigo-500/20"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-4 h-4 transition-colors z-10 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                    <span className="z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[11px] font-semibold text-zinc-400 dark:text-zinc-500 uppercase tracking-widest mb-3 px-3">Operations</div>
            <nav className="space-y-1 relative">
              {operations.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm font-medium z-10 ${
                      isActive 
                        ? 'text-indigo-700 dark:text-indigo-300' 
                        : 'text-zinc-600 dark:text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100 hover:bg-zinc-100/50 dark:hover:bg-zinc-800/30'
                    }`}
                  >
                    {isActive && mounted && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-indigo-50 dark:bg-indigo-500/10 rounded-lg -z-10 ring-1 ring-indigo-500/20"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-4 h-4 transition-colors z-10 ${isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-zinc-400'}`} />
                    <span className="z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden">
        {/* Header */}
        <header className="h-16 flex-shrink-0 bg-white/40 dark:bg-[#09090b]/40 backdrop-blur-2xl border-b border-zinc-200/80 dark:border-white/5 flex items-center justify-between px-4 lg:px-8 z-20">
          <div className="flex items-center gap-4">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition">
              <Menu className="w-5 h-5" />
            </button>
            <div className="hidden md:flex items-center px-3 py-1.5 bg-zinc-100/50 dark:bg-white/[0.03] rounded-md border border-zinc-200/50 dark:border-white/5 focus-within:bg-white dark:focus-within:bg-[#121214] focus-within:ring-2 focus-within:ring-indigo-500/30 focus-within:border-transparent transition-all w-72 shadow-inner">
              <Search className="w-4 h-4 text-zinc-400 mr-2" />
              <input type="text" placeholder="Search (Cmd+K)" className="bg-transparent border-none outline-none text-sm w-full placeholder:text-zinc-500 dark:text-zinc-300" />
              <div className="text-[10px] font-mono text-zinc-400 bg-zinc-200/50 dark:bg-zinc-800 px-1.5 py-0.5 rounded ml-2 border border-zinc-300 dark:border-zinc-700">⌘K</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <button className="relative p-2 text-zinc-500 hover:text-zinc-900 dark:hover:text-white transition rounded-full hover:bg-zinc-100/80 dark:hover:bg-white/5">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2 right-2 w-2 h-2 bg-indigo-500 rounded-full border-2 border-white dark:border-[#09090b]"></span>
            </button>
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 flex items-center justify-center text-white text-sm font-semibold shadow-inner ring-2 ring-white dark:ring-[#121214] cursor-pointer hover:scale-105 transition-transform">
              NP
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-[#fafafa] dark:bg-[#09090b]">
           <div className="absolute inset-0 pointer-events-none opacity-[0.03] dark:opacity-[0.02]" style={{ backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")` }}></div>
           
           <AnimatePresence mode="wait">
             <motion.div
               key={pathname}
               initial={{ opacity: 0, y: 10, filter: 'blur(4px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               exit={{ opacity: 0, y: -10, filter: 'blur(4px)' }}
               transition={{ duration: 0.25, ease: 'easeOut' }}
               className="h-full"
             >
                {children}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

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
    <div className="flex h-screen text-zinc-100 font-sans antialiased overflow-hidden bg-transparent">
      {/* Mobile sidebar overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setSidebarOpen(false)} 
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div 
        className={`fixed inset-y-0 left-0 z-50 w-[260px] bg-black/40 backdrop-blur-2xl border-r border-white/5 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-[4px_0_24px_rgba(0,0,0,0.5)] ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        <div className="flex items-center justify-between h-20 px-6 border-b border-white/5 bg-white/[0.01]">
          <Link href="/overview" className="flex items-center gap-3 group cursor-pointer text-white">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-[0_0_15px_rgba(79,70,229,0.4)] group-hover:shadow-[0_0_25px_rgba(79,70,229,0.6)] group-hover:scale-105 transition-all duration-300 ease-out border border-white/20">
               <Sparkles className="w-5 h-5 text-white" />
            </div>
            <span className="font-black tracking-tight text-xl drop-shadow-sm">InstaFlow</span>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-white transition">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="overflow-y-auto h-[calc(100vh-5rem)] scrollbar-hide py-8 px-4 space-y-10">
          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-3 flex items-center gap-2">
              Workspace <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <nav className="space-y-1.5 relative">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname === '/' && item.href === '/overview');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold z-10 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && mounted && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-indigo-500/10 rounded-xl -z-10 border border-indigo-500/20 shadow-inner"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 transition-colors z-10 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span className="z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          <div>
            <div className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-4 px-3 flex items-center gap-2">
              Operations <div className="h-px flex-1 bg-white/5"></div>
            </div>
            <nav className="space-y-1.5 relative">
              {operations.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-4 py-3 rounded-xl transition-colors text-sm font-bold z-10 ${
                      isActive 
                        ? 'text-white' 
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    {isActive && mounted && (
                      <motion.div
                        layoutId="activeNavBackground"
                        className="absolute inset-0 bg-indigo-500/10 rounded-xl -z-10 border border-indigo-500/20 shadow-inner"
                        transition={{ type: 'spring', stiffness: 400, damping: 30 }}
                      />
                    )}
                    <item.icon className={`w-5 h-5 transition-colors z-10 ${isActive ? 'text-indigo-400' : 'text-zinc-500'}`} />
                    <span className="z-10">{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>
      </motion.div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent">
        {/* Header */}
        <header className="h-20 flex-shrink-0 bg-black/20 backdrop-blur-3xl border-b border-white/5 flex items-center justify-between px-6 lg:px-10 z-20 shadow-sm relative">
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/[0.02] to-transparent mix-blend-overlay pointer-events-none" />
          
          <div className="flex items-center gap-4 relative z-10">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white transition">
              <Menu className="w-6 h-6" />
            </button>
            <div className="hidden md:flex items-center px-4 py-2.5 bg-black/40 rounded-xl border border-white/10 focus-within:bg-black focus-within:ring-1 focus-within:ring-indigo-500/50 focus-within:border-indigo-500/50 transition-all w-80 shadow-inner group">
              <Search className="w-4 h-4 text-zinc-500 group-focus-within:text-indigo-400 mr-3 transition-colors" />
              <input type="text" placeholder="Search (Cmd+K)" className="bg-transparent border-none outline-none text-sm font-medium w-full placeholder:text-zinc-600 text-white" />
              <div className="text-[10px] font-bold text-zinc-500 bg-white/5 px-2 py-1 rounded-md border border-white/10 tracking-widest">⌘K</div>
            </div>
          </div>
          <div className="flex items-center gap-6 relative z-10">
            <button className="relative p-2.5 text-zinc-400 hover:text-white transition rounded-xl hover:bg-white/5 border border-transparent hover:border-white/10">
              <Bell className="w-5 h-5" />
              <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border-2 border-[#09090b] shadow-[0_0_8px_rgba(79,70,229,0.8)]"></span>
            </button>
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 flex items-center justify-center text-white text-sm font-black shadow-[0_0_15px_rgba(79,70,229,0.3)] ring-1 ring-white/20 cursor-pointer hover:scale-105 transition-transform hover:shadow-[0_0_20px_rgba(79,70,229,0.5)]">
              NP
            </div>
          </div>
        </header>

        {/* Scrollable Content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-transparent">
           <AnimatePresence mode="wait">
             <motion.div
               key={pathname}
               initial={{ opacity: 0, y: 15, filter: 'blur(8px)' }}
               animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
               exit={{ opacity: 0, y: -15, filter: 'blur(8px)' }}
               transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
               className="h-full relative z-10"
             >
                {children}
             </motion.div>
           </AnimatePresence>
        </main>
      </div>
    </div>
  );
}

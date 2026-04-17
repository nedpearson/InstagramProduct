'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, FileText, Package, Library, Calendar, Eye,
  AlertCircle, Inbox, Activity, ShieldCheck, LineChart,
  Settings, Menu, Bell, Search, X, Zap, ChevronRight, Gem,
  CircleDollarSign, Target, TrendingUp, BookOpen
} from 'lucide-react';
import { useState, useEffect } from 'react';

const navigation = [
  { name: 'Executive Command Center', href: '/overview', icon: LayoutDashboard },
  { name: 'Profit Sector Matrix', href: '/sectors', icon: TrendingUp },
  { name: 'Market Domination', href: '/domination', icon: Target },
  { name: 'Trend Radar', href: '/trends', icon: Activity },
  { name: 'Competitor War Room', href: '/competitors', icon: ShieldCheck },
  { name: 'Launch Cockpit', href: '/launches', icon: Zap },
  { name: 'Revenue Dashboard', href: '/revenue', icon: CircleDollarSign },
];

const operations = [
  { name: 'System Auditor & Health', href: '/system', icon: Activity },
  { name: 'Automation Dashboard', href: '/automation', icon: LineChart },
  { name: 'Content Calendar', href: '/calendar', icon: Calendar },
  { name: 'Content Library', href: '/library', icon: Library },
  { name: 'Product Briefs', href: '/briefs', icon: FileText },
  { name: 'Review Queue', href: '/queue', icon: AlertCircle },
  { name: 'Settings / Admin', href: '/settings', icon: Settings },
  { name: 'System Docs & Setup', href: '/docs', icon: BookOpen },
];

export function Sidebar({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [tick, setTick] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  // Subtle live clock tick for AI aliveness
  useEffect(() => {
    const interval = setInterval(() => setTick(t => t + 1), 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex h-screen text-zinc-100 font-sans antialiased overflow-hidden bg-transparent">
      {/* Mobile overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md lg:hidden"
            onClick={() => setSidebarOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.div className={`fixed inset-y-0 left-0 z-50 w-[264px] flex flex-col bg-[#030304]/90 backdrop-blur-2xl border-r border-white/[0.05] transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 shadow-2xl ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        
        {/* Logo */}
        <div className="flex items-center justify-between h-[64px] px-5 border-b border-white/[0.04] shrink-0">
          <Link href="/overview" className="flex items-center gap-3 group cursor-pointer">
            {/* AI logo mark */}
            <div className="relative w-9 h-9 rounded-xl flex items-center justify-center shrink-0">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity" />
              <div className="absolute inset-[1px] rounded-[10px] bg-gradient-to-br from-indigo-400/20 to-transparent" />
              <Zap className="w-4 h-4 text-white relative z-10 drop-shadow-sm" />
            </div>
            <div className="flex flex-col leading-none">
              <span className="font-extrabold tracking-tight text-[15px] text-white">InstaFlow</span>
              <span className="ai-section-label mt-0.5" style={{ fontSize: '8px', letterSpacing: '0.14em' }}>AI PLATFORM</span>
            </div>
          </Link>
          <button onClick={() => setSidebarOpen(false)} className="lg:hidden text-zinc-500 hover:text-white transition p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* AI Status Strip */}
        <div className="px-4 py-3 border-b border-white/[0.04] bg-indigo-500/[0.04]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-emerald-500"></span>
              </span>
              <span className="text-[10px] font-bold text-emerald-400/80 tracking-widest uppercase">Neural Engine Active</span>
            </div>
            <span className="text-[9px] text-zinc-600 font-mono tabular-nums">{tick > 0 ? `+${tick * 3}s` : '0s'}</span>
          </div>
        </div>

        {/* Nav */}
        <div className="overflow-y-auto flex-1 scrollbar-hide py-6 px-3 space-y-6">
          {/* Workspace */}
          <div>
            <div className="ai-section-label px-3 mb-3 flex items-center gap-2">
              Workspace <div className="h-px flex-1 bg-white/[0.04]"></div>
            </div>
            <nav className="space-y-0.5">
              {navigation.map((item) => {
                const isActive = pathname === item.href || (pathname === '/' && item.href === '/overview');
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-[13px] font-semibold z-10 group/nav ${
                      isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {isActive && mounted && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 rounded-xl -z-10 bg-white/[0.06] border border-white/[0.08] shadow-inner"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    {/* Active indicator bar */}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full" />
                    )}
                    <item.icon className={`w-[17px] h-[17px] transition-colors shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover/nav:text-zinc-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>

          {/* Operations */}
          <div>
            <div className="ai-section-label px-3 mb-3 flex items-center gap-2">
              Operations <div className="h-px flex-1 bg-white/[0.04]"></div>
            </div>
            <nav className="space-y-0.5">
              {operations.map((item) => {
                const isActive = pathname === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setSidebarOpen(false)}
                    className={`relative flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors text-[13px] font-semibold z-10 group/nav ${
                      isActive ? 'text-white' : 'text-zinc-500 hover:text-zinc-200 hover:bg-white/[0.04]'
                    }`}
                  >
                    {isActive && mounted && (
                      <motion.div
                        layoutId="activeNavBg"
                        className="absolute inset-0 rounded-xl -z-10 bg-white/[0.06] border border-white/[0.08] shadow-inner"
                        transition={{ type: 'spring', stiffness: 500, damping: 35 }}
                      />
                    )}
                    {isActive && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-0.5 h-5 bg-indigo-400 rounded-full" />
                    )}
                    <item.icon className={`w-[17px] h-[17px] transition-colors shrink-0 ${isActive ? 'text-indigo-400' : 'text-zinc-600 group-hover/nav:text-zinc-400'}`} />
                    <span>{item.name}</span>
                  </Link>
                );
              })}
            </nav>
          </div>
        </div>

        {/* System footer */}
        <div className="px-4 py-4 border-t border-white/[0.04] bg-white/[0.01] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-zinc-800 to-zinc-900 flex items-center justify-center text-[11px] font-bold text-white ring-1 ring-white/10 shrink-0">
              NP
            </div>
            <div className="flex flex-col leading-none min-w-0 flex-1">
              <span className="text-[12px] font-semibold text-white truncate">Ned Pearson</span>
              <span className="text-[10px] text-zinc-500 mt-0.5">Administrator</span>
            </div>
            {/* Plan badge — links to billing */}
            <Link href="/billing" className="shrink-0 flex items-center gap-1 px-2.5 py-1 rounded-lg bg-indigo-500/10 hover:bg-indigo-500/20 border border-indigo-500/20 transition-all group/plan">
              <Gem className="w-3 h-3 text-indigo-400 group-hover/plan:scale-110 transition-transform" />
              <span className="text-[9px] font-black text-indigo-400 tracking-widest uppercase">Pro</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Main content area */}
      <div className="flex-1 flex flex-col h-full relative overflow-hidden bg-transparent min-w-0">
        
        {/* Top header */}
        <header className="h-[64px] flex-shrink-0 border-b border-white/[0.04] bg-[#030304]/70 backdrop-blur-xl flex items-center justify-between px-6 lg:px-8 z-20 relative">
          <div className="absolute inset-0 bg-gradient-to-r from-indigo-500/[0.01] via-transparent to-transparent pointer-events-none" />

          <div className="flex items-center gap-4 relative z-10 flex-1">
            <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-zinc-400 hover:text-white transition p-1">
              <Menu className="w-5 h-5" />
            </button>
            
            {/* AI command bar — opens command palette on click */}
            <button
              onClick={() => document.getElementById('command-palette-trigger')?.click()}
              className="hidden md:flex items-center px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.06] rounded-xl border border-white/[0.06] hover:border-indigo-500/25 transition-all w-72 group shadow-inner cursor-pointer"
            >
              <Search className="w-3.5 h-3.5 text-zinc-600 group-hover:text-indigo-400 mr-2.5 transition-colors shrink-0" />
              <span className="text-[13px] font-medium text-zinc-600 group-hover:text-zinc-400 flex-1 text-left transition-colors">Search or run command...</span>
              <div className="flex items-center gap-0.5 shrink-0">
                <kbd className="text-[8px] font-black text-zinc-700 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06] leading-none">⌘</kbd>
                <kbd className="text-[8px] font-black text-zinc-700 bg-white/[0.04] px-1.5 py-0.5 rounded border border-white/[0.06] leading-none">K</kbd>
              </div>
            </button>
          </div>

          <div className="flex items-center gap-3 relative z-10">
            {/* AI compute indicator */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-lg bg-indigo-500/[0.08] border border-indigo-500/[0.15]">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-indigo-500"></span>
              </span>
              <span className="text-[10px] font-bold text-indigo-400/80 tracking-widest uppercase">AI Active</span>
            </div>

            <button className="relative p-2 text-zinc-500 hover:text-white transition rounded-lg hover:bg-white/[0.05] border border-transparent hover:border-white/[0.08]">
              <Bell className="w-4 h-4" />
              <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-indigo-500 rounded-full ring-2 ring-[#030304]"></span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto scrollbar-hide relative bg-transparent">
            <div className="h-full relative z-10">
              {children}
            </div>
        </main>
      </div>
    </div>
  );
}

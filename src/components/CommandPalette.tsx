'use client';

import { useEffect, useState, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, LayoutDashboard, FileText, Package, Library, Calendar,
  AlertCircle, Inbox, Activity, ShieldCheck, LineChart, Settings,
  Zap, ArrowRight, Clock, Sparkles, Hash, Command
} from 'lucide-react';

const NAV_COMMANDS = [
  { label: 'Overview — Command Center', href: '/overview', icon: LayoutDashboard, group: 'Navigate', keys: 'G O', badge: undefined },
  { label: 'Product Briefs', href: '/briefs', icon: FileText, group: 'Navigate', keys: 'G B', badge: undefined },
  { label: 'Products Catalog', href: '/products', icon: Package, group: 'Navigate', keys: 'G P', badge: undefined },
  { label: 'Content Library', href: '/library', icon: Library, group: 'Navigate', keys: 'G L', badge: undefined },
  { label: 'Content Calendar', href: '/calendar', icon: Calendar, group: 'Navigate', keys: 'G C', badge: undefined },
  { label: 'Review Queue', href: '/queue', icon: AlertCircle, group: 'Navigate', keys: 'G Q', badge: undefined },
  { label: 'Operator Inbox', href: '/inbox', icon: Inbox, group: 'Navigate', keys: 'G I', badge: undefined },
  { label: 'System Health', href: '/health', icon: Activity, group: 'Navigate', keys: 'G H', badge: undefined },
  { label: 'Rules Engine', href: '/rules', icon: ShieldCheck, group: 'Navigate', keys: undefined, badge: undefined },
  { label: 'Analytics Dashboard', href: '/analytics', icon: LineChart, group: 'Navigate', keys: undefined, badge: undefined },
  { label: 'Settings & Integration', href: '/settings', icon: Settings, group: 'Navigate', keys: undefined, badge: undefined },
];

const ACTION_COMMANDS = [
  { label: 'Create New Brief', href: '/briefs', icon: Zap, group: 'Actions', badge: 'AI', keys: undefined },
  { label: 'Schedule Content', href: '/calendar', icon: Calendar, group: 'Actions', badge: undefined, keys: undefined },
  { label: 'View Pending Review Tasks', href: '/queue', icon: AlertCircle, group: 'Actions', badge: undefined, keys: undefined },
  { label: 'Open Analytics', href: '/analytics', icon: LineChart, group: 'Actions', badge: undefined, keys: undefined },
  { label: 'Check System Health', href: '/health', icon: Activity, group: 'Actions', badge: undefined, keys: undefined },
  { label: 'Connect Instagram Account', href: '/settings', icon: Zap, group: 'Actions', badge: 'Setup', keys: undefined },
];

const ALL_COMMANDS = [...NAV_COMMANDS, ...ACTION_COMMANDS];

function fuzzyMatch(query: string, text: string): boolean {
  const q = query.toLowerCase();
  const t = text.toLowerCase();
  return t.includes(q) || q.split('').every(c => t.includes(c));
}

export function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [selected, setSelected] = useState(0);
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);

  const filtered = query.length === 0
    ? ALL_COMMANDS
    : ALL_COMMANDS.filter(cmd => fuzzyMatch(query, cmd.label));

  const execute = useCallback((cmd: (typeof ALL_COMMANDS)[number]) => {
    router.push(cmd.href);
    setOpen(false);
    setQuery('');
  }, [router]);

  // Global keyboard listener
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      // ⌘K or Ctrl+K
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setOpen(v => !v);
        setSelected(0);
      }
      if (!open) return;
      if (e.key === 'Escape') { setOpen(false); setQuery(''); }
      if (e.key === 'ArrowDown') { e.preventDefault(); setSelected(s => Math.min(s + 1, filtered.length - 1)); }
      if (e.key === 'ArrowUp') { e.preventDefault(); setSelected(s => Math.max(s - 1, 0)); }
      if (e.key === 'Enter' && filtered[selected]) { execute(filtered[selected]); }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [open, filtered, selected, execute]);

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      setSelected(0);
    }
  }, [open]);

  // Group results
  const groups: Record<string, typeof ALL_COMMANDS> = {};
  for (const cmd of filtered) {
    if (!groups[cmd.group]) groups[cmd.group] = [];
    groups[cmd.group].push(cmd);
  }

  let globalIndex = 0;

  return (
    <>
      {/* Trigger button (hidden, for ref — triggered via keyboard) */}
      <button
        id="command-palette-trigger"
        onClick={() => setOpen(true)}
        className="sr-only"
        aria-label="Open command palette"
      />

      <AnimatePresence>
        {open && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="fixed inset-0 z-[100] bg-black/70 backdrop-blur-sm"
              onClick={() => { setOpen(false); setQuery(''); }}
            />

            {/* Panel */}
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: -8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: -8 }}
              transition={{ duration: 0.18, ease: [0.16, 1, 0.3, 1] }}
              className="fixed top-[15vh] left-1/2 -translate-x-1/2 z-[101] w-full max-w-xl px-4"
            >
              <div className="rounded-2xl bg-[#0d0d12] border border-white/[0.08] shadow-2xl shadow-black/60 overflow-hidden">

                {/* Search input */}
                <div className="flex items-center gap-3 px-4 py-3.5 border-b border-white/[0.06]">
                  <Search className="w-4 h-4 text-zinc-500 shrink-0" />
                  <input
                    ref={inputRef}
                    type="text"
                    value={query}
                    onChange={e => { setQuery(e.target.value); setSelected(0); }}
                    placeholder="Search or run command..."
                    className="flex-1 bg-transparent text-[14px] font-medium text-white placeholder:text-zinc-600 outline-none"
                  />
                  <kbd className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-md bg-white/[0.04] border border-white/[0.06] text-[9px] font-bold text-zinc-600 tracking-widest">
                    ESC
                  </kbd>
                </div>

                {/* Results */}
                <div className="max-h-80 overflow-y-auto py-2">
                  {filtered.length === 0 ? (
                    <div className="py-10 text-center">
                      <Hash className="w-6 h-6 text-zinc-700 mx-auto mb-2" />
                      <p className="text-[12px] text-zinc-600 font-medium">No commands found for &ldquo;{query}&rdquo;</p>
                    </div>
                  ) : (
                    Object.entries(groups).map(([groupName, cmds]) => {
                      const section = (
                        <div key={groupName}>
                          <div className="px-4 py-1.5 text-[9px] font-black text-zinc-700 tracking-[0.18em] uppercase">
                            {groupName}
                          </div>
                          {cmds.map(cmd => {
                            const idx = globalIndex++;
                            const isSelected = idx === selected;
                            return (
                              <button
                                key={cmd.label}
                                onMouseEnter={() => setSelected(idx)}
                                onClick={() => execute(cmd)}
                                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-100 ${
                                  isSelected ? 'bg-indigo-600/20' : 'hover:bg-white/[0.03]'
                                }`}
                              >
                                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 border transition-colors ${
                                  isSelected
                                    ? 'bg-indigo-500/20 border-indigo-500/30'
                                    : 'bg-white/[0.04] border-white/[0.06]'
                                }`}>
                                  <cmd.icon className={`w-3.5 h-3.5 ${isSelected ? 'text-indigo-400' : 'text-zinc-500'}`} />
                                </div>
                                <span className={`text-[13px] font-medium flex-1 ${isSelected ? 'text-white' : 'text-zinc-400'}`}>
                                  {cmd.label}
                                </span>
                                {cmd.badge && (
                                  <span className="px-2 py-0.5 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-[9px] font-black text-indigo-400 tracking-widest uppercase">
                                    {cmd.badge}
                                  </span>
                                )}
                                {cmd.keys && (
                                  <kbd className="hidden sm:inline-flex gap-1 text-[9px] font-bold text-zinc-700 tracking-widest">
                                    {cmd.keys}
                                  </kbd>
                                )}
                                {isSelected && <ArrowRight className="w-3.5 h-3.5 text-indigo-400 shrink-0" />}
                              </button>
                            );
                          })}
                        </div>
                      );
                      return section;
                    })
                  )}
                </div>

                {/* Footer */}
                <div className="px-4 py-2.5 border-t border-white/[0.05] flex items-center justify-between bg-white/[0.01]">
                  <div className="flex items-center gap-4 text-[9px] font-bold text-zinc-700 tracking-widest">
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">↑↓</kbd> Navigate</span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">↵</kbd> Select</span>
                    <span className="flex items-center gap-1"><kbd className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">Esc</kbd> Close</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-[9px] font-bold text-zinc-700 tracking-widest">
                    <Sparkles className="w-3 h-3 text-indigo-600" /> AI Commands
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}

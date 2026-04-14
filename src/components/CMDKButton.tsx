'use client';

// Isolated client component so the overview server component can render
// a button with onClick without violating the RSC "event handler" constraint.

export function CMDKButton() {
  return (
    <button
      onClick={() => document.getElementById('command-palette-trigger')?.click()}
      className="hidden sm:flex items-center gap-2 px-4 py-2.5 bg-white/[0.03] hover:bg-white/[0.06] border border-white/[0.08] rounded-xl transition-all group active:scale-95"
    >
      <span className="text-[12px] text-zinc-500 group-hover:text-zinc-300 font-medium">Quick actions</span>
      <kbd className="flex items-center gap-0.5 text-[9px] font-black text-zinc-700 tracking-wide">
        <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">⌘</span>
        <span className="px-1.5 py-0.5 rounded bg-white/[0.05] border border-white/[0.07]">K</span>
      </kbd>
    </button>
  );
}

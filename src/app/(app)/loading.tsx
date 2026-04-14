export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh] relative">
      <div className="mesh-bg-1" />
      <div className="flex flex-col items-center gap-5 relative z-10">
        {/* Branded spinner */}
        <div className="relative w-10 h-10">
          <div className="absolute inset-0 rounded-full border-2 border-indigo-500/20" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-indigo-500 animate-spin" />
          <div className="absolute inset-[3px] rounded-full border border-violet-500/30 border-t-violet-400 animate-spin" style={{ animationDirection: 'reverse', animationDuration: '0.8s' }} />
        </div>
        <div className="text-center">
          <p className="text-[12px] font-bold text-zinc-500 tracking-widest uppercase animate-pulse">Neural Engine</p>
          <p className="text-[10px] text-zinc-700 font-medium mt-0.5">Loading intelligence...</p>
        </div>
      </div>
    </div>
  );
}

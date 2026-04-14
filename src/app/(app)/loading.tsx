export default function Loading() {
  return (
    <div className="flex items-center justify-center min-h-[60vh]">
      <div className="flex flex-col items-center gap-4">
        <div className="w-8 h-8 border-4 border-zinc-200 border-t-blue-600 rounded-full animate-spin"></div>
        <p className="text-sm font-medium text-zinc-500 animate-pulse">Loading dashboard...</p>
      </div>
    </div>
  );
}

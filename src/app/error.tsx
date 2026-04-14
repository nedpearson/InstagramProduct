'use client';

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4 text-center">
      <div className="max-w-md w-full bg-white dark:bg-zinc-900 border border-red-100 dark:border-red-900/30 p-8 rounded-xl shadow-sm">
        <div className="w-12 h-12 bg-red-100 text-red-600 rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
        </div>
        <h2 className="text-xl font-bold mb-2 text-zinc-900 dark:text-zinc-100">Something went wrong</h2>
        <p className="text-sm text-zinc-500 mb-6">{error.message || "An unexpected system error occurred."}</p>
        <button
          onClick={() => reset()}
          className="w-full px-4 py-2 bg-zinc-900 hover:bg-zinc-800 dark:bg-zinc-100 dark:text-zinc-900 dark:hover:bg-white text-white font-medium rounded-md transition"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

'use client';
import { useState } from 'react';
import { Plus, Check, Loader2 } from 'lucide-react';

export default function CreateAssetButton() {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const { createWorkspaceBriefAction } = await import('@/app/(app)/actions');
      await createWorkspaceBriefAction();
      setSuccess(true);
      setTimeout(() => {
         setSuccess(false);
         // Refresh page or revalidate
         window.location.reload();
      }, 1000);
    } catch(e) {
      console.error(e);
      setSuccess(false);
    } finally {
      setLoading(false);
    }
  };

  return (
    <button 
      onClick={handleCreate}
      disabled={loading || success}
      className={`px-5 py-2.5 font-bold text-[13px] rounded-xl shadow-lg transition-all duration-200 flex items-center gap-2 active:scale-95 disabled:opacity-50 ${
        success ? 'bg-emerald-600 text-white shadow-emerald-500/25' : 'bg-indigo-600 hover:bg-indigo-500 text-white hover:shadow-indigo-500/25'
      }`}
    >
      {loading ? (
         <><Loader2 className="w-4 h-4 animate-spin" /> Processing Matrix...</>
      ) : success ? (
         <><Check className="w-4 h-4" /> Agent Queued</>
      ) : (
         <><Plus className="w-4 h-4" /> Create Asset</>
      )}
    </button>
  );
}

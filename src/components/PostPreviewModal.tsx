'use client';

import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Smartphone, X, Heart, MessageCircle, Send, Bookmark, MoreHorizontal } from 'lucide-react';

export function PostPreviewModal({ schedule }: { schedule: any }) {
  const [open, setOpen] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const variant = schedule.variant;
  const asset = variant.asset;

  return (
    <>
      <button 
        onClick={() => setOpen(true)}
        className="text-[10px] uppercase font-bold tracking-widest text-indigo-400 hover:text-white transition-colors bg-indigo-500/10 hover:bg-indigo-500/30 px-3 py-1.5 rounded-md"
      >
        Preview Post
      </button>

      {open && mounted && createPortal(
        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
          <div className="absolute inset-0 bg-black/90 backdrop-blur-xl" onClick={() => setOpen(false)} />
          
          <div className="relative w-full max-w-[400px] h-[800px] max-h-[90vh] bg-black border-[8px] border-zinc-900 rounded-[3rem] shadow-2xl flex flex-col overflow-hidden animate-in zoom-in-95 duration-300">
            {/* Phone Top Notch */}
            <div className="absolute top-0 inset-x-0 h-7 flex justify-center z-50">
              <div className="w-32 h-6 bg-zinc-900 rounded-b-3xl"></div>
            </div>

            {/* Instagram Header Mock */}
            <div className="pt-10 pb-3 px-4 flex items-center justify-between border-b border-white/10 z-10 bg-black">
               <div className="flex items-center gap-3">
                 <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-yellow-400 via-fuchsia-500 to-indigo-500 p-[2px]">
                   <div className="w-full h-full bg-black rounded-full border-2 border-black flex items-center justify-center">
                     <Smartphone className="w-4 h-4 text-white" />
                   </div>
                 </div>
                 <div className="text-sm font-bold text-white tracking-tight">insta_growth_hq</div>
               </div>
               <MoreHorizontal className="w-5 h-5 text-zinc-300" />
            </div>

            {/* Content Area */}
            <div className="flex-1 overflow-y-auto bg-zinc-950 no-scrollbar">
               {/* Mock Video Frame */}
               <div className="w-full aspect-[4/5] bg-zinc-900 relative flex items-center justify-center overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-tr from-indigo-900/40 via-fuchsia-900/20 to-black mix-blend-overlay"></div>
                  {/* Hook Text overlay centered */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center p-8 text-center text-white drop-shadow-[0_2px_10px_rgba(0,0,0,0.8)]">
                     <h1 className="text-3xl font-black uppercase tracking-tight leading-tight">{variant.hook || asset.title}</h1>
                  </div>
               </div>

               {/* Interaction Bar */}
               <div className="p-4 bg-black">
                 <div className="flex justify-between items-center mb-3">
                   <div className="flex items-center gap-4">
                     <Heart className="w-6 h-6 text-white" />
                     <MessageCircle className="w-6 h-6 text-white" />
                     <Send className="w-6 h-6 text-white" />
                   </div>
                   <Bookmark className="w-6 h-6 text-white" />
                 </div>
                 <div className="font-bold text-sm text-white mb-2">10,234 likes</div>
                 
                 {/* Caption */}
                 <div className="text-sm text-zinc-200">
                   <span className="font-bold text-white mr-2">insta_growth_hq</span>
                   <span className="whitespace-pre-wrap leading-relaxed">{variant.body}</span>
                 </div>
                 
                 <div className="text-[10px] text-zinc-500 uppercase tracking-widest mt-4">
                   Scheduled for {new Date(schedule.scheduledFor).toLocaleString()}
                 </div>
               </div>
            </div>
            
            {/* Close Button overlay */}
            <button 
              onClick={() => setOpen(false)}
              className="absolute top-4 -right-16 text-white hover:text-zinc-300"
            >
              <X className="w-8 h-8" />
            </button>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

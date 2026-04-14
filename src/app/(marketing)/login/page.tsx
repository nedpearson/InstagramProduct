'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion } from 'framer-motion';
import { Zap, Mail, Lock, Eye, EyeOff, ArrowRight, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Simulate auth — redirect to app
    await new Promise(r => setTimeout(r, 900));
    window.location.href = '/overview';
  };

  return (
    <div className="min-h-screen bg-[#030304] flex">
      {/* Ambient mesh */}
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Left — brand panel */}
      <div className="hidden lg:flex flex-1 flex-col justify-between p-12 border-r border-white/[0.04] relative overflow-hidden">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
            <Zap className="w-4 h-4 text-white relative z-10" />
          </div>
          <span className="font-extrabold text-[16px] text-white tracking-tight">InstaFlow</span>
        </Link>

        <div className="max-w-md">
          <div className="text-[10px] font-black text-indigo-400 tracking-[0.2em] uppercase mb-6">Neural Intelligence Platform</div>
          <h1 className="text-4xl font-black tracking-tighter text-white leading-tight mb-5">
            Your Instagram growth engine awaits.
          </h1>
          <p className="text-[15px] text-zinc-400 font-medium leading-relaxed mb-10">
            Log in to access your AI-powered content engine, funnels, and analytics dashboard.
          </p>

          {/* Testimonial */}
          <div className="p-5 rounded-2xl bg-white/[0.03] border border-white/[0.06]">
            <div className="flex gap-0.5 mb-3">
              {Array(5).fill(null).map((_, i) => (
                <svg key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" viewBox="0 0 24 24"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
              ))}
            </div>
            <p className="text-[13px] text-zinc-300 italic leading-relaxed mb-3">"InstaFlow replaced an entire marketing team. The AI just knows what to post and when."</p>
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-full bg-gradient-to-br from-indigo-500 to-violet-600 flex items-center justify-center text-[10px] font-black text-white">SK</div>
              <div>
                <div className="text-[12px] font-bold text-white">Sarah K.</div>
                <div className="text-[10px] text-zinc-500">Course Creator · 400 leads/week</div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-[11px] text-zinc-600 font-medium">
          © 2026 InstaFlow · All systems operational
        </div>
      </div>

      {/* Right — auth form */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-12 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
          className="w-full max-w-sm"
        >
          {/* Mobile logo */}
          <Link href="/" className="lg:hidden flex items-center gap-2.5 mb-8">
            <div className="relative w-8 h-8 rounded-xl flex items-center justify-center">
              <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
              <Zap className="w-4 h-4 text-white relative z-10" />
            </div>
            <span className="font-extrabold text-[15px] text-white">InstaFlow</span>
          </Link>

          <h2 className="text-2xl font-black tracking-tight text-white mb-1.5">Welcome back</h2>
          <p className="text-[13px] text-zinc-500 font-medium mb-8">Sign in to your InstaFlow dashboard.</p>

          {error && (
            <div className="flex items-start gap-3 p-4 bg-red-500/10 border border-red-500/20 rounded-xl mb-5">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
              <p className="text-[13px] text-red-300 font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-[11px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Email address</label>
              <div className="relative group">
                <Mail className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type="email" value={email} onChange={e => setEmail(e.target.value)} required
                  placeholder="you@example.com"
                  className="w-full pl-11 pr-4 py-3.5 bg-[#08080b] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl text-[13px] font-medium text-white placeholder:text-zinc-600 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <div className="flex justify-between items-center mb-2">
                <label className="text-[11px] font-bold text-zinc-400 tracking-widest uppercase">Password</label>
                <Link href="#" className="text-[11px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">Forgot?</Link>
              </div>
              <div className="relative group">
                <Lock className="w-4 h-4 absolute left-4 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                <input
                  type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required
                  placeholder="••••••••"
                  className="w-full pl-11 pr-12 py-3.5 bg-[#08080b] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl text-[13px] font-medium text-white placeholder:text-zinc-600 outline-none transition-all"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit" disabled={loading}
              className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 disabled:cursor-not-allowed text-white font-bold text-[14px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>Sign in <ArrowRight className="w-4 h-4" /></>
              )}
            </button>
          </form>

          <p className="text-center text-[13px] text-zinc-500 font-medium mt-6">
            Don't have an account?{' '}
            <Link href="/signup" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Start free →</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}

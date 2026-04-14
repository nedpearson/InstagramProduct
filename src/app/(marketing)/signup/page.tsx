'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Zap, Mail, Lock, User, Eye, EyeOff, ArrowRight, Check, Building2 } from 'lucide-react';

const steps = ['Account', 'Profile', 'Connect'];

export default function SignupPage() {
  const [step, setStep] = useState(0);
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ email: '', password: '', name: '', company: '' });

  const set = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }));

  const next = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < steps.length - 1) { setStep(s => s + 1); return; }
    setLoading(true);
    await new Promise(r => setTimeout(r, 900));
    window.location.href = '/overview';
  };

  return (
    <div className="min-h-screen bg-[#030304] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-md relative z-10"
      >
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2.5 justify-center mb-10">
          <div className="relative w-9 h-9 rounded-xl flex items-center justify-center">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600" />
            <Zap className="w-4.5 h-4.5 text-white relative z-10" />
          </div>
          <span className="font-extrabold text-[16px] text-white tracking-tight">InstaFlow</span>
        </Link>

        {/* Progress */}
        <div className="flex items-center gap-2 mb-8">
          {steps.map((s, i) => (
            <div key={s} className="flex items-center gap-2 flex-1">
              <div className={`w-7 h-7 rounded-full flex items-center justify-center text-[10px] font-black shrink-0 transition-all duration-300 ${
                i < step ? 'bg-indigo-600 text-white' : i === step ? 'bg-indigo-600/20 border border-indigo-500/40 text-indigo-400' : 'bg-white/[0.04] border border-white/[0.08] text-zinc-600'
              }`}>
                {i < step ? <Check className="w-3.5 h-3.5" /> : i + 1}
              </div>
              <span className={`text-[11px] font-bold tracking-wide ${i === step ? 'text-white' : 'text-zinc-600'}`}>{s}</span>
              {i < steps.length - 1 && <div className="flex-1 h-px bg-white/[0.06]" />}
            </div>
          ))}
        </div>

        {/* Card */}
        <div className="bg-[#08080b] border border-white/[0.07] rounded-2xl p-7 shadow-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, x: 16 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -16 }}
              transition={{ duration: 0.25 }}
            >
              {step === 0 && (
                <>
                  <h2 className="text-xl font-black tracking-tight text-white mb-1">Create your account</h2>
                  <p className="text-[13px] text-zinc-500 font-medium mb-6">Start for free — no credit card required.</p>
                  <form onSubmit={next} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Email</label>
                      <div className="relative group">
                        <Mail className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input type="email" required value={form.email} onChange={e => set('email', e.target.value)} placeholder="you@company.com" className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl text-[13px] text-white placeholder:text-zinc-600 outline-none transition-all font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Password</label>
                      <div className="relative group">
                        <Lock className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input type={showPw ? 'text' : 'password'} required value={form.password} onChange={e => set('password', e.target.value)} placeholder="Min. 8 characters" className="w-full pl-10 pr-10 py-3 bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl text-[13px] text-white placeholder:text-zinc-600 outline-none transition-all font-medium" />
                        <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-600 hover:text-white transition-colors">
                          {showPw ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                    <button type="submit" className="w-full py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[14px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2 mt-2">
                      Continue <ArrowRight className="w-4 h-4" />
                    </button>
                    <p className="text-center text-[11px] text-zinc-600 font-medium">By continuing you agree to our <a href="#" className="text-zinc-400 hover:text-white underline">Terms</a> and <a href="#" className="text-zinc-400 hover:text-white underline">Privacy Policy</a>.</p>
                  </form>
                </>
              )}

              {step === 1 && (
                <>
                  <h2 className="text-xl font-black tracking-tight text-white mb-1">Tell us about yourself</h2>
                  <p className="text-[13px] text-zinc-500 font-medium mb-6">We'll personalize your experience.</p>
                  <form onSubmit={next} className="space-y-4">
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Full Name</label>
                      <div className="relative group">
                        <User className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input type="text" required value={form.name} onChange={e => set('name', e.target.value)} placeholder="Jane Smith" className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl text-[13px] text-white placeholder:text-zinc-600 outline-none transition-all font-medium" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-bold text-zinc-400 tracking-widest uppercase mb-2">Company / Brand <span className="text-zinc-600">(optional)</span></label>
                      <div className="relative group">
                        <Building2 className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-600 group-focus-within:text-indigo-400 transition-colors" />
                        <input type="text" value={form.company} onChange={e => set('company', e.target.value)} placeholder="Your brand or company" className="w-full pl-10 pr-4 py-3 bg-white/[0.03] border border-white/[0.08] focus:border-indigo-500/50 rounded-xl text-[13px] text-white placeholder:text-zinc-600 outline-none transition-all font-medium" />
                      </div>
                    </div>
                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={() => setStep(0)} className="flex-1 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-zinc-300 font-semibold text-[13px] rounded-xl transition-all">
                        Back
                      </button>
                      <button type="submit" className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-[13px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2">
                        Continue <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </form>
                </>
              )}

              {step === 2 && (
                <>
                  <h2 className="text-xl font-black tracking-tight text-white mb-1">Connect Instagram</h2>
                  <p className="text-[13px] text-zinc-500 font-medium mb-6">Connect your account to start the automation engine.</p>
                  <form onSubmit={next} className="space-y-4">
                    <div className="p-5 rounded-xl bg-gradient-to-br from-indigo-500/[0.06] to-violet-500/[0.04] border border-indigo-500/20">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-pink-500 to-orange-400 flex items-center justify-center">
                          <svg className="w-4.5 h-4.5 text-white" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                        </div>
                        <div>
                          <div className="text-[13px] font-bold text-white">Instagram Business Account</div>
                          <div className="text-[11px] text-zinc-500 font-medium">via Meta Business API</div>
                        </div>
                      </div>
                      <p className="text-[12px] text-zinc-500 leading-relaxed font-medium">You'll be redirected to Meta to authorize InstaFlow. We use the official Graph API — no credentials are stored.</p>
                    </div>

                    <div className="flex gap-3">
                      {['No data stored on Meta servers', 'Official Graph API only', 'Revoke access anytime'].map(t => (
                        <div key={t} className="flex-1 flex items-start gap-1.5 text-[10px] text-zinc-500 font-medium leading-snug">
                          <Check className="w-3 h-3 text-emerald-500 mt-0.5 shrink-0" /> {t}
                        </div>
                      ))}
                    </div>

                    <div className="flex gap-3 mt-2">
                      <button type="button" onClick={() => setStep(1)} className="flex-1 py-3 bg-white/[0.04] hover:bg-white/[0.07] border border-white/[0.08] text-zinc-300 font-semibold text-[13px] rounded-xl transition-all">
                        Back
                      </button>
                      <button type="submit" disabled={loading} className="flex-1 py-3 bg-indigo-600 hover:bg-indigo-500 disabled:opacity-60 text-white font-bold text-[13px] rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex items-center justify-center gap-2">
                        {loading ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <><Zap className="w-3.5 h-3.5" /> Launch Dashboard</>}
                      </button>
                    </div>
                    <button type="button" onClick={() => { window.location.href = '/overview'; }} className="w-full text-center text-[12px] text-zinc-600 hover:text-zinc-400 font-medium transition-colors">
                      Skip for now → connect later in Settings
                    </button>
                  </form>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        <p className="text-center text-[13px] text-zinc-500 font-medium mt-5">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 font-bold hover:text-indigo-300 transition-colors">Sign in →</Link>
        </p>
      </motion.div>
    </div>
  );
}

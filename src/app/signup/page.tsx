'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Zap, ArrowRight, Clock } from 'lucide-react';
import Link from 'next/link';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate API call to save email
    setTimeout(() => {
      setSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#030304] text-white flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-indigo-500/10 blur-[120px] pointer-events-none rounded-full" />
      
      <div className="sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <Link href="/" className="flex items-center justify-center gap-2 mb-8 group">
          <div className="relative w-10 h-10 rounded-xl flex items-center justify-center shadow-lg">
            <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-indigo-500 to-violet-600 opacity-90 group-hover:opacity-100 transition-opacity" />
            <Zap className="w-5 h-5 text-white relative z-10" />
          </div>
        </Link>
        <h2 className="text-center text-3xl font-black tracking-tighter text-white">
          Apply for Private Beta
        </h2>
        <p className="mt-2 text-center text-sm text-zinc-400 font-medium max-w-sm mx-auto">
          InstaFlow AI is currently in private beta. Join the waitlist to get early access to the autonomous growth engine.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md relative z-10">
        <div className="bg-[#08080b] py-8 px-4 shadow-2xl sm:rounded-2xl border border-white/[0.06] sm:px-10">
          {!submitted ? (
            <form className="space-y-6" onSubmit={handleSignup}>
              <div>
                <label className="block text-xs font-bold text-zinc-400 uppercase tracking-wider mb-2">
                  Work Email Address
                </label>
                <div className="mt-1">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="appearance-none block w-full px-4 py-3 bg-white/[0.03] border border-white/[0.08] rounded-xl text-white placeholder-zinc-600 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all sm:text-sm"
                    placeholder="name@company.com"
                  />
                </div>
              </div>

              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center items-center gap-2 py-3.5 px-4 border border-transparent rounded-xl shadow-lg shadow-indigo-500/20 text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#08080b] transition-all active:scale-[0.98]"
                >
                  Join Waitlist <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </form>
          ) : (
            <div className="text-center py-6">
              <div className="w-12 h-12 bg-emerald-500/10 border border-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="w-6 h-6 text-emerald-400" />
              </div>
              <h3 className="text-lg font-bold text-white mb-2">You're on the list!</h3>
              <p className="text-sm text-zinc-400 font-medium">
                We've received your application. We'll email you at {email} as soon as a spot opens up.
              </p>
            </div>
          )}

          <div className="mt-6 text-center">
            <p className="text-xs text-zinc-500 font-medium">
              Already have an account? <Link href="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">Sign in</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

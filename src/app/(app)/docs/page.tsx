import { BookOpen, Rocket, Zap, ShieldAlert, CheckCircle, Code, Settings } from 'lucide-react';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default function DocsPage() {
  return (
    <div className="p-5 lg:p-8 max-w-5xl mx-auto space-y-10 animate-in fade-in duration-500 relative pb-20">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />
      <div className="mesh-bg-3" />

      {/* Header */}
      <div className="relative z-10">
        <div className="ai-section-label mb-3 flex items-center gap-2">
          <BookOpen className="w-4 h-4 text-emerald-400" /> System Documentation
        </div>
        <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white leading-none">InstaFlow Official Manual</h1>
        <p className="text-sm font-medium text-zinc-500 mt-4 leading-relaxed max-w-2xl">
          Everything you need to know about operating your autonomous profit engine, tracking telemetry, and manually hooking up your Meta Graph API tunnels.
        </p>
      </div>

      <div className="space-y-8 relative z-10">
        {/* Operations Manual Section */}
        <section className="glass-panel-ai rounded-2xl p-6 md:p-8 border border-white/[0.05] shadow-xl">
          <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-6">
            <Rocket className="w-6 h-6 text-indigo-400" /> Operational Overview
          </h2>
          <div className="space-y-6 text-sm text-zinc-400 leading-relaxed">
            <div>
              <h3 className="font-bold text-white text-base mb-2">1. Executive Command Center</h3>
              <p>The central hub for tracking your entire neural pipeline. Here, you get real-time telemetry on active product deployments, auto-scheduled campaigns, and predicted revenue.</p>
            </div>
            
            <div className="p-4 bg-white/[0.02] border border-white/[0.04] rounded-xl flex gap-4">
              <div className="shrink-0 mt-1"><TargetIcon /></div>
              <div>
                <h3 className="font-bold text-indigo-400 text-base mb-2">2. Market Domination</h3>
                <p>The system continually analyzes market forces (threats, momentum, and internal capacity) to rank your product viability. Click <span className="text-white font-bold bg-white/10 px-2 py-0.5 rounded">Deploy Market Attack</span> here to generate a massive, staggered 30-day offensive plan for your highest-ranking opportunity.</p>
              </div>
            </div>

            <div>
              <h3 className="font-bold text-white text-base mb-2">3. Launch Cockpit (Deploying the Next Best Thing)</h3>
              <ul className="list-disc pl-5 space-y-2">
                <li><strong className="text-zinc-200">Select Asset:</strong> Explicitly select a product you want to push, or let the Master Agent pick automatically based on top momentum.</li>
                <li><strong className="text-zinc-200">Autonomy Clearance:</strong> Run in Preview mode (no scheduling) or Autonomous mode (build assets & slot to timeline instantly).</li>
                <li><strong className="text-zinc-200">Deploy Next Best Thing:</strong> The central trigger. Engages the Master Agent to synthesize content, map hooks, and execute your organic launch.</li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white text-base mb-2">4. Content Calendar</h3>
              <p>Your timeline dynamically receives posts directly from the Launch Cockpit. The engine places high-converting drops optimally without overlapping duplicates. Hidden triggers like Auto-Replies remain off your calendar to keep it pristine, tracking gracefully in the background.</p>
            </div>
          </div>
        </section>

        {/* Technical/Integrations Section */}
        <section className="glass-panel-ai rounded-2xl p-6 md:p-8 border border-white/[0.05] shadow-xl relative overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-emerald-500 to-indigo-500" />
          <h2 className="text-2xl font-black text-white flex items-center gap-3 mb-6">
            <Zap className="w-6 h-6 text-emerald-400" /> Social Integrations & Webhooks
          </h2>
          <p className="text-sm text-zinc-400 mb-6">
            While the content orchestration and event-matching is 100% autonomous, the initial secure handshake with Instagram's servers requires a one-time manual infrastructure setup. Follow these exact steps to ensure Auto-Replies perform flawlessly.
          </p>

          <div className="space-y-6">
            <div className="p-5 border border-indigo-500/20 bg-indigo-500/[0.02] rounded-xl relative">
              <ShieldAlert className="w-4 h-4 text-indigo-400 absolute top-5 right-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3">Task 1: Meta App Registration</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-zinc-400">
                <li>Navigate to the <a href="https://developers.facebook.com/" target="_blank" rel="noopener noreferrer" className="text-indigo-400 hover:text-indigo-300 underline underline-offset-2">Meta Developer Dashboard</a> and ensure you have an active Facebook Business Page linked to a Professional Instagram Account.</li>
                <li>Click <strong>Create App</strong> and select <strong>Business</strong> (or Other -&gt; Consumer).</li>
                <li>Add the <strong>Instagram Graph API</strong> product to the application.</li>
              </ol>
            </div>

            <div className="p-5 border border-white/5 bg-white/[0.01] rounded-xl relative">
              <Code className="w-4 h-4 text-zinc-500 absolute top-5 right-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3">Task 2: Environment Configuration</h3>
              <p className="text-sm text-zinc-400 mb-3">Inject your API keys into the system environment variable file (<code className="text-white bg-white/10 px-1 rounded">.env</code>) so the Master Agent has clearance to speak on your behalf.</p>
              <pre className="text-[11px] font-mono text-emerald-400 bg-black p-4 rounded-lg border border-white/[0.04] overflow-x-auto">
{`# Instagram Graph API
INSTAGRAM_ACCESS_TOKEN="your_long_lived_page_access_token_here"
META_WEBHOOK_VERIFY_TOKEN="any_secure_random_string_you_invent"`}
              </pre>
            </div>

            <div className="p-5 border border-emerald-500/20 bg-emerald-500/[0.02] rounded-xl relative">
              <CheckCircle className="w-4 h-4 text-emerald-400 absolute top-5 right-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3">Task 3: Establish Webhook Tunnel</h3>
              <ol className="list-decimal pl-5 space-y-2 text-sm text-zinc-400">
                <li>Inside the Meta App Dashboard, navigate to <strong>Webhooks</strong> -&gt; <strong>Instagram</strong>.</li>
                <li>Click <strong>Edit Subscription</strong> and provide your live server endpoint mapping back to your platform:<br/>
                  <code className="text-emerald-400 bg-emerald-500/10 px-2 py-1 rounded inline-block mt-1">https://[your-domain].com/api/webhooks/instagram</code>
                </li>
                <li>Enter the exact verification string you used for <code className="text-white">META_WEBHOOK_VERIFY_TOKEN</code> into the pop-up box.</li>
                <li>Subscribe specifically to the <code className="text-white">messages</code> and <code className="text-white">comments</code> edge fields.</li>
              </ol>
            </div>

            <div className="p-5 border border-white/5 bg-white/[0.01] rounded-xl relative">
              <Settings className="w-4 h-4 text-zinc-500 absolute top-5 right-5" />
              <h3 className="text-sm font-bold text-white uppercase tracking-widest flex items-center gap-2 mb-3">Task 4: Background Scheduling (Cron)</h3>
              <p className="text-sm text-zinc-400">
                Currently, your <code className="text-white">api/integrations/post</code> execution queue is active in code, but needs a clock triggering it. Setup a CRON job on your hosting provider (like Vercel Cron or a raw Linux crontab) to send a <code className="text-white">POST</code> request to your deployment execution edge every 5 minutes. This is what physically publishes your scheduled Reels to the feed.
              </p>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
}

function TargetIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-indigo-400"><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>
  );
}

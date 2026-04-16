import { PROFIT_SECTORS, projectRevenue } from '@/lib/profitEngine';
import { TrendingUp, DollarSign, Zap, Target, ChevronRight, Sparkles } from 'lucide-react';
import { LaunchSectorButton } from '@/components/LaunchSectorButton';

const REVENUE_MODEL_LABELS: Record<string, string> = {
  affiliate: 'Affiliate Commission',
  coaching: 'High-Ticket Coaching',
  digital_product: 'Digital Products',
  saas: 'SaaS Recurring',
  ecommerce: 'E-Commerce'
};

const MODEL_COLORS: Record<string, string> = {
  affiliate: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
  coaching: 'text-fuchsia-400 bg-fuchsia-500/10 border-fuchsia-500/20',
  digital_product: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20',
  saas: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20',
  ecommerce: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
};

export default function ProfitSectorsPage() {
  const FOLLOWER_COUNT = 5000; // assumed baseline

  return (
    <div className="p-5 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500 ease-out">
      <div className="mesh-bg-1" />
      <div className="mesh-bg-2" />

      {/* Header */}
      <div className="relative z-10 pt-2">
        <div className="ai-section-label mb-3 flex items-center gap-2">
          <TrendingUp className="w-4 h-4 text-fuchsia-400" /> Revenue Intelligence
        </div>
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div>
            <h1 className="text-4xl lg:text-5xl font-black tracking-tight text-white mb-2">Profit Sector Matrix</h1>
            <p className="text-sm font-medium text-zinc-500 leading-relaxed max-w-xl">
              Top-yielding Instagram monetization verticals ranked by documented creator revenue. 
              Launch any sector to inject a full 30-day proven campaign into your calendar.
            </p>
          </div>
          <div className="flex items-center gap-2 px-4 py-3 glass-panel rounded-xl border border-fuchsia-500/20 bg-fuchsia-500/5">
            <Sparkles className="w-4 h-4 text-fuchsia-400" />
            <div>
              <div className="text-xs font-bold text-zinc-400 uppercase tracking-widest">Pipeline Value</div>
              <div className="text-xl font-black text-fuchsia-400">$0 → $50k/mo</div>
            </div>
          </div>
        </div>
      </div>

      {/* Sector Grid */}
      <div className="relative z-10 grid grid-cols-1 lg:grid-cols-2 gap-6">
        {PROFIT_SECTORS.map((sector, idx) => {
          const proj = projectRevenue(sector, FOLLOWER_COUNT);
          const isTop = idx === 0;

          return (
            <div key={sector.name} className={`glass-panel-ai rounded-2xl border overflow-hidden transition-all duration-300 hover:-translate-y-1 group ${
              isTop ? 'border-fuchsia-500/30 shadow-[0_0_40px_rgba(217,70,239,0.08)]' : 'border-white/[0.06] hover:border-white/[0.12]'
            }`}>
              {/* Top Strip */}
              <div className={`px-6 py-3 flex items-center justify-between ${isTop ? 'bg-fuchsia-500/[0.06]' : 'bg-white/[0.01]'} border-b border-white/[0.04]`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center font-black text-sm ${
                    isTop ? 'bg-fuchsia-500 text-white shadow-[0_0_15px_rgba(217,70,239,0.5)]' : 'bg-white/5 text-zinc-500'
                  }`}>
                    #{idx + 1}
                  </div>
                  {isTop && <span className="text-[10px] font-black text-fuchsia-400 uppercase tracking-widest">🔥 Top Earner</span>}
                </div>
                <span className={`text-[10px] font-bold px-2.5 py-1 rounded-full border ${MODEL_COLORS[sector.revenueModel]}`}>
                  {REVENUE_MODEL_LABELS[sector.revenueModel]}
                </span>
              </div>

              <div className="p-6 space-y-5">
                {/* Title + Revenue */}
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="text-xl font-black text-white leading-tight">{sector.name}</h2>
                    <p className="text-xs text-zinc-500 mt-1 font-medium">{sector.niche}</p>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold">Avg Creator Revenue</div>
                    <div className="text-base font-black text-emerald-400">{sector.avgMonthlyRevenue}</div>
                  </div>
                </div>

                {/* Revenue Projection */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">
                      <DollarSign className="w-2.5 h-2.5 inline mr-1"/>Est. Min/Mo
                    </div>
                    <div className="text-lg font-black text-white">${proj.monthlyMin.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-600">w/ {FOLLOWER_COUNT.toLocaleString()} followers</div>
                  </div>
                  <div className="bg-black/30 rounded-xl p-3 border border-white/5">
                    <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-1">
                      <Zap className="w-2.5 h-2.5 inline mr-1"/>Est. Max/Mo
                    </div>
                    <div className="text-lg font-black text-emerald-400">${proj.monthlyMax.toLocaleString()}</div>
                    <div className="text-[10px] text-zinc-600">{proj.estimatedSales} est. conversions</div>
                  </div>
                </div>

                {/* Pain → Outcome */}
                <div className="space-y-2">
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <Target className="w-3.5 h-3.5 text-red-500 shrink-0 mt-0.5" />
                    <span><span className="text-red-400 font-bold">Pain: </span>{sector.painPoint}</span>
                  </div>
                  <div className="flex items-start gap-2 text-xs text-zinc-400">
                    <Zap className="w-3.5 h-3.5 text-emerald-500 shrink-0 mt-0.5" />
                    <span><span className="text-emerald-400 font-bold">Outcome: </span>{sector.desiredOutcome}</span>
                  </div>
                </div>

                {/* Proven Hook Preview */}
                <div className="bg-black/40 rounded-xl p-4 border border-white/5">
                  <div className="text-[10px] uppercase tracking-widest text-zinc-600 font-bold mb-2">✦ Proven Conversion Hook</div>
                  <p className="text-sm font-bold text-white leading-snug italic">"{sector.conversionHook}"</p>
                  <div className="mt-2 text-[10px] text-indigo-400 font-bold uppercase tracking-widest">
                    CTA Keyword: {sector.ctaKeyword}
                  </div>
                </div>

                {/* Content Count */}
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-zinc-600 font-bold">
                    {sector.contentFrameworks.length} proven frameworks · {sector.contentFrameworks.length * 2} variants generated
                  </span>
                  <LaunchSectorButton sectorName={sector.name} sectorNiche={sector.niche} ctaKeyword={sector.ctaKeyword} />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Full Pipeline Launch */}
      <div className="relative z-10 glass-panel-ai rounded-2xl border border-fuchsia-500/20 p-8 text-center bg-fuchsia-500/[0.03] shadow-[0_0_60px_rgba(217,70,239,0.05)]">
        <div className="w-16 h-16 rounded-2xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center mx-auto mb-4">
          <Sparkles className="w-8 h-8 text-fuchsia-400" />
        </div>
        <h2 className="text-2xl font-black text-white mb-2">Launch Full 30-Day Pipeline</h2>
        <p className="text-sm text-zinc-500 mb-6 max-w-md mx-auto leading-relaxed">
          Inject all 5 profit sectors into your content calendar simultaneously. 
          Posts will be scheduled at optimal engagement times across 30 days.
        </p>
        <LaunchSectorButton sectorName="ALL" sectorNiche="all" ctaKeyword="LINK" fullPipeline />
      </div>
    </div>
  );
}

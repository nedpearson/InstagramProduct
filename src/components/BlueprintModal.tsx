'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Target, Zap, LayoutTemplate, 
  TrendingUp, ShieldCheck, Cog, CalendarDays, BarChart,
  Download, Copy, RefreshCw, X, ChevronRight, Activity, Globe,
  ShieldAlert, AlertTriangle, Lightbulb, Hexagon, Layers, Plus, Database, Crosshair
} from 'lucide-react';
import { generateStrategicBlueprintAction, analyzeCompetitorAction } from '@/app/(app)/actions';

export function BlueprintModal({ brief }: { brief: any }) {
  const [activeTab, setActiveTab] = useState('intelligence');
  const [isGenerating, setIsGenerating] = useState(false);
  
  // Competitor Tracking State
  const [isAddingCompetitor, setIsAddingCompetitor] = useState(false);
  const [compName, setCompName] = useState('');
  const [compHandle, setCompHandle] = useState('');

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      await generateStrategicBlueprintAction(brief.id);
    } catch (e) {
      console.error(e);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleAddCompetitor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!compName) return;
    setIsAddingCompetitor(true);
    try {
      await analyzeCompetitorAction(brief.id, { name: compName, url_handle: compHandle });
      setCompName('');
      setCompHandle('');
    } catch (e) {
      console.error(e);
    } finally {
      setIsAddingCompetitor(false);
    }
  };

  const blueprint = brief.blueprintData ? JSON.parse(brief.blueprintData) : null;

  const tabs = [
    { id: 'intelligence', label: 'Opportunity Intelligence', icon: Hexagon },
    { id: 'competitorTracker', label: 'Live Competitor Radar', icon: Crosshair },
    { id: 'marketOverview', label: 'Market Overview', icon: Globe },
    { id: 'audienceAvatar', label: 'Audience Avatar', icon: Users },
    { id: 'blueOceanStrategy', label: 'Blue Ocean', icon: Target },
    { id: 'contentStrategy', label: 'Content', icon: LayoutTemplate },
    { id: 'conversionStrategy', label: 'Conversion', icon: Zap },
    { id: 'brandAuthority', label: 'Brand Authority', icon: ShieldCheck },
    { id: 'automationScale', label: 'Automation', icon: Cog },
    { id: 'executionRoadmap', label: '90-Day Roadmap', icon: CalendarDays },
    { id: 'kpis', label: 'KPIs', icon: BarChart },
  ];

  if (!blueprint) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md" />
        <div className="relative w-full max-w-md bg-zinc-950 border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden p-8 text-center flex flex-col items-center">
          <Link href="/briefs" scroll={false} className="absolute top-4 right-4 text-zinc-500 hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </Link>
          <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center mb-6 border border-indigo-500/20">
            <TrendingUp className="w-8 h-8 text-indigo-400" />
          </div>
          <h2 className="text-2xl font-black text-white mb-2">Strategy Not Generated</h2>
          <p className="text-zinc-400 text-sm mb-8">Run the elite AI strategic consultant to build a $10k market domination blueprint for this product.</p>
          <button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full py-3.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 text-white font-bold rounded-xl transition-all shadow-lg hover:shadow-indigo-500/25 active:scale-95 flex justify-center items-center gap-2"
          >
            {isGenerating ? <Activity className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5" />}
            {isGenerating ? 'Analyzing Market...' : 'Generate $10k Blueprint'}
          </button>
        </div>
      </div>
    );
  }

  const activeSection = tabs.find(t => t.id === activeTab);
  const oppInt = blueprint.opportunityIntelligence;

  const getColorClass = (score: number) => {
    if (score >= 90) return 'text-fuchsia-400 border-fuchsia-500/30 bg-fuchsia-500/10 shadow-[0_0_15px_rgba(232,121,249,0.3)]';
    if (score >= 75) return 'text-emerald-400 border-emerald-500/30 bg-emerald-500/10';
    if (score >= 60) return 'text-amber-400 border-amber-500/30 bg-amber-500/10';
    return 'text-red-400 border-red-500/30 bg-red-500/10';
  };

  const getBarColorClass = (score: number) => {
    if (score >= 90) return 'bg-fuchsia-500';
    if (score >= 75) return 'bg-emerald-500';
    if (score >= 60) return 'bg-amber-500';
    return 'bg-red-500';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
      <div className="relative w-full max-w-7xl h-[95vh] bg-zinc-950 border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05] bg-white/[0.02] shrink-0">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-black tracking-widest border border-indigo-500/30">Active Blueprint</span>
              <h2 className="text-xl font-bold text-white">{brief.product?.name || brief.niche}</h2>
            </div>
            <p className="text-zinc-500 text-xs mt-1 font-medium">Auto-generated strategic execution plan for market domination.</p>
          </div>
          <div className="flex items-center gap-3">
            <Link href="?compare=true" scroll={false} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 border border-white/10" title="Compare Briefs">
              <Layers className="w-3.5 h-3.5" /> Compare Strategies
            </Link>
            <button className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-lg transition-colors" title="Export PDF">
              <Download className="w-4 h-4" />
            </button>
            <button onClick={handleGenerate} className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-lg transition-colors">
              <RefreshCw className={isGenerating ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            </button>
            <Link href="/briefs" scroll={false} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ml-2">
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar Tabs */}
          <div className="w-64 border-r border-white/[0.05] bg-black/40 overflow-y-auto p-4 space-y-1">
            {tabs.map(tab => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-[13px] font-bold transition-all ${
                    isActive 
                      ? 'bg-indigo-600 font-bold text-white shadow-md' 
                      : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon className={`w-4 h-4 ${isActive ? 'text-indigo-200' : 'text-zinc-500'}`} />
                    {tab.label}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4 text-white/50" />}
                </button>
              )
            })}
          </div>

          {/* Tab Content */}
          <div className="flex-1 overflow-y-auto bg-zinc-950/50">
            {activeTab === 'intelligence' ? (
              <div className="p-10 max-w-5xl mx-auto space-y-10">
                {/* Score Header */}
                <div className="flex flex-col md:flex-row gap-8 items-center justify-between">
                  <div>
                    <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                      <Hexagon className="w-8 h-8 text-indigo-400" /> Opportunity Intelligence Engine
                    </h3>
                    <p className="text-zinc-400 mt-2 font-medium bg-white/5 p-3 rounded-xl border border-white/5 inline-block">
                      <span className="text-white font-bold opacity-80">AI Assessment:</span> {oppInt.recommendation}
                    </p>
                  </div>
                  <div className={`w-36 h-36 rounded-full border-4 flex flex-col items-center justify-center shrink-0 relative ${getColorClass(oppInt.scores.composite)}`}>
                    <div className="text-[10px] uppercase tracking-widest font-bold opacity-80 mt-2">Opp Score</div>
                    <div className="text-5xl font-black">{oppInt.scores.composite}</div>
                  </div>
                </div>

                {/* Score Breakdown Bars */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-x-12 gap-y-6 bg-black/20 p-8 rounded-3xl border border-white/[0.05]">
                  {[
                    { label: 'Market Demand', score: oppInt.scores.demand, weight: '20%' },
                    { label: 'Competition & Saturation', score: oppInt.scores.competition, weight: '15%' },
                    { label: 'Monetization Potential', score: oppInt.scores.monetization, weight: '20%' },
                    { label: 'Virality Probability', score: oppInt.scores.virality, weight: '10%' },
                    { label: 'Retention & LTV', score: oppInt.scores.retention, weight: '10%' },
                    { label: 'Automation Readiness', score: oppInt.scores.automation, weight: '10%' },
                    { label: 'Brand Authority Expansion', score: oppInt.scores.authority, weight: '5%' },
                    { label: 'Long Term Viability', score: oppInt.scores.viability, weight: '10%' },
                  ].map((s) => (
                    <div key={s.label}>
                      <div className="flex justify-between items-end mb-2">
                        <div className="text-[11px] uppercase tracking-widest font-bold text-zinc-300">
                          {s.label} <span className="text-zinc-600 ml-1">({s.weight})</span>
                        </div>
                        <div className={`text-lg font-black ${getColorClass(s.score).split(' ')[0]}`}>{s.score}</div>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden border border-white/[0.02]">
                        <div 
                           className={`h-full rounded-full ${getBarColorClass(s.score)} transition-all duration-1000 ease-out`} 
                           style={{ width: `${s.score}%` }} 
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* SWOT Analysis Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Strengths */}
                  <div className="p-6 bg-emerald-500/5 border border-emerald-500/20 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-emerald-500/20 flex items-center justify-center text-emerald-400"><TrendingUp className="w-4 h-4" /></div>
                      <h4 className="text-emerald-400 font-black tracking-widest text-sm uppercase">Strategic Strengths</h4>
                    </div>
                    <ul className="space-y-3">
                      {oppInt.swot.strengths.map((s: string, idx: number) => (
                        <li key={idx} className="text-zinc-300 text-sm font-medium flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Opportunities */}
                  <div className="p-6 bg-indigo-500/5 border border-indigo-500/20 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-indigo-500/20 flex items-center justify-center text-indigo-400"><Lightbulb className="w-4 h-4" /></div>
                      <h4 className="text-indigo-400 font-black tracking-widest text-sm uppercase">Blue Ocean Opportunities</h4>
                    </div>
                    <ul className="space-y-3">
                      {oppInt.swot.opportunities.map((s: string, idx: number) => (
                        <li key={idx} className="text-zinc-300 text-sm font-medium flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 mt-1.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Weaknesses */}
                  <div className="p-6 bg-amber-500/5 border border-amber-500/20 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-amber-500/20 flex items-center justify-center text-amber-400"><AlertTriangle className="w-4 h-4" /></div>
                      <h4 className="text-amber-400 font-black tracking-widest text-sm uppercase">Core Weaknesses</h4>
                    </div>
                    <ul className="space-y-3">
                      {oppInt.swot.weaknesses.map((s: string, idx: number) => (
                        <li key={idx} className="text-zinc-300 text-sm font-medium flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Threats */}
                  <div className="p-6 bg-red-500/5 border border-red-500/20 rounded-3xl">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-8 h-8 rounded-xl bg-red-500/20 flex items-center justify-center text-red-400"><ShieldAlert className="w-4 h-4" /></div>
                      <h4 className="text-red-400 font-black tracking-widest text-sm uppercase">Market Threats</h4>
                    </div>
                    <ul className="space-y-3">
                      {oppInt.swot.threats.map((s: string, idx: number) => (
                        <li key={idx} className="text-zinc-300 text-sm font-medium flex items-start gap-3">
                          <span className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 shrink-0" /> {s}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

              </div>
            ) : activeTab === 'competitorTracker' ? (
              
              <div className="p-10 max-w-6xl mx-auto space-y-10">
                <div className="flex items-center justify-between">
                  <div>
                     <h3 className="text-3xl font-black text-white tracking-tight flex items-center gap-3">
                       <Crosshair className="w-8 h-8 text-rose-500" /> Live Competitor Radar
                     </h3>
                     <p className="text-zinc-400 mt-2 font-medium">Autonomous tracking of market gaps, funnel leaks, and positioning holes of competitors.</p>
                  </div>
                </div>

                <div className="bg-black/20 border border-white/5 p-6 rounded-3xl">
                  <form onSubmit={handleAddCompetitor} className="flex gap-4">
                    <input 
                      type="text" 
                      placeholder="Brand Name (e.g. Hormozi)" 
                      value={compName}
                      onChange={e => setCompName(e.target.value)}
                      className="flex-1 bg-white/5 border border-white/10 rounded-xl px-5 text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50"
                      required
                    />
                    <input 
                      type="text" 
                      placeholder="@handle (optional)" 
                      value={compHandle}
                      onChange={e => setCompHandle(e.target.value)}
                      className="w-48 bg-white/5 border border-white/10 rounded-xl px-5 text-white placeholder-zinc-500 outline-none focus:border-indigo-500/50"
                    />
                    <button 
                      type="submit" 
                      disabled={isAddingCompetitor}
                      className="px-6 py-3 bg-white text-black font-black rounded-xl hover:bg-zinc-200 transition-colors flex items-center gap-2"
                    >
                      {isAddingCompetitor ? <Activity className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
                      Deploy AI Spy
                    </button>
                  </form>
                </div>

                {/* Viral Trend Tracker */}
                {brief.competitors && brief.competitors.length > 0 && (
                  <div className="bg-indigo-500/5 border border-indigo-500/10 rounded-3xl p-6">
                     <div className="flex items-center gap-3 mb-6">
                        <Activity className="w-5 h-5 text-indigo-400" />
                        <h4 className="text-sm font-black uppercase tracking-widest text-indigo-400">Live Trend Tracker</h4>
                     </div>
                     <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
                           <div className="text-[10px] text-zinc-500 uppercase font-black mb-1">Emerging Hook</div>
                           <div className="text-sm font-bold text-white">"The 3 things they refuse to tell you about..."</div>
                           <div className="text-xs text-emerald-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3" /> +140% adoption</div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
                           <div className="text-[10px] text-zinc-500 uppercase font-black mb-1">Dying Format</div>
                           <div className="text-sm font-bold text-white">Generic Lip-sync POV Reels</div>
                           <div className="text-xs text-red-400 mt-2 flex items-center gap-1"><TrendingUp className="w-3 h-3 rotate-180" /> -65% engagement</div>
                        </div>
                        <div className="bg-white/[0.02] border border-white/[0.05] p-4 rounded-2xl">
                           <div className="text-[10px] text-zinc-500 uppercase font-black mb-1">Blue Ocean Topic</div>
                           <div className="text-sm font-bold text-white">Advanced Systemization</div>
                           <div className="text-xs text-fuchsia-400 mt-2 flex items-center gap-1"><Zap className="w-3 h-3" /> 0.8% Saturation</div>
                        </div>
                     </div>
                  </div>
                )}

                {(!brief.competitors || brief.competitors.length === 0) ? (
                   <div className="py-20 text-center flex flex-col items-center">
                     <Database className="w-16 h-16 text-white/[0.05] mb-4" />
                     <h4 className="text-xl font-bold text-white">No active targets</h4>
                     <p className="text-zinc-500 mt-2 max-w-sm">Deploy the AI spy by entering a competitor above. We'll aggressively scan their positioning and find gaps.</p>
                   </div>
                ) : (
                  <div className="space-y-6">
                    {brief.competitors.map((comp: any) => {
                      const data = comp.intelligenceData ? JSON.parse(comp.intelligenceData) : null;
                      return (
                        <div key={comp.id} className="bg-white/[0.02] border border-white/[0.05] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
                           <div className="p-6 border-b border-white/[0.05] bg-black/40 flex justify-between items-center">
                              <div className="flex items-center gap-5">
                                 <div className="w-14 h-14 bg-gradient-to-br from-rose-500/20 to-orange-500/20 rounded-full border border-rose-500/30 flex items-center justify-center shadow-inner">
                                   <Building2 className="w-6 h-6 text-rose-400" />
                                 </div>
                                 <div>
                                    <h4 className="text-2xl font-black text-white">{comp.brandName} <span className="text-base text-zinc-500 font-medium ml-2">{comp.handle}</span></h4>
                                    <p className="text-sm font-medium text-amber-400/80 tracking-wide mt-1">{data?.positioning}</p>
                                 </div>
                              </div>
                              <div className="text-right">
                                 <div className="text-[10px] uppercase tracking-widest font-bold text-zinc-500">Threat Level</div>
                                 <div className={`text-4xl font-black ${comp.threatScore > 80 ? 'text-rose-500' : 'text-amber-500'}`}>{comp.threatScore}</div>
                              </div>
                           </div>
                           
                           {data && (
                             <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-6 bg-zinc-950/80">
                               
                               <div className="col-span-1 md:col-span-2 grid grid-cols-2 gap-6">
                                 <div>
                                   <h5 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-emerald-400 mb-3"><TrendingUp className="w-4 h-4"/> Key Strengths</h5>
                                   <ul className="space-y-3">
                                      {data.strengths?.map((s: string, i: number) => (
                                         <li key={i} className="text-zinc-300 text-[13px] flex items-start gap-2"><span className="text-emerald-500/50 mt-0.5">•</span> {s}</li>
                                      ))}
                                   </ul>
                                 </div>
                                 <div>
                                   <h5 className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-red-400 mb-3"><AlertTriangle className="w-4 h-4"/> Critical Flaws</h5>
                                   <ul className="space-y-3">
                                      {data.weaknesses?.map((s: string, i: number) => (
                                         <li key={i} className="text-zinc-300 text-[13px] flex items-start gap-2"><span className="text-red-500/50 mt-0.5">•</span> {s}</li>
                                      ))}
                                   </ul>
                                 </div>
                               </div>

                               <div className="bg-rose-500/5 border border-rose-500/10 p-5 rounded-2xl flex flex-col justify-between">
                                  <div>
                                    <h5 className="text-[10px] font-black uppercase tracking-widest text-rose-400 mb-3">🔥 Exploitation Strategy</h5>
                                    <p className="text-zinc-200 text-sm leading-relaxed">{data.exploitation}</p>
                                  </div>
                                  <div className="mt-4 pt-4 border-t border-rose-500/20 flex justify-between items-center text-xs font-bold text-rose-300">
                                    <span>Followers Mined: {comp.followers.toLocaleString()}</span>
                                  </div>
                               </div>

                             </div>
                           )}
                        </div>
                      )
                    })}
                  </div>
                )}
              </div>

            ) : (
              // Standard Sections
              <div className="p-10 lg:p-14 max-w-3xl mx-auto">
                <h3 className="text-3xl font-black text-white mb-8 border-b border-white/10 pb-4">{activeSection?.label}</h3>
                <div className="prose prose-invert prose-indigo max-w-none">
                  {blueprint.sections.find((s: any) => s.id === activeTab)?.content?.split('\n').map((para: string, idx: number) => {
                     if (para.trim().length === 0) return null;
                     const colonMatch = para.match(/^([^:]+:)(.*)$/);
                     if (colonMatch) {
                       return (
                         <p key={idx} className="text-zinc-300 leading-relaxed mb-6 bg-white/[0.02] p-5 rounded-xl border border-white/[0.05]">
                           <strong className="text-white font-black tracking-wide text-[15px]">{colonMatch[1]}</strong>
                           <span className="block mt-2 opacity-90">{colonMatch[2]}</span>
                         </p>
                       );
                     }
                     return <p key={idx} className="text-zinc-300 leading-relaxed mb-6">{para}</p>;
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

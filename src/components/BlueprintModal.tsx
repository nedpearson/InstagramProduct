'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Building2, Users, Target, Zap, LayoutTemplate, 
  TrendingUp, ShieldCheck, Cog, CalendarDays, BarChart,
  Download, Copy, RefreshCw, X, ChevronRight, Activity, Globe
} from 'lucide-react';
import { generateStrategicBlueprintAction } from '@/app/(app)/actions';

export function BlueprintModal({ brief }: { brief: any }) {
  const [activeTab, setActiveTab] = useState('marketOverview');
  const [isGenerating, setIsGenerating] = useState(false);

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

  const blueprint = brief.blueprintData ? JSON.parse(brief.blueprintData) : null;

  const tabs = [
    { id: 'marketOverview', label: 'Market Overview', icon: Globe },
    { id: 'audienceAvatar', label: 'Audience Avatar', icon: Users },
    { id: 'competitorAnalysis', label: 'Competitors', icon: Building2 },
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

  const activeSection = blueprint.sections.find((s: any) => s.id === activeTab);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-hidden">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-lg" />
      <div className="relative w-full max-w-6xl h-[90vh] bg-zinc-950 border border-white/[0.08] shadow-2xl rounded-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-white/[0.05] bg-white/[0.02]">
          <div>
            <div className="flex items-center gap-3">
              <span className="px-2.5 py-1 rounded bg-indigo-500/20 text-indigo-400 text-[10px] uppercase font-black tracking-widest border border-indigo-500/30">Active Blueprint</span>
              <h2 className="text-xl font-bold text-white">{brief.product?.name || brief.niche}</h2>
            </div>
            <p className="text-zinc-500 text-xs mt-1 font-medium">Auto-generated strategic execution plan for market domination.</p>
          </div>
          <div className="flex items-center gap-3">
            <button className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-lg transition-colors" title="Export PDF">
              <Download className="w-4 h-4" />
            </button>
            <button className="p-2 bg-white/5 hover:bg-white/10 text-zinc-400 rounded-lg transition-colors" title="Duplicate">
              <Copy className="w-4 h-4" />
            </button>
            <button onClick={handleGenerate} className="px-4 py-2 bg-white/5 hover:bg-white/10 text-white text-xs font-bold rounded-lg transition-colors flex items-center gap-2 border border-white/10">
              <RefreshCw className={isGenerating ? "w-3 h-3 animate-spin" : "w-3 h-3"} /> Refresh Strategy
            </button>
            <Link href="/briefs" scroll={false} className="p-2 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-lg transition-colors ml-2">
              <X className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Top Dashboard Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-6 border-b border-white/[0.05]">
          <div className="col-span-2 md:col-span-1 p-6 border-r border-white/[0.05] flex flex-col items-center justify-center bg-indigo-900/10">
            <div className="text-[10px] text-zinc-400 uppercase tracking-widest font-bold mb-2">Opp Score</div>
            <div className="text-4xl font-black text-indigo-400">{blueprint.opportunityScore}</div>
          </div>
          <div className="col-span-2 md:col-span-5 grid grid-cols-2 lg:grid-cols-5 p-4 gap-4 bg-black/20">
             {Object.entries(blueprint.metrics).map(([k, v]) => (
               <div key={k} className="p-3 bg-white/[0.03] rounded-xl border border-white/[0.05]">
                 <div className="text-[9px] text-zinc-500 uppercase tracking-widest font-bold mb-1">{k.replace(/([A-Z])/g, ' $1').trim()}</div>
                 <div className="text-sm font-bold text-zinc-200">{String(v)}</div>
               </div>
             ))}
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
                  className={`w-full flex items-center justify-between p-3 rounded-xl text-sm font-bold transition-all ${
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
          <div className="flex-1 overflow-y-auto p-8 lg:p-12 bg-zinc-950/50">
            <div className="max-w-3xl mx-auto">
              <h3 className="text-2xl font-black text-white mb-6 border-b border-white/10 pb-4">{activeSection?.title}</h3>
              <div className="prose prose-invert prose-indigo max-w-none">
                {activeSection?.content.split('\n').map((para: string, idx: number) => {
                   if (para.trim().length === 0) return null;
                   // Bold leading phrases like "Demographics:"
                   const colonMatch = para.match(/^([^:]+:)(.*)$/);
                   if (colonMatch) {
                     return (
                       <p key={idx} className="text-zinc-300 leading-relaxed mb-4">
                         <strong className="text-white font-bold">{colonMatch[1]}</strong> {colonMatch[2]}
                       </p>
                     );
                   }
                   return <p key={idx} className="text-zinc-300 leading-relaxed mb-4">{para}</p>;
                })}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

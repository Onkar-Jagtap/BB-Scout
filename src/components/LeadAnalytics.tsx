import React from 'react';
import { Award, Mail, Sparkles, Star, Target, Users, Zap } from 'lucide-react';
import { Vendor } from '../types';

interface LeadAnalyticsProps {
  vendors: Vendor[];
  filteredCount: number;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  setMinLeadScore: (val: number) => void;
  setHasEmail: (val: boolean) => void;
}

export default function LeadAnalytics({
  vendors,
  filteredCount,
  selectedCategory,
  setSelectedCategory,
  setMinLeadScore,
  setHasEmail,
}: LeadAnalyticsProps) {
  const total = vendors.length;

  // 1. Calculate Average Lead Quality
  const avgLeadScore = total > 0 
    ? Math.round(vendors.reduce((sum, v) => sum + (v.leadScore || 0), 0) / total) 
    : 0;

  const highQualityCount = vendors.filter(v => (v.leadScore || 0) >= 80).length;
  const highQualityPct = total > 0 ? Math.round((highQualityCount / total) * 100) : 0;

  // 2. Contact discovered rate (Percentage with emails or phone)
  const contactDiscoveredCount = vendors.filter(v => (v.emails && v.emails.length > 0) || (v.phonesNormalized && v.phonesNormalized.length > 0)).length;
  const contactDiscoveredPct = total > 0 ? Math.round((contactDiscoveredCount / total) * 100) : 0;

  // 3. Category count
  const categoryCounts: Record<string, number> = {};
  vendors.forEach(v => {
    if (v.category) {
      categoryCounts[v.category] = (categoryCounts[v.category] || 0) + 1;
    }
  });

  const topCategories = Object.entries(categoryCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 3);

  if (total === 0) {
    return (
      <div className="glass-panel rounded-2xl p-6 border border-slate-800 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] text-center">
        <p className="text-xs text-slate-400 font-mono tracking-wide">
          Waiting for background pipeline to harvest localized B2B leads. Statistics will populate in real-time.
        </p>
      </div>
    );
  }

  return (
    <div className="grid gap-5 md:grid-cols-3">
      {/* Widget 1: Heuristic Quality Score */}
      <div 
        onClick={() => setMinLeadScore(80)}
        className="group relative glass-panel hover:bg-slate-900/90 hover:border-indigo-500/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
        id="widget-lead-score"
      >
        <div className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 transition-transform group-hover:scale-110">
          <Award className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">B2B Directory Health</span>
        <div className="flex items-baseline mt-2.5">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">{avgLeadScore}</span>
          <span className="text-xs text-slate-400 font-semibold ml-1.5">Avg Score</span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>High Tier Leads (Score 80+)</span>
            <span className="text-indigo-450 font-mono font-extrabold">{highQualityCount} ({highQualityPct}%)</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-indigo-500 rounded-full transition-all duration-500" 
              style={{ width: `${highQualityPct}%` }}
            />
          </div>
        </div>
        <p className="text-[9px] text-indigo-400 mt-2 font-mono flex items-center gap-1 group-hover:underline">
          <Zap className="h-3 w-3 animate-pulse" /> Click to isolate High Tier leads &rarr;
        </p>
      </div>

      {/* Widget 2: Reachable leads */}
      <div 
        onClick={() => {
          setHasEmail(true);
        }}
        className="group relative glass-panel hover:bg-slate-900/90 hover:border-emerald-500/50 shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl p-5 cursor-pointer transition-all duration-300 hover:-translate-y-1"
        id="widget-contact-rate"
      >
        <div className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-emerald-500/10 flex items-center justify-center text-emerald-400 transition-transform group-hover:scale-110">
          <Mail className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Outbound Campaign Readiness</span>
        <div className="flex items-baseline mt-2.5">
          <span className="text-3xl font-display font-extrabold text-white tracking-tight">{contactDiscoveredPct}%</span>
          <span className="text-xs text-slate-400 font-semibold ml-1.5">Reach Rate</span>
        </div>

        {/* Progress bar */}
        <div className="mt-4 space-y-1.5">
          <div className="flex justify-between items-center text-[10px] font-bold text-slate-400">
            <span>Direct Channels Mapped</span>
            <span className="text-emerald-450 font-mono font-extrabold">{contactDiscoveredCount} / {total} Leads</span>
          </div>
          <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-emerald-500 rounded-full transition-all duration-500" 
              style={{ width: `${contactDiscoveredPct}%` }}
            />
          </div>
        </div>
        <p className="text-[9px] text-emerald-400 mt-2 font-mono flex items-center gap-1 group-hover:underline">
          <Sparkles className="h-3 w-3 animate-pulse" /> Click to filter leads with active emails &rarr;
        </p>
      </div>

      {/* Widget 3: Top Niches / Categories */}
      <div 
        className="group relative glass-panel shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] rounded-2xl p-5 transition-all duration-300"
        id="widget-top-categories"
      >
        <div className="absolute top-4 right-4 h-8 w-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400">
          <Target className="h-4 w-4" />
        </div>
        <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">Top Directory Niches</span>
        
        {/* Industry density ranking list */}
        <div className="mt-2.5 space-y-2">
          {topCategories.map(([cat, count], idx) => {
            const isSelected = selectedCategory === cat;
            return (
              <div 
                key={idx}
                onClick={() => setSelectedCategory(isSelected ? "" : cat)}
                className={`flex items-center justify-between text-xs px-2 py-1 rounded-lg border transition-all cursor-pointer ${
                  isSelected 
                    ? 'bg-purple-500/20 text-purple-300 border-purple-500/40 font-bold scale-[1.02] shadow-sm'
                    : 'bg-slate-950/40 hover:bg-slate-950/90 text-slate-300 border-slate-800/80 hover:border-slate-750'
                }`}
                title={`Filter by ${cat}`}
              >
                <span className="truncate max-w-[150px] font-semibold">{cat}</span>
                <span className="bg-slate-900 group-hover:bg-slate-800 text-slate-300 text-[10px] font-bold font-mono px-2 py-0.5 rounded-md border border-slate-850">
                  {count} leads
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

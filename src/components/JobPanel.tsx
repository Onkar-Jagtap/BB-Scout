import React, { useState, useEffect, useRef } from 'react';
import { Search, Loader2, Play, AlertCircle, Terminal, CheckCircle2, Globe, Flame } from 'lucide-react';
import { SearchJob } from '../types';

interface JobPanelProps {
  activeJob: SearchJob | null;
  onLaunchJob: (query: string, location: string, country: string, targetCount: number) => Promise<void>;
  isLaunching: boolean;
}

export default function JobPanel({ activeJob, onLaunchJob, isLaunching }: JobPanelProps) {
  const [query, setQuery] = useState('');
  const [location, setLocation] = useState('');
  const [country, setCountry] = useState('India');
  const [targetCount, setTargetCount] = useState(10);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll terminal to bottom when new logs arrive
  useEffect(() => {
    if (logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeJob?.logs?.length]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim() || !location.trim() || !country.trim()) return;
    onLaunchJob(query.trim(), location.trim(), country.trim(), targetCount);
  };

  const loadExample = (exQuery: string, exLoc: string, exCountry: string, customCount?: number) => {
    setQuery(exQuery);
    setLocation(exLoc);
    setCountry(exCountry);
    if (customCount) {
      setTargetCount(customCount);
    }
  };

  const getStageLabel = (stage: SearchJob['stage']) => {
    switch (stage) {
      case 'searching': return 'Searching & extracting business contacts';
      case 'crawling': return 'Deep website spider crawl & contact parsing';
      case 'enriching': return 'AI-Powered profile synthesis & lead scoring';
      case 'completed': return 'Scout pipeline finished successfully';
      case 'failed': return 'Scout pipeline interrupted';
      default: return 'Listening to worker queue...';
    }
  };

  return (
    <div className="glass-panel rounded-2xl p-6 shadow-md">
      <div className="grid gap-6 md:grid-cols-12">
        
        {/* Form Inputs (Left) */}
        <div className="md:col-span-7 flex flex-col justify-between">
          <div>
            <h2 className="flex items-center text-lg font-display font-bold text-white mb-2">
              <Search className="mr-2 h-5 w-5 text-indigo-400 animate-pulse" />
              Launch Vendor Scout
            </h2>
            <p className="text-xs text-slate-400 mb-4 font-sans">
              Enter a category and target hub to launch our deep B2B scouter. The system will search directories, crawl official domains, and run AI enrichment.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label htmlFor="category-input" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  B2B Category / Keyword
                </label>
                <input
                  id="category-input"
                  type="text"
                  placeholder="e.g., Industrial Packaging Manufacturers"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  disabled={isLaunching || (activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending'))}
                  className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-slate-950 focus:outline-hidden disabled:bg-slate-950/40 disabled:text-slate-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label htmlFor="city-input" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    City / Hub
                  </label>
                  <input
                    id="city-input"
                    type="text"
                    placeholder="e.g., Pune"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    disabled={isLaunching || (activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending'))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-slate-950 focus:outline-hidden disabled:bg-slate-950/40 disabled:text-slate-500"
                    required
                  />
                </div>
                <div>
                  <label htmlFor="country-input" className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                    Country
                  </label>
                  <input
                    id="country-input"
                    type="text"
                    placeholder="e.g., India"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    disabled={isLaunching || (activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending'))}
                    className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3.5 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all focus:border-indigo-500 focus:bg-slate-950 focus:outline-hidden disabled:bg-slate-950/40 disabled:text-slate-500"
                    required
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-[10px] font-mono font-bold uppercase tracking-wider text-slate-400 mb-1.5">
                  Target Sourcing Depth (Volume Control)
                </label>
                <div className="grid grid-cols-4 gap-1.5 p-1 rounded-xl bg-slate-950 border border-slate-800/80">
                  {[
                    { value: 10, label: '10 Leads' },
                    { value: 50, label: '50 Leads' },
                    { value: 100, label: '100 Leads' },
                    { value: 200, label: '200 Leads' }
                  ].map((opt) => (
                    <button
                      key={opt.value}
                      type="button"
                      disabled={isLaunching || (activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending'))}
                      onClick={() => setTargetCount(opt.value)}
                      className={`py-1.5 rounded-lg text-center transition-all cursor-pointer ${
                        targetCount === opt.value
                          ? 'bg-slate-900 text-indigo-400 font-bold border border-indigo-500/20 text-[10px]'
                          : 'text-slate-400 hover:text-slate-200 text-[10px] hover:bg-slate-800/40'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
                <p className="text-[9px] text-slate-500 mt-1 font-sans">
                  {targetCount <= 15 
                    ? "Single-pass localized directory query. Fast & direct." 
                    : targetCount === 50 
                    ? "Deep-crawl: generates 3 distinct sub-category queries to expand B2B leads."
                    : "Massive sweep: uses intelligent multi-channel semantic expansion to acquire 100-200 targets."}
                </p>
              </div>

              <button
                id="scout-launch-btn"
                type="submit"
                disabled={isLaunching || (activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending')) || !query.trim() || !location.trim()}
                className="flex w-full items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 text-sm font-semibold text-white shadow-lg py-2.5 px-4 active:scale-98 transition disabled:opacity-50 disabled:pointer-events-none cursor-pointer"
              >
                {isLaunching ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-white" />
                    Initializing Scout Mission...
                  </>
                ) : activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending') ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin text-indigo-200" />
                    Analyzing Leads... ({activeJob.progress}%)
                  </>
                ) : (
                  <>
                    <Play className="mr-2 h-4 w-4 fill-current text-white animate-pulse" />
                    Start Scout Mission
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Dynamic Insights & Presets (Right) */}
        <div className="md:col-span-5 flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800/60 pt-5 md:pt-0 md:pl-6">
          <div className="space-y-4">
            <div>
              <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-400 font-mono">Extraction Architecture</span>
              <h3 className="text-sm font-bold text-slate-200 mt-1">Multi-Stage Data Refinery</h3>
              <p className="text-xs text-slate-400 mt-1.5 leading-relaxed font-sans">
                Our scouter connects live to map grounding API nodes, extracts company listings, and visits official domains to scrape raw emails, direct phones, and social footprints. It then triggers Gemini to structure high-fidelity B2B directories.
              </p>
            </div>

            {/* Pipeline Status Indicator */}
            <div className="rounded-xl bg-slate-950/40 border border-slate-800/80 p-3">
              <div className="flex items-center justify-between text-[11px] font-mono">
                <span className="text-slate-400 font-bold uppercase">Pipeline Status:</span>
                {activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending') ? (
                  <span className="text-indigo-400 font-bold flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    Active ({activeJob.progress}%)
                  </span>
                ) : (
                  <span className="text-slate-500 font-semibold">Idle & Listening</span>
                )}
              </div>
              <div className="text-[10px] text-slate-400 font-sans mt-1">
                {activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending') 
                  ? getStageLabel(activeJob.stage)
                  : "Ready for target specifications."
                }
              </div>
            </div>
          </div>

          {/* Quick Example Presets */}
          <div className="mt-5 border-t border-slate-800/80 pt-4">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 block mb-2">Preset Hubs:</span>
            <div className="flex flex-wrap gap-1.5">
              <button
                onClick={() => loadExample('Packaging Manufacturers', 'Pune', 'India')}
                id="example-pkg-btn"
                type="button"
                disabled={activeJob?.status === 'processing' || activeJob?.status === 'pending'}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-indigo-450 bg-slate-950/40 border border-slate-800/85 hover:bg-slate-900 px-2 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Globe className="h-3 w-3 text-indigo-400" />
                Packaging (Pune)
              </button>
              <button
                onClick={() => loadExample('Corporate Law Firms', 'Mumbai', 'India')}
                id="example-law-btn"
                type="button"
                disabled={activeJob?.status === 'processing' || activeJob?.status === 'pending'}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-indigo-450 bg-slate-950/40 border border-slate-800/85 hover:bg-slate-900 px-2 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Globe className="h-3 w-3 text-indigo-400" />
                Law Firms (Mumbai)
              </button>
              <button
                onClick={() => loadExample('Automotive Parts Exporters', 'Chennai', 'India')}
                id="example-parts-btn"
                type="button"
                disabled={activeJob?.status === 'processing' || activeJob?.status === 'pending'}
                className="inline-flex items-center gap-1 text-[11px] font-medium text-slate-300 hover:text-indigo-450 bg-slate-950/40 border border-slate-800/85 hover:bg-slate-900 px-2 py-1.5 rounded-lg transition cursor-pointer"
              >
                <Flame className="h-3 w-3 text-amber-400 animate-pulse" />
                Auto Parts (Chennai)
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

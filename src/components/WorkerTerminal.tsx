import React, { useEffect, useRef, useState } from 'react';
import { Terminal, Loader2, CheckCircle2, AlertCircle, ChevronDown, ChevronUp } from 'lucide-react';
import { SearchJob } from '../types';

interface WorkerTerminalProps {
  activeJob: SearchJob | null;
}

export default function WorkerTerminal({ activeJob }: WorkerTerminalProps) {
  const [isCollapsed, setIsCollapsed] = useState(true);
  const logEndRef = useRef<HTMLDivElement>(null);

  // Auto-expand terminal when a job starts processing
  useEffect(() => {
    if (activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending')) {
      setIsCollapsed(false);
    }
  }, [activeJob?.id, activeJob?.status]);

  // Scroll to bottom when logs change
  useEffect(() => {
    if (!isCollapsed && logEndRef.current) {
      logEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [activeJob?.logs?.length, isCollapsed]);

  const getStageLabel = (stage: SearchJob['stage']) => {
    switch (stage) {
      case 'searching': return 'Searching B2B index & extracting contacts...';
      case 'crawling': return 'Deep crawler spider parsing website channels...';
      case 'enriching': return 'AI enrichment engine synthesizing target profile...';
      case 'completed': return 'Pipeline executed successfully.';
      case 'failed': return 'Scout pipeline was interrupted.';
      default: return 'Listening to background worker queue...';
    }
  };

  return (
    <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8 mt-8">
      <div className="backdrop-blur-xl bg-slate-950/85 border border-slate-800/90 shadow-[0_12px_40px_0_rgba(0,0,0,0.25)] rounded-2xl p-4 overflow-hidden transition-all duration-300">
        
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2.5 mb-2.5">
          <div className="flex items-center space-x-2.5">
            <div className="relative flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-500/10 text-indigo-400">
              <Terminal className="h-3.5 w-3.5" />
              {activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending') && (
                <span className="absolute -top-0.5 -right-0.5 flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
              )}
            </div>
            <div>
              <h3 className="text-xs font-bold text-slate-200 font-mono tracking-wide">
                Scouter Workers Queue Terminal
              </h3>
              {activeJob && (
                <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                  Job ID: <span className="text-indigo-400">{activeJob.id.slice(0, 8)}</span>
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-3">
            {activeJob && (
              <span className="text-[10px] font-mono text-emerald-400 font-bold bg-emerald-500/10 border border-emerald-500/20 rounded-md px-2 py-0.5">
                {activeJob.progress}% Done
              </span>
            )}
            <button
              onClick={() => setIsCollapsed(!isCollapsed)}
              className="text-slate-400 hover:text-white hover:bg-slate-900 p-1 rounded-lg transition"
              title={isCollapsed ? "Expand Terminal" : "Collapse Terminal"}
            >
              {isCollapsed ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
            </button>
          </div>
        </div>

        {/* Expandable/Collapsible Area */}
        {!isCollapsed && (
          <div className="space-y-2">
            {activeJob ? (
              <div className="flex flex-col space-y-2">
                {/* Slim Status Bar */}
                <div className="bg-slate-900/80 border border-slate-800/50 rounded-xl px-3.5 py-2 flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    {activeJob.status === 'processing' || activeJob.status === 'pending' ? (
                      <Loader2 className="h-3.5 w-3.5 text-indigo-400 animate-spin" />
                    ) : activeJob.status === 'completed' ? (
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-400" />
                    ) : (
                      <AlertCircle className="h-3.5 w-3.5 text-rose-400" />
                    )}
                    <span className="text-xs font-mono font-semibold text-slate-300">
                      {getStageLabel(activeJob.stage)}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-500 font-mono">
                    Status: <span className="capitalize text-slate-300">{activeJob.status}</span>
                  </span>
                </div>

                {/* Highly Compact Logs Window */}
                <div className="h-28 bg-slate-900/50 border border-slate-800/40 rounded-xl p-2.5 overflow-y-auto font-mono text-[10.5px] text-slate-300 space-y-1 scrollbar-thin scrollbar-thumb-slate-800">
                  {activeJob.logs?.map((log, i) => {
                    let colorClass = "text-slate-400";
                    if (log.includes("Successfully") || log.includes("completed")) {
                      colorClass = "text-emerald-400";
                    } else if (log.includes("Visiting") || log.includes("Crawl completed") || log.includes("CRAWL FALLBACK")) {
                      colorClass = "text-indigo-400";
                    } else if (log.includes("failed") || log.includes("error") || log.includes("Error") || log.includes("interrupted")) {
                      colorClass = "text-rose-400 font-medium";
                    } else if (log.includes("Phase") || log.includes("AI Enrichment")) {
                      colorClass = "text-purple-400";
                    } else if (log.includes("Enriched") || log.includes("AI")) {
                      colorClass = "text-amber-400";
                    }
                    return (
                      <div key={i} className={`py-0.5 border-b border-slate-950/20 last:border-0 ${colorClass}`}>
                        <span className="text-slate-600 mr-1.5 select-none">&gt;</span>
                        {log}
                      </div>
                    );
                  })}
                  <div ref={logEndRef} />
                </div>
              </div>
            ) : (
              <div className="flex items-center justify-center border border-dashed border-slate-800/60 rounded-xl p-4 text-center">
                <p className="text-[11px] font-mono text-slate-400 max-w-lg leading-relaxed">
                  Worker terminal is idle. Launch a B2B Scout pipeline above to trigger live crawl streams, contact channel extractions, and target profiling.
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

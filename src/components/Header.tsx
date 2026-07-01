import React from 'react';
import { Trash2, Compass, Users, Star, Layers, Activity } from 'lucide-react';

interface HeaderProps {
  vendorCount: number;
  shortlistCount: number;
  jobCount: number;
  onClearDb: () => void;
  isClearing: boolean;
}

export default function Header({ vendorCount, shortlistCount, jobCount, onClearDb, isClearing }: HeaderProps) {
  return (
    <header className="sticky top-4 z-40 mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
      <div className="glass-panel shadow-[0_8px_32px_0_rgba(0,0,0,0.4)] rounded-2xl px-5 py-4 sm:px-6 transition-all duration-300">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Logo Brand Title */}
          <div className="flex items-center space-x-3">
            <div className="relative flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/10">
              <div className="flex h-full w-full items-center justify-center rounded-[10px] bg-slate-950">
                <Compass className="h-5 w-5 text-indigo-400 animate-spin-slow" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="font-display text-xl font-bold tracking-tight text-white sm:text-2xl">
                  BusinessBridge <span className="font-medium bg-gradient-to-r from-indigo-400 to-emerald-400 bg-clip-text text-transparent">Scout</span>
                </h1>
                <span className="inline-flex items-center gap-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 text-[10px] font-bold text-emerald-400">
                  <Activity className="h-2.5 w-2.5 animate-pulse" />
                  Active
                </span>
              </div>
              <p className="hidden sm:block text-xs text-slate-400 font-sans mt-0.5">
                Automated B2B vendor discovery, deep website parsing, and intelligent lead enrichment.
              </p>
            </div>
          </div>

          {/* Statistics bar & Actions */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Simple indicators */}
            <div className="flex items-center gap-1 sm:gap-2 rounded-xl bg-slate-950/40 border border-slate-800/80 p-1 sm:p-1.5 shadow-inner">
              {/* Stat 1 */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800/40 transition">
                <Users className="h-4 w-4 text-indigo-400" />
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none font-mono">Scouted</span>
                  <span className="text-xs font-bold text-slate-100 font-mono">{vendorCount}</span>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-800" />

              {/* Stat 2 */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800/40 transition">
                <Star className="h-4 w-4 text-amber-400 fill-amber-400/10" />
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none font-mono">Shortlisted</span>
                  <span className="text-xs font-bold text-slate-100 font-mono">{shortlistCount}</span>
                </div>
              </div>

              <div className="h-4 w-px bg-slate-800" />

              {/* Stat 3 */}
              <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-slate-800/40 transition">
                <Layers className="h-4 w-4 text-emerald-400" />
                <div className="text-left">
                  <span className="block text-[9px] font-bold text-slate-400 uppercase leading-none font-mono">Pipelines</span>
                  <span className="text-xs font-bold text-slate-100 font-mono">{jobCount}</span>
                </div>
              </div>
            </div>

            {/* Clear Database Action */}
            <button
              onClick={onClearDb}
              disabled={isClearing}
              id="clear-db-btn"
              className="inline-flex h-9 items-center justify-center gap-1.5 rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 px-3.5 text-xs font-semibold text-red-400 transition duration-200 active:scale-95 disabled:opacity-50 cursor-pointer"
              title="Clear all local data and reset workspace"
            >
              <Trash2 className="h-3.5 w-3.5" />
              <span>{isClearing ? "Resetting..." : "Reset Workspace"}</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}

import React, { useState } from 'react';
import { SlidersHorizontal, Search, Star, Globe, Mail, RotateCcw, Award } from 'lucide-react';

interface FiltersProps {
  searchTerm: string;
  setSearchTerm: (val: string) => void;
  selectedCategory: string;
  setSelectedCategory: (val: string) => void;
  selectedLocation: string;
  setSelectedLocation: (val: string) => void;
  starredOnly: boolean;
  setStarredOnly: (val: boolean) => void;
  minRating: number;
  setMinRating: (val: number) => void;
  minLeadScore: number;
  setMinLeadScore: (val: number) => void;
  hasWebsite: boolean;
  setHasWebsite: (val: boolean) => void;
  hasEmail: boolean;
  setHasEmail: (val: boolean) => void;
  categories: string[];
  locations: string[];
  onReset: () => void;
  scoreWeights: {
    website: number;
    rating: number;
    email: number;
    contact: number;
    relevance: number;
  };
  setScoreWeights: React.Dispatch<React.SetStateAction<{
    website: number;
    rating: number;
    email: number;
    contact: number;
    relevance: number;
  }>>;
}

export default function Filters({
  searchTerm,
  setSearchTerm,
  selectedCategory,
  setSelectedCategory,
  selectedLocation,
  setSelectedLocation,
  starredOnly,
  setStarredOnly,
  minRating,
  setMinRating,
  minLeadScore,
  setMinLeadScore,
  hasWebsite,
  setHasWebsite,
  hasEmail,
  setHasEmail,
  categories,
  locations,
  onReset,
  scoreWeights,
  setScoreWeights
}: FiltersProps) {
  const [showAdvancedWeights, setShowAdvancedWeights] = useState(false);

  const handleWeightChange = (key: keyof typeof scoreWeights, val: number) => {
    setScoreWeights(prev => ({
      ...prev,
      [key]: val
    }));
  };

  const handleResetWeights = () => {
    setScoreWeights({
      website: 25,
      rating: 15,
      email: 20,
      contact: 20,
      relevance: 20
    });
  };

  return (
    <div className="glass-panel rounded-2xl p-5 space-y-6 shadow-md">
      
      {/* Live Search */}
      <div>
        <h3 className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-400 mb-2">
          Search Directory
        </h3>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <input
            id="dashboard-search-input"
            type="text"
            placeholder="Search company, tech, keyword..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full rounded-xl border border-slate-800 bg-slate-950/70 pl-9 pr-4 py-2.5 text-sm text-slate-100 placeholder-slate-500 transition-all duration-200 focus:border-indigo-500 focus:bg-slate-950 focus:outline-hidden focus:ring-2 focus:ring-indigo-500/20"
          />
        </div>
      </div>

      <div className="border-t border-slate-800/80 pt-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="flex items-center text-xs font-display font-bold uppercase tracking-wider text-slate-200">
            <SlidersHorizontal className="mr-1.5 h-3.5 w-3.5 text-indigo-400" />
            Filter Leads
          </h3>
          <button
            onClick={onReset}
            id="reset-filters-btn"
            className="text-[11px] font-bold text-indigo-400 hover:text-indigo-300 flex items-center gap-1 transition-colors group cursor-pointer"
            title="Reset to default filters"
          >
            <RotateCcw className="h-3 w-3 group-hover:rotate-180 transition-transform duration-500" />
            <span>Reset All</span>
          </button>
        </div>

        <div className="space-y-4">
          {/* Bookmark Checkbox toggle */}
          <label className="flex items-center gap-2.5 cursor-pointer rounded-xl bg-amber-500/5 border border-amber-500/10 px-3 py-2 text-xs text-amber-400 hover:bg-amber-500/10 hover:border-amber-500/20 transition-all">
            <input
              type="checkbox"
              checked={starredOnly}
              onChange={(e) => setStarredOnly(e.target.checked)}
              className="rounded border-slate-800 text-amber-400 focus:ring-amber-400/20 bg-slate-950"
            />
            <Star className={`h-4 w-4 ${starredOnly ? 'fill-amber-400 text-amber-400' : 'text-slate-400'}`} />
            <span className="font-bold">Shortlisted Only</span>
          </label>

          {/* Category Dropdown */}
          <div>
            <label htmlFor="category-select" className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Business Category
            </label>
            <select
              id="category-select"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 transition-all duration-200 focus:border-indigo-500 focus:bg-slate-900 focus:outline-hidden"
            >
              <option value="" className="bg-slate-950 text-slate-200">All Categories</option>
              {categories.map((cat, i) => (
                <option key={i} value={cat} className="bg-slate-950 text-slate-200">{cat}</option>
              ))}
            </select>
          </div>

          {/* Location Dropdown */}
          <div>
            <label htmlFor="location-select" className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1.5">
              Hub / Location
            </label>
            <select
              id="location-select"
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full rounded-xl border border-slate-800 bg-slate-950/70 px-3 py-2 text-xs text-slate-200 transition-all duration-200 focus:border-indigo-500 focus:bg-slate-900 focus:outline-hidden"
            >
              <option value="" className="bg-slate-950 text-slate-200">All Locations</option>
              {locations.map((loc, i) => (
                <option key={i} value={loc} className="bg-slate-950 text-slate-200">{loc}</option>
              ))}
            </select>
          </div>

          {/* Rating Slider Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span>Min Rating</span>
              <span className="text-indigo-400 font-bold font-mono bg-indigo-500/10 border border-indigo-500/20 px-1.5 py-0.5 rounded-md">{minRating === 0 ? 'Any' : `${minRating}★+`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minRating}
              onChange={(e) => setMinRating(parseFloat(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-slate-800 accent-indigo-500 cursor-pointer"
            />
          </div>

          {/* Lead score Slider Filter */}
          <div className="space-y-1.5">
            <div className="flex justify-between text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider">
              <span>Min Quality Score</span>
              <span className="text-emerald-400 font-bold font-mono bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">{minLeadScore === 0 ? 'Any' : `${minLeadScore}+`}</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              step="5"
              value={minLeadScore}
              onChange={(e) => setMinLeadScore(parseInt(e.target.value))}
              className="w-full h-1.5 rounded-lg bg-slate-800 accent-emerald-500 cursor-pointer"
            />
          </div>

          {/* Contact Checklists */}
          <div className="space-y-2 border-t border-slate-800/85 pt-4">
            <span className="block text-[11px] font-mono font-bold text-slate-400 uppercase tracking-wider mb-1">
              Contact Requirements
            </span>
            
            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={hasWebsite}
                onChange={(e) => setHasWebsite(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/20"
              />
              <Globe className="h-3.5 w-3.5 text-slate-400" />
              <span>Must Have Website</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer text-xs text-slate-300 hover:text-white transition-colors">
              <input
                type="checkbox"
                checked={hasEmail}
                onChange={(e) => setHasEmail(e.target.checked)}
                className="rounded border-slate-800 bg-slate-950 text-indigo-500 focus:ring-indigo-500/20"
              />
              <Mail className="h-3.5 w-3.5 text-slate-400" />
              <span>Must Have Emails</span>
            </label>
          </div>

          {/* Real-time Weight Configurator (Advanced) */}
          <div className="border-t border-slate-800/80 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvancedWeights(!showAdvancedWeights)}
              className="flex items-center justify-between w-full text-xs font-display font-bold text-slate-300 hover:text-white transition-colors cursor-pointer"
            >
              <span className="flex items-center gap-1.5">
                <Award className="h-3.5 w-3.5 text-indigo-400" />
                Scoring Weight Configurator
              </span>
              <span className="text-[10px] text-slate-500 font-mono font-bold">
                {showAdvancedWeights ? 'COLLAPSE ▲' : 'ADVANCED ▼'}
              </span>
            </button>
            
            {showAdvancedWeights && (
              <div className="mt-4 space-y-4 bg-slate-950/40 border border-slate-800/60 p-3.5 rounded-xl">
                <p className="text-[10px] text-slate-400 leading-relaxed">
                  Adjust coefficient scoring weights to update B2B lead scores across the directory in real-time.
                </p>
                
                {/* Weight: Website */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Website Exists</span>
                    <span className="text-indigo-400 font-bold">{scoreWeights.website} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={scoreWeights.website}
                    onChange={(e) => handleWeightChange('website', parseInt(e.target.value))}
                    className="w-full h-1 rounded-sm bg-slate-800 accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Weight: Rating */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Rating ≥ 4.0</span>
                    <span className="text-indigo-400 font-bold">{scoreWeights.rating} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={scoreWeights.rating}
                    onChange={(e) => handleWeightChange('rating', parseInt(e.target.value))}
                    className="w-full h-1 rounded-sm bg-slate-800 accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Weight: Email */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Email Discovered</span>
                    <span className="text-indigo-400 font-bold">{scoreWeights.email} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={scoreWeights.email}
                    onChange={(e) => handleWeightChange('email', parseInt(e.target.value))}
                    className="w-full h-1 rounded-sm bg-slate-800 accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Weight: Contact info */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>Complete Contacts</span>
                    <span className="text-indigo-400 font-bold">{scoreWeights.contact} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={scoreWeights.contact}
                    onChange={(e) => handleWeightChange('contact', parseInt(e.target.value))}
                    className="w-full h-1 rounded-sm bg-slate-800 accent-indigo-500 cursor-pointer"
                  />
                </div>

                {/* Weight: Relevance */}
                <div className="space-y-1">
                  <div className="flex justify-between text-[10px] font-mono text-slate-400">
                    <span>B2B Relevance</span>
                    <span className="text-indigo-400 font-bold">{scoreWeights.relevance} pts</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="50"
                    step="5"
                    value={scoreWeights.relevance}
                    onChange={(e) => handleWeightChange('relevance', parseInt(e.target.value))}
                    className="w-full h-1 rounded-sm bg-slate-800 accent-indigo-500 cursor-pointer"
                  />
                </div>

                <div className="flex justify-between items-center pt-2 border-t border-slate-800/60">
                  <div className="text-[10px] text-slate-400 font-mono">
                    Sum: <span className="font-bold text-slate-200">{scoreWeights.website + scoreWeights.rating + scoreWeights.email + scoreWeights.contact + scoreWeights.relevance} pts</span>
                  </div>
                  <button
                    type="button"
                    onClick={handleResetWeights}
                    className="text-[10px] font-bold text-indigo-400 hover:text-indigo-300 transition-colors cursor-pointer"
                  >
                    Reset Weights
                  </button>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}

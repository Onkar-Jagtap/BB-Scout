import React, { useState, useEffect } from 'react';
import { 
  Building2, Search, SlidersHorizontal, ArrowUpDown, 
  Download, Copy, RefreshCw, Layers, Sparkles, Filter 
} from 'lucide-react';
import Header from './components/Header';
import JobPanel from './components/JobPanel';
import Filters from './components/Filters';
import VendorCard from './components/VendorCard';
import VendorModal from './components/VendorModal';
import WorkerTerminal from './components/WorkerTerminal';
import LeadAnalytics from './components/LeadAnalytics';
import { SearchJob, Vendor } from './types';
import { Grid, List, Star } from 'lucide-react';

export default function App() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [jobs, setJobs] = useState<SearchJob[]>([]);
  const [activeJob, setActiveJob] = useState<SearchJob | null>(null);

  // Loading, launching, clearing states
  const [isLoading, setIsLoading] = useState(true);
  const [isLaunching, setIsLaunching] = useState(false);
  const [isClearing, setIsClearing] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [starredOnly, setStarredOnly] = useState(false);
  const [minRating, setMinRating] = useState(0);
  const [minLeadScore, setMinLeadScore] = useState(0);
  const [hasWebsite, setHasWebsite] = useState(false);
  const [hasEmail, setHasEmail] = useState(false);

  // Dynamic Lead Scoring Weights
  const [scoreWeights, setScoreWeights] = useState({
    website: 25,
    rating: 15,
    email: 20,
    contact: 20,
    relevance: 20
  });

  // Sorting State
  const [sortBy, setSortBy] = useState<'leadScore' | 'name' | 'rating' | 'reviewsCount'>('leadScore');

  // Layout View Mode (Compact list / Spreading sheet vs Profiles card grid)
  const [layoutMode, setLayoutMode] = useState<'grid' | 'list'>('grid');

  // Modal State
  const [selectedVendor, setSelectedVendor] = useState<Vendor | null>(null);

  // Action status indicators (toasts / notifications)
  const [exportSuccess, setExportSuccess] = useState<string | null>(null);
  const [quickCopied, setQuickCopied] = useState<'emails' | 'phones' | null>(null);

  // Fetch initial data on load
  const fetchData = async () => {
    try {
      const vRes = await fetch('/api/vendors');
      const vendorsData = await vRes.json();
      setVendors(Array.isArray(vendorsData) ? vendorsData : []);

      const jRes = await fetch('/api/jobs');
      const jobsData = await jRes.json();
      const loadedJobs = Array.isArray(jobsData) ? jobsData : [];
      setJobs(loadedJobs);

      // If there is any processing/pending job, set it as active
      const runningJob = loadedJobs.find(j => j.status === 'processing' || j.status === 'pending');
      if (runningJob) {
        setActiveJob(runningJob);
      } else if (loadedJobs.length > 0 && !activeJob) {
        // Set last run job
        setActiveJob(loadedJobs[0]);
      }
    } catch (error) {
      console.error("Error loading scout data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Poller for active/running background jobs
  useEffect(() => {
    let intervalId: any = null;

    if (activeJob && (activeJob.status === 'processing' || activeJob.status === 'pending')) {
      intervalId = setInterval(async () => {
        try {
          // Poll current job status
          const jRes = await fetch(`/api/jobs/${activeJob.id}`);
          if (jRes.ok) {
            const updatedJob: SearchJob = await jRes.json();
            setActiveJob(updatedJob);

            // Fetch latest vendors in background to show them dropping in!
            const vRes = await fetch('/api/vendors');
            const vendorsData = await vRes.json();
            setVendors(Array.isArray(vendorsData) ? vendorsData : []);

            // If completed or failed, refresh all jobs list and stop interval
            if (updatedJob.status === 'completed' || updatedJob.status === 'failed') {
              clearInterval(intervalId);
              const jobsRes = await fetch('/api/jobs');
              const jobsData = await jobsRes.json();
              setJobs(Array.isArray(jobsData) ? jobsData : []);
            }
          }
        } catch (error) {
          console.error("Polling error:", error);
        }
      }, 1500);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [activeJob?.id, activeJob?.status]);

  // Submit and start a new scout job
  const handleLaunchJob = async (queryText: string, location: string, country: string, targetCount: number) => {
    setIsLaunching(true);
    try {
      const res = await fetch('/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: queryText, location, country, targetCount })
      });
      if (res.ok) {
        const newJob: SearchJob = await res.json();
        setJobs(prev => [newJob, ...prev]);
        setActiveJob(newJob);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setIsLaunching(false);
    }
  };

  // Star / Shortlist toggle
  const handleToggleStar = async (id: string) => {
    // Optimistic UI update
    setVendors(prev => prev.map(v => v.id === id ? { ...v, starred: !v.starred } : v));
    try {
      await fetch(`/api/vendors/toggle-star/${id}`, { method: 'POST' });
    } catch (error) {
      console.error(error);
      // Revert if error
      fetchData();
    }
  };

  // Custom tags updates
  const handleUpdateTags = async (id: string, tags: string[]) => {
    setVendors(prev => prev.map(v => v.id === id ? { ...v, tags } : v));
    try {
      await fetch(`/api/vendors/tags/${id}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tags })
      });
    } catch (error) {
      console.error(error);
    }
  };

  // Delete vendor
  const handleDeleteVendor = async (id: string) => {
    if (!window.confirm("Are you sure you want to delete this vendor from your scout directory?")) return;
    setVendors(prev => prev.filter(v => v.id !== id));
    try {
      await fetch(`/api/vendors/delete/${id}`, { method: 'POST' });
    } catch (error) {
      console.error(error);
      fetchData();
    }
  };

  // Reset database workspace
  const handleClearDb = async () => {
    if (!window.confirm("CRITICAL: This will delete ALL search jobs, background queue logs, and B2B vendor profiles from Firestore. Do you want to proceed?")) return;
    setIsClearing(true);
    try {
      const res = await fetch('/api/jobs/clear', { method: 'POST' });
      if (res.ok) {
        setVendors([]);
        setJobs([]);
        setActiveJob(null);
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsClearing(false);
    }
  };

  // Derived filter options based on all loaded vendors
  const categories: string[] = Array.from(new Set(vendors.map(v => v.category).filter(Boolean))) as string[];
  const locations: string[] = Array.from(new Set(vendors.map(v => v.city).filter(Boolean))) as string[];

  // Recalculate B2B lead scores dynamically in real-time based on advanced weights
  const vendorsWithDynamicScores = React.useMemo(() => {
    return vendors.map(v => {
      let score = 0;
      if (v.website) score += scoreWeights.website;
      if (v.rating >= 4.0) score += scoreWeights.rating;
      if (v.emails && v.emails.length > 0) score += scoreWeights.email;
      const hasPhone = !!v.phone || (v.phonesNormalized && v.phonesNormalized.length > 0);
      const hasSocials = v.socialLinks && Object.values(v.socialLinks).some(Boolean);
      if (hasPhone || hasSocials) score += scoreWeights.contact;
      const isB2B = !['restaurant', 'cafe', 'retail', 'laundry', 'salon', 'bar', 'bakery'].some(kw => 
        v.category?.toLowerCase().includes(kw) || v.industry?.toLowerCase().includes(kw)
      );
      if (isB2B) score += scoreWeights.relevance;

      const totalWeight = scoreWeights.website + scoreWeights.rating + scoreWeights.email + scoreWeights.contact + scoreWeights.relevance;
      const dynamicScore = totalWeight > 0 ? Math.round((score / totalWeight) * 100) : 0;

      return {
        ...v,
        leadScore: dynamicScore
      };
    });
  }, [vendors, scoreWeights]);

  // Filter application
  const filteredVendors = vendorsWithDynamicScores.filter(v => {
    // Search Term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      const matchesName = v.name.toLowerCase().includes(term);
      const matchesIndustry = v.industry?.toLowerCase().includes(term);
      const matchesKeyword = v.keywords?.some(k => k.toLowerCase().includes(term));
      const matchesService = v.services?.some(s => s.toLowerCase().includes(term));
      const matchesTech = v.technologies?.some(t => t.toLowerCase().includes(term));
      const matchesTag = v.tags?.some(tag => tag.toLowerCase().includes(term));
      if (!matchesName && !matchesIndustry && !matchesKeyword && !matchesService && !matchesTech && !matchesTag) {
        return false;
      }
    }

    // Dropdowns
    if (selectedCategory && v.category !== selectedCategory) return false;
    if (selectedLocation && v.city !== selectedLocation) return false;

    // Toggles
    if (starredOnly && !v.starred) return false;
    if (hasWebsite && !v.website) return false;
    if (hasEmail && (!v.emails || v.emails.length === 0)) return false;

    // Sliders
    if (minRating > 0 && v.rating < minRating) return false;
    if (minLeadScore > 0 && v.leadScore < minLeadScore) return false;

    return true;
  });

  // Sort application
  const sortedVendors = [...filteredVendors].sort((a, b) => {
    if (sortBy === 'leadScore') return b.leadScore - a.leadScore;
    if (sortBy === 'rating') return b.rating - a.rating;
    if (sortBy === 'reviewsCount') return b.reviewsCount - a.reviewsCount;
    if (sortBy === 'name') return a.name.localeCompare(b.name);
    return 0;
  });

  // Reset filter inputs
  const handleResetFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedLocation('');
    setStarredOnly(false);
    setMinRating(0);
    setMinLeadScore(0);
    setHasWebsite(false);
    setHasEmail(false);
  };

  // Compile and copy list communications
  const handleCopyAllEmails = () => {
    const emails = sortedVendors.flatMap(v => v.emails || []).filter(Boolean);
    const uniqueEmails = Array.from(new Set(emails));
    if (uniqueEmails.length === 0) {
      alert("No email channels discovered in the current filtered list!");
      return;
    }
    navigator.clipboard.writeText(uniqueEmails.join(', '));
    setQuickCopied('emails');
    setTimeout(() => setQuickCopied(null), 2000);
  };

  const handleCopyAllPhones = () => {
    const phones = sortedVendors.flatMap(v => v.phonesNormalized || []).filter(Boolean);
    const uniquePhones = Array.from(new Set(phones));
    if (uniquePhones.length === 0) {
      alert("No phone numbers available in the current filtered list!");
      return;
    }
    navigator.clipboard.writeText(uniquePhones.join(', '));
    setQuickCopied('phones');
    setTimeout(() => setQuickCopied(null), 2000);
  };

  // Export functions (CSV & Excel-friendly CSV)
  const handleExportCSV = (fileType: 'csv' | 'excel' | 'json') => {
    if (sortedVendors.length === 0) {
      alert("No vendor data available to export! Run a scout job or clear active filters.");
      return;
    }

    if (fileType === 'json') {
      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(sortedVendors, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `B2B_Scout_Export_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();
      triggerExportToast("JSON Export Downloaded!");
      return;
    }

    // CSV Headers
    const headers = [
      "Company Name", "Category", "Industry", "Google Rating", "Google Reviews", 
      "Website", "Phone", "Physical Address", "City", "Country", 
      "Emails Discovered", "Technologies Detected", "Lead Score", "Ideal Customer Profile", "AI Summary"
    ];

    // CSV Rows
    const rows = sortedVendors.map(v => [
      v.name,
      v.category,
      v.industry || '',
      v.rating,
      v.reviewsCount,
      v.website || '',
      v.phone || '',
      v.address.replace(/"/g, '""'), // Escape quotes
      v.city,
      v.country,
      (v.emails || []).join('; '),
      (v.technologies || []).join('; '),
      v.leadScore,
      (v.idealCustomer || '').replace(/"/g, '""'),
      (v.summary || '').replace(/"/g, '""')
    ]);

    // Build CSV content
    const csvContent = [
      headers.join(','),
      ...rows.map(r => r.map(val => `"${val}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const downloadLink = document.createElement('a');
    downloadLink.setAttribute("href", url);
    downloadLink.setAttribute("download", `B2B_Scout_Export_${fileType === 'excel' ? 'Excel_' : ''}${Date.now()}.csv`);
    document.body.appendChild(downloadLink);
    downloadLink.click();
    downloadLink.remove();
    triggerExportToast(fileType === 'excel' ? "Excel CSV Downloaded!" : "CSV Export Downloaded!");
  };

  const triggerExportToast = (msg: string) => {
    setExportSuccess(msg);
    setTimeout(() => setExportSuccess(null), 3000);
  };

  return (
    <div className="relative min-h-screen bg-slate-950 flex flex-col justify-between font-sans text-slate-100 antialiased overflow-x-hidden selection:bg-indigo-500/30">
      
      {/* Dynamic Background Ambient Blobs */}
      <div className="fixed inset-0 -z-10 overflow-hidden pointer-events-none" aria-hidden="true">
        {/* Indigo-purple glowing backdrop */}
        <div className="absolute -top-[10%] -left-[5%] w-[45vw] h-[45vw] rounded-full bg-gradient-to-tr from-indigo-600/10 via-indigo-500/5 to-purple-600/5 blur-[140px] mix-blend-multiply animate-pulse" style={{ animationDuration: '8s' }} />
        {/* Emerald-mint glowing backdrop */}
        <div className="absolute top-[35%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-gradient-to-br from-emerald-600/5 via-teal-500/5 to-sky-600/5 blur-[140px] mix-blend-multiply animate-pulse" style={{ animationDuration: '12s', animationDelay: '2s' }} />
        {/* Rose-amber glowing backdrop */}
        <div className="absolute -bottom-[10%] left-[20%] w-[35vw] h-[35vw] rounded-full bg-gradient-to-tr from-rose-600/5 via-amber-500/5 to-indigo-600/5 blur-[140px] mix-blend-multiply animate-pulse" style={{ animationDuration: '10s', animationDelay: '4s' }} />
      </div>

      {/* Floating Glass Navigation Header */}
      <div className="pt-4">
        <Header 
          vendorCount={vendors.length} 
          shortlistCount={vendors.filter(v => v.starred).length}
          jobCount={jobs.length}
          onClearDb={handleClearDb}
          isClearing={isClearing}
        />
      </div>

      {/* Main dashboard space */}
      <main className="flex-1 max-w-7xl w-full mx-auto p-4 sm:p-6 lg:p-8 space-y-8">
        
        {/* Search & Scraper Control Queue panel */}
        <JobPanel 
          activeJob={activeJob}
          onLaunchJob={handleLaunchJob}
          isLaunching={isLaunching}
        />

        {/* Real-time Interactive Lead Analytics Dashboard */}
        <LeadAnalytics 
          vendors={vendors}
          filteredCount={sortedVendors.length}
          selectedCategory={selectedCategory}
          setSelectedCategory={setSelectedCategory}
          setMinLeadScore={setMinLeadScore}
          setHasEmail={setHasEmail}
        />

        {/* Dashboard Catalog Controls */}
        <div className="border-t border-slate-200/40 pt-8">
          <div className="grid gap-6 lg:grid-cols-4">
            
            {/* Sidebar Filter Panel (1 col) */}
            <div className="lg:col-span-1">
              <Filters 
                searchTerm={searchTerm}
                setSearchTerm={setSearchTerm}
                selectedCategory={selectedCategory}
                setSelectedCategory={setSelectedCategory}
                selectedLocation={selectedLocation}
                setSelectedLocation={setSelectedLocation}
                starredOnly={starredOnly}
                setStarredOnly={setStarredOnly}
                minRating={minRating}
                setMinRating={setMinRating}
                minLeadScore={minLeadScore}
                setMinLeadScore={setMinLeadScore}
                hasWebsite={hasWebsite}
                setHasWebsite={setHasWebsite}
                hasEmail={hasEmail}
                setHasEmail={setHasEmail}
                categories={categories}
                locations={locations}
                onReset={handleResetFilters}
                scoreWeights={scoreWeights}
                setScoreWeights={setScoreWeights}
              />
            </div>

            {/* Vendor Catalog View Panel (3 cols) */}
            <div className="lg:col-span-3 space-y-5">
              
              {/* Toolbar: sorting, exports, copiers */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between glass-panel shadow-md rounded-2xl p-4 gap-4 transition-all duration-300">
                
                {/* Result counts & Sorting & Layout dropdown */}
                <div className="flex flex-wrap items-center gap-3">
                  <div className="text-sm font-semibold text-slate-200 font-sans">
                    Showing <span className="text-indigo-400 font-bold font-mono">{sortedVendors.length}</span> matching vendors
                  </div>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  <div className="flex items-center space-x-2">
                    <ArrowUpDown className="h-3.5 w-3.5 text-slate-500" />
                    <label htmlFor="sort-select" className="text-xs text-slate-400 font-semibold font-mono">Sort:</label>
                    <select
                      id="sort-select"
                      value={sortBy}
                      onChange={(e) => setSortBy(e.target.value as any)}
                      className="rounded-xl border border-slate-800 bg-slate-950 px-3 py-1.5 text-xs text-slate-200 font-bold focus:outline-hidden"
                    >
                      <option value="leadScore">Lead Score (High-Low)</option>
                      <option value="name">Company Name (A-Z)</option>
                      <option value="rating">Google Rating (★ High-Low)</option>
                      <option value="reviewsCount">Google Reviews (High-Low)</option>
                    </select>
                  </div>
                  <span className="hidden sm:inline text-slate-600">|</span>
                  
                  {/* View Layout Switcher */}
                  <div className="flex items-center bg-slate-950 border border-slate-800 p-1 rounded-xl">
                    <button
                      type="button"
                      onClick={() => setLayoutMode('grid')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        layoutMode === 'grid' 
                          ? 'bg-slate-900 text-indigo-400 shadow-sm border border-slate-800' 
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                      title="Profiles Card Grid View"
                    >
                      <Grid className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={() => setLayoutMode('list')}
                      className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                        layoutMode === 'list' 
                          ? 'bg-slate-900 text-indigo-400 shadow-sm border border-slate-800' 
                          : 'text-slate-500 hover:text-slate-350'
                      }`}
                      title="Compact Spreadsheet View"
                    >
                      <List className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>                {/* Batch copies & exports */}
                <div className="flex flex-wrap items-center gap-2">
                  <div className="flex gap-1">
                    {/* Copy channels in batches */}
                    <button
                      onClick={handleCopyAllEmails}
                      disabled={sortedVendors.length === 0}
                      id="copy-all-emails-btn"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-indigo-400 disabled:opacity-45 disabled:pointer-events-none transition cursor-pointer shadow-2xs"
                      title="Copy unique emails from active filtered results"
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                      <span>{quickCopied === 'emails' ? 'Emails Copied!' : 'Copy Emails'}</span>
                    </button>

                    <button
                      onClick={handleCopyAllPhones}
                      disabled={sortedVendors.length === 0}
                      id="copy-all-phones-btn"
                      className="inline-flex items-center justify-center rounded-xl border border-slate-800 bg-slate-900 hover:bg-slate-850 px-3 py-1.5 text-xs font-bold text-slate-200 hover:text-indigo-400 disabled:opacity-45 disabled:pointer-events-none transition cursor-pointer shadow-2xs"
                      title="Copy phone numbers from active filtered results"
                    >
                      <Copy className="mr-1.5 h-3.5 w-3.5 text-slate-500" />
                      <span>{quickCopied === 'phones' ? 'Phones Copied!' : 'Copy Phones'}</span>
                    </button>
                  </div>

                  <span className="text-slate-700">|</span>

                  {/* Export Options */}
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => handleExportCSV('csv')}
                      disabled={sortedVendors.length === 0}
                      id="export-csv-btn"
                      className="inline-flex h-8 items-center justify-center rounded-xl border border-indigo-500/20 bg-indigo-500/10 px-3 text-xs font-bold text-indigo-300 hover:bg-indigo-600 hover:text-white disabled:opacity-45 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-2xs"
                      title="Export filtered directory to standard CSV"
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      <span>CSV</span>
                    </button>
                    <button
                      onClick={() => handleExportCSV('excel')}
                      disabled={sortedVendors.length === 0}
                      className="inline-flex h-8 items-center justify-center rounded-xl border border-emerald-500/20 bg-emerald-500/10 px-3 text-xs font-bold text-emerald-300 hover:bg-emerald-600 hover:text-white disabled:opacity-45 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-2xs"
                      title="Export to Excel formatted CSV"
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      <span>Excel</span>
                    </button>
                    <button
                      onClick={() => handleExportCSV('json')}
                      disabled={sortedVendors.length === 0}
                      className="inline-flex h-8 items-center justify-center rounded-xl border border-purple-500/20 bg-purple-500/10 px-3 text-xs font-bold text-purple-300 hover:bg-purple-600 hover:text-white disabled:opacity-45 disabled:pointer-events-none transition-all duration-200 cursor-pointer shadow-2xs"
                      title="Export clean database payload as JSON"
                    >
                      <Download className="mr-1 h-3.5 w-3.5" />
                      <span>JSON</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Vendor Cards Grid */}
              {isLoading ? (
                <div className="flex flex-col items-center justify-center py-20 glass-panel rounded-2xl shadow-md">
                  <RefreshCw className="h-8 w-8 text-indigo-400 animate-spin mb-3.5" />
                  <p className="text-sm font-bold text-slate-200 font-sans">Connecting to Firestore database...</p>
                  <p className="text-xs text-slate-500 font-mono mt-1">Acquiring live vendor catalog feeds</p>
                </div>
              ) : sortedVendors.length > 0 ? (
                layoutMode === 'grid' ? (
                  <div className="grid gap-5 md:grid-cols-2">
                    {sortedVendors.map((vendor) => (
                      <VendorCard
                        key={vendor.id}
                        vendor={vendor}
                        onToggleStar={handleToggleStar}
                        onDeleteVendor={handleDeleteVendor}
                        onUpdateTags={handleUpdateTags}
                        onViewDetails={setSelectedVendor}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="glass-panel rounded-2xl shadow-md overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-left border-collapse min-w-[700px]">
                        <thead>
                          <tr className="border-b border-slate-800/80 bg-slate-950/80 text-[10px] font-bold text-slate-400 uppercase tracking-wider font-mono">
                            <th className="py-3 px-4">Company Name</th>
                            <th className="py-3 px-4">Category</th>
                            <th className="py-3 px-4">City</th>
                            <th className="py-3 px-4 text-center">Rating</th>
                            <th className="py-3 px-4 text-center">Score</th>
                            <th className="py-3 px-4">Discovered Channels</th>
                            <th className="py-3 px-4 text-right">Actions</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-800/60 text-xs">
                          {sortedVendors.map((vendor) => {
                            const hasEmail = vendor.emails && vendor.emails.length > 0;
                            const hasPhone = vendor.phonesNormalized && vendor.phonesNormalized.length > 0;
                            return (
                              <tr 
                                key={vendor.id} 
                                className="hover:bg-slate-900/40 transition-colors duration-150 group"
                              >
                                <td className="py-3.5 px-4 font-bold text-slate-200 font-sans">
                                  <div className="flex items-center space-x-2">
                                    <button 
                                      onClick={() => handleToggleStar(vendor.id)}
                                      className="text-slate-600 hover:text-amber-500 transition-colors cursor-pointer"
                                    >
                                      <Star className={`h-3.5 w-3.5 ${vendor.starred ? 'fill-amber-400 text-amber-500' : ''}`} />
                                    </button>
                                    <span 
                                      onClick={() => setSelectedVendor(vendor)}
                                      className="hover:text-indigo-400 cursor-pointer font-bold font-display"
                                    >
                                      {vendor.name}
                                    </span>
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-slate-300 font-medium">
                                  <span className="inline-flex items-center rounded-lg bg-indigo-500/10 px-2.5 py-0.5 text-[10px] font-bold text-indigo-300 border border-indigo-500/20">
                                    {vendor.category}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4 text-slate-400 font-semibold">{vendor.city}</td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className="text-amber-500 font-bold">★ {vendor.rating}</span>
                                </td>
                                <td className="py-3.5 px-4 text-center">
                                  <span className={`inline-flex items-center rounded-lg px-2.5 py-1 text-[10px] font-extrabold ${
                                    vendor.leadScore >= 80 
                                      ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' 
                                      : vendor.leadScore >= 50 
                                        ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20' 
                                        : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                                  }`}>
                                    {vendor.leadScore}
                                  </span>
                                </td>
                                <td className="py-3.5 px-4">
                                  <div className="flex items-center space-x-1.5 text-[10px]">
                                    {hasEmail ? (
                                      <span className="bg-emerald-500/15 text-emerald-400 font-bold px-1.5 py-0.5 rounded-lg border border-emerald-500/20" title={vendor.emails[0]}>
                                        Email
                                      </span>
                                    ) : (
                                      <span className="text-slate-500 italic">No Email</span>
                                    )}
                                    {hasPhone ? (
                                      <span className="bg-indigo-500/15 text-indigo-400 font-bold px-1.5 py-0.5 rounded-lg border border-indigo-500/20" title={vendor.phonesNormalized[0]}>
                                        Phone
                                      </span>
                                    ) : (
                                      <span className="text-slate-500 italic">No Phone</span>
                                    )}
                                  </div>
                                </td>
                                <td className="py-3.5 px-4 text-right">
                                  <div className="flex items-center justify-end space-x-1.5">
                                    <button
                                      onClick={() => setSelectedVendor(vendor)}
                                      className="inline-flex h-7 items-center bg-indigo-600 hover:bg-indigo-500 px-3 rounded-lg text-[10px] font-bold text-white shadow-xs cursor-pointer active:scale-95 transition-all"
                                    >
                                      Details
                                    </button>
                                    <button
                                      onClick={() => handleDeleteVendor(vendor.id)}
                                      className="inline-flex h-7 w-7 items-center justify-center rounded-lg border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                                      title="Delete"
                                    >
                                      &times;
                                    </button>
                                  </div>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )
              ) : (
                <div className="flex flex-col items-center justify-center py-20 px-6 text-center glass-panel rounded-2xl shadow-md">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-slate-900 border border-slate-800 text-slate-500 mb-4 shadow-inner">
                    <Building2 className="h-6 w-6" />
                  </div>
                  <h4 className="text-base font-display font-bold text-slate-200">No Vendors Found</h4>
                  <p className="text-xs text-slate-400 max-w-sm mt-1.5 mb-5 leading-relaxed font-sans">
                    There are no registered B2B profiles matching your chosen filters or active search constraints. Adjust parameters or launch a background scout task above to extract and compile fresh leads.
                  </p>
                  <button
                    onClick={handleResetFilters}
                    id="clear-all-filters-btn"
                    className="inline-flex items-center justify-center rounded-xl bg-indigo-600 hover:bg-indigo-500 py-2 px-4 text-xs font-semibold text-white shadow-md active:scale-95 transition cursor-pointer"
                  >
                    Clear Filters
                  </button>
                </div>
              )}

            </div>

          </div>
        </div>

      </main>

      {/* Scouter Workers Terminal (Small Box at bottom) */}
      <WorkerTerminal activeJob={activeJob} />

      {/* Profile Detail Bento Dialog */}
      <VendorModal 
        vendor={selectedVendor}
        onClose={() => setSelectedVendor(null)}
        onVendorUpdated={(updatedVendor) => {
          setVendors(prev => prev.map(v => v.id === updatedVendor.id ? updatedVendor : v));
          setSelectedVendor(updatedVendor);
        }}
      />

      {/* Floating Glass Status Toast */}
      {exportSuccess && (
        <div id="export-toast" className="fixed bottom-6 right-6 z-50 backdrop-blur-xl bg-slate-950/90 text-white font-semibold text-xs py-3 px-5 rounded-2xl shadow-xl flex items-center space-x-2.5 border border-white/10 animate-bounce">
          <Sparkles className="h-4 w-4 text-emerald-400" />
          <span>{exportSuccess}</span>
        </div>
      )}

      {/* Clean Aesthetic Footer */}
      <footer className="backdrop-blur-md bg-slate-950/40 border-t border-slate-800/80 py-6 mt-16">
        <div className="mx-auto max-w-7xl px-4 text-center text-[11px] text-slate-500 font-mono sm:px-6 lg:px-8 space-y-1">
          <p>© 2026 BusinessBridge. Independent self-hosted infrastructure. 100% Free architecture.</p>
          <p>Please comply with website robots.txt, local compliance indices, and GDPR protocols.</p>
        </div>
      </footer>
    </div>
  );
}

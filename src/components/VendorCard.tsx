import React, { useState } from 'react';
import { 
  Star, MapPin, Phone, Mail, Globe, ExternalLink, 
  Trash2, ShieldCheck, Tag, X, Check, Copy 
} from 'lucide-react';
import { Vendor } from '../types';

interface VendorCardProps {
  key?: React.Key;
  vendor: Vendor;
  onToggleStar: (id: string) => void;
  onDeleteVendor: (id: string) => void;
  onUpdateTags: (id: string, tags: string[]) => void;
  onViewDetails: (vendor: Vendor) => void;
}

export default function VendorCard({
  vendor,
  onToggleStar,
  onDeleteVendor,
  onUpdateTags,
  onViewDetails
}: VendorCardProps) {
  const [newTag, setNewTag] = useState('');
  const [isAddingTag, setIsAddingTag] = useState(false);
  const [copiedText, setCopiedText] = useState<'email' | 'phone' | null>(null);

  const handleCopyEmails = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vendor.emails.length === 0) return;
    navigator.clipboard.writeText(vendor.emails.join(', '));
    setCopiedText('email');
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleCopyPhones = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (vendor.phonesNormalized.length === 0) return;
    navigator.clipboard.writeText(vendor.phonesNormalized.join(', '));
    setCopiedText('phone');
    setTimeout(() => setCopiedText(null), 1500);
  };

  const handleAddTag = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTag.trim()) return;
    const cleanTag = newTag.trim();
    if (!vendor.tags.includes(cleanTag)) {
      onUpdateTags(vendor.id, [...vendor.tags, cleanTag]);
    }
    setNewTag('');
    setIsAddingTag(false);
  };

  const handleRemoveTag = (tagToRemove: string) => {
    onUpdateTags(vendor.id, vendor.tags.filter(t => t !== tagToRemove));
  };

  // Lead score styling helper
  const getScoreBadgeStyles = (score: number) => {
    if (score >= 80) return "bg-emerald-500/10 text-emerald-400 border-emerald-500/20";
    if (score >= 50) return "bg-amber-500/10 text-amber-400 border-amber-500/20";
    return "bg-rose-500/10 text-rose-400 border-rose-500/20";
  };

  return (
    <div className="group relative flex flex-col justify-between glass-panel hover:bg-slate-900/90 shadow-[0_4px_24px_0_rgba(0,0,0,0.3)] hover:shadow-[0_12px_40px_0_rgba(99,102,241,0.25)] rounded-2xl p-5 transition-all duration-300 hover:-translate-y-1">
      {/* Upper Panel */}
      <div>
        <div className="flex items-start justify-between space-x-3 mb-3.5">
          {/* Category Badge & Lead Score */}
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center rounded-lg bg-indigo-500/10 px-2.5 py-1 text-xs font-semibold text-indigo-300 border border-indigo-500/20">
              {vendor.category}
            </span>
            <span className={`inline-flex items-center rounded-lg border px-2.5 py-1 text-xs font-bold ${getScoreBadgeStyles(vendor.leadScore)}`}>
              <ShieldCheck className="mr-1 h-3.5 w-3.5 flex-shrink-0" />
              Score: {vendor.leadScore}
            </span>
          </div>

          {/* Star/Shortlist toggle */}
          <button
            onClick={() => onToggleStar(vendor.id)}
            id={`star-btn-${vendor.id}`}
            className="rounded-xl p-2 text-slate-400 hover:bg-slate-800 hover:text-amber-400 border border-transparent hover:border-slate-700 transition duration-200 cursor-pointer"
            title={vendor.starred ? "Remove from Shortlist" : "Add to Shortlist"}
          >
            <Star className={`h-4.5 w-4.5 transition-all duration-300 ${vendor.starred ? 'fill-amber-400 text-amber-400 scale-110' : ''}`} />
          </button>
        </div>

        {/* Company Title */}
        <h3 
          onClick={() => onViewDetails(vendor)}
          className="text-lg font-display font-bold text-slate-100 leading-snug hover:text-indigo-400 transition-colors duration-200 cursor-pointer mb-1"
        >
          {vendor.name}
        </h3>

        {/* Localized reviews and location metadata */}
        <div className="flex items-center space-x-1.5 text-[11px] font-semibold text-slate-400 mb-3.5">
          <span className="flex items-center font-bold text-amber-400">
            ★ <span className="ml-0.5 text-slate-200 font-bold">{vendor.rating}</span>
          </span>
          <span className="text-slate-600">•</span>
          <span className="text-slate-400">{vendor.reviewsCount} Google Reviews</span>
          <span className="text-slate-600">•</span>
          <span className="flex items-center text-slate-300">
            <MapPin className="h-3 w-3 mr-0.5 text-slate-500" />
            {vendor.city}
          </span>
        </div>

        {/* Description / AI Summary */}
        <p className="text-xs text-slate-300 mb-4 line-clamp-3 font-sans leading-relaxed">
          {vendor.summary || "No description generated yet. Open details panel to trigger automated AI enrichment and technology profiling."}
        </p>

        {/* Dynamic Tags container */}
        <div className="mb-5">
          <div className="flex flex-wrap gap-1.5 items-center">
            {vendor.tags?.map((tag, i) => (
              <span 
                key={i} 
                className="inline-flex items-center rounded-lg bg-emerald-500/10 px-2 py-0.5 text-[10px] font-bold text-emerald-400 border border-emerald-500/20"
              >
                {tag}
                <button 
                  onClick={() => handleRemoveTag(tag)}
                  className="ml-1 rounded-md text-emerald-400 hover:bg-emerald-500/20 hover:text-emerald-300 p-0.5 transition-colors cursor-pointer"
                >
                  <X className="h-2 w-2" />
                </button>
              </span>
            ))}

            {isAddingTag ? (
              <form onSubmit={handleAddTag} className="flex items-center">
                <input
                  type="text"
                  placeholder="New tag..."
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  autoFocus
                  className="rounded-lg border border-slate-700 bg-slate-950 px-2 py-0.5 text-[10px] text-slate-200 focus:outline-hidden focus:border-indigo-500 w-20 shadow-xs"
                />
                <button type="submit" className="ml-1 text-emerald-400 p-0.5 hover:bg-slate-800 rounded">
                  <Check className="h-3 w-3" />
                </button>
                <button type="button" onClick={() => setIsAddingTag(false)} className="ml-0.5 text-slate-400 p-0.5 hover:bg-slate-800 rounded">
                  <X className="h-3 w-3" />
                </button>
              </form>
            ) : (
              <button
                onClick={() => setIsAddingTag(true)}
                className="inline-flex items-center text-[10px] text-slate-400 hover:text-slate-200 hover:bg-slate-800 px-2 py-0.5 rounded-lg border border-dashed border-slate-700 cursor-pointer transition-colors"
              >
                <Tag className="h-2.5 w-2.5 mr-1 text-slate-400" />
                Add Tag
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Contacts and Actions footer */}
      <div className="border-t border-slate-800/85 pt-4 space-y-4">
        {/* Contact list & copy utilities */}
        <div className="grid grid-cols-2 gap-2 text-[11px]">
          {/* Copy Email button */}
          <button
            onClick={handleCopyEmails}
            disabled={vendor.emails.length === 0}
            id={`copy-emails-${vendor.id}`}
            className="flex items-center justify-start rounded-xl border border-slate-800/80 bg-slate-950/40 p-2 text-left hover:bg-slate-950 hover:border-indigo-500/40 disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer"
          >
            <Mail className="h-3.5 w-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
            <div className="truncate flex-1">
              <span className="block font-bold text-slate-200 leading-none">Email</span>
              <span className="text-[9px] text-slate-400 leading-none truncate block mt-1">
                {copiedText === 'email' ? 'Copied!' : vendor.emails.length > 0 ? vendor.emails[0] : 'None found'}
              </span>
            </div>
            {vendor.emails.length > 0 && <Copy className="h-3 w-3 text-slate-400 ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>

          {/* Copy Phone button */}
          <button
            onClick={handleCopyPhones}
            disabled={vendor.phonesNormalized.length === 0}
            id={`copy-phones-${vendor.id}`}
            className="flex items-center justify-start rounded-xl border border-slate-800/80 bg-slate-950/40 p-2 text-left hover:bg-slate-950 hover:border-indigo-500/40 disabled:opacity-35 disabled:pointer-events-none transition cursor-pointer"
          >
            <Phone className="h-3.5 w-3.5 text-slate-400 mr-1.5 flex-shrink-0" />
            <div className="truncate flex-1">
              <span className="block font-bold text-slate-200 leading-none">Phone</span>
              <span className="text-[9px] text-slate-400 leading-none truncate block mt-1">
                {copiedText === 'phone' ? 'Copied!' : vendor.phonesNormalized.length > 0 ? vendor.phonesNormalized[0] : 'None found'}
              </span>
            </div>
            {vendor.phonesNormalized.length > 0 && <Copy className="h-3 w-3 text-slate-400 ml-1 flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity" />}
          </button>
        </div>

        {/* Buttons Drawer */}
        <div className="flex items-center justify-between">
          <div className="flex gap-1.5">
            {/* Website External Link */}
            {vendor.website && (
              <a
                href={vendor.website}
                target="_blank"
                rel="noreferrer"
                id={`website-link-${vendor.id}`}
                className="inline-flex h-8 items-center rounded-xl border border-slate-800/80 bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all shadow-xs"
                title="Visit Official Website"
              >
                <Globe className="h-3.5 w-3.5 text-slate-400 mr-1" />
                <span>Website</span>
                <ExternalLink className="h-2.5 w-2.5 ml-1 text-slate-500" />
              </a>
            )}

            {/* Google Maps Link */}
            {vendor.mapsUrl && (
              <a
                href={vendor.mapsUrl}
                target="_blank"
                rel="noreferrer"
                className="inline-flex h-8 items-center rounded-xl border border-slate-800/80 bg-slate-950/40 px-2.5 py-1.5 text-xs text-slate-300 hover:bg-slate-900 hover:text-indigo-400 transition-all shadow-xs"
                title="Google Maps Location Profile"
              >
                <MapPin className="h-3.5 w-3.5 text-emerald-400 mr-1" />
                <span>Maps</span>
              </a>
            )}
          </div>

          <div className="flex gap-1.5">
            {/* View Details CTA */}
            <button
              onClick={() => onViewDetails(vendor)}
              id={`view-details-${vendor.id}`}
              className="inline-flex h-8 items-center rounded-xl bg-indigo-600 hover:bg-indigo-500 px-3.5 py-1.5 text-xs font-semibold text-white transition-colors duration-200 shadow-sm cursor-pointer"
            >
              Details
            </button>

            {/* Delete vendor card */}
            <button
              onClick={() => onDeleteVendor(vendor.id)}
              id={`delete-vendor-${vendor.id}`}
              className="inline-flex h-8 w-8 items-center justify-center rounded-xl border border-red-500/20 bg-red-500/10 hover:bg-red-500/20 text-red-400 transition duration-200 shadow-xs cursor-pointer"
              title="Delete Vendor Profile"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

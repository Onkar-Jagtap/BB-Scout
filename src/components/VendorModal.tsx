import React, { useState, useEffect } from 'react';
import { 
  X, ShieldCheck, Mail, Phone, Globe, MapPin, 
  Linkedin, Facebook, Instagram, Youtube, Twitter, 
  Cpu, Award, ShoppingBag, Target, FileText, CheckCircle2, Calendar,
  Sparkles, Send, Check, AlertCircle, Copy, Loader2
} from 'lucide-react';
import { Vendor } from '../types';

interface VendorModalProps {
  vendor: Vendor | null;
  onClose: () => void;
  onVendorUpdated?: (vendor: Vendor) => void;
}

export default function VendorModal({ vendor, onClose, onVendorUpdated }: VendorModalProps) {
  if (!vendor) return null;

  // Render social icon helper
  const renderSocialIcon = (key: string) => {
    switch (key) {
      case 'linkedin': return <Linkedin className="h-4 w-4 text-sky-400" />;
      case 'facebook': return <Facebook className="h-4 w-4 text-blue-400" />;
      case 'instagram': return <Instagram className="h-4 w-4 text-pink-400" />;
      case 'youtube': return <Youtube className="h-4 w-4 text-red-400" />;
      case 'x': return <Twitter className="h-4 w-4 text-slate-300" />;
      default: return <Globe className="h-4 w-4 text-slate-400" />;
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div className="flex min-h-screen items-center justify-center p-4 text-center sm:p-6">
        {/* Background Backdrop */}
        <div 
          onClick={onClose}
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md transition-opacity duration-300" 
          aria-hidden="true" 
        />

        {/* Modal Bento Container */}
        <div className="relative inline-block w-full max-w-4xl transform overflow-hidden rounded-3xl bg-slate-900 border border-slate-800 text-left align-middle shadow-2xl shadow-slate-950/90 transition-all duration-300 sm:my-8">
          
          {/* Header Banner */}
          <div className="bg-gradient-to-r from-indigo-950 via-slate-900 to-slate-950 px-6 py-6 text-white flex items-center justify-between border-b border-slate-800">
            <div className="flex items-center space-x-3.5">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-indigo-500 to-emerald-500 p-0.5 shadow-md shadow-indigo-500/25">
                <div className="flex h-full w-full items-center justify-center rounded-[14px] bg-slate-950">
                  <Award className="h-5 w-5 text-indigo-400" />
                </div>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 font-mono">B2B Verified Enterprise Profile</span>
                <h2 className="text-xl sm:text-2xl font-display font-bold leading-tight text-white">{vendor.name}</h2>
              </div>
            </div>
            <button 
              onClick={onClose}
              id="close-modal-btn"
              className="rounded-xl bg-slate-800 border border-slate-700 p-2 text-slate-400 hover:text-white hover:bg-slate-700 transition cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="p-6 max-h-[75vh] overflow-y-auto scrollbar-thin space-y-6">
            <div className="grid gap-5 md:grid-cols-12">
              
              {/* Bento Compartment 1: Identity Panel (4 cols) */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 md:col-span-4 flex flex-col justify-between space-y-6">
                <div>
                  <span className="inline-block rounded-lg bg-indigo-500/10 px-3 py-1 text-xs font-bold text-indigo-300 border border-indigo-500/20 mb-4">
                    {vendor.category}
                  </span>
                  
                  <div className="space-y-4">
                    {/* Location */}
                    <div className="flex items-start text-xs text-slate-300">
                      <MapPin className="h-4.5 w-4.5 mr-2.5 text-slate-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Physical HQ</span>
                        <span className="text-slate-400 mt-0.5 block leading-relaxed">{vendor.address}</span>
                      </div>
                    </div>

                    {/* Google Ratings */}
                    <div className="flex items-start text-xs text-slate-300">
                      <span className="mr-2.5 text-amber-400 font-bold text-lg leading-none">★</span>
                      <div>
                        <span className="block font-bold text-slate-200">Google Profile</span>
                        <span className="text-slate-400 mt-0.5 block leading-relaxed">{vendor.rating} stars ({vendor.reviewsCount} reviews)</span>
                      </div>
                    </div>

                    {/* Company Size */}
                    <div className="flex items-start text-xs text-slate-300">
                      <CheckCircle2 className="h-4.5 w-4.5 mr-2.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <div>
                        <span className="block font-bold text-slate-200">Est. Size</span>
                        <span className="text-slate-400 mt-0.5 block leading-relaxed">{vendor.companySize || "50-150 Employees"}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Lead Quality Rating Progress */}
                <div className="mt-6 border-t border-slate-800/80 pt-4">
                  <div className="flex justify-between items-center mb-1.5">
                    <span className="text-xs font-bold text-slate-300 uppercase tracking-wide">Lead Score</span>
                    <span className="text-xs font-bold text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/20 px-1.5 py-0.5 rounded-md">{vendor.leadScore} / 100</span>
                  </div>
                  <div className="h-2 w-full bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full bg-gradient-to-r from-emerald-500 to-indigo-500`}
                      style={{ width: `${vendor.leadScore}%` }}
                    />
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-2 font-mono">Heuristic index evaluated by AI</span>
                </div>
              </div>

              {/* Bento Compartment 2: AI Description Summary (8 cols) */}
              <div className="space-y-5 md:col-span-8">
                {/* Executive Summary */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="flex items-center text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    <FileText className="mr-1.5 h-4 w-4 text-indigo-400" />
                    Executive AI Synthesis
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {vendor.summary || `${vendor.name} is a designated enterprise partner. Deep scraping extraction parsed public credentials to verify specialized services and manufacturing capacity.`}
                  </p>
                </div>

                {/* Ideal Customer Profile */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="flex items-center text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-2">
                    <Target className="mr-1.5 h-4 w-4 text-indigo-400" />
                    Target ICP (Ideal Customer Profile)
                  </h3>
                  <p className="text-sm text-slate-300 leading-relaxed font-sans">
                    {vendor.idealCustomer || "Enterprise procurement networks, B2B procurement professionals, wholesale supply chain partnerships, and verified logistical requirements."}
                  </p>
                </div>
              </div>

              {/* Bento Compartment 3: Services & Products Grid (8 cols) */}
              <div className="md:col-span-8 space-y-5">
                {/* Services */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center">
                    <CheckCircle2 className="mr-1.5 h-4 w-4 text-emerald-400" />
                    Offered B2B Services
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.services && vendor.services.length > 0 ? (
                      vendor.services.map((svc, i) => (
                        <span key={i} className="inline-flex items-center rounded-xl bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-400">
                          {svc}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 font-mono italic">No indexed services discovered on website.</span>
                    )}
                  </div>
                </div>

                {/* Products */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center">
                    <ShoppingBag className="mr-1.5 h-4 w-4 text-indigo-400" />
                    Core Products & Focus Sectors
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {vendor.products && vendor.products.length > 0 ? (
                      vendor.products.map((prod, i) => (
                        <span key={i} className="inline-flex items-center rounded-xl bg-indigo-500/10 border border-indigo-500/20 px-3 py-1 text-xs font-semibold text-indigo-300">
                          {prod}
                        </span>
                      ))
                    ) : (
                      <span className="text-xs text-slate-500 font-mono italic">No commercial products categories scraped.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bento Compartment 4: Tech Stack & Socials (4 cols) */}
              <div className="md:col-span-4 space-y-5">
                {/* Tech Stack */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3 flex items-center">
                    <Cpu className="mr-1.5 h-4 w-4 text-indigo-400" />
                    Discovered Tech Stack
                  </h3>
                  <div className="flex flex-wrap gap-1.5">
                    {vendor.technologies && vendor.technologies.length > 0 ? (
                      vendor.technologies.map((tech, i) => (
                        <span key={i} className="inline-flex items-center rounded-full bg-purple-500/10 px-2.5 py-0.5 text-[10px] font-bold text-purple-300 border border-purple-500/20">
                          {tech}
                        </span>
                      ))
                    ) : (
                      <span className="inline-flex items-center rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-medium text-slate-500">
                        None detected
                      </span>
                    )}
                  </div>
                </div>

                {/* Social Badges */}
                <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5">
                  <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-3">Social Footprint</h3>
                  <div className="space-y-2">
                    {Object.entries(vendor.socialLinks || {}).map(([key, url]) => {
                      if (!url) return null;
                      return (
                        <a 
                          key={key}
                          href={url as string}
                          target="_blank"
                          rel="noreferrer"
                          className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/30 p-2 hover:bg-slate-900 text-xs transition duration-200 font-semibold text-slate-300"
                        >
                          <div className="flex items-center space-x-2">
                            {renderSocialIcon(key)}
                            <span className="capitalize">{key}</span>
                          </div>
                          <span className="text-[10px] text-indigo-400 font-mono">Open ↗</span>
                        </a>
                      );
                    })}
                    {(!vendor.socialLinks || Object.values(vendor.socialLinks).filter(Boolean).length === 0) && (
                      <span className="text-xs text-slate-500 font-mono block italic text-center py-2">No social channels found.</span>
                    )}
                  </div>
                </div>
              </div>

              {/* Bento Compartment 5: Scraped Communication Channels (12 cols) */}
              <div className="bg-slate-950/40 border border-slate-800 rounded-2xl p-5 md:col-span-12">
                <h3 className="text-xs font-mono font-bold uppercase tracking-wider text-slate-300 mb-4 flex items-center">
                  <Mail className="mr-1.5 h-4 w-4 text-indigo-400" />
                  Scraped Lead Channels
                </h3>
                
                <div className="grid gap-4 md:grid-cols-2">
                  {/* Email Channels */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2.5">Email Addresses</h4>
                    {vendor.emails && vendor.emails.length > 0 ? (
                      <div className="space-y-1.5">
                        {vendor.emails.map((email, i) => (
                          <div key={i} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-xs text-slate-300">
                            <span className="font-mono truncate">{email}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(email);
                              }}
                              className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:text-indigo-400 cursor-pointer active:scale-95 transition-all shadow-2xs"
                            >
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic font-mono">No business email directories scraped on this domain.</span>
                    )}
                  </div>

                  {/* Phone Channels */}
                  <div>
                    <h4 className="text-[10px] font-bold text-slate-500 uppercase tracking-wide mb-2.5">Direct Line Phones</h4>
                    {vendor.phonesNormalized && vendor.phonesNormalized.length > 0 ? (
                      <div className="space-y-1.5">
                        {vendor.phonesNormalized.map((ph, i) => (
                          <div key={i} className="flex items-center justify-between rounded-xl border border-slate-800 bg-slate-950/30 px-3 py-2 text-xs text-slate-300">
                            <span className="font-mono">{ph}</span>
                            <button
                              onClick={() => {
                                navigator.clipboard.writeText(ph);
                              }}
                              className="text-[10px] bg-slate-900 border border-slate-800 px-2.5 py-1 rounded-lg text-slate-300 hover:text-indigo-400 cursor-pointer active:scale-95 transition-all shadow-2xs"
                            >
                              Copy
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <span className="text-xs text-slate-500 italic font-mono">No business phones detected.</span>
                    )}
                  </div>
                </div>
              </div>

            </div>
          </div>

          {/* Modal Footer */}
          <div className="backdrop-blur-md bg-slate-950/45 border-t border-slate-800 px-6 py-4 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
            <div className="flex items-center text-[10px] text-slate-500 font-mono">
              <Calendar className="h-3.5 w-3.5 mr-1 text-slate-400" />
              <span>Registered: {new Date(vendor.createdAt).toLocaleDateString()}</span>
            </div>
            <button
              onClick={onClose}
              className="rounded-xl bg-indigo-600 hover:bg-indigo-500 px-5 py-2.5 text-xs font-semibold text-white shadow-md hover:shadow-lg transition-all cursor-pointer active:scale-95"
            >
              Close Profile
            </button>
          </div>

        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Briefcase, Sparkles, ChevronRight, Loader2, Gift, CheckCircle2 } from "lucide-react";
import Link from "next/link";

interface PositionItem {
  id: string;
  kind: "responsibility" | "requirement" | "benefit";
  body: string;
  display_order: number;
}

interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string | null;
  created_at: string;
  position_items: PositionItem[];
}

export default function CareersPage() {
  const [positions, setPositions] = useState<Position[]>([]);
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const [selectedJobId, setSelectedJobId] = useState<string | null>(null);
  const [activeJobDetails, setActiveJobDetails] = useState<Position | null>(null);
  const [loadingDetails, setLoadingDetails] = useState(false);

  const handleViewRole = async (id: string) => {
    setSelectedJobId(id);
    setLoadingDetails(true);
    try {
      const res = await fetch(`/api/v1/positions/${id}`);
      const json = await res.json();
      if (json.success && json.data) {
        setActiveJobDetails(json.data);
      }
    } catch (err) {
      console.error("Failed to load position details:", err);
    } finally {
      setLoadingDetails(false);
    }
  };

  const handleClosePopup = () => {
    setSelectedJobId(null);
    setActiveJobDetails(null);
  };

  useEffect(() => {
    const fetchPositions = async () => {
      try {
        const res = await fetch("/api/v1/positions");
        const json = await res.json();
        if (json.success && json.data) {
          setPositions(json.data);
        }
      } catch (err) {
        console.error("Failed to fetch positions:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchPositions();
  }, []);

  return (
    <main className="min-h-screen bg-transparent">
      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-12 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] text-[#2563EB] text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Join the Team
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] mb-5 tracking-tight"
          >
            Build the <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-[#8B5CF6] to-[#EC4899] pb-0.5 inline-block">future</span> with us.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#6B7280] text-lg font-normal leading-relaxed max-w-2xl"
          >
            We are always looking for visionary engineers, artists, and innovators who want to push the boundaries of spatial computing and high-performance software.
          </motion.p>
        </div>

        {/* Job Listings */}
        <motion.div 
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between border-b border-[#E5E7EB] pb-4 mb-6">
            <h2 className="text-xl font-bold text-[#111827] tracking-tight">Open Positions</h2>
            <span className="text-xs font-semibold px-3 py-1 bg-white rounded-full text-[#6B7280] border border-[#E5E7EB]">
              {loading ? "..." : `${positions.length} Opening${positions.length !== 1 ? "s" : ""}`}
            </span>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-5 h-5 animate-spin text-[#2563EB] mr-3" />
              <span className="text-[#6B7280] text-sm">Loading positions...</span>
            </div>
          ) : positions.length === 0 ? (
            <div className="py-16 text-center">
              <p className="text-[#6B7280] text-sm mb-2">No open positions right now.</p>
              <p className="text-[#9CA3AF] text-xs">Check back soon or send us a general application below.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {positions.map((job) => {
                const benefits = (job.position_items || []).filter((i) => i.kind === "benefit");
                const responsibilities = (job.position_items || []).filter((i) => i.kind === "responsibility");
                const requirements = (job.position_items || []).filter((i) => i.kind === "requirement");
                const totalItems = responsibilities.length + requirements.length + benefits.length;

                return (
                  <div 
                    key={job.id}
                    className="group relative bg-white border border-[#E5E7EB] rounded-[20px] p-6 md:p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:bg-[#D2E3FC] hover:border-[#B4D0FB] hover:shadow-[0_24px_48px_rgba(15,23,42,0.3)] transition-all duration-250 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
                  >
                    <div className="flex-1 relative z-10">
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] bg-[#F3F7FF] px-3 py-1 rounded-full border border-[#DCEBFF]">
                          {job.department}
                        </span>
                        {totalItems > 0 && (
                          <span className="text-[10px] font-medium text-[#9CA3AF]">
                            {totalItems} detail{totalItems !== 1 ? "s" : ""}
                          </span>
                        )}
                      </div>
                      <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#2563EB] transition-colors leading-tight">
                        {job.title}
                      </h3>
                      {job.description && (
                        <p className="text-[#6B7280] text-sm mb-4 max-w-2xl leading-relaxed line-clamp-2">
                          {job.description}
                        </p>
                      )}
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6B7280]">
                        <div className="flex items-center gap-1">
                          <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                          {job.location}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[#BDC1C6]" />
                        <div className="flex items-center gap-1">
                          <Briefcase className="w-3.5 h-3.5 text-[#6B7280]" />
                          {job.employment_type}
                        </div>
                        {benefits.length > 0 && (
                          <>
                            <div className="w-1 h-1 rounded-full bg-[#BDC1C6]" />
                            <div className="flex items-center gap-1">
                              <Gift className="w-3.5 h-3.5 text-emerald-500" />
                              {benefits.length} benefit{benefits.length !== 1 ? "s" : ""}
                            </div>
                          </>
                        )}
                      </div>
                    </div>

                    <div className="relative z-10 md:shrink-0 flex items-center justify-start md:justify-end">
                      <button
                        onClick={() => handleViewRole(job.id)}
                        className="flex items-center gap-1.5 px-5 py-2.5 bg-[#F3F7FF] text-[#2563EB] border border-[#DCEBFF] hover:bg-[#2563EB] hover:text-white rounded-full font-semibold transition-all duration-300 text-sm shadow-sm"
                      >
                        View Role
                        <ChevronRight className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Fallback / General Application */}
          <div className="mt-10 p-8 rounded-2xl bg-white border border-[#E5E7EB] flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-lg font-bold text-[#111827] mb-1">Don&apos;t see a perfect fit?</h3>
              <p className="text-[#6B7280] text-sm max-w-md">
                We&apos;re always looking for outstanding talent. Send us your resume and a brief intro, and we&apos;ll keep you in mind for future roles.
              </p>
            </div>
            <Link 
              href="/request-proposal" 
              className="shrink-0 px-6 py-3 bg-[#2563EB] hover:bg-[#1765CC] text-white rounded-full font-semibold transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
            >
              Get in Touch
            </Link>
          </div>

        </motion.div>
      </div>

      {/* Modal Popup Card */}
      {mounted && typeof document !== "undefined" && createPortal(
        <AnimatePresence>
          {selectedJobId && (
            <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4">
              {/* Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={handleClosePopup}
                className="absolute inset-0 bg-black/60 backdrop-blur-md"
              />

              {/* Popup Card */}
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 20 }}
                transition={{ type: "spring", duration: 0.5 }}
                className="relative w-full max-w-3xl bg-white border border-[#E5E7EB] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] z-10"
              >
                {/* Close Button */}
                <button
                  onClick={handleClosePopup}
                  className="absolute top-6 right-6 p-2 rounded-full hover:bg-[#F3F7FF] transition-all text-[#6B7280] hover:text-[#2563EB]"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {loadingDetails ? (
                  <div className="flex flex-col items-center justify-center py-32 space-y-4">
                    <Loader2 className="w-8 h-8 animate-spin text-[#2563EB]" />
                    <span className="text-[#6B7280] text-sm font-medium">Fetching role details...</span>
                  </div>
                ) : activeJobDetails ? (
                  <>
                    {/* Header */}
                    <div className="p-8 border-b border-[#E5E7EB] bg-[#F3F7FF]/50 pr-16">
                      <span className="text-[10px] font-bold uppercase tracking-widest text-[#2563EB] bg-white border border-[#DCEBFF] px-3.5 py-1.5 rounded-full inline-block mb-3.5">
                        {activeJobDetails.department}
                      </span>
                      <h3 className="text-2xl sm:text-3xl font-extrabold text-[#111827] tracking-tight mb-3 leading-tight">
                        {activeJobDetails.title}
                      </h3>
                      
                      <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#6B7280]">
                        <div className="flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-[#2563EB]" />
                          {activeJobDetails.location}
                        </div>
                        <div className="w-1 h-1 rounded-full bg-[#BDC1C6]" />
                        <div className="flex items-center gap-1.5">
                          <Briefcase className="w-3.5 h-3.5 text-[#2563EB]" />
                          {activeJobDetails.employment_type}
                        </div>
                      </div>
                    </div>

                    {/* Body Content */}
                    <div className="p-8 overflow-y-auto flex-1 space-y-8 custom-scrollbar">
                      {/* Description */}
                      {activeJobDetails.description && (
                        <div className="space-y-2">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#111827]">About The Role</h4>
                          <p className="text-sm text-[#6B7280] leading-relaxed font-light">
                            {activeJobDetails.description}
                          </p>
                        </div>
                      )}

                      {/* Columns Grid */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Responsibilities */}
                        {activeJobDetails.position_items.filter(i => i.kind === "responsibility").length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#111827] flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                              Key Responsibilities
                            </h4>
                            <ul className="space-y-2.5">
                              {activeJobDetails.position_items
                                .filter(i => i.kind === "responsibility")
                                .map(item => (
                                  <li key={item.id} className="flex items-start gap-2.5 text-xs text-[#6B7280] leading-relaxed font-light">
                                    <ChevronRight className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 shrink-0" />
                                    <span>{item.body}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}

                        {/* Requirements */}
                        {activeJobDetails.position_items.filter(i => i.kind === "requirement").length > 0 && (
                          <div className="space-y-3">
                            <h4 className="text-xs font-black uppercase tracking-widest text-[#111827] flex items-center gap-2">
                              <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                              Requirements
                            </h4>
                            <ul className="space-y-2.5">
                              {activeJobDetails.position_items
                                .filter(i => i.kind === "requirement")
                                .map(item => (
                                  <li key={item.id} className="flex items-start gap-2.5 text-xs text-[#6B7280] leading-relaxed font-light">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500 mt-0.5 shrink-0" />
                                    <span>{item.body}</span>
                                  </li>
                                ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      {/* Benefits */}
                      {activeJobDetails.position_items.filter(i => i.kind === "benefit").length > 0 && (
                        <div className="pt-6 border-t border-[#E5E7EB] space-y-3">
                          <h4 className="text-xs font-black uppercase tracking-widest text-[#111827] flex items-center gap-2">
                            <Gift className="w-4 h-4 text-[#A142F4]" />
                            Perks & Benefits
                          </h4>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {activeJobDetails.position_items
                              .filter(i => i.kind === "benefit")
                              .map(item => (
                                <div key={item.id} className="p-3.5 rounded-xl border border-[#E5E7EB] bg-[#F9FAFB]/50 flex items-start gap-3">
                                  <CheckCircle2 className="w-4 h-4 text-emerald-500 mt-0.5 shrink-0" />
                                  <span className="text-xs text-[#6B7280] leading-normal font-medium">{item.body}</span>
                                </div>
                              ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Footer */}
                    <div className="p-6 border-t border-[#E5E7EB] bg-[#F9FAFB] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <span className="text-[10px] text-[#9CA3AF] font-semibold">
                        Glyptika is an equal opportunity employer.
                      </span>
                      <Link
                        href="/request-proposal"
                        className="px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold transition-all duration-200 text-xs shadow-md hover:shadow-lg hover:-translate-y-0.5 text-center w-full sm:w-auto"
                      >
                        Apply For This Role
                      </Link>
                    </div>
                  </>
                ) : (
                  <div className="p-12 text-center text-sm text-[#6B7280]">
                    Failed to load role details. Please close and try again.
                  </div>
                )}
              </motion.div>
            </div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </main>
  );
}

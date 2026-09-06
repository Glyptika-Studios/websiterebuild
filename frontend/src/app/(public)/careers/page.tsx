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
          <div className="p-10 rounded-2xl bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] text-center space-y-4">
            <h3 className="text-2xl font-bold text-[#111827]">Current Opportunities</h3>
            <p className="text-[#6B7280] text-base max-w-xl mx-auto leading-relaxed">
              We are not currently recruiting for specific open roles at the moment, but we are always eager to connect with extraordinary engineers, 3D artists, and software innovators.
            </p>
            <p className="text-[#9CA3AF] text-sm max-w-lg mx-auto">
              If you&apos;re interested in working with us on future projects, feel free to send us your resume and introduction.
            </p>
            <div className="pt-2">
              <Link 
                href="/request-proposal" 
                className="inline-flex items-center gap-2 px-7 py-3 bg-[#2563EB] hover:bg-[#1765CC] text-white rounded-full font-semibold transition-colors duration-200 text-sm shadow-sm hover:shadow-md"
              >
                Send General Application
              </Link>
            </div>
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

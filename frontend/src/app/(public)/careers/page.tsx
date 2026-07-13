"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

const MOCK_JOBS = [
  {
    id: "job-1",
    title: "Senior 3D Technical Artist",
    department: "XR & Visualization",
    location: "Remote (India)",
    type: "Full-time",
    description: "We are looking for an experienced 3D Technical Artist to bridge the gap between art and programming for our high-fidelity VR simulations.",
  },
  {
    id: "job-2",
    title: "Full Stack Engineer (Next.js)",
    department: "Web Ecosystems",
    location: "Hybrid / Bangalore",
    type: "Full-time",
    description: "Join our core web team to architect scalable, high-performance SaaS applications and client portals using Next.js and Node.js.",
  }
];

export default function CareersPage() {
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
              {MOCK_JOBS.length} Openings
            </span>
          </div>

          <div className="grid grid-cols-1 gap-4">
            {MOCK_JOBS.map((job) => (
              <div 
                key={job.id}
                className="group relative bg-white border border-[#E5E7EB] rounded-[20px] p-6 md:p-8 shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:bg-[#D2E3FC] hover:border-[#B4D0FB] hover:shadow-[0_24px_48px_rgba(15,23,42,0.3)] transition-all duration-250 flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
              >
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-[10px] font-semibold uppercase tracking-wider text-[#2563EB] bg-[#F3F7FF] px-3 py-1 rounded-full border border-[#DCEBFF]">
                      {job.department}
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-[#111827] mb-2 group-hover:text-[#2563EB] transition-colors leading-tight">
                    {job.title}
                  </h3>
                  <p className="text-[#6B7280] text-sm mb-4 max-w-2xl leading-relaxed">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-xs font-medium text-[#6B7280]">
                    <div className="flex items-center gap-1">
                      <MapPin className="w-3.5 h-3.5 text-[#6B7280]" />
                      {job.location}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-[#BDC1C6]" />
                    <div className="flex items-center gap-1">
                      <Briefcase className="w-3.5 h-3.5 text-[#6B7280]" />
                      {job.type}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 md:shrink-0 flex items-center justify-start md:justify-end">
                  <Link 
                    href={`/careers/${job.id}`} 
                    className="flex items-center gap-1.5 px-5 py-2.5 bg-[#F3F7FF] text-[#2563EB] border border-[#DCEBFF] hover:bg-[#2563EB] hover:text-white rounded-full font-semibold transition-all duration-300 text-sm shadow-sm"
                  >
                    View Role
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

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
    </main>
  );
}

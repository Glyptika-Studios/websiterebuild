"use client";

import { motion } from "framer-motion";
import { MapPin, Briefcase, Sparkles, ChevronRight } from "lucide-react";
import Link from "next/link";

// Dummy data for upcoming API integration
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
    <main className="min-h-screen bg-[#000000] text-slate-300 font-sans selection:bg-blue-500/30">
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full -translate-y-1/2" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_30%,#000_20%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 pt-40 pb-24">
        
        {/* Hero Section */}
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles className="w-3.5 h-3.5" />
            Join the Team
          </motion.div>
          
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight drop-shadow-xl"
          >
            Build the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">future</span> with us.
          </motion.h1>
          
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-slate-400 text-lg md:text-xl font-light leading-relaxed max-w-2xl"
          >
            We are always looking for visionary engineers, artists, and innovators who want to push the boundaries of spatial computing and high-performance software.
          </motion.p>
        </div>

        {/* Job Listings */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="space-y-6"
        >
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-8">
            <h2 className="text-2xl font-bold text-white tracking-wide">Open Positions</h2>
            <span className="text-sm font-semibold px-3 py-1 bg-white/5 rounded-full text-slate-400 border border-white/10">
              {MOCK_JOBS.length} Openings
            </span>
          </div>

          <div className="grid grid-cols-1 gap-6">
            {MOCK_JOBS.map((job) => (
              <div 
                key={job.id}
                className="group relative bg-[#0a1128]/60 backdrop-blur-md border border-white/10 hover:border-blue-500/50 rounded-2xl p-6 md:p-8 transition-all duration-300 hover:shadow-[0_0_30px_rgba(37,99,235,0.15)] flex flex-col md:flex-row md:items-center justify-between gap-6 overflow-hidden"
              >
                {/* Hover Glow */}
                <div className="absolute inset-0 bg-gradient-to-r from-blue-600/0 via-blue-600/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                
                <div className="flex-1 relative z-10">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3 py-1 rounded-full border border-blue-500/20">
                      {job.department}
                    </span>
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-2 group-hover:text-blue-300 transition-colors">
                    {job.title}
                  </h3>
                  <p className="text-slate-400 text-sm mb-5 max-w-2xl leading-relaxed">
                    {job.description}
                  </p>
                  
                  <div className="flex flex-wrap items-center gap-4 text-sm font-medium text-slate-500">
                    <div className="flex items-center gap-1.5">
                      <MapPin className="w-4 h-4 text-slate-400" />
                      {job.location}
                    </div>
                    <div className="w-1 h-1 rounded-full bg-slate-700" />
                    <div className="flex items-center gap-1.5">
                      <Briefcase className="w-4 h-4 text-slate-400" />
                      {job.type}
                    </div>
                  </div>
                </div>

                <div className="relative z-10 md:shrink-0 flex items-center justify-start md:justify-end">
                  <Link 
                    href={`/careers/${job.id}`} 
                    className="flex items-center gap-2 px-6 py-3 bg-white/5 hover:bg-blue-600 text-white border border-white/10 hover:border-blue-500 rounded-xl font-semibold transition-all duration-300"
                  >
                    View Role
                    <ChevronRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* Fallback / General Application */}
          <div className="mt-12 p-8 rounded-2xl bg-gradient-to-br from-[#050B14] to-[#0a1128] border border-white/5 flex flex-col sm:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-white mb-2">Don&apos;t see a perfect fit?</h3>
              <p className="text-slate-400 text-sm max-w-md">
                We&apos;re always looking for outstanding talent. Send us your resume and a brief intro, and we&apos;ll keep you in mind for future roles.
              </p>
            </div>
            <Link 
              href="/request-proposal" 
              className="shrink-0 px-6 py-3 bg-transparent hover:bg-white/5 border border-slate-600 hover:border-slate-400 text-white rounded-xl font-semibold transition-colors"
            >
              Get in Touch
            </Link>
          </div>

        </motion.div>
      </div>
    </main>
  );
}


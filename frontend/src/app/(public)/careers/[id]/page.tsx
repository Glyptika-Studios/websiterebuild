/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Briefcase, MapPin, CheckCircle, HelpCircle } from "lucide-react";

interface PositionItem {
  id: string;
  kind: "responsibility" | "requirement";
  body: string;
}

interface Position {
  id: string;
  title: string;
  department: string;
  location: string;
  employment_type: string;
  description: string;
  active: boolean;
  items: PositionItem[];
}

const DEFAULT_POSITIONS: Position[] = [
  {
    id: "job-1",
    title: "Senior 3D Technical Artist",
    department: "XR & Visualization",
    location: "Remote (India)",
    employment_type: "Full-time",
    description: "We are looking for an experienced 3D Technical Artist to bridge the gap between art and programming for our high-fidelity VR simulations. You will lead assets integration, engine optimization, and material shaders pipelines.",
    active: true,
    items: [
      { id: "1", kind: "responsibility", body: "Develop, optimize, and maintain custom material shaders inside Unreal Engine and WebGL grids." },
      { id: "2", kind: "responsibility", body: "Coordinate with 3D modeling pipelines to establish clean file transfer standards." },
      { id: "3", kind: "requirement", body: "4+ years of industry experience working with standard gaming engines (Unreal Engine, Unity, or Blender)." },
      { id: "4", kind: "requirement", body: "Proficiency in HLSL/GLSL scripting and procedural node texturing." }
    ]
  },
  {
    id: "job-2",
    title: "Full Stack Engineer (Next.js)",
    department: "Web Ecosystems",
    location: "Hybrid / Bangalore",
    employment_type: "Full-time",
    description: "Join our core web team to architect scalable, high-performance SaaS applications and client portals using Next.js, React, and Node.js.",
    active: true,
    items: [
      { id: "5", kind: "responsibility", body: "Design and implement responsive Next.js application routes, loaders, and telemetry charts." },
      { id: "6", kind: "responsibility", body: "Integrate serverless edge APIs and postgres storage structures securely." },
      { id: "7", kind: "requirement", body: "Deep knowledge of React Server Components, TypeScript, Tailwind, and hydration state." },
      { id: "8", kind: "requirement", body: "Experience configuring Supabase RLS and server session middleware." }
    ]
  }
];

export default function CareerDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = React.use(params);
  const [job, setJob] = useState<Position | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_positions");
    let allJobs = DEFAULT_POSITIONS;
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        // Map any old schema positions to full Position objects if needed
        allJobs = parsed.map((p: any) => ({
          id: p.id,
          title: p.title,
          department: p.department,
          location: p.location,
          employment_type: p.employment_type || p.type || "Full-time",
          description: p.description,
          active: p.active !== undefined ? p.active : true,
          items: p.items || []
        }));
      } catch {
        // fallback
      }
    }

    // Lookup by id or slugified title
    const found = allJobs.find(j => {
      const slug = j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return j.id === id || slug === id;
    });

    setJob(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-transparent text-slate-400 flex items-center justify-center font-space">
        <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading role details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-transparent text-slate-350 flex flex-col items-center justify-center font-space px-4">
        <h2 className="text-3xl font-black text-white mb-3">Role Not Found</h2>
        <p className="text-slate-500 mb-8 max-w-sm text-center">This position has been filled or archiving limits apply.</p>
        <Link href="/careers" className="px-6 py-3 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold transition-all flex items-center gap-2">
          <ArrowLeft className="w-4 h-4" /> Back to Careers
        </Link>
      </div>
    );
  }

  const responsibilities = job.items.filter(item => item.kind === "responsibility");
  const requirements = job.items.filter(item => item.kind === "requirement");

  return (
    <main className="min-h-screen bg-transparent text-slate-300 font-sans selection:bg-blue-500/30 pb-32">
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[800px] bg-blue-900/10 blur-[150px] rounded-full -translate-y-1/3" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b_1px,transparent_1px),linear-gradient(to_bottom,#1e293b_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_60%_at_50%_40%,#000_20%,transparent_100%)] opacity-20" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-40">
        {/* Back Link */}
        <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-white transition-colors mb-10 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Back to Careers
        </Link>

        {/* Header Block */}
        <div className="border-b border-white/10 pb-8 mb-10">
          <div className="flex flex-wrap items-center gap-3 mb-6">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-3.5 py-1.5 rounded-full border border-blue-500/20">
              {job.department}
            </span>
            <span className={`text-xs font-bold uppercase tracking-wider px-3.5 py-1.5 rounded-full border ${
              job.active 
                ? 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' 
                : 'text-slate-500 bg-slate-500/10 border-slate-500/20'
            }`}>
              {job.active ? "Accepting Applications" : "Closed"}
            </span>
          </div>

          <h1 className="text-4xl sm:text-5xl font-black text-white tracking-tight mb-6 font-space">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-6 text-sm font-semibold text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-slate-400" />
              {job.location}
            </div>
            <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
            <div className="flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-slate-400" />
              {job.employment_type}
            </div>
          </div>
        </div>

        {/* Role Introduction */}
        <div className="mb-12">
          <h2 className="text-2xl font-bold text-white mb-4 font-space">About the Role</h2>
          <p className="text-slate-350 text-base leading-relaxed font-light">
            {job.description}
          </p>
        </div>

        {/* Responsibilities */}
        {responsibilities.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 font-space">What You&apos;ll Do</h2>
            <ul className="space-y-4">
              {responsibilities.map((item, idx) => (
                <li key={item.id || idx} className="flex items-start gap-3.5">
                  <CheckCircle className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm leading-relaxed">{item.body}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mb-12">
            <h2 className="text-2xl font-bold text-white mb-6 font-space">What We&apos;re Looking For</h2>
            <ul className="space-y-4">
              {requirements.map((item, idx) => (
                <li key={item.id || idx} className="flex items-start gap-3.5">
                  <HelpCircle className="w-5 h-5 text-teal-400 shrink-0 mt-0.5" />
                  <span className="text-slate-300 text-sm leading-relaxed">{item.body}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application CTA */}
        {job.active && (
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#050B14] to-[#0a1128] border border-white/5 flex flex-col md:flex-row items-center justify-between gap-6 shadow-xl">
            <div>
              <h3 className="text-xl font-bold text-white mb-1">Interested in this position?</h3>
              <p className="text-slate-500 text-xs">Let&apos;s start engineering your career path with Glyptika.</p>
            </div>
            <Link 
              href="/request-proposal"
              className="px-8 py-3.5 bg-blue-600 hover:bg-blue-500 text-white rounded-xl font-bold tracking-wide transition-all shadow-[0_0_20px_rgba(37,99,235,0.3)] shrink-0"
            >
              Apply for Role
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

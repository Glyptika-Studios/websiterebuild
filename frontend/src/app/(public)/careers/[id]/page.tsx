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

    const found = allJobs.find(j => {
      const slug = j.title.toLowerCase().replace(/[^a-z0-9]+/g, "-");
      return j.id === id || slug === id;
    });

    setJob(found || null);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#5F6368] flex items-center justify-center">
        <div className="w-5 h-5 border-2 border-[#1A73E8] border-t-transparent rounded-full animate-spin mr-3" />
        <span>Loading role details...</span>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-[#FAFAF9] text-[#5F6368] flex flex-col items-center justify-center px-4">
        <h2 className="text-2xl font-bold text-[#202124] mb-2">Role Not Found</h2>
        <p className="text-[#5F6368] mb-6 max-w-sm text-center">This position has been filled or archiving limits apply.</p>
        <Link href="/careers" className="px-5 py-2.5 bg-[#1A73E8] hover:bg-[#1765CC] text-white rounded-full font-semibold transition-all duration-200 flex items-center gap-2 text-sm shadow-sm">
          <ArrowLeft className="w-4 h-4" /> Back to Careers
        </Link>
      </div>
    );
  }

  const responsibilities = job.items.filter(item => item.kind === "responsibility");
  const requirements = job.items.filter(item => item.kind === "requirement");

  return (
    <main className="min-h-screen bg-[#FAFAF9] pb-24 pt-36">
      <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Link */}
        <Link href="/careers" className="inline-flex items-center gap-2 text-sm font-semibold text-[#5F6368] hover:text-[#202124] transition-colors mb-8 group">
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          Back to Careers
        </Link>

        {/* Header Block */}
        <div className="border-b border-[#DADCE0] pb-8 mb-8">
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <span className="text-[10px] font-semibold uppercase tracking-wider text-[#1A73E8] bg-[#E8F0FE] px-3 py-1 rounded-full border border-[#D2E3FC]">
              {job.department}
            </span>
            <span className={`text-[10px] font-semibold uppercase tracking-wider px-3 py-1 rounded-full border ${
              job.active 
                ? 'text-[#0D652D] bg-[#E6F4EA] border-[#CEEAD6]' 
                : 'text-[#5F6368] bg-[#F1F3F4] border-[#DADCE0]'
            }`}>
              {job.active ? "Accepting Applications" : "Closed"}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-bold text-[#202124] tracking-tight mb-4">
            {job.title}
          </h1>

          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-[#5F6368]">
            <div className="flex items-center gap-1">
              <MapPin className="w-4 h-4 text-[#80868B]" />
              {job.location}
            </div>
            <div className="w-1 h-1 rounded-full bg-[#BDC1C6]" />
            <div className="flex items-center gap-1">
              <Briefcase className="w-4 h-4 text-[#80868B]" />
              {job.employment_type}
            </div>
          </div>
        </div>

        {/* Role Introduction */}
        <div className="mb-10">
          <h2 className="text-xl font-bold text-[#202124] mb-3">About the Role</h2>
          <p className="text-[#5F6368] text-sm leading-relaxed">
            {job.description}
          </p>
        </div>

        {/* Responsibilities */}
        {responsibilities.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#202124] mb-4">What You&apos;ll Do</h2>
            <ul className="space-y-3.5">
              {responsibilities.map((item, idx) => (
                <li key={item.id || idx} className="flex items-start gap-2.5">
                  <CheckCircle className="w-4 h-4 text-[#1A73E8] shrink-0 mt-0.5" />
                  <span className="text-[#5F6368] text-sm leading-relaxed">{item.body}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Requirements */}
        {requirements.length > 0 && (
          <div className="mb-10">
            <h2 className="text-xl font-bold text-[#202124] mb-4">What We&apos;re Looking For</h2>
            <ul className="space-y-3.5">
              {requirements.map((item, idx) => (
                <li key={item.id || idx} className="flex items-start gap-2.5">
                  <HelpCircle className="w-4 h-4 text-[#A142F4] shrink-0 mt-0.5" />
                  <span className="text-[#5F6368] text-sm leading-relaxed">{item.body}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* Application CTA */}
        {job.active && (
          <div className="p-8 rounded-2xl bg-white border border-[#DADCE0] flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
            <div>
              <h3 className="text-lg font-bold text-[#202124] mb-1">Interested in this position?</h3>
              <p className="text-[#5F6368] text-xs">Let&apos;s start engineering your career path with Glyptika.</p>
            </div>
            <Link 
              href="/request-proposal"
              className="px-6 py-3 bg-[#1A73E8] hover:bg-[#1765CC] text-white rounded-full font-semibold transition-all duration-200 text-sm shadow-sm hover:shadow-md shrink-0"
            >
              Apply for Role
            </Link>
          </div>
        )}
      </div>
    </main>
  );
}

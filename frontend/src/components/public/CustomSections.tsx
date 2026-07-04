"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { Move3d, HardHat, TrendingDown, Clock, Layers, Rocket } from "lucide-react";

const FEATURED_PROJECTS = [
  {
    id: "proj-1",
    title: "XPLOR MVP",
    subtitle: "2D Maps → VR Environments",
    content: [
      "A revolutionary automation platform that transforms flat architectural drawings into fully interactive spatial environments in record time.",
      "By eliminating the manual modeling bottleneck, we drastically reduce production costs and time-to-market for real estate and architectural visualization.",
    ],
    metrics: [
      { label: "Time Saved", value: "99%", icon: Clock },
      { label: "Cost Saved", value: "99.98%", icon: TrendingDown },
    ],
    imageIcon: Move3d,
    imageUrl: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200&auto=format&fit=crop&q=80",
    alignment: "left" as const,
    color: "#1A73E8",
    tagBg: "#E8F0FE",
    tagBorder: "#D2E3FC",
  },
  {
    id: "proj-2",
    title: "HRV Simulator",
    subtitle: "Heavy Recovery Vehicle VR Training Module",
    content: [
      "A full-scale VR simulation environment engineered for high-stakes mechanical training and operational readiness without risking multi-million dollar equipment.",
      "Delivering uncompromised fidelity and physics accuracy to ensure personnel are mission-ready from day one.",
    ],
    metrics: [
      { label: "3D Assets", value: "150+ Models", icon: Layers },
      { label: "Deployment", value: "Full VR", icon: Rocket },
    ],
    imageIcon: HardHat,
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1200&auto=format&fit=crop&q=80",
    alignment: "right" as const,
    color: "#A142F4",
    tagBg: "#F3E8FD",
    tagBorder: "#E4CCFA",
  },
];

function ProjectRow({ project }: { project: (typeof FEATURED_PROJECTS)[0] }) {
  const isLeft = project.alignment === "left";
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rowRef}
      className={`flex flex-col gap-10 lg:gap-16 items-center ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* Text Column */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full lg:w-1/2 space-y-6"
      >
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-2" style={{ color: project.color }}>
            {project.subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#202124] tracking-tight leading-tight">
            {project.title}
          </h2>
        </div>

        <div className="space-y-4">
          {project.content.map((p, i) => (
            <p key={i} className="text-base md:text-lg text-[#5F6368] leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {project.metrics.map((metric, mIdx) => {
            const MetricIcon = metric.icon;
            return (
              <div
                key={mIdx}
                className="group p-5 rounded-xl flex items-center gap-4 bg-white border border-[#DCE3EC] shadow-[0_8px_24px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(0,0,0,0.06)] hover:border-[#BDC1C6] transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: project.tagBg, border: `1px solid ${project.tagBorder}` }}
                >
                  <MetricIcon className="w-5 h-5" style={{ color: project.color }} />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-[#202124] tracking-tight">{metric.value}</div>
                  <div className="text-sm text-[#5F6368] uppercase tracking-wider font-semibold">{metric.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Media Column */}
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        whileInView={{ opacity: 1, y: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-1/2 relative font-sans"
      >
        <div
          className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden bg-white border border-[#DCE3EC] shadow-[0_12px_32px_rgba(15,23,42,0.05)] hover:-translate-y-1 hover:shadow-[0_20px_48px_rgba(0,0,0,0.08)] transition-all duration-300"
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomSections() {
  return (
    <section className="relative w-full py-32 overflow-hidden bg-[#FAFBFD]/80 border-y border-[#E5E8EB]/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-semibold uppercase tracking-widest bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]">
            Featured Work
          </div>
        </motion.div>

        <div className="flex flex-col gap-24 lg:gap-32">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}

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
    alignment: "right" as const,
    color: "#A142F4",
    tagBg: "#F3E8FD",
    tagBorder: "#E4CCFA",
  },
];

function ProjectRow({ project }: { project: (typeof FEATURED_PROJECTS)[0] }) {
  const isLeft = project.alignment === "left";
  const Icon = project.imageIcon;
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
          <p className="text-xs font-semibold uppercase tracking-widest mb-2" style={{ color: project.color }}>
            {project.subtitle}
          </p>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#202124] tracking-tight leading-tight">
            {project.title}
          </h2>
        </div>

        <div className="space-y-3">
          {project.content.map((p, i) => (
            <p key={i} className="text-sm text-[#5F6368] leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {project.metrics.map((metric, mIdx) => {
            const MetricIcon = metric.icon;
            return (
              <div
                key={mIdx}
                className="group p-5 rounded-xl flex items-center gap-4 bg-white border border-[#DADCE0] shadow-sm hover:shadow-md hover:border-[#BDC1C6] transition-all duration-200"
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: project.tagBg, border: `1px solid ${project.tagBorder}` }}
                >
                  <MetricIcon className="w-5 h-5" style={{ color: project.color }} />
                </div>
                <div>
                  <div className="text-lg font-bold text-[#202124] tracking-tight">{metric.value}</div>
                  <div className="text-xs text-[#5F6368] uppercase tracking-wider font-medium">{metric.label}</div>
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
        className="w-full lg:w-1/2 relative"
      >
        <div
          className="relative w-full aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden flex items-center justify-center bg-[#F1F3F4] border border-[#DADCE0] shadow-sm"
        >
          {/* Floating icon */}
          <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-36 h-36 rounded-2xl flex items-center justify-center bg-white border border-[#DADCE0] shadow-md"
          >
            <Icon
              className="w-16 h-16"
              strokeWidth={1.2}
              style={{ color: project.color }}
            />
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomSections() {
  return (
    <section className="relative w-full py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-16"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]">
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

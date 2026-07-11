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
    accent: "#60A5FA",
    accentDim: "rgba(96,165,250,0.12)",
    accentBorder: "rgba(96,165,250,0.25)",
    tag: "Featured Product",
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
      { label: "3D Assets", value: "150+", icon: Layers },
      { label: "Deployment", value: "Full VR", icon: Rocket },
    ],
    imageIcon: HardHat,
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1200&auto=format&fit=crop&q=80",
    alignment: "right" as const,
    accent: "#C084FC",
    accentDim: "rgba(192,132,252,0.12)",
    accentBorder: "rgba(192,132,252,0.25)",
    tag: "Defense Project",
  },
];

function ProjectRow({ project, index }: { project: (typeof FEATURED_PROJECTS)[0]; index: number }) {
  const isLeft = project.alignment === "left";
  const rowRef = useRef<HTMLDivElement>(null);

  return (
    <div
      ref={rowRef}
      className={`flex flex-col gap-10 lg:gap-20 items-center ${isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
    >
      {/* Text Column */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? -40 : 40 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut" }}
        className="w-full lg:w-1/2 space-y-8"
      >
        {/* Tag */}
        <div
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-bold uppercase tracking-widest border"
          style={{
            color: project.accent,
            backgroundColor: project.accentDim,
            borderColor: project.accentBorder,
          }}
        >
          {project.tag}
        </div>

        <div>
          <p className="text-sm font-semibold uppercase tracking-widest mb-3" style={{ color: project.accent }}>
            {project.subtitle}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight text-[#0F172A]">
            {project.title}
          </h2>
        </div>

        <div className="space-y-4 border-l-2 pl-6" style={{ borderColor: project.accentBorder }}>
          {project.content.map((p, i) => (
            <p key={i} className="text-base md:text-lg text-[#334155] leading-relaxed">
              {p}
            </p>
          ))}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {project.metrics.map((metric, mIdx) => {
            const MetricIcon = metric.icon;
            return (
              <div
                key={mIdx}
                className="group p-5 rounded-xl flex items-center gap-4 border transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  backgroundColor: project.accentDim,
                  borderColor: project.accentBorder,
                }}
              >
                <div
                  className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0"
                  style={{ backgroundColor: "rgba(255,255,255,0.6)", border: `1px solid ${project.accentBorder}` }}
                >
                  <MetricIcon className="w-5 h-5" style={{ color: project.accent }} />
                </div>
                <div>
                  <div className="text-xl md:text-2xl font-black text-[#0F172A] tracking-tight">{metric.value}</div>
                  <div className="text-xs text-[#334155] uppercase tracking-wider font-semibold">{metric.label}</div>
                </div>
              </div>
            );
          })}
        </div>
      </motion.div>

      {/* Media Column */}
      <motion.div
        initial={{ opacity: 0, x: isLeft ? 40 : -40, scale: 0.96 }}
        whileInView={{ opacity: 1, x: 0, scale: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.7, ease: "easeOut", delay: 0.1 }}
        className="w-full lg:w-1/2 relative"
      >
        {/* Glow behind image */}
        <div
          className="absolute -inset-4 rounded-3xl opacity-20 z-0"
          style={{ background: `radial-gradient(ellipse at center, ${project.accent}, transparent 70%)` }}
        />
        <div
          className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden border z-10"
          style={{ borderColor: project.accentBorder }}
        >
          <img
            src={project.imageUrl}
            alt={project.title}
            className="w-full h-full object-cover"
          />
          {/* Subtle overlay */}
          <div
            className="absolute inset-0"
            style={{
              background: `linear-gradient(to top, rgba(10,15,30,0.5) 0%, transparent 50%)`
            }}
          />
          {/* Index number watermark */}
          <div className="absolute top-4 right-4 text-7xl font-black opacity-[0.06] text-[#0F172A] select-none leading-none">
            0{index + 1}
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function CustomSections() {
  return (
    <section className="relative w-full py-32 overflow-hidden bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-20"
        >
          <div className="inline-flex items-center px-4 py-1.5 rounded-full text-sm font-bold uppercase tracking-widest bg-[#2563EB]/8 text-[#2563EB]/80 border border-[#2563EB]/15">
            ✦ Featured Work
          </div>
        </motion.div>

        <div className="flex flex-col gap-28 lg:gap-40">
          {FEATURED_PROJECTS.map((project, index) => (
            <ProjectRow key={project.id} project={project} index={index} />
          ))}
        </div>

      </div>
    </section>
  );
}

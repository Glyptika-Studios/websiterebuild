"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
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
      { label: "Time Saved",  value: "99%",      icon: Clock },
      { label: "Cost Saved",  value: "99.98%",   icon: TrendingDown },
    ],
    imageIcon: Move3d,
    alignment: "left" as const,
    accentColor: "rgba(59,130,246,",
    iconColor: "text-blue-400",
    glowRgb: "59,130,246",
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
      { label: "3D Assets",   value: "150+ Models", icon: Layers },
      { label: "Deployment",  value: "Full VR",     icon: Rocket },
    ],
    imageIcon: HardHat,
    alignment: "right" as const,
    accentColor: "rgba(99,102,241,",
    iconColor: "text-indigo-400",
    glowRgb: "99,102,241",
  },
];

const glassPanel = {
  background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
  backdropFilter: "blur(24px)",
  WebkitBackdropFilter: "blur(24px)",
  border: "1px solid rgba(255,255,255,0.09)",
  boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.07)",
};

// ─── Per-project row with scroll-driven parallax ─────────────────────────────
function ProjectRow({ project }: { project: typeof FEATURED_PROJECTS[0] }) {
  const isLeft = project.alignment === "left";
  const Icon   = project.imageIcon;
  const rowRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: rowRef,
    offset: ["start 0.9", "center 0.5"],
  });

  // Text column — slides up from bottom
  const textY       = useTransform(scrollYProgress, [0, 1], [70,  0]);
  const textOpacity = useTransform(scrollYProgress, [0, 0.55], [0, 1]);

  // Media column — scales + appears with slight float
  const mediaScale   = useTransform(scrollYProgress, [0, 1], [0.88, 1]);
  const mediaY       = useTransform(scrollYProgress, [0, 1], [50,   0]);
  const mediaOpacity = useTransform(scrollYProgress, [0, 0.65], [0, 1]);
  const mediaRotateY = useTransform(scrollYProgress, [0, 1], [isLeft ? 10 : -10, 0]);

  return (
    <div
      ref={rowRef}
      className={`flex flex-col gap-12 lg:gap-20 items-center ${
        isLeft ? "lg:flex-row" : "lg:flex-row-reverse"
      }`}
    >
      {/* ── Text Column ── */}
      <motion.div
        style={{ y: textY, opacity: textOpacity }}
        className="w-full lg:w-1/2 space-y-8"
      >
        <div>
          <p className={`text-xs font-bold uppercase tracking-widest mb-3 ${project.iconColor}`}>
            {project.subtitle}
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white tracking-tight leading-none">
            {project.title}
          </h2>
        </div>

        <div className="space-y-4">
          {project.content.map((p, i) => (
            <p key={i} className="text-base text-slate-400 font-light leading-relaxed">{p}</p>
          ))}
        </div>

        {/* Metric cards */}
        <div className="grid grid-cols-2 gap-4 pt-2">
          {project.metrics.map((metric, mIdx) => {
            const MetricIcon = metric.icon;
            return (
              <motion.div
                key={mIdx}
                whileHover={{ y: -5, scale: 1.03 }}
                className="group relative p-5 rounded-2xl flex items-center gap-4 overflow-hidden cursor-default"
                style={glassPanel}
              >
                <div
                  className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                  style={{ background: `linear-gradient(90deg, transparent, ${project.accentColor}0.4), transparent)` }}
                />
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{
                    background: `${project.accentColor}0.12)`,
                    border: `1px solid ${project.accentColor}0.25)`,
                  }}
                >
                  <MetricIcon className={`w-5 h-5 ${project.iconColor}`} />
                </div>
                <div>
                  <div className="text-xl font-bold text-white tracking-tight">{metric.value}</div>
                  <div className="text-xs text-slate-500 uppercase tracking-wider font-semibold">{metric.label}</div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* ── Glass Media Column ── */}
      <motion.div
        style={{ y: mediaY, opacity: mediaOpacity, scale: mediaScale, rotateY: mediaRotateY, transformPerspective: 1200 }}
        className="w-full lg:w-1/2 relative"
      >
        <div
          className="group relative w-full aspect-square md:aspect-[4/3] rounded-[3rem] overflow-hidden flex items-center justify-center"
          style={{
            background: "linear-gradient(145deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02))",
            backdropFilter: "blur(32px)",
            WebkitBackdropFilter: "blur(32px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: `0 20px 80px rgba(0,0,0,0.6), 0 0 60px rgba(${project.glowRgb},0.08), inset 0 1px 0 rgba(255,255,255,0.10)`,
          }}
        >
          {/* Ambient inner glow */}
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-3/4 rounded-full blur-[80px] group-hover:scale-110 transition-transform duration-1000 pointer-events-none"
            style={{ background: `rgba(${project.glowRgb},0.15)` }}
          />

          {/* Floating glass icon card */}
          <motion.div
            animate={{ y: [0, -16, 0] }}
            transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            className="relative z-10 w-44 h-44 rounded-[2rem] flex items-center justify-center"
            style={{
              background: "linear-gradient(145deg, rgba(255,255,255,0.12), rgba(255,255,255,0.04))",
              backdropFilter: "blur(20px)",
              WebkitBackdropFilter: "blur(20px)",
              border: "1px solid rgba(255,255,255,0.15)",
              boxShadow: `0 20px 60px rgba(0,0,0,0.5), 0 0 30px rgba(${project.glowRgb},0.2), inset 0 1px 0 rgba(255,255,255,0.2)`,
            }}
          >
            <div
              className="absolute inset-0 rounded-[2rem]"
              style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.08) 0%, transparent 60%)" }}
            />
            <Icon
              className={`w-20 h-20 ${project.iconColor} relative z-10`}
              strokeWidth={1.2}
              style={{ filter: `drop-shadow(0 0 16px rgba(${project.glowRgb},0.6))` }}
            />
          </motion.div>

          {/* Glass reflection sweep */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none rounded-[3rem]"
            style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, transparent 50%)" }}
          />

          {/* Corner accents */}
          <div className="absolute top-4 left-4 w-8 h-8 rounded-tl-2xl border-t border-l pointer-events-none"
            style={{ borderColor: `rgba(${project.glowRgb},0.4)` }} />
          <div className="absolute bottom-4 right-4 w-8 h-8 rounded-br-2xl border-b border-r pointer-events-none"
            style={{ borderColor: `rgba(${project.glowRgb},0.4)` }} />
        </div>

        {/* Backdrop decorative glow */}
        <div
          className={`absolute -z-10 w-1/2 h-1/2 rounded-full blur-3xl ${isLeft ? "-bottom-8 -right-8" : "-bottom-8 -left-8"}`}
          style={{ background: `rgba(${project.glowRgb},0.15)` }}
        />
      </motion.div>
    </div>
  );
}

export default function CustomSections() {
  return (
    <section className="relative w-full py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section badge */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="flex justify-center mb-20"
        >
          <div
            className="inline-flex items-center px-5 py-2 rounded-full text-xs font-bold uppercase tracking-widest text-blue-300"
            style={{
              background: "rgba(37,99,235,0.10)",
              border: "1px solid rgba(37,99,235,0.22)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 0 24px rgba(37,99,235,0.12)",
            }}
          >
            Featured Work
          </div>
        </motion.div>

        <div className="flex flex-col gap-32 lg:gap-40">
          {FEATURED_PROJECTS.map((project) => (
            <ProjectRow key={project.id} project={project} />
          ))}
        </div>

      </div>
    </section>
  );
}

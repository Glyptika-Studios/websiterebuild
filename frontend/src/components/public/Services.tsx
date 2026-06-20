"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cuboid, Move3d, Video } from "lucide-react";

const SERVICES_DATA = [
  {
    id: "svc-1",
    title: "Custom 3D Asset Creation",
    tag: "3D Modeling",
    description: "Bespoke 3D models tailored to your exact specifications. From product prototypes to architectural elements.",
    icon: Cuboid,
    accentFrom: "rgba(59,130,246,0.15)",
    accentTo: "rgba(6,182,212,0.08)",
    borderHover: "rgba(59,130,246,0.35)",
    glowColor: "rgba(59,130,246,0.5)",
    iconColor: "text-blue-400",
    tagBg: "rgba(59,130,246,0.12)",
    tagBorder: "rgba(59,130,246,0.25)",
    tagText: "#93c5fd",
    delay: 0,
  },
  {
    id: "svc-2",
    title: "VR Environment Creation",
    tag: "VR Simulation",
    description: "Fully immersive virtual reality environments designed for training, visualization, and interactive experiences.",
    icon: Move3d,
    accentFrom: "rgba(99,102,241,0.15)",
    accentTo: "rgba(59,130,246,0.08)",
    borderHover: "rgba(99,102,241,0.35)",
    glowColor: "rgba(99,102,241,0.5)",
    iconColor: "text-indigo-400",
    tagBg: "rgba(99,102,241,0.12)",
    tagBorder: "rgba(99,102,241,0.25)",
    tagText: "#a5b4fc",
    delay: 0.1,
  },
  {
    id: "svc-3",
    title: "INSDAG Collaboration",
    tag: "Explainer Reel",
    description: "Partnering with INSDAG to modernize workforce development through intuitive, high-fidelity instructional animations.",
    icon: Video,
    accentFrom: "rgba(20,184,166,0.15)",
    accentTo: "rgba(6,182,212,0.08)",
    borderHover: "rgba(20,184,166,0.35)",
    glowColor: "rgba(20,184,166,0.5)",
    iconColor: "text-teal-400",
    tagBg: "rgba(20,184,166,0.12)",
    tagBorder: "rgba(20,184,166,0.25)",
    tagText: "#5eead4",
    delay: 0.2,
  },
];

function ServiceCard({ service }: { service: typeof SERVICES_DATA[0] }) {
  const Icon = service.icon;
  const ref = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.4"],
  });

  // Each card rises up and slightly rotates into view
  const y = useTransform(scrollYProgress, [0, 1], [70, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [0, 1]);
  const rotateX = useTransform(scrollYProgress, [0, 1], [12, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.94, 1]);

  const cardBaseStyle = {
    background: "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(20px)",
    WebkitBackdropFilter: "blur(20px)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 4px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)",
    transition: "all 0.45s cubic-bezier(0.16,1,0.3,1)",
  };

  return (
    <motion.div
      ref={ref}
      style={{ y, opacity, rotateX, scale, transformPerspective: 1000, ...cardBaseStyle }}
      whileHover={{ y: -8, scale: 1.02 }}
      className="group relative rounded-[2rem] p-8 flex flex-col h-full cursor-default overflow-hidden"
      onMouseEnter={(e) => {
        const el = e.currentTarget;
        el.style.border = `1px solid ${service.borderHover}`;
        el.style.boxShadow = `0 8px 50px rgba(0,0,0,0.5), 0 0 40px ${service.glowColor}33, inset 0 1px 0 rgba(255,255,255,0.1)`;
        el.style.background = `linear-gradient(145deg, ${service.accentFrom} 0%, ${service.accentTo} 100%)`;
      }}
      onMouseLeave={(e) => {
        const el = e.currentTarget;
        el.style.border = "1px solid rgba(255,255,255,0.09)";
        el.style.boxShadow = "0 4px 30px rgba(0,0,0,0.35), inset 0 1px 0 rgba(255,255,255,0.07)";
        el.style.background = "linear-gradient(145deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)";
      }}
    >

      {/* Glossy sweep on hover */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/5 to-transparent transition-transform duration-1000 ease-out pointer-events-none rounded-[2rem]" />
      {/* Top shimmer */}
      <div
        className="absolute top-0 left-6 right-6 h-px pointer-events-none"
        style={{ background: `linear-gradient(90deg, transparent, ${service.glowColor}60, transparent)` }}
      />

      <div className="relative z-10 flex flex-col h-full">
        <div className="flex items-start justify-between mb-8">
          <div
            className="w-14 h-14 rounded-2xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
            style={{
              background: "rgba(255,255,255,0.06)",
              backdropFilter: "blur(8px)",
              border: "1px solid rgba(255,255,255,0.12)",
            }}
          >
            <Icon className={`w-7 h-7 ${service.iconColor}`} />
          </div>
          <div
            className="px-3 py-1 rounded-full text-xs font-bold"
            style={{ background: service.tagBg, border: `1px solid ${service.tagBorder}`, color: service.tagText }}
          >
            {service.tag}
          </div>
        </div>

        <h3 className="text-xl font-bold text-white mb-4 tracking-wide leading-snug">{service.title}</h3>
        <p className="text-slate-400 text-sm leading-relaxed flex-grow group-hover:text-slate-300 transition-colors duration-300">
          {service.description}
        </p>

        <div className="mt-8 flex items-center text-xs font-bold text-slate-500 group-hover:text-blue-400 transition-colors duration-300 w-max">
          <span className="relative">
            Explore Capability
            <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-blue-400 group-hover:w-full transition-all duration-500" />
          </span>
          <svg className="w-3.5 h-3.5 ml-2 opacity-0 -translate-x-3 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
          </svg>
        </div>
      </div>
    </motion.div>
  );
}

export default function Services() {
  const sectionRef = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "start 0.1"],
  });
  // Section header has its own parallax: slides up as section enters
  const headerY = useTransform(scrollYProgress, [0, 1], [40, -20]);

  return (
    <section ref={sectionRef} className="relative w-full py-32 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Section Header with parallax */}
        <motion.div
          style={{ y: headerY }}
          className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center"
        >
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center justify-center px-4 py-1.5 mb-6 rounded-full text-xs font-bold uppercase tracking-widest"
            style={{
              background: "rgba(59,130,246,0.10)",
              border: "1px solid rgba(59,130,246,0.25)",
              color: "#93c5fd",
              backdropFilter: "blur(8px)",
              boxShadow: "0 0 20px rgba(59,130,246,0.15)",
            }}
          >
            Service Division
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-white mb-6 tracking-tight"
          >
            Elite 3D &amp; VR Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-slate-400 text-lg font-light leading-relaxed max-w-2xl"
          >
            Precision-engineered 3D modeling, immersive VR experiences, and cutting-edge visualization for commercial, government, and defense clients.
          </motion.p>
        </motion.div>

        {/* Cards — flex-wrap so incomplete rows are centered */}
        <div className="flex flex-wrap justify-center gap-6">
          {SERVICES_DATA.map((service) => (
            <div key={service.id} className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]">
              <ServiceCard service={service} />
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}

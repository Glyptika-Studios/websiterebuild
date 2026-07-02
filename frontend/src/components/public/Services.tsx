"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Cuboid, Move3d, Video } from "lucide-react";

const SERVICES_DATA = [
  {
    id: "svc-1",
    title: "Custom 3D Asset Creation",
    tag: "3D Modeling",
    description: "Bespoke 3D models tailored to your exact specifications. From product prototypes to architectural elements.",
    icon: Cuboid,
    color: "#1A73E8",
    tagBg: "#E8F0FE",
    tagBorder: "#D2E3FC",
  },
  {
    id: "svc-2",
    title: "VR Environment Creation",
    tag: "VR Simulation",
    description: "Fully immersive virtual reality environments designed for training, visualization, and interactive experiences.",
    icon: Move3d,
    color: "#A142F4",
    tagBg: "#F3E8FD",
    tagBorder: "#E4CCFA",
  },
  {
    id: "svc-3",
    title: "INSDAG Collaboration",
    tag: "Explainer Reel",
    description: "Partnering with INSDAG to modernize workforce development through intuitive, high-fidelity instructional animations.",
    icon: Video,
    color: "#0D652D",
    tagBg: "#E6F4EA",
    tagBorder: "#CEEAD6",
  },
];

function ServiceCard({ service }: { service: (typeof SERVICES_DATA)[0] }) {
  const Icon = service.icon;
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 0.95", "start 0.5"],
  });

  const y = useTransform(scrollYProgress, [0, 1], [40, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.5], [0, 1]);

  return (
    <motion.div
      ref={ref}
      style={{ 
        y, 
        opacity,
        borderColor: isHovered ? `${service.color}40` : "#DADCE0",
        boxShadow: isHovered 
          ? `0 12px 30px rgba(0, 0, 0, 0.04), 0 0 20px ${service.color}15`
          : "0 2px 8px rgba(0, 0, 0, 0.01)"
      }}
      whileHover={{ y: -4 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="group relative rounded-2xl p-8 flex flex-col h-full cursor-default bg-white border transition-all duration-300"
    >
      <div className="flex items-start justify-between mb-6">
        <div
          className="w-12 h-12 rounded-xl flex items-center justify-center transition-transform duration-300 group-hover:scale-105"
          style={{ backgroundColor: service.tagBg, border: `1px solid ${service.tagBorder}` }}
        >
          <Icon className="w-6 h-6" style={{ color: service.color }} />
        </div>
        <div
          className="px-3 py-1 rounded-full text-xs font-medium"
          style={{ backgroundColor: service.tagBg, border: `1px solid ${service.tagBorder}`, color: service.color }}
        >
          {service.tag}
        </div>
      </div>

      <h3 className="text-lg font-semibold text-[#202124] mb-3 leading-snug">{service.title}</h3>
      <p className="text-[#5F6368] text-sm leading-relaxed flex-grow">
        {service.description}
      </p>

      <div className="mt-6 flex items-center text-xs font-medium text-[#5F6368] group-hover:text-[#1A73E8] transition-colors duration-200 w-max">
        <span className="relative text-xs">
          Explore Capability
          <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-[#1A73E8] group-hover:w-full transition-all duration-300" />
        </span>
        <svg className="w-3.5 h-3.5 ml-1.5 opacity-0 -translate-x-2 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
        </svg>
      </div>
    </motion.div>
  );
}

export default function Services() {
  return (
    <section id="services" className="relative w-full py-24 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 flex flex-col items-center">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center justify-center px-4 py-1.5 mb-5 rounded-full text-xs font-medium uppercase tracking-widest bg-[#E8F0FE] text-[#1A73E8] border border-[#D2E3FC]"
          >
            Service Division
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.05 }}
            className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#202124] mb-5 tracking-tight"
          >
            Elite 3D &amp; VR Services
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="text-[#5F6368] text-lg font-normal leading-relaxed max-w-2xl"
          >
            Precision-engineered 3D modeling, immersive VR experiences, and cutting-edge visualization for commercial, government, and defense clients.
          </motion.p>
        </div>

        {/* Cards */}
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

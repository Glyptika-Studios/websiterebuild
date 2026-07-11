"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Move3d, Code2, Database, ArrowUpRight } from "lucide-react";

const MOCK_SERVICES = [
  {
    id: "svc-1",
    number: "01",
    title: "Custom 3D Asset Creation",
    category: "3D Visualization",
    description:
      "Procedural synthesis of high-fidelity 3D assets mapped from CAD outlines. Optimized using texture atlases and dynamic Level of Detail (LOD) compilation.",
    icon: Move3d,
    accent: "#3B82F6",
    accentBg: "#EFF6FF",
    accentBorder: "#DBEAFE",
    url: "/request-proposal",
    tags: ["CAD Import", "LOD Optimization", "glTF Export"],
  },
  {
    id: "svc-2",
    number: "02",
    title: "VR Environment Creation",
    category: "Spatial Engineering",
    description:
      "Bespoke virtual reality scenes and simulations compatible with WebXR, SteamVR, and Oculus arrays. Full collision meshes and customized lighting bakes.",
    icon: Layers,
    accent: "#8B5CF6",
    accentBg: "#F5F3FF",
    accentBorder: "#EDE9FE",
    url: "/request-proposal",
    tags: ["WebXR", "Unreal Engine", "Custom Lighting"],
  },
  {
    id: "svc-3",
    number: "03",
    title: "Digital Automation",
    category: "Software Engineering",
    description:
      "Transition manual material logs to secure automated scripts. Custom APIs, webhooks, and air-gapped system integrations.",
    icon: Code2,
    accent: "#10B981",
    accentBg: "#ECFDF5",
    accentBorder: "#D1FAE5",
    url: "/request-proposal",
    tags: ["API Design", "Webhooks", "Air-gapped"],
  },
  {
    id: "svc-4",
    number: "04",
    title: "Inventory Management Solutions",
    category: "Logistics Sync",
    description:
      "Bespoke deployment, migration, and maintenance packages for the IMS Portal. Custom authorization rules tailored to enterprise operational pipelines.",
    icon: Database,
    accent: "#F59E0B",
    accentBg: "#FEF3C7",
    accentBorder: "#FDE68A",
    url: "/ims",
    tags: ["IMS Portal", "Enterprise Auth", "Migration"],
  },
];

export default function ServicesPage() {
  return (
    <main className="min-h-screen relative overflow-hidden">
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 pb-24">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-20"
        >
          <div
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border text-xs font-bold uppercase tracking-widest mb-6"
            style={{
              borderColor: "#DBEAFE",
              color: "#2563EB",
              background: "#EFF6FF",
            }}
          >
            <Layers className="w-3 h-3" />
            Our Services
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-[#0F172A] tracking-tight leading-none mb-6">
            Digital
            <br />
            <span
              className="bg-clip-text text-transparent"
              style={{
                backgroundImage:
                  "linear-gradient(90deg, #2563EB, #7C3AED, #059669)",
              }}
            >
              Ecosystems.
            </span>
          </h1>
          <p className="text-lg md:text-xl text-[#475569] max-w-2xl leading-relaxed font-normal">
            We engineer bespoke solutions across spatial computing, 3D
            visualization, and automated enterprise software.
          </p>
        </motion.div>

        {/* Bento Service Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {MOCK_SERVICES.map((service, index) => {
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 32 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Link
                  href={service.url}
                  className="group relative flex flex-col h-full p-8 rounded-2xl border bg-white/75 hover:bg-[#D2E3FC] overflow-hidden transition-all duration-300 hover:-translate-y-1"
                  style={{
                    backdropFilter: "blur(12px)",
                    borderColor: "rgba(226, 232, 240, 0.8)",
                    boxShadow:
                      "0 10px 30px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)",
                  }}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = service.accent + "55";
                    el.style.boxShadow = `0 20px 40px ${service.accent}12, inset 0 1px 0 rgba(255, 255, 255, 0.1)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget as HTMLElement;
                    el.style.borderColor = "rgba(226, 232, 240, 0.8)";
                    el.style.boxShadow =
                      "0 10px 30px rgba(15, 23, 42, 0.04), inset 0 1px 0 rgba(255, 255, 255, 0.8)";
                  }}
                >
                  {/* Subtle top border accent */}
                  <div
                    className="absolute top-0 left-0 right-0 h-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                    style={{
                      background: `linear-gradient(90deg, transparent, ${service.accent}, transparent)`,
                    }}
                  />

                  {/* Number watermark */}
                  <div
                    className="absolute top-6 right-8 text-7xl font-black opacity-[0.05] group-hover:opacity-10 transition-opacity duration-300 select-none leading-none font-mono"
                    style={{ color: service.accent }}
                  >
                    {service.number}
                  </div>

                  {/* Icon + Category row removed as requested */}

                  {/* Content */}
                  <div className="flex-grow z-10">
                    <h3 className="text-2xl font-bold text-[#1E293B] mb-4 leading-tight transition-colors duration-300">
                      {service.title}
                    </h3>
                    <p className="text-[#64748B] text-base md:text-lg leading-relaxed mb-8 transition-colors duration-300">
                      {service.description}
                    </p>
                  </div>

                  {/* Tags */}
                  <div className="flex flex-wrap gap-2 mb-8 z-10">
                    {service.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2.5 py-1 rounded-md text-[#64748B] bg-slate-900/5 border border-slate-900/10 group-hover:text-slate-300 group-hover:bg-white/10 group-hover:border-white/10 transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div
                    className="flex items-center gap-2 text-sm font-bold uppercase tracking-wider transition-all duration-200"
                    style={{ color: service.accent }}
                  >
                    <span>View Details</span>
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform duration-200" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Bottom CTA strip */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="mt-16 flex flex-col sm:flex-row items-center justify-between gap-6 p-8 rounded-2xl border"
          style={{
            background: "rgba(255, 255, 255, 0.6)",
            borderColor: "rgba(226, 232, 240, 0.8)",
            boxShadow: "0 10px 30px rgba(15, 23, 42, 0.03)",
          }}
        >
          <div>
            <p className="text-[#1E293B] font-bold text-lg mb-1">
              Need a custom solution?
            </p>
            <p className="text-[#64748B] text-sm">
              Every project is unique. Let&apos;s talk about what you need.
            </p>
          </div>
          <Link
            href="/request-proposal"
            className="flex items-center gap-2 px-7 py-3.5 rounded-xl font-bold text-sm uppercase tracking-wider transition-all duration-200 hover:-translate-y-0.5 whitespace-nowrap"
            style={{
              background: "linear-gradient(135deg, #2563EB, #7C3AED)",
              color: "white",
              boxShadow: "0 8px 24px rgba(37,99,235,0.2)",
            }}
          >
            Request Proposal
            <ArrowUpRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </main>
  );
}

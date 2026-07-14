"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Layers, Move3d, Code2, Database, ChevronRight, ArrowRight } from "lucide-react";

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

const serviceDesignMeta: Record<string, {
  description: string;
  tags: string[];
  icon: any;
  accent: string;
  accentBg: string;
  accentBorder: string;
}> = {
  "Product Design": {
    description: "Procedural synthesis of high-fidelity 3D assets mapped from CAD outlines. Optimized using texture atlases and dynamic Level of Detail (LOD) compilation.",
    tags: ["CAD Import", "LOD Optimization", "glTF Export"],
    icon: Move3d,
    accent: "#3B82F6",
    accentBg: "#EFF6FF",
    accentBorder: "#DBEAFE"
  },
  "Web Development": {
    description: "Bespoke virtual reality scenes and simulations compatible with WebXR, SteamVR, and Oculus arrays. Full collision meshes and customized lighting bakes.",
    tags: ["WebXR", "Unreal Engine", "Custom Lighting"],
    icon: Layers,
    accent: "#8B5CF6",
    accentBg: "#F5F3FF",
    accentBorder: "#EDE9FE"
  },
  "Mobile Development": {
    description: "Transition manual material logs to secure automated scripts. Custom APIs, webhooks, and air-gapped system integrations.",
    tags: ["API Design", "Webhooks", "Air-gapped"],
    icon: Code2,
    accent: "#10B981",
    accentBg: "#ECFDF5",
    accentBorder: "#D1FAE5"
  },
  "Brand Identity": {
    description: "Bespoke deployment, migration, and maintenance packages for the IMS Portal. Custom authorization rules tailored to enterprise operational pipelines.",
    tags: ["IMS Portal", "Enterprise Auth", "Migration"],
    icon: Database,
    accent: "#F59E0B",
    accentBg: "#FEF3C7",
    accentBorder: "#FDE68A"
  }
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>(MOCK_SERVICES);

  useEffect(() => {
    fetch("/api/v1/services?published=true")
      .then((res) => {
        if (!res.ok) throw new Error();
        return res.json();
      })
      .then((body: any) => {
        if (body.success && Array.isArray(body.data) && body.data.length > 0) {
          const mapped = body.data.map((item: any, index: number) => {
            const meta = serviceDesignMeta[item.title] || {
              description: "Custom digital engineering solutions designed and deployed by Glyptika.",
              tags: [],
              icon: Code2,
              accent: "#3B82F6",
              accentBg: "#EFF6FF",
              accentBorder: "#DBEAFE"
            };
            return {
              id: item.id,
              number: String(index + 1).padStart(2, "0"),
              title: item.title,
              url: item.url || "/request-proposal",
              url_type: item.url_type,
              ...meta,
              description: item.description || meta.description
            };
          });
          setServices(mapped);
        }
      })
      .catch(() => {});
  }, []);

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
              className="bg-clip-text text-transparent bg-gradient-to-r from-[#1A73E8] via-[#4285F4] to-[#0F172A] pb-1 block"
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
          {services.map((service, index) => {
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
                  className="group relative flex flex-col h-full p-8 rounded-[20px] border border-[#E5E7EB] hover:border-[#B4D0FB] bg-white hover:bg-[#D2E3FC] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(15,23,42,0.3)] transition-all duration-300"
                >
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
                    {service.tags.map((tag: string) => (
                      <span
                        key={tag}
                        className="text-xs font-mono px-2.5 py-1 rounded-md text-[#64748B] bg-slate-900/5 border border-slate-900/10 group-hover:text-[#2563EB] group-hover:bg-white group-hover:border-[#B4D0FB] transition-colors duration-300"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>

                  {/* CTA */}
                  <div className="relative z-10 mt-auto pt-4 border-t border-[#E5E7EB] transition-colors duration-300 flex">
                    <span
                      className="inline-flex items-center gap-1.5 px-4.5 py-2 rounded-xl text-sm font-bold bg-[#F3F7FF] text-[#2563EB] border border-[#DCEBFF] group-hover:bg-[#2563EB] group-hover:border-[#2563EB] group-hover:text-white transition-all duration-300 shadow-sm"
                    >
                      Get Details
                      <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </div>

        {/* Request Proposal Section */}
        <section className="mt-20 max-w-5xl mx-auto relative">
          <div className="relative p-12 md:p-16 rounded-[2rem] bg-[#D2E3FC] border border-[#B4D0FB] text-center space-y-6 overflow-hidden shadow-sm">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full inline-flex">Custom Solutions</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight max-w-2xl mx-auto">
              Need a custom solution?
            </h2>
            <p className="text-sm text-[#374151] max-w-md mx-auto font-light leading-relaxed">
              Every project is unique. Let&apos;s talk about what you need to build your digital ecosystem.
            </p>

            <div className="pt-4">
              <Link
                href="/request-proposal"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold uppercase tracking-wider transition-all duration-300 shadow-sm text-sm"
              >
                <span>Request Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

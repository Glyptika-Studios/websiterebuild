"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, animate, useInView } from "framer-motion";
import {
  ArrowRight,
  CheckCircle2,
  Minus,
  Plus,
  Play,
  Sparkles,
  Eye,
  ChevronRight,
  Cpu,
  Users,
  Zap,
  Layers,
  LucideIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";

// ==========================================
// DATA TYPES
// ==========================================
interface MediaItem {
  id: string;
  title: string;
  category: string;
  imageUrl: string;
  description: string;
}

interface PricingTier {
  name: string;
  price: string;
  jobsPerMonth: number;
  extraJob: string;
  admins: number;
  screens: number;
  maxAdmins: number;
  maxScreens: number;
  extraAdminCost: string;
  extraScreenCost: string;
  furnitureUploads: number;
  extraFurnitureCost: string;
  features: string[];
}

interface ModuleDetails {
  name: string;
  tagline: string;
  shortTagline: string;
  desc: string;
  bestFor: string;
  icon: LucideIcon;
  capabilities: string[];
  specs: {
    complexity: string;
    engine: string;
    throughput: string;
  };
  pricing: PricingTier[];
}

// ==========================================
// MOCK DATA
// ==========================================
const MOCK_GALLERY: MediaItem[] = [
  {
    id: "g-1",
    title: "Neo-Futurism Suburban Villa",
    category: "Residential Architecture",
    imageUrl: "https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80",
    description: "Full WebGL model generated in 120 seconds from flat 2D blueprint layout, with procedural material mapping."
  },
  {
    id: "g-2",
    title: "Logistics Command Center",
    category: "Industrial / Defense Space",
    imageUrl: "https://images.unsplash.com/photo-1451187580459-43490279c0fa?w=800&auto=format&fit=crop&q=80",
    description: "Highly secure spatial mockup engineered for tactical training simulations, mapped to standard warehouse CAD."
  },
  {
    id: "g-3",
    title: "Commercial Retail Pavilion",
    category: "Brand Exhibition",
    imageUrl: "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=800&auto=format&fit=crop&q=80",
    description: "Interactive virtual shopping setup showing dynamic asset lighting and custom product stand layouts."
  }
];

const MODULE_DETAILS: Record<string, ModuleDetails> = {
  neo: {
    name: "XPLOR NEO",
    tagline: "2D to 3D + Real-Time 3D Editing",
    shortTagline: "Instant 2D to 3D Synthesis",
    desc: "Upload a 2D floor plan and instantly convert it into a 3D model. Modify dimensions, lighting, textures, and furniture layouts—all in real time. Export your 3D model when ready.",
    bestFor: "Builders • Interior Designers • Modular Furniture Brands",
    icon: Cpu,
    capabilities: [
      "Procedural extrusion of wall systems",
      "Automatic door and window mapping",
      "Dynamic browser viewport rendering",
      "Standard glTF/FBX format exports"
    ],
    specs: {
      complexity: "Standard to High",
      engine: "Three.js / WebGL",
      throughput: "Up to 500k polygons"
    },
    pricing: [
      {
        name: "Neo Lite",
        price: "₹3,499",
        jobsPerMonth: 299,
        extraJob: "₹49",
        admins: 1,
        screens: 2,
        maxAdmins: 1,
        maxScreens: 2,
        extraAdminCost: "—",
        extraScreenCost: "—",
        furnitureUploads: 50,
        extraFurnitureCost: "₹25",
        features: ["Standard WebGL compiler", "Procedural Wall Extrusion", "2D Floor Plan Import", "Single admin seat"]
      },
      {
        name: "Neo",
        price: "₹9,999",
        jobsPerMonth: 999,
        extraJob: "₹44",
        admins: 1,
        screens: 4,
        maxAdmins: 2,
        maxScreens: 8,
        extraAdminCost: "₹3,499",
        extraScreenCost: "₹1,999",
        furnitureUploads: 200,
        extraFurnitureCost: "₹25",
        features: ["High-fidelity WebGL compiler", "Custom Material Library", "Multiple file format export", "Priority processing queue"]
      },
      {
        name: "Neo Pro",
        price: "₹17,999",
        jobsPerMonth: 1999,
        extraJob: "₹41",
        admins: 2,
        screens: 8,
        maxAdmins: 4,
        maxScreens: 14,
        extraAdminCost: "₹3,149",
        extraScreenCost: "₹1,749",
        furnitureUploads: 450,
        extraFurnitureCost: "₹21",
        features: ["Advanced procedurals", "Unlimited custom assets", "Dedicated API throughput", "24/7 Priority support"]
      }
    ]
  },
  adorno: {
    name: "XPLOR ADORNO",
    tagline: "2D to VR Walkthrough",
    shortTagline: "VR Walkthrough Compilation",
    desc: "Convert a 2D floor plan directly into a high-quality VR walkthrough with predefined lighting, materials, and furniture templates. Ideal for quick client demos.",
    bestFor: "Real Estate Developers • Marketing Teams",
    icon: Eye,
    capabilities: [
      "Teleportation-based navigation setup",
      "Bespoke high-fidelity lighting bakes",
      "Custom asset placing interface",
      "Oculus/HTC native integrations"
    ],
    specs: {
      complexity: "Ultra-High Fidelity",
      engine: "Unreal / Unity WebXR",
      throughput: "Up to 3M polygons"
    },
    pricing: [
      {
        name: "Adorno Lite",
        price: "₹2,499",
        jobsPerMonth: 149,
        extraJob: "₹69",
        admins: 1,
        screens: 1,
        maxAdmins: 1,
        maxScreens: 1,
        extraAdminCost: "—",
        extraScreenCost: "—",
        furnitureUploads: 100,
        extraFurnitureCost: "₹30",
        features: ["VR walkthrough compiler", "Standard lighting bake", "Oculus Go/Quest support", "Single display node"]
      },
      {
        name: "Adorno",
        price: "₹6,499",
        jobsPerMonth: 499,
        extraJob: "₹59",
        admins: 1,
        screens: 2,
        maxAdmins: 2,
        maxScreens: 4,
        extraAdminCost: "₹3,999",
        extraScreenCost: "₹2,199",
        furnitureUploads: 300,
        extraFurnitureCost: "₹30",
        features: ["Bespoke lighting bakes", "Asset placement editor", "Quest/SteamVR support", "Up to 4 display nodes"]
      },
      {
        name: "Adorno Pro",
        price: "₹14,999",
        jobsPerMonth: 1599,
        extraJob: "₹49",
        admins: 1,
        screens: 4,
        maxAdmins: 2,
        maxScreens: 8,
        extraAdminCost: "₹3,749",
        extraScreenCost: "₹1,999",
        furnitureUploads: 600,
        extraFurnitureCost: "₹25",
        features: ["Ultra-High Fidelity bakes", "Dynamic material swapping", "Dual admin seats", "Up to 8 display nodes"]
      }
    ]
  },
  apice: {
    name: "XPLOR APICE",
    tagline: "Full Stack (2D → 3D → VR)",
    shortTagline: "Unified CAD ➔ 3D ➔ VR Pipeline",
    desc: "The complete workflow. Convert 2D to 3D, edit in real time, then publish as an immersive VR experience. Maximum creative control + maximum speed.",
    bestFor: "Architects • Design Studios • High-End Brands",
    icon: Sparkles,
    capabilities: [
      "Multi-user real-time VR editing",
      "Custom legacy API integrations",
      "Procedural texture library syncing",
      "Air-gapped on-premise deployments"
    ],
    specs: {
      complexity: "Unlimited Scalability",
      engine: "Proprietary WebXR Grid",
      throughput: "Multi-million polygon streams"
    },
    pricing: [
      {
        name: "Apice Lite",
        price: "₹4,499",
        jobsPerMonth: 299,
        extraJob: "₹74",
        admins: 1,
        screens: 2,
        maxAdmins: 1,
        maxScreens: 1,
        extraAdminCost: "—",
        extraScreenCost: "—",
        furnitureUploads: 100,
        extraFurnitureCost: "₹30",
        features: ["Unified pipeline access", "Basic real-time edit", "2 admin seats", "Email & Chat support"]
      },
      {
        name: "Apice",
        price: "₹11,499",
        jobsPerMonth: 999,
        extraJob: "₹64",
        admins: 1,
        screens: 4,
        maxAdmins: 2,
        maxScreens: 6,
        extraAdminCost: "₹3,999",
        extraScreenCost: "₹2,199",
        furnitureUploads: 300,
        extraFurnitureCost: "₹30",
        features: ["Multi-user collaboration", "Procedural texture sync", "4 display node streams", "Priority API access"]
      },
      {
        name: "Apice Pro",
        price: "₹20,999",
        jobsPerMonth: 1999,
        extraJob: "₹54",
        admins: 2,
        screens: 6,
        maxAdmins: 4,
        maxScreens: 10,
        extraAdminCost: "₹3,749",
        extraScreenCost: "₹1,999",
        furnitureUploads: 600,
        extraFurnitureCost: "₹25",
        features: ["Enterprise collaboration pipeline", "Dedicated asset server", "10 display node streams", "Dedicated support SLA"]
      },
      {
        name: "Apice Enterprise",
        price: "Free Trial",
        jobsPerMonth: 99,
        extraJob: "₹49",
        admins: 1,
        screens: 1,
        maxAdmins: 1,
        maxScreens: 1,
        extraAdminCost: "—",
        extraScreenCost: "—",
        furnitureUploads: 90,
        extraFurnitureCost: "₹49",
        features: ["Air-gapped on-premise containers", "Custom API connectors", "Uncapped throughput options", "Dedicated enterprise engineer"]
      }
    ]
  }
};

const FAQS = [
  {
    question: "How does the automated 2D-to-3D conversion work?",
    answer: "XPLOR uses pattern recognition algorithms to read standard CAD vector maps (.DWG/.DXF) or PDF lines. It identifies bounding walls, openings, and structural spans, extruding them into structured mesh objects automatically."
  },
  {
    question: "Can we integrate custom furniture databases into the pipeline?",
    answer: "Yes. With the XPLOR APICE tier, you can link your custom asset repository, allowing the layout tool to automatically map block symbols to actual high-fidelity 3D models from your catalog."
  },
  {
    question: "Is there support for secure, offline defense deployments?",
    answer: "Absolutely. XPLOR software setups can be packaged into local Docker containers, running in air-gapped environments without any external internet telemetry requirements."
  }
];

function AnimatedCounter({ value, decimals = 0, suffix = "" }: { value: number; decimals?: number; suffix?: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => latest.toFixed(decimals));
  const ref = useRef<HTMLSpanElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-50px" });

  useEffect(() => {
    if (isInView) {
      const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
      return () => controls.stop();
    }
  }, [isInView, count, value]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest + suffix;
      }
    });
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function XplorPage() {
  const [activeMedia, setActiveMedia] = useState<MediaItem>(MOCK_GALLERY[0]);
  const [activeModuleTab, setActiveModuleTab] = useState<"" | "neo" | "adorno" | "apice">("neo");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  return (
    <main className="min-h-screen text-[#111827] font-sans selection:bg-[#2563EB]/30 overflow-x-hidden relative bg-white">
      <div className="relative z-10">
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-[#E5E7EB]">
          {/* Grid Background */}
          <div
            className="absolute inset-0 w-full h-full z-0 pointer-events-none"
            style={{
              backgroundImage: `url('/bgimage.png')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
          {/* Dot Matrix Overlay */}
          <div 
            className="absolute inset-0 w-full h-full z-0 pointer-events-none" 
            style={{
              backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)",
              backgroundSize: "32px 32px",
              opacity: 0.6
            }}
          />
          <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
            {/* Tech Badge */}
            {/* <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-8"
            >
              <Sparkles className="w-3.5 h-3.5 text-[#2563EB] animate-pulse" />
              Flagship Spatial Engine
            </motion.div> */}

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#111827] tracking-tight leading-tight mb-6 max-w-5xl"
            >
              Transform CAD blueprints <br />
              into <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-[#8B5CF6] to-[#EC4899] pb-1 block">Immersive Reality.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-[#6B7280] max-w-4xl leading-relaxed mb-12 font-normal"
            >
              Democratizing & automating spatial visualization. Convert static 2D floor plans into fully interactive 3D WebGL scenes and standalone VR walkthroughs instantly.
            </motion.p>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/request-proposal"
                className="px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-xl font-bold transition-all duration-200 shadow-[0_10px_24px_rgba(37,99,235,0.20)] hover:-translate-y-0.5 flex items-center gap-2 text-base"
              >
                <span>Book a Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <a
                href="#modules"
                className="px-8 py-4 bg-white hover:bg-[#F3F7FF] text-[#2563EB] rounded-xl font-bold border border-[#2563EB] transition-all duration-200 text-base hover:-translate-y-0.5"
              >
                Explore Modules
              </a>
            </motion.div>
          </div>

          {/* Interactive Scroll Down Prompt */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-sm text-[#6B7280] z-10 pointer-events-none select-none">
            <span className="font-bold tracking-widest uppercase text-xs">Scroll to explore</span>
            <div className="w-5 h-8 rounded-full border border-[#E5E7EB] flex justify-center p-1">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-1.5 bg-[#2563EB] rounded-full"
              />
            </div>
          </div>
        </section>
        {/* ============================================================
            STATS, WHY CHOOSE, AND SECTORS WRAPPER WITH LIGHT BLUE BG
           ============================================================ */}
        <section className="bg-[#D2E3FC] py-16 relative z-20 border-y border-[#DCEBFF]">
          {/* 2. HIGH-IMPACT METRICS, STATS, & WHY CHOOSE COMBINED */}
          <div className="py-6 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-white/50 p-8 md:p-12" style={{ background: "rgba(255,255,255,0.75)", boxShadow: "0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
                
                {/* Heading */}
                <div className="text-center mb-12 relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                    Why Choose XPLOR
                  </h3>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 text-center mb-12 border-b border-gray-200/60 pb-12">
                  {/* Stat 1 */}
                  <div className="flex flex-col items-center justify-center space-y-2 group">
                    <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] tracking-tight transition-all duration-300">
                      <AnimatedCounter value={99} decimals={0} suffix="%" />
                    </div>
                    <div className="text-xs md:text-sm text-[#6B7280] font-bold uppercase tracking-widest">
                      Faster Synthesis
                    </div>
                  </div>

                  {/* Stat 2 */}
                  <div className="flex flex-col items-center justify-center space-y-2 group">
                    <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] tracking-tight transition-all duration-300">
                      <AnimatedCounter value={99.98} decimals={2} suffix="%" />
                    </div>
                    <div className="text-xs md:text-sm text-[#6B7280] font-bold uppercase tracking-widest">
                      Cost Reductions
                    </div>
                  </div>

                  {/* Stat 3 */}
                  <div className="flex flex-col items-center justify-center space-y-2 group">
                    <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] tracking-tight transition-all duration-300">
                      <AnimatedCounter value={99.9} decimals={1} suffix="%" />
                    </div>
                    <div className="text-xs md:text-sm text-[#6B7280] font-bold uppercase tracking-widest">
                      CAD Precision
                    </div>
                  </div>
                </div>

                {/* 4 Cards grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                  {/* Prop 1 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex flex-col items-start space-y-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] border border-[#F5C6C2] flex items-center justify-center text-[#C5221F] font-bold">
                      <Zap className="w-5 h-5 animate-pulse" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#C5221F] transition-colors">99% Faster Visualization</h4>
                      <p className="text-xs text-[#6B7280] mt-1">From weeks to minutes.</p>
                    </div>
                  </div>

                  {/* Prop 2 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex flex-col items-start space-y-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] border border-[#F5C6C2] flex items-center justify-center text-[#C5221F] font-bold">
                      <Users className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#C5221F] transition-colors">No Technical Expertise</h4>
                      <p className="text-xs text-[#6B7280] mt-1">Zero learning curve.</p>
                    </div>
                  </div>

                  {/* Prop 3 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex flex-col items-start space-y-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] border border-[#F5C6C2] flex items-center justify-center text-[#C5221F] font-bold">
                      <Layers className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#C5221F] transition-colors">One Unified Workflow</h4>
                      <p className="text-xs text-[#6B7280] mt-1">No switching between tools.</p>
                    </div>
                  </div>

                  {/* Prop 4 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex flex-col items-start space-y-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#FCE8E6] border border-[#F5C6C2] flex items-center justify-center text-[#C5221F] font-bold">
                      <CheckCircle2 className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#C5221F] transition-colors">Accurate Communication</h4>
                      <p className="text-xs text-[#6B7280] mt-1">True-to-plan & real-time collaboration.</p>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          </div>

          {/* ============================================================
            2c. WHO USES XPLOR SECTION
           ============================================================ */}
          <div className="py-6 relative z-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="rounded-2xl border border-white/50 p-8 md:p-12" style={{ background: "rgba(255,255,255,0.75)", boxShadow: "0 8px 32px rgba(13,101,45,0.04), inset 0 1px 0 rgba(255,255,255,0.9)" }}>

                <div className="text-center mb-10 relative z-10">
                  <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                    Built for Industry Professionals
                  </h3>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">

                  {/* Sector 1 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex items-center space-x-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EA] border border-[#CEEAD6] flex items-center justify-center text-[#0D652D] shrink-0 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#0D652D] transition-colors uppercase tracking-wider">Architects & Interior Designers</span>
                  </div>

                  {/* Sector 2 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex items-center space-x-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EA] border border-[#CEEAD6] flex items-center justify-center text-[#0D652D] shrink-0 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#0D652D] transition-colors uppercase tracking-wider">Real Estate Developers & Contractors</span>
                  </div>

                  {/* Sector 3 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex items-center space-x-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EA] border border-[#CEEAD6] flex items-center justify-center text-[#0D652D] shrink-0 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#0D652D] transition-colors uppercase tracking-wider">Furniture & Retail Brands</span>
                  </div>

                </div>

                {/* Second row */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-6 max-w-4xl mx-auto">

                  {/* Sector 4 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex items-center space-x-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EA] border border-[#CEEAD6] flex items-center justify-center text-[#0D652D] shrink-0 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#0D652D] transition-colors uppercase tracking-wider">Event & Experience Designers</span>
                  </div>

                  {/* Sector 5 */}
                  <div className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex items-center space-x-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[#E6F4EA] border border-[#CEEAD6] flex items-center justify-center text-[#0D652D] shrink-0 font-bold">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#0D652D] transition-colors uppercase tracking-wider">Defence & Industrial VR Training Teams</span>
                  </div>

                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ============================================================
            3. INTERACTIVE VISUAL SHOWCASE MEDIA GALLERY
           ============================================================ */}
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Visual Showcase</span>
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-2 mb-4">See XPLOR in Action</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">Explore high-fidelity interactive spaces built automatically using the XPLOR synthesis pipeline.</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Column: Interactive Selector List */}
            <div className="lg:col-span-4 flex flex-col gap-4 justify-center">
              {MOCK_GALLERY.map((item) => {
                const isActive = item.id === activeMedia.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMedia(item)}
                    className={`p-6 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col ${isActive
                      ? 'bg-[#F3F7FF] border-[#2563EB]/30 shadow-sm'
                      : 'bg-white border-[#E5E7EB] hover:border-[#BDC1C6] hover:bg-[#F1F3F4]'
                      }`}
                  >
                    <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest mb-1.5">{item.category}</span>
                    <span className="text-lg font-bold text-[#111827] leading-tight mb-2">{item.title}</span>
                    <span className="text-xs text-[#6B7280] line-clamp-2 leading-relaxed">{item.description}</span>
                  </button>
                )
              })}
            </div>

            {/* Right Column: Display Canvas Wrapper */}
            <div className="lg:col-span-8">
              <AnimatePresence mode="wait">
                <motion.div
                  key={activeMedia.id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.5 }}
                  className="h-full rounded-2xl bg-white border border-[#E5E7EB] p-6 flex flex-col overflow-hidden shadow-sm"
                >
                  {/* Canvas Render Frame */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#E5E7EB] group">
                    <Image
                      src={activeMedia.imageUrl}
                      alt={activeMedia.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    {/* Live Interaction HUD overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-6">
                      <div className="flex items-center gap-3 bg-white/90 backdrop-blur-md px-4 py-2.5 rounded-xl border border-[#E5E7EB]">
                        <Play className="w-4 h-4 text-[#2563EB] fill-[#2563EB] animate-pulse" />
                        <span className="text-xs text-[#111827] font-bold tracking-wide uppercase">Viewport Interactive Preview</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#111827] mb-2">{activeMedia.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed font-light">{activeMedia.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* Draggable Before/After Blueprint-to-3D Synthesis Sandbox */}
        <BeforeAfterSlider />


        {/* ============================================================
            5. PRICING & MODULES SECTION
           ============================================================ */}
        <section id="modules" className="py-32 border-t border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB]">Plans & Pricing</span>
              <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-2 mb-4">Choose Your XPLOR Module</h2>
              <p className="text-[#6B7280] max-w-2xl mx-auto">Three specialized modules, each with flexible tiers. Select a module below to view detailed pricing.</p>
            </div>

            {/* Horizontal Module Cards Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
              {(["neo", "adorno", "apice"] as const).map((moduleKey) => {
                const mod = MODULE_DETAILS[moduleKey];
                const ModIcon = mod.icon;
                const isActive = activeModuleTab === moduleKey;
                const startingPrice = mod.pricing[0]?.price ?? "";

                return (
                  <button
                    key={moduleKey}
                    onClick={() => setActiveModuleTab(isActive ? "" : moduleKey)}
                    className={`p-6 rounded-2xl text-left border transition-all duration-300 relative overflow-hidden flex flex-col justify-between group h-full ${
                      isActive
                        ? "bg-[#F3F7FF] border-[#2563EB]/40 shadow-sm"
                        : "bg-white border-[#E5E7EB] hover:border-[#BDC1C6] hover:bg-[#F1F3F4]/20 hover:shadow-sm"
                    }`}
                  >
                    <div>
                      <div className="flex items-center gap-3 mb-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all duration-300 ${
                          isActive ? "bg-[#2563EB] text-white" : "bg-[#F3F7FF] text-[#2563EB] border border-[#DCEBFF]"
                        }`}>
                          <ModIcon className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-[#111827]">{mod.name}</h3>
                      </div>
                      
                      <div className="mb-6">
                        <p className="text-xs font-semibold text-[#6B7280] uppercase tracking-wider mb-2">{mod.shortTagline}</p>
                        <p className="text-xs text-[#6B7280] leading-relaxed line-clamp-2">Best for: {mod.bestFor}</p>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-[#E5E7EB] w-full flex justify-between items-end">
                      <div>
                        <span className="text-[9px] uppercase tracking-wider text-[#6B7280] font-semibold block">Starting at</span>
                        <span className="text-base font-bold text-[#2563EB]">{startingPrice}<span className="text-xs text-[#6B7280] font-normal">/mo</span></span>
                      </div>
                      <div className={`text-xs font-bold uppercase tracking-wider transition-colors duration-205 flex items-center gap-1 ${
                        isActive ? "text-[#2563EB]" : "text-[#6B7280] group-hover:text-[#2563EB]"
                      }`}>
                        {isActive ? "Viewing details" : "Explore plans"}
                        <svg className={`w-3.5 h-3.5 transition-transform duration-300 ${isActive ? "rotate-90 text-[#2563EB]" : "group-hover:translate-x-0.5"}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M9 5l7 7-7 7" />
                        </svg>
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Expanded Pricing details for the active module */}
            <AnimatePresence mode="wait">
              {activeModuleTab && (() => {
                const activeMod = MODULE_DETAILS[activeModuleTab];
                return (
                  <motion.div
                    key={activeModuleTab}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.35 }}
                    className="mt-12 p-8 sm:p-10 rounded-[2rem] border border-[#E5E7EB] bg-white shadow-[0_12px_48px_rgba(37,99,235,0.04)]"
                  >
                    <div className="mb-8 border-b border-[#E5E7EB] pb-6">
                      <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-2">
                        <h3 className="text-2xl font-bold text-[#111827]">{activeMod.name} Pricing Details</h3>
                        <span className="text-xs font-semibold text-[#6B7280] uppercase tracking-widest">— {activeMod.tagline}</span>
                      </div>
                      <p className="text-sm text-[#6B7280] leading-relaxed max-w-4xl">{activeMod.desc}</p>
                    </div>

                    {/* Pricing Tiers Grid */}
                    <div className={`grid grid-cols-1 md:grid-cols-${activeMod.pricing.length > 3 ? '4' : '3'} gap-6`}>
                      {activeMod.pricing.map((tier, idx) => (
                        <div
                          key={idx}
                          className="rounded-2xl bg-[#F9FAFB]/50 border border-[#E5E7EB] overflow-hidden hover:-translate-y-1 hover:border-[#2563EB]/40 hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex flex-col justify-between bg-white"
                        >
                          {/* Tier Header */}
                          <div className="px-6 pt-6 pb-4 border-b border-[#E5E7EB]">
                            <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-widest block mb-1">{activeMod.name}</span>
                            <h5 className="text-base font-bold text-[#111827] mb-3">{tier.name}</h5>
                            <div className="flex items-baseline gap-1">
                              <span className="text-2xl font-bold text-[#111827]">{tier.price}</span>
                              {tier.price !== "Free Trial" && (
                                <span className="text-xs text-[#6B7280]">/month</span>
                              )}
                            </div>
                          </div>

                          {/* Specs Table */}
                          <div className="px-6 py-5 flex-1">
                            <div className="space-y-2 text-[11px] mb-6">
                              {[
                                ["Jobs/month", tier.jobsPerMonth.toLocaleString()],
                                ["Extra Job", tier.extraJob],
                                ["Admins", tier.admins.toString()],
                                ["Screens", tier.screens.toString()],
                                ["Max Admins", tier.maxAdmins.toString()],
                                ["Max Screens", tier.maxScreens.toString()],
                                ["Extra Admin Cost", tier.extraAdminCost],
                                ["Extra Screen Cost", tier.extraScreenCost],
                                ["Furniture Uploads", tier.furnitureUploads.toString()],
                                ["Extra Furniture Cost", tier.extraFurnitureCost],
                              ].map(([label, val], rIdx) => (
                                <div key={rIdx} className="flex justify-between items-center py-1 border-b border-[#F3F4F6] last:border-b-0">
                                  <span className="text-[#6B7280] font-medium">{label}</span>
                                  <span className="text-[#111827] font-bold font-mono">{val}</span>
                                </div>
                              ))}
                            </div>

                            {/* Features list */}
                            <div className="pt-4 border-t border-[#E5E7EB]">
                              <span className="text-[9px] font-bold text-[#6B7280] uppercase tracking-widest block mb-2.5">Highlights</span>
                              <ul className="space-y-2">
                                {tier.features.map((feat, fIdx) => (
                                  <li key={fIdx} className="flex items-start gap-2 text-[11px] text-[#6B7280]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-[#2563EB] mt-0.5 shrink-0" />
                                    <span>{feat}</span>
                                  </li>
                                ))}
                              </ul>
                            </div>
                          </div>

                          {/* CTA button */}
                          <div className="px-6 pb-6">
                            <Link
                              href="/request-proposal"
                              className="w-full py-3 rounded-xl text-center text-xs font-bold uppercase tracking-wider text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_6px_20px_rgba(37,99,235,0.12)] hover:shadow-[0_8px_24px_rgba(37,99,235,0.22)] hover:-translate-y-0.5 transition-all duration-250 block"
                            >
                              Choose Plan
                            </Link>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Request Demo at bottom */}
                    <div className="mt-10 pt-6 border-t border-[#E5E7EB] flex justify-center">
                      <Link
                        href="/request-proposal"
                        className="inline-flex items-center gap-2 text-sm font-bold uppercase tracking-wider text-[#2563EB] hover:text-[#1765CC] transition-colors group"
                      >
                        Request a {activeMod.name} demo
                        <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </Link>
                    </div>
                  </motion.div>
                );
              })()}
            </AnimatePresence>
          </div>
        </section>


        {/* ============================================================
            7. FAQ SECTION
           ============================================================ */}
        <section className="py-32 border-t border-[#E5E7EB]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-[#111827]">FAQ</h2>
            </div>

            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div
                  key={idx}
                  className={`border ${openFaq === idx ? 'border-[#2563EB]/30 bg-[#F3F7FF]/20' : 'border-[#E5E7EB] bg-white'} rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-base font-semibold text-[#111827]">{faq.question}</span>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-[#2563EB] shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#6B7280] shrink-0" />
                    )}
                  </button>
                  <div
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-sm text-[#6B7280] leading-relaxed">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ============================================================
            8. FINAL CALL TO ACTION
           ============================================================ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-20 relative">
          <div className="relative p-12 md:p-16 rounded-[2rem] bg-[#D2E3FC] border border-[#B4D0FB] text-center space-y-6 overflow-hidden shadow-sm">

            <span className="text-xs font-bold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full inline-flex">Next-Gen AEC Synthesis</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-[#111827] leading-tight max-w-2xl mx-auto">
              Ready to transform your blueprint workflows?
            </h2>
            <p className="text-sm text-[#374151] max-w-md mx-auto font-light leading-relaxed">
              Create a proposal layout configuration to integrate XPLOR with your company tools.
            </p>

            <div className="pt-4">
              <Link
                href="/request-proposal"
                className="inline-flex items-center gap-2 px-8 py-4 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-bold uppercase tracking-wider transition-all duration-300 shadow-sm text-sm"
              >
                <span>Request Custom Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Box, 
  ArrowRight, 
  CheckCircle2, 
  Minus, 
  Plus, 
  Play, 
  Layers, 
  Cpu, 
  Sparkles, 
  Eye, 
  Sliders, 
  ChevronRight, 
  Users, 
  FolderGit2, 
  Hourglass,
  BadgeAlert,
  Zap,
  LucideIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import BeforeAfterSlider from "@/components/public/BeforeAfterSlider";

// ==========================================
// INTERACTIVE MOCK DATA TYPES
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
  jobs: string;
  extraJob: string;
  admins?: string;
  screens?: string;
  features: string[];
}

interface ModuleDetails {
  name: string;
  tagline: string;
  desc: string;
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
// DUMMY ASSETS FOR CMS INTEGRATION
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
    tagline: "Instant 2D to 3D Synthesis",
    desc: "Our automated compiler that takes flat floor plans (.DWG, .DXF, or PDF) and renders a fully interactive 3D WebGL model within minutes.",
    icon: Cpu,
    capabilities: [
      "Procedural extrusion of wall systems",
      "Automatic door and window window mapping",
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
        jobs: "299 Jobs",
        extraJob: "₹49",
        features: ["Standard WebGL compiler", "Procedural Wall Extrusion", "2D Floor Plan Import", "Single admin seat"]
      },
      {
        name: "Neo Standard",
        price: "₹9,999",
        jobs: "999 Jobs",
        extraJob: "₹44",
        features: ["High-fidelity WebGL compiler", "Custom Material Library", "Multiple file format export", "Priority processing queue"]
      },
      {
        name: "Neo Pro",
        price: "₹17,999",
        jobs: "1,999 Jobs",
        extraJob: "₹41",
        features: ["Advanced procedurals", "Unlimited custom assets", "Dedicated API throughput", "24/7 Priority support"]
      }
    ]
  },
  adorno: {
    name: "XPLOR ADORNO",
    tagline: "VR Walkthrough Compilation",
    desc: "Converts configured 3D models into immersive VR walkthroughs compatible with mobile VR, Oculus Quest, and steam headsets.",
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
        jobs: "149 Jobs",
        extraJob: "₹69",
        admins: "1 Admin",
        screens: "1 Screen",
        features: ["VR walkthrough compiler", "Standard lighting bake", "Oculus Go/Quest support", "Single display node"]
      },
      {
        name: "Adorno Standard",
        price: "₹6,499",
        jobs: "499 Jobs",
        extraJob: "₹59",
        admins: "1 Admin",
        screens: "2 Screens (Max 4)",
        features: ["Bespoke lighting bakes", "Asset placement editor", "Quest/SteamVR support", "Up to 4 display nodes"]
      },
      {
        name: "Adorno Pro",
        price: "₹14,999",
        jobs: "1,599 Jobs",
        extraJob: "₹49",
        admins: "1 Admin (Max 2)",
        screens: "4 Screens (Max 8)",
        features: ["Ultra-High Fidelity bakes", "Dynamic material swapping", "Dual admin seats", "Up to 8 display nodes"]
      }
    ]
  },
  apice: {
    name: "XPLOR APICE",
    tagline: "Unified CAD ➔ 3D ➔ VR Pipeline",
    desc: "Our enterprise package bundling real-time collaboration channels, dynamic asset pipelines, and custom API connectors under one roof.",
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
        jobs: "299 Jobs",
        extraJob: "₹74",
        admins: "1 Admin",
        screens: "2 Screens",
        features: ["Unified pipeline access", "Basic real-time edit", "2 admin seats", "Email & Chat support"]
      },
      {
        name: "Apice Standard",
        price: "₹11,499",
        jobs: "999 Jobs",
        extraJob: "₹64",
        admins: "1 Admin (Max 2)",
        screens: "4 Screens (Max 6)",
        features: ["Multi-user collaboration", "Procedural texture sync", "4 display node streams", "Priority API access"]
      },
      {
        name: "Apice Pro",
        price: "₹20,999",
        jobs: "1,999 Jobs",
        extraJob: "₹54",
        admins: "2 Admins (Max 4)",
        screens: "6 Screens (Max 10)",
        features: ["Enterprise collaboration pipeline", "Dedicated asset server", "10 display node streams", "Dedicated support SLA"]
      },
      {
        name: "Apice Enterprise",
        price: "Free Trial",
        jobs: "99 Jobs",
        extraJob: "₹49",
        admins: "1 Admin",
        screens: "1 Screen",
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

// ==========================================
// PROCEDURAL 3D WIREFRAME MESH ANIMATION
// ==========================================
function InteractivePreviewCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationId: number;
    let width = canvas.width = canvas.offsetWidth || 600;
    let height = canvas.height = canvas.offsetHeight || 337;

    const angleX = 0.005;
    const angleY = 0.008;

    const points: {x: number, y: number, z: number}[] = [];
    const size = 120;
    const divisions = 8;
    const step = (size * 2) / divisions;

    for (let x = -size; x <= size; x += step) {
      for (let z = -size; z <= size; z += step) {
        points.push({ x, y: 0, z });
      }
    }

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth || 600;
      height = canvas.height = canvas.offsetHeight || 337;
    };
    window.addEventListener("resize", handleResize);

    const project = (x: number, y: number, z: number) => {
      const distance = 400;
      const scale = distance / (distance + z);
      return {
        x: (width / 2) + (x * scale),
        y: (height / 2) + (y * scale)
      };
    };

    const draw = () => {
      ctx.clearRect(0, 0, width, height);

      const cosX = Math.cos(angleX);
      const sinX = Math.sin(angleX);
      const cosY = Math.cos(angleY);
      const sinY = Math.sin(angleY);

      points.forEach((p) => {
        const x = p.x * cosY - p.z * sinY;
        let z = p.z * cosY + p.x * sinY;
        const y = p.y * cosX - z * sinX;
        z = z * cosX + p.y * sinX;

        const dist = Math.sqrt(p.x * p.x + p.z * p.z);
        const time = Date.now() * 0.003;
        const wave = Math.sin(dist * 0.04 - time) * 12;

        p.x = x;
        p.y = wave;
        p.z = z;
      });

      ctx.strokeStyle = "rgba(59, 130, 246, 0.35)";
      ctx.lineWidth = 1;

      const columns = divisions + 1;
      for (let i = 0; i < columns; i++) {
        ctx.beginPath();
        for (let j = 0; j < columns; j++) {
          const pt = project(points[i * columns + j].x, points[i * columns + j].y, points[i * columns + j].z);
          if (j === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      for (let j = 0; j < columns; j++) {
        ctx.beginPath();
        for (let i = 0; i < columns; i++) {
          const pt = project(points[i * columns + j].x, points[i * columns + j].y, points[i * columns + j].z);
          if (i === 0) ctx.moveTo(pt.x, pt.y);
          else ctx.lineTo(pt.x, pt.y);
        }
        ctx.stroke();
      }

      ctx.fillStyle = "rgba(34, 211, 238, 0.8)";
      points.forEach((p) => {
        const pt = project(p.x, p.y, p.z);
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 2, 0, Math.PI * 2);
        ctx.fill();
      });

      animationId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
    };
  }, []);

  return (
    <canvas 
      ref={canvasRef} 
      className="absolute inset-0 w-full h-full pointer-events-none mix-blend-screen opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10" 
    />
  );
}

export default function XplorPage() {
  // Page States
  const [activeMedia, setActiveMedia] = useState<MediaItem>(MOCK_GALLERY[0]);
  const [activeModuleTab, setActiveModuleTab] = useState<"neo" | "adorno" | "apice">("neo");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Interactive Calculator States
  const [calcArea, setCalcArea] = useState<number>(3500);
  const [calcFloors, setCalcFloors] = useState<number>(1);

  // Calculator logic
  const estTimeMinutes = Math.max(1, Math.round((calcArea * 0.02) + (calcFloors * 15)));
  const estSavings = Math.round((calcArea * 0.85) + (calcFloors * 1200));

  const activeModule = MODULE_DETAILS[activeModuleTab];
  const ModuleIcon = activeModule.icon;

  return (
    <main className="min-h-screen bg-transparent text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-blue-900/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-cyan-900/10 blur-[150px] rounded-full" />
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#0c1322_1px,transparent_1px),linear-gradient(to_bottom,#0c1322_1px,transparent_1px)] bg-[size:5rem_5rem] opacity-30" />
      </div>

      <div className="relative z-10">
        
        {/* ============================================================
            1. DYNAMIC HERO SECTION WITH LOOPS BACKGROUND VIDEO
           ============================================================ */}
        <section className="relative min-h-screen flex items-center justify-center pt-24 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden border-b border-white/5">
          {/* Looping BG Video */}
          <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
            <video 
              src="/reference.mp4" 
              autoPlay 
              loop 
              muted 
              playsInline 
              className="absolute inset-0 w-full h-full object-cover opacity-45 filter grayscale contrast-125"
            />
            {/* Glossy Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-[#02050b]/40 via-[#02050b]/60 to-[#02050b]" />
            <div className="absolute inset-0 bg-gradient-to-r from-[#02050b]/40 via-transparent to-[#02050b]/40" />
          </div>

          <div className="relative z-10 max-w-7xl mx-auto text-center flex flex-col items-center">
            {/* Tech Badge */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/35 text-blue-400 text-xs font-semibold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(59,130,246,0.15)]"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-400 animate-pulse" />
              Flagship Spatial Engine
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-6 font-space max-w-4xl"
            >
              Transform CAD blueprints <br />
              into <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-cyan-300 to-indigo-300">Immersive Reality.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-12 font-light"
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
                className="px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:shadow-[0_0_30px_rgba(37,99,235,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Book a Live Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="#modules"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                Explore Modules
              </a>
            </motion.div>
          </div>

          {/* Interactive Scroll Down Prompt */}
          <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-1.5 text-xs text-slate-500 z-10 pointer-events-none select-none">
            <span className="font-bold tracking-widest uppercase text-[10px] animate-pulse">Scroll to explore</span>
            <div className="w-5 h-8 rounded-full border border-slate-700 flex justify-center p-1">
              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-1 h-1.5 bg-blue-500 rounded-full"
              />
            </div>
          </div>
        </section>


        {/* ============================================================
            2. HIGH-IMPACT METRICS & STATS SECTION
           ============================================================ */}
        <section className="py-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 text-center">
                
                {/* Stat 1 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:text-blue-400 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.4)] transition-all duration-300 font-space">
                    99%
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-350 transition-colors">
                    Faster Synthesis
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:text-cyan-400 group-hover:drop-shadow-[0_0_20px_rgba(34,211,238,0.4)] transition-all duration-300 font-space">
                    99.98%
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-350 transition-colors">
                    Cost Reductions
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_20px_rgba(129,140,248,0.4)] transition-all duration-300 font-space">
                    99.9%
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-350 transition-colors">
                    CAD Precision
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ============================================================
            2b. WHY CHOOSE XPLOR SECTION
           ============================================================ */}
        <section className="py-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="relative rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent" />
              
              <div className="text-center mb-10 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/35 text-fuchsia-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Core Value Propositions
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-space">
                  Why Choose XPLOR
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                
                {/* Prop 1 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-fuchsia-400 transition-colors">99% Faster Visualization</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">From weeks to minutes.</p>
                  </div>
                </div>

                {/* Prop 2 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-fuchsia-400 transition-colors">No Technical Expertise</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">Zero learning curve.</p>
                  </div>
                </div>

                {/* Prop 3 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">
                    <Layers className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-fuchsia-400 transition-colors">One Unified Workflow</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">No switching between tools.</p>
                  </div>
                </div>

                {/* Prop 4 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-fuchsia-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-fuchsia-500/10 border border-fuchsia-500/20 flex items-center justify-center text-fuchsia-400 font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-fuchsia-400 transition-colors">Accurate Communication</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">True-to-plan & real-time collaboration.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>

        {/* ============================================================
            2c. WHO USES XPLOR SECTION
           ============================================================ */}
        <section className="py-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="relative rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="text-center mb-10 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Target Audience
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-space">
                  Built for Industry Professionals
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                
                {/* Sector 1 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Architects & Interior Designers</span>
                </div>

                {/* Sector 2 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Real Estate Developers & Contractors</span>
                </div>

                {/* Sector 3 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Furniture & Retail Brands</span>
                </div>

              </div>

              {/* Second row of 2 centered items on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-6 max-w-4xl mx-auto">
                
                {/* Sector 4 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Event & Experience Designers</span>
                </div>

                {/* Sector 5 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Defence & Industrial VR Training Teams</span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ============================================================
            3. INTERACTIVE VISUAL SHOWCASE MEDIA GALLERY
           ============================================================ */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-500">Visual Showcase</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 font-space">See XPLOR in Action</h2>
            <p className="text-slate-400 max-w-2xl mx-auto">Explore high-fidelity interactive spaces built automatically using the XPLOR synthesis pipeline.</p>
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
                    className={`p-6 rounded-2xl text-left border transition-all relative overflow-hidden flex flex-col ${
                      isActive 
                        ? 'bg-[#0a1128]/70 border-blue-500 shadow-[0_0_20px_rgba(59,130,246,0.1)]' 
                        : 'bg-transparent border-white/5 hover:border-white/15 hover:bg-white/[0.02]'
                    }`}
                  >
                    <span className="text-[10px] font-bold text-blue-400 uppercase tracking-widest mb-1.5">{item.category}</span>
                    <span className="text-lg font-black text-white leading-tight mb-2">{item.title}</span>
                    <span className="text-xs text-slate-400 line-clamp-2 leading-relaxed font-light">{item.description}</span>
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
                  className="h-full rounded-[2rem] bg-slate-900/40 border border-white/10 p-6 flex flex-col overflow-hidden shadow-2xl backdrop-blur-md"
                >
                  {/* Canvas Render Frame */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-white/5 shadow-inner group">
                    <Image 
                      src={activeMedia.imageUrl} 
                      alt={activeMedia.title}
                      fill
                      sizes="(max-width: 1024px) 100vw, 66vw"
                      className="object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                    <InteractivePreviewCanvas />
                    {/* Live Interaction HUD overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-6">
                      <div className="flex items-center gap-3 bg-black/60 backdrop-blur-md px-4 py-2.5 rounded-xl border border-white/10">
                        <Play className="w-4 h-4 text-blue-400 fill-blue-400 animate-pulse" />
                        <span className="text-xs text-slate-200 font-bold font-mono tracking-wide uppercase">Viewport Interactive Preview</span>
                      </div>
                    </div>
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-white mb-2 font-space">{activeMedia.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed font-light">{activeMedia.description}</p>
                  </div>
                </motion.div>
              </AnimatePresence>
            </div>

          </div>
        </section>

        {/* Draggable Before/After Blueprint-to-3D Synthesis Sandbox */}
        <BeforeAfterSlider />

        {/* ============================================================
            4. INTERACTIVE MODULE ESTIMATION CALCULATOR
           ============================================================ */}
        <section className="py-24 border-t border-white/5 bg-[#050b14]/35">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Synthesis Calculator</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 font-space">Interactive Cost & Speed Estimator</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Input your blueprint dimensions to calculate conversion times and cost reductions.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
              
              {/* Sliders Form Card */}
              <div className="p-8 md:p-10 rounded-[2rem] bg-slate-900/50 border border-white/10 backdrop-blur-lg shadow-xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400" />
                <h3 className="text-xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-blue-400" />
                  Dimension Setup
                </h3>

                {/* Slider 1 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Floor Area</span>
                    <span className="text-blue-400 font-mono text-sm">{calcArea.toLocaleString()} Sq.Ft.</span>
                  </div>
                  <input 
                    type="range" 
                    min="500" 
                    max="15000" 
                    step="250"
                    value={calcArea} 
                    onChange={(e) => setCalcArea(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-blue-500" 
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                    <span>500 sq.ft.</span>
                    <span>15,000 sq.ft.</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Number of Floors</span>
                    <span className="text-cyan-400 font-mono text-sm">{calcFloors} Floor{calcFloors > 1 ? 's' : ''}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="5" 
                    step="1"
                    value={calcFloors} 
                    onChange={(e) => setCalcFloors(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" 
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                    <span>1 Level</span>
                    <span>5 Levels</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Outputs Card */}
              <div className="space-y-6">
                
                {/* Panel 1 */}
                <div className="p-6 rounded-2xl bg-[#0a1128]/50 border border-blue-500/20 relative overflow-hidden flex items-center gap-6">
                  <div className="absolute inset-y-0 left-0 w-1 bg-blue-500" />
                  <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center shrink-0">
                    <Hourglass className="w-7 h-7 text-blue-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Conversion Speed</span>
                    <div className="text-3xl font-black text-white tracking-tight mt-0.5">
                      ~ {estTimeMinutes} minutes
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mt-1 font-light">Manual modeling pipeline: ~35-40 hours.</p>
                  </div>
                </div>

                {/* Panel 2 */}
                <div className="p-6 rounded-2xl bg-[#081525]/50 border border-cyan-500/20 relative overflow-hidden flex items-center gap-6">
                  <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400" />
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Pipeline Savings</span>
                    <div className="text-3xl font-black text-white tracking-tight mt-0.5">
                      ₹ {estSavings.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mt-1 font-light">Calculated against local rendering agent costs.</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>


        {/* ============================================================
            5. DYNAMIC MODULE SELECTOR & PARAMETER SHOWCASE
           ============================================================ */}
        <section id="modules" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-blue-500">System Modules</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 font-space">Flexible Spatial Architecture</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Scale XPLOR as your firm expands. Toggle the tabs below to view detailed specifications.</p>
            </div>

            {/* Selector tabs */}
            <div className="flex justify-center border-b border-white/5 mb-12 max-w-lg mx-auto overflow-x-auto gap-2">
              {(["neo", "adorno", "apice"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveModuleTab(tab)}
                  className={`px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                    activeModuleTab === tab
                      ? "border-blue-500 text-blue-400"
                      : "border-transparent text-slate-500 hover:text-slate-300"
                  }`}
                >
                  {MODULE_DETAILS[tab].name}
                </button>
              ))}
            </div>

            {/* Display module card */}
            <AnimatePresence mode="wait">
              <motion.div
                key={activeModuleTab}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.4 }}
                className="grid grid-cols-1 lg:grid-cols-12 gap-10 max-w-6xl mx-auto items-stretch bg-slate-900/20 border border-white/5 p-8 md:p-10 rounded-[2.5rem] backdrop-blur-sm"
              >
                
                {/* Details Column */}
                <div className="lg:col-span-7 flex flex-col justify-between space-y-6">
                  <div>
                    <div className="w-14 h-14 rounded-2xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center mb-6">
                      <ModuleIcon className="w-7 h-7 text-blue-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{activeModule.tagline}</span>
                    <h3 className="text-3xl font-black text-white mt-1 mb-4 font-space">{activeModule.name}</h3>
                    <p className="text-slate-450 leading-relaxed font-light mb-8 text-base">{activeModule.desc}</p>

                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Core capabilities</h4>
                    <ul className="space-y-3">
                      {activeModule.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                          <span className="text-slate-350">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <Link
                      href="/request-proposal"
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-blue-400 hover:text-white transition-colors group"
                    >
                      Request dynamic demo
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Technical Specs Panels */}
                <div className="lg:col-span-5 flex flex-col justify-center gap-4">
                  <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Mesh Complexity</span>
                    <span className="text-lg font-bold text-white mt-1 block font-mono">{activeModule.specs.complexity}</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Rendering Engine</span>
                    <span className="text-lg font-bold text-white mt-1 block font-mono">{activeModule.specs.engine}</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Average Throughput</span>
                    <span className="text-lg font-bold text-white mt-1 block font-mono">{activeModule.specs.throughput}</span>
                  </div>
                </div>

                {/* Pricing Tiers Section */}
                <div className="lg:col-span-12 border-t border-white/5 pt-10 mt-6">
                  <h4 className="text-sm font-black uppercase tracking-widest text-white mb-6 font-space">
                    Select your {activeModule.name} Pricing Tier
                  </h4>
                  <div className={`grid grid-cols-1 md:grid-cols-3 ${activeModule.pricing.length === 4 ? "lg:grid-cols-4" : ""} gap-6`}>
                    {activeModule.pricing.map((tier, idx) => {
                      const hoverClass = 
                        activeModuleTab === "neo" ? "hover:border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.05)]" :
                        activeModuleTab === "adorno" ? "hover:border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.05)]" :
                        "hover:border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.05)]";
                      
                      const accentTextClass = 
                        activeModuleTab === "neo" ? "text-blue-400" :
                        activeModuleTab === "adorno" ? "text-purple-400" :
                        "text-rose-400";
                      
                      return (
                        <div 
                          key={idx}
                          className={`p-6 rounded-3xl bg-slate-950/40 border border-white/5 transition-all duration-300 flex flex-col justify-between relative overflow-hidden group ${hoverClass}`}
                        >
                          <div>
                            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">
                              {activeModule.name}
                            </span>
                            <h5 className="text-base font-black text-white mb-3 font-space">
                              {tier.name}
                            </h5>
                            
                            {/* Price */}
                            <div className="flex items-baseline gap-1 mb-4">
                              <span className="text-2xl font-black text-white font-space">
                                {tier.price}
                              </span>
                              {tier.price !== "Free Trial" && (
                                <span className="text-[10px] text-slate-500 font-medium font-sans">
                                  / month
                                </span>
                              )}
                            </div>

                            {/* Quotas */}
                            <div className="space-y-1.5 mb-6 text-[11px] text-slate-400 border-y border-white/5 py-3.5 font-sans">
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-semibold">Jobs Allowance:</span>
                                <span className="text-white font-bold font-mono">{tier.jobs}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-semibold">Extra Job:</span>
                                <span className="text-white font-bold font-mono">{tier.extraJob}</span>
                              </div>
                              {tier.admins && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-semibold">Seat Limit:</span>
                                  <span className="text-white font-bold font-mono">{tier.admins}</span>
                                </div>
                              )}
                              {tier.screens && (
                                <div className="flex justify-between">
                                  <span className="text-slate-500 font-semibold">Display Nodes:</span>
                                  <span className="text-white font-bold font-mono">{tier.screens}</span>
                                </div>
                              )}
                            </div>

                            {/* Features list */}
                            <ul className="space-y-2 mb-6">
                              {tier.features.map((feat, fIdx) => (
                                <li key={fIdx} className="flex items-start gap-2 text-[11px] text-slate-450 leading-relaxed font-light">
                                  <CheckCircle2 className={`w-3.5 h-3.5 ${accentTextClass} mt-0.5 shrink-0`} />
                                  <span>{feat}</span>
                                </li>
                              ))}
                            </ul>
                          </div>

                          <Link 
                            href="/request-proposal"
                            className="w-full py-2.5 rounded-xl text-center text-[10px] font-black uppercase tracking-wider text-white bg-slate-900 border border-white/5 hover:border-white/10 hover:bg-slate-800 transition-all duration-300 block"
                          >
                            Choose Plan
                          </Link>
                        </div>
                      );
                    })}
                  </div>
                </div>

              </motion.div>
            </AnimatePresence>

          </div>
        </section>


        {/* Deleted original target sectors hub section to prevent redundancy */}


        {/* ============================================================
            7. FAQ SECTION
           ============================================================ */}
        <section className="py-24 border-t border-white/5 bg-[#02050b]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl font-bold text-white font-space">FAQ</h2>
            </div>
            
            <div className="space-y-4">
              {FAQS.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`border ${openFaq === idx ? 'border-blue-500/50 bg-[#0a1128]/40' : 'border-white/5 bg-[#0a1128]/10'} rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-base font-semibold text-white font-space">{faq.question}</span>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-blue-400 shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-slate-500 shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-6 overflow-hidden transition-all duration-300 ease-in-out ${openFaq === idx ? 'max-h-96 pb-5 opacity-100' : 'max-h-0 opacity-0'}`}
                  >
                    <p className="text-sm text-slate-400 leading-relaxed font-light">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>


        {/* ============================================================
            8. FINAL GLOWING CALL TO ACTION
           ============================================================ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 via-cyan-500/5 to-transparent rounded-[2.5rem] blur-xl pointer-events-none" />
          <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-slate-900/60 border border-white/10 text-center space-y-6 overflow-hidden shadow-2xl backdrop-blur-md">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <span className="text-xs font-bold uppercase tracking-widest text-blue-400">Next-Gen AEC Synthesis</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-space max-w-2xl mx-auto">
              Ready to transform your blueprint workflows?
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto font-light leading-relaxed">
              Create a proposal layout configuration to integrate XPLOR with your company tools.
            </p>
            
            <div className="pt-4">
              <Link 
                href="/request-proposal"
                className="inline-flex items-center gap-2 px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-2xl font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(37,99,235,0.25)] hover:shadow-[0_0_35px_rgba(37,99,235,0.45)] hover:scale-[1.02] active:scale-[0.98]"
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

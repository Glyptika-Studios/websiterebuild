/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence, useMotionValue, useTransform, useInView, animate } from "framer-motion";
import { 
  ShieldCheck, 
  Database, 
  Zap, 
  Lock, 
  ArrowRight, 
  CheckCircle2, 
  Minus, 
  Plus, 
  Server, 
  Activity, 
  Sliders, 
  ChevronRight, 
  Hourglass,
  Play,
  LucideIcon
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

interface MediaItem {
  id: string;
  title: string;
  category: string;
  url: string;
  mediaType: "image" | "video";
  description: string;
}

// ==========================================
// INTERACTIVE MOCK DATA TYPES
// ==========================================
interface PricingTier {
  name: string;
  price: string;
  assets: string;
  admins: string;
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
// MODULES & PRICING SPEC DATA
// ==========================================
const INITIAL_MODULE_DETAILS: Record<string, ModuleDetails> = {
  core: {
    name: "Secure Core",
    tagline: "Military-Grade Database Isolation",
    desc: "Loading module configurations...",
    icon: Lock,
    capabilities: [
      "Zero-Telemetry local setup & containers",
      "Hardware security module (HSM) compatibility",
      "Automated daily encrypted local backups",
      "Strict cryptographically signed auth trees"
    ],
    specs: {
      complexity: "Defense Class 1",
      engine: "Isolated Postgres / AES-256",
      throughput: "100% On-Premise / Local Node"
    },
    pricing: []
  },
  flow: {
    name: "Automated Flow",
    tagline: "Zero-Latency Activity Telemetry",
    desc: "Loading module configurations...",
    icon: Zap,
    capabilities: [
      "Automated threshold level alerts",
      "Bespoke maintenance interval schedules",
      "Immutable system mutation ledger",
      "Custom legacy webhooks & triggers"
    ],
    specs: {
      complexity: "Automated Triggers",
      engine: "Reactive Event Streams",
      throughput: "Up to 50k events / second"
    },
    pricing: []
  },
  dispatch: {
    name: "Logistics Desk",
    tagline: "End-to-End Dispatch Control",
    desc: "Loading module configurations...",
    icon: Server,
    capabilities: [
      "Packaging inventory decrement sync",
      "Standardized container batch tracking",
      "Barcode, QR & RFID scanner support",
      "Offline cache sync for field logistics"
    ],
    specs: {
      complexity: "Enterprise Logistics",
      engine: "Logistics Sync Engine",
      throughput: "Up to 5,000 dispatches / day"
    },
    pricing: []
  }
};

const FAQS = [
  {
    question: "Is the IMS portal cloud-based or on-premise?",
    answer: "We offer both solutions. For maximum security, particularly in defense applications, we provide full on-premise deployment with air-gapped support and offline caching."
  },
  {
    question: "How long does deployment take?",
    answer: "Standard deployment takes 2-4 weeks including data migration, network setup, and initial staff onboarding workshops."
  },
  {
    question: "Does this integrate with our existing ERP?",
    answer: "Yes, our system provides robust REST APIs and custom integration bridges for legacy ERP synchronization (SAP, Oracle, custom defense setups)."
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

export default function ImsPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [projectTitle, setProjectTitle] = useState<string>("IMS Portal: Next-Gen Logistics");
  const [projectDesc, setProjectDesc] = useState<string>("Automated logistics management custom-engineered for defense institutions and secure enterprises.");
  const [showcaseHeading, setShowcaseHeading] = useState<string>("See IMS in Action");
  const [showcaseDesc, setShowcaseDesc] = useState<string>("Explore high-fidelity interactive screens and modules built automatically using the IMS management pipeline.");

  const [gallery, setGallery] = useState<MediaItem[]>([]);
  const [activeMedia, setActiveMedia] = useState<MediaItem | null>(null);

  useEffect(() => {
    const fetchImsGallery = async () => {
      try {
        // Try pageContent API first
        const pageRes = await fetch("/api/v1/pages/ims");
        const pageJson = await pageRes.json();
        
        if (pageJson.success && pageJson.data && pageJson.data.content) {
          const dbContent = pageJson.data.content;
          setShowcaseHeading(dbContent.showcase_heading || "See IMS in Action");
          setShowcaseDesc(dbContent.showcase_description || "Explore high-fidelity interactive screens and modules built automatically using the IMS management pipeline.");
          
          const dbShowcase = dbContent.showcase_items || [];
          const mappedMedia: MediaItem[] = dbShowcase
            .filter((item: any) => item.public_url)
            .map((item: any, idx: number) => ({
              id: item.media_id ? `${item.media_id}-${idx}` : `showcase-${idx}`,
              title: item.title || `Showcase Asset #${idx + 1}`,
              category: "",
              url: item.public_url,
              mediaType: item.media_type || "video",
              description: item.description || ""
            }));

          if (mappedMedia.length > 0) {
            setGallery(mappedMedia);
            setActiveMedia(mappedMedia[0]);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching IMS page content showcase:", err);
      }

      try {
        const res = await fetch("/api/v1/products/22222222-0000-0000-0000-000000000003");
        const json = await res.json();
        
        if (json.success && json.data) {
          const dbMedia = json.data.entity_media || [];
          const mappedMedia: MediaItem[] = dbMedia.map((em: any, idx: number) => {
            const m = em.media || {};
            const publicUrl = m.public_url || "";
            let detectedType: "image" | "video" = "image";
            if (m.media_type === "video" || publicUrl.match(/\.(mp4|webm|ogg|mov)($|\?)/i)) {
              detectedType = "video";
            }
            return {
              id: em.id,
              title: m.file_name ? m.file_name.replace(/\.[^/.]+$/, "") : `Showcase Asset #${idx + 1}`,
              category: "",
              url: publicUrl || "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80",
              mediaType: detectedType,
              description: em.description || `Interactive preview of the ${m.file_name || 'IMS Module'} tracking systems.`,
            };
          });

          if (mappedMedia.length > 0) {
            setGallery(mappedMedia);
            setActiveMedia(mappedMedia[0]);
            return;
          }
        }
      } catch (err) {
        console.error("Error fetching IMS product gallery:", err);
      }

      // Fallback mock items
      const fallbackMedia: MediaItem[] = [
        {
          id: "ims-f1",
          title: "Live Logistics Control Center",
          category: "",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
          mediaType: "video",
          description: "Simulating on-premise dashboard tracking material dispatches and inventory levels in real-time."
        },
        {
          id: "ims-f2",
          title: "Defense Storage Depots",
          category: "",
          url: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1200&auto=format&fit=crop&q=80",
          mediaType: "image",
          description: "Physical asset verification mapping interface showing secure racks and compartment details."
        },
        {
          id: "ims-f3",
          title: "Decrement Telemetry",
          category: "",
          url: "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4",
          mediaType: "video",
          description: "Visualizing automated barcodes scans instantly decrementing databases with zero network lag."
        }
      ];
      setGallery(fallbackMedia);
      setActiveMedia(fallbackMedia[0]);
    };

    fetchImsGallery();
  }, []);

  useEffect(() => {
    const fetchImsProject = async () => {
      try {
        const res = await fetch("/api/v1/projects/44444444-0000-0000-0000-000000000004");
        const json = await res.json();
        if (json.success && json.data) {
          setProjectTitle(json.data.title || "IMS Portal: Next-Gen Logistics");
          setProjectDesc(json.data.description || "Automated logistics management custom-engineered for defense institutions and secure enterprises.");
        }
      } catch (err) {
        console.error("Error loading dynamic IMS project data:", err);
      }
    };
    fetchImsProject();
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      if (video.currentTime < 4) {
        video.currentTime = 4;
      }
    };

    video.addEventListener("loadedmetadata", handleLoadedMetadata);
    if (video.readyState >= 1 && video.currentTime < 4) {
      video.currentTime = 4;
    }

    return () => {
      video.removeEventListener("loadedmetadata", handleLoadedMetadata);
    };
  }, []);
  const [calcAssets, setCalcAssets] = useState<number>(5000);
  const [calcAdmins, setCalcAdmins] = useState<number>(3);

  // Calculator logic
  const estTimeSaved = Math.round((calcAssets * 0.5) + (calcAdmins * 24));
  const estCostSaved = Math.round((calcAssets * 150) + (calcAdmins * 12500));

  return (
    <main className="min-h-screen bg-transparent overflow-x-hidden relative">
      <div className="relative z-10">
        
        {/* ============================================================
            1. HERO SECTION
           ============================================================ */}
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
            <motion.div
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F3F7FF] border border-[#DCEBFF] text-[#2563EB] text-sm font-semibold uppercase tracking-widest mb-8"
            >
              <ShieldCheck className="w-3.5 h-3.5 animate-pulse" />
              Defense-Grade Inventory System
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold text-[#111827] tracking-tight leading-tight mb-5 max-w-5xl"
            >
              {projectTitle}
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-xl sm:text-2xl text-[#6B7280] max-w-4xl leading-relaxed mb-10"
            >
              {projectDesc}
            </motion.p>

            {/* CTA Actions */}
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
            >
              <Link
                href="/request-proposal"
                className="px-7 py-3.5 bg-[#2563EB] hover:bg-[#1765CC] text-white rounded-full font-bold transition-all duration-200 shadow-sm hover:shadow-md flex items-center gap-2 text-base"
              >
                Request Custom Demo
                <ArrowRight className="w-4 h-4" />
              </Link>
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
        <section className="bg-[#D2E3FC] py-16 relative z-20 border-y border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
            
            {/* Merged Stats & Why Choose Container */}
            <div className="rounded-2xl border border-white/50 p-8 md:p-12" style={{ background: "rgba(255,255,255,0.75)", boxShadow: "0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
              {/* Heading */}
              <div className="text-center mb-12 relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                  Why Choose IMS
                </h3>
              </div>

              {/* Stats Row */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 text-center mb-12 border-b border-gray-200/60 pb-12">
                {/* Stat 1 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] tracking-tight transition-all duration-300">
                    <AnimatedCounter value={99.99} decimals={2} suffix="%" />
                  </div>
                  <div className="text-xs md:text-sm text-[#6B7280] font-bold uppercase tracking-widest">
                    System Uptime
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] tracking-tight transition-all duration-300">
                    <AnimatedCounter value={85} decimals={0} suffix="%" />
                  </div>
                  <div className="text-xs md:text-sm text-[#6B7280] font-bold uppercase tracking-widest">
                    Time Reduction
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-2xl sm:text-3xl font-bold text-[#2563EB] tracking-tight transition-all duration-300">
                    <AnimatedCounter value={0} decimals={0} suffix="" />
                  </div>
                  <div className="text-xs md:text-sm text-[#6B7280] font-bold uppercase tracking-widest">
                    Security Breaches
                  </div>
                </div>
              </div>

              {/* 4 Cards Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                {[
                  { icon: Lock, title: "Air-Gapped Setup", desc: "Run completely offline within local defense containers." },
                  { icon: Database, title: "Isolated DB Nodes", desc: "Isolated database cores featuring Row Level Security." },
                  { icon: Zap, title: "Automatic Decrements", desc: "Logistics flows auto sync to asset databases instantly." },
                  { icon: Activity, title: "Immutable History", desc: "Chronological activity sync audit registers." }
                ].map((prop, i) => (
                  <div key={i} className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex flex-col items-start space-y-3 group">
                    <div className="w-10 h-10 rounded-xl bg-[#F3E8FD] border border-[#E4CCFA] flex items-center justify-center text-[#A142F4] font-bold">
                      <prop.icon className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-[#111827] group-hover:text-[#A142F4] transition-colors">{prop.title}</h4>
                      <p className="text-xs text-[#6B7280] mt-1">{prop.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Target Sectors Container */}
            <div className="rounded-2xl border border-white/50 p-8 md:p-12" style={{ background: "rgba(255,255,255,0.75)", boxShadow: "0 8px 32px rgba(37,99,235,0.06), inset 0 1px 0 rgba(255,255,255,0.9)" }}>
              <div className="text-center mb-10 relative z-10">
                <h3 className="text-2xl sm:text-3xl font-bold text-[#111827]">
                  Built for Secure Enterprise & Defense
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                {["Indian Defense Institutions", "Security Infrastructure Teams", "Heavy Material Warehouses"].map((sector, i) => (
                  <div key={i} className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex items-center space-x-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[#F3F7FF] border border-[#DCEBFF] flex items-center justify-center text-[#2563EB] shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors uppercase tracking-wider">{sector}</span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-6 max-w-4xl mx-auto">
                {["Military Logistics Centers", "On-Premise Enterprise Facilities"].map((sector, i) => (
                  <div key={i} className="p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 flex items-center space-x-4 group">
                    <div className="w-8 h-8 rounded-lg bg-[#F3F7FF] border border-[#DCEBFF] flex items-center justify-center text-[#2563EB] shrink-0">
                      <CheckCircle2 className="w-4 h-4" />
                    </div>
                    <span className="text-xs font-bold text-[#111827] group-hover:text-[#2563EB] transition-colors uppercase tracking-wider">{sector}</span>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* ============================================================
            3b. INTERACTIVE VISUAL SHOWCASE MEDIA GALLERY
           ============================================================ */}
        <section className="py-32 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-t border-[#E5E7EB]">
          <div className="text-center mb-16">
            <h2 className="text-3xl sm:text-4xl font-bold text-[#111827] mt-2 mb-4">{showcaseHeading}</h2>
            <p className="text-[#6B7280] max-w-2xl mx-auto">{showcaseDesc}</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

            {/* Left Column: Interactive Selector List */}
            <div className="lg:col-span-4 flex flex-col gap-4 justify-center">
              {gallery.map((item) => {
                const isActive = activeMedia && item.id === activeMedia.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => setActiveMedia(item)}
                    className={`p-6 rounded-2xl text-left border transition-all duration-200 relative overflow-hidden flex flex-col ${isActive
                      ? 'bg-blue-50/80 border-[#2563EB] shadow-[0_8px_30px_rgba(37,99,235,0.12)]'
                      : 'bg-white border-[#E5E7EB] hover:border-slate-300 hover:bg-slate-50/50'
                      }`}
                  >
                    <span className={`text-lg font-bold leading-tight mb-2 transition-colors ${isActive ? 'text-[#2563EB]' : 'text-[#111827]'}`}>{item.title}</span>
                    <span className={`text-xs line-clamp-2 leading-relaxed transition-colors ${isActive ? 'text-slate-600 font-medium' : 'text-[#6B7280]'}`}>{item.description}</span>
                  </button>
                )
              })}
            </div>

            {/* Right Column: Display Canvas Wrapper */}
            <div className="lg:col-span-8">
              {activeMedia ? (
                <motion.div
                  key={activeMedia.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.35 }}
                  className="h-full rounded-2xl bg-white border border-[#E5E7EB] p-6 flex flex-col overflow-hidden shadow-sm"
                >
                  {/* Canvas Render Frame */}
                  <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-[#E5E7EB] bg-slate-950 flex items-center justify-center group">
                    {activeMedia.mediaType === "video" ? (
                      <video
                        src={activeMedia.url}
                        className="w-full h-full object-cover"
                        autoPlay
                        muted
                        loop
                        playsInline
                      />
                    ) : (
                      <Image
                        src={activeMedia.url}
                        alt={activeMedia.title}
                        fill
                        sizes="(max-width: 1024px) 100vw, 66vw"
                        className="object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                    )}
                  </div>

                  <div className="mt-6">
                    <h3 className="text-xl font-bold text-[#111827] mb-2">{activeMedia.title}</h3>
                    <p className="text-sm text-[#6B7280] leading-relaxed font-light">{activeMedia.description}</p>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full rounded-2xl border border-dashed border-[#E5E7EB] flex items-center justify-center text-xs text-[#6B7280] p-12 bg-[#F9FAFB]/50">
                  Select a showcase asset to view interactive viewport preview.
                </div>
              )}
            </div>

          </div>
        </section>

        {/* ============================================================
            3. AUDIT ESTIMATOR CALCULATOR
           ============================================================ */}
        <section className="py-32 border-t border-[#E5E7EB]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <span className="text-sm font-semibold uppercase tracking-widest text-[#2563EB]">Logistics Calculator</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-[#111827] mt-2 mb-3">IMS Savings & Time Estimator</h2>
              <p className="text-[#6B7280] max-w-2xl mx-auto text-base">Estimate your time savings and audit cost reductions based on system scale.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 max-w-5xl mx-auto items-center">
              
              {/* Sliders Form Card */}
              <div className="p-8 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] space-y-6 relative overflow-hidden">
                <h3 className="text-lg font-bold text-[#111827] mb-4 flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-[#2563EB]" />
                  Scale Setup
                </h3>

                {/* Slider 1 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-[#6B7280]">
                    <span>Number of Inventory Assets</span>
                    <span className="text-[#2563EB] font-mono text-sm font-bold">{calcAssets.toLocaleString()} Items</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000"
                    value={calcAssets} 
                    onChange={(e) => setCalcAssets(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-[#2563EB]" 
                  />
                  <div className="flex justify-between text-xs text-[#6B7280] font-medium">
                    <span>1,000 items</span>
                    <span>100,000 items</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center text-sm font-semibold text-[#6B7280]">
                    <span>Admin Operator Seats</span>
                    <span className="text-[#2563EB] font-mono text-sm font-bold">{calcAdmins} Operator{calcAdmins > 1 ? 's' : ''}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1"
                    value={calcAdmins} 
                    onChange={(e) => setCalcAdmins(parseInt(e.target.value))}
                    className="w-full h-1 bg-[#F1F3F4] rounded-lg appearance-none cursor-pointer accent-[#2563EB]" 
                  />
                  <div className="flex justify-between text-xs text-[#6B7280] font-medium">
                    <span>1 Operator</span>
                    <span>50 Operators</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Outputs Card */}
              <div className="space-y-4">
                
                {/* Panel 1 */}
                <div className="p-5 rounded-xl bg-[#F3F7FF] border border-[#DCEBFF] flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                    <Hourglass className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Est. Hours Saved / Year</span>
                    <div className="text-2xl font-bold text-[#111827] mt-0.5">
                      ~ {estTimeSaved.toLocaleString()} hours
                    </div>
                    <p className="text-xs text-[#6B7280] leading-normal mt-0.5">Calculated against manual verification workflows.</p>
                  </div>
                </div>

                {/* Panel 2 */}
                <div className="p-5 rounded-xl bg-[#F3F7FF] border border-[#DCEBFF] flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-white border border-[#E5E7EB] flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-6 h-6 text-[#2563EB]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#6B7280] uppercase tracking-widest">Est. Annual Audit Cost Saved</span>
                    <div className="text-2xl font-bold text-[#111827] mt-0.5">
                      ₹ {estCostSaved.toLocaleString()}
                    </div>
                    <p className="text-xs text-[#6B7280] leading-normal mt-0.5">Includes reductions in audit processing overhead.</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>



        {/* ============================================================
            5. FAQ SECTION
           ============================================================ */}
        <section className="py-32 border-t border-[#E5E7EB]">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-2xl font-bold text-[#111827]">FAQ</h2>
            </div>
            
            <div className="space-y-3">
              {FAQS.map((faq, idx) => (
                <div 
                  key={idx}
                  className={`border rounded-xl overflow-hidden transition-all duration-200 ${
                    openFaq === idx
                      ? "border-[#2563EB]/30 bg-[#F3F7FF]/30"
                      : "border-[#E5E7EB] bg-white"
                  }`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-5 py-4 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-sm font-medium text-[#111827]">{faq.question}</span>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-[#2563EB] shrink-0" />
                    ) : (
                      <Plus className="w-4 h-4 text-[#6B7280] shrink-0" />
                    )}
                  </button>
                  <div 
                    className={`px-5 overflow-hidden transition-all duration-300 ease-in-out ${
                      openFaq === idx ? "max-h-96 pb-4 opacity-100" : "max-h-0 opacity-0"
                    }`}
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
            6. CALL TO ACTION
           ============================================================ */}
        <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-5xl mx-auto mb-12">
          <div className="relative p-10 md:p-14 rounded-2xl bg-[#D2E3FC] border border-[#B4D0FB] text-center space-y-5 overflow-hidden shadow-sm">
            <span className="text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20 px-3 py-1 rounded-full inline-flex">Secure Enterprise Architecture</span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#111827] leading-tight max-w-2xl mx-auto">
              Ready to deploy your local IMS instance?
            </h2>
            <p className="text-sm text-[#374151] max-w-md mx-auto leading-relaxed">
              Create a custom configuration schema to integrate IMS with your secure operational grids.
            </p>
            
            <div className="pt-3">
              <Link 
                href="/request-proposal"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white rounded-full font-semibold transition-all duration-200 shadow-sm text-sm"
              >
                Request Deployment Proposal
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>
      </div>
    </main>
  );
}

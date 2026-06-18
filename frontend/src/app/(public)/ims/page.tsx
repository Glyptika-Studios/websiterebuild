"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  LucideIcon
} from "lucide-react";
import Link from "next/link";

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
const MODULE_DETAILS: Record<string, ModuleDetails> = {
  core: {
    name: "Secure Core",
    tagline: "Military-Grade Database Isolation",
    desc: "Air-gapped database deployment featuring isolated PostgreSQL nodes and strict Row Level Security (RLS) policies custom engineered for defense environments.",
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
    pricing: [
      {
        name: "Core Lite",
        price: "₹45,000",
        assets: "2,000 Assets",
        admins: "1 Admin Seat",
        features: ["Standard air-gapped container", "Weekly encrypted backups", "Static inventory registers", "Email ticket support"]
      },
      {
        name: "Core Standard",
        price: "₹85,000",
        assets: "10,000 Assets",
        admins: "3 Admin Seats",
        features: ["Multi-node replica database", "Daily encrypted backups", "AD / LDAP Active sync", "Priority 24/7 support ticket"]
      },
      {
        name: "Core Pro",
        price: "₹1,50,000",
        assets: "Unlimited Assets",
        admins: "10 Admin Seats",
        features: ["High-availability clustering", "Hourly real-time backups", "Custom HSM integration", "Dedicated on-call team SLA"]
      }
    ]
  },
  flow: {
    name: "Automated Flow",
    tagline: "Zero-Latency Activity Telemetry",
    desc: "Real-time automated alerts for inventory thresholds, scheduled maintenance runs, and immutable ledger logging across asset lifecycles.",
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
    pricing: [
      {
        name: "Flow Lite",
        price: "₹35,000",
        assets: "1,000 Runs / mo",
        admins: "Email Alert Logs",
        features: ["Basic threshold monitors", "Hourly log consolidation", "Default trigger library", "Standard API token access"]
      },
      {
        name: "Flow Standard",
        price: "₹75,000",
        assets: "10,000 Runs / mo",
        admins: "SMS & Slack Integration",
        features: ["Advanced automated schedules", "Real-time state telemetry", "Bespoke triggers custom pack", "Secure REST API endpoints"]
      },
      {
        name: "Flow Pro",
        price: "₹1,35,000",
        assets: "Unlimited Runs / mo",
        admins: "Webhook Data Streams",
        features: ["Immutable event hashing", "Enterprise syslog integration", "High throughput event bus", "Custom webhook handlers"]
      }
    ]
  },
  dispatch: {
    name: "Logistics Desk",
    tagline: "End-to-End Dispatch Control",
    desc: "Material Control Office dashboard sync with standardized packaging modules and shipping dispatch workflows to prevent inventory leaks.",
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
    pricing: [
      {
        name: "Desk Lite",
        price: "₹55,000",
        assets: "500 Dispatches / mo",
        admins: "Barcode Scanning Only",
        features: ["Standard packaging module", "Barcode register parsing", "Manual dispatch sheets", "Standard ticketing support"]
      },
      {
        name: "Desk Standard",
        price: "₹1,15,000",
        assets: "5,000 Dispatches / mo",
        admins: "Barcode + RFID Tracking",
        features: ["Automated packaging decrement", "RFID batch scanner integration", "Digital dispatch ledger sync", "Priority support ticket"]
      },
      {
        name: "Desk Pro",
        price: "₹1,95,000",
        assets: "Unlimited Dispatches",
        admins: "Multi-Warehouse Sync",
        features: ["Real-time terminal updates", "Active scanner arrays sync", "Air-gapped dispatch controller", "On-site engineer assistance"]
      }
    ]
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

export default function ImsPage() {
  // Page States
  const [activeModuleTab, setActiveModuleTab] = useState<"core" | "flow" | "dispatch">("core");
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  
  // Interactive Calculator States
  const [calcAssets, setCalcAssets] = useState<number>(5000);
  const [calcAdmins, setCalcAdmins] = useState<number>(3);

  // Calculator logic
  const estTimeSaved = Math.round((calcAssets * 0.5) + (calcAdmins * 24));
  const estCostSaved = Math.round((calcAssets * 150) + (calcAdmins * 12500));

  const activeModule = MODULE_DETAILS[activeModuleTab];
  const ModuleIcon = activeModule.icon;

  return (
    <main className="min-h-screen bg-transparent text-slate-300 font-sans selection:bg-blue-500/30 overflow-x-hidden relative">
      
      {/* Background Grid & Ambient Glows */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <div className="absolute top-[10%] left-[20%] w-[600px] h-[600px] bg-indigo-900/10 blur-[150px] rounded-full" />
        <div className="absolute top-[40%] right-[10%] w-[500px] h-[500px] bg-blue-900/10 blur-[150px] rounded-full" />
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
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-indigo-500/10 border border-indigo-500/35 text-indigo-400 text-xs font-semibold uppercase tracking-widest mb-8 shadow-[0_0_15px_rgba(99,102,241,0.15)]"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              Defense-Grade Inventory System
            </motion.div>

            {/* Main Title */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-5xl sm:text-6xl md:text-7xl font-extrabold text-white tracking-tight leading-none mb-6 font-space max-w-4xl"
            >
              IMS Portal: <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-300 to-blue-300">Next-Gen Logistics.</span>
            </motion.h1>

            {/* Description */}
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-lg sm:text-xl text-slate-400 max-w-3xl leading-relaxed mb-12 font-light"
            >
              Automated logistics management custom-engineered for defense institutions and secure enterprises. Eliminate inventory leaks with air-gapped PostgreSQL cores, packaging registries, and immutable logs.
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
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.3)] hover:shadow-[0_0_30px_rgba(99,102,241,0.5)] hover:scale-[1.02] active:scale-[0.98] flex items-center gap-2"
              >
                <span>Request Custom Demo</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <a
                href="#modules"
                className="px-8 py-4 bg-white/5 hover:bg-white/10 text-white rounded-2xl font-bold border border-white/5 hover:border-white/10 transition-all duration-300"
              >
                View System Modules
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
                className="w-1 h-1.5 bg-indigo-500 rounded-full"
              />
            </div>
          </div>
        </section>


        {/* ============================================================
            2. HIGH-IMPACT METRICS & STATS SECTION (Smaller, Homepage style)
           ============================================================ */}
        <section className="py-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="relative rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-indigo-500/50 to-transparent" />
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-12 relative z-10 text-center">
                
                {/* Stat 1 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:text-indigo-400 group-hover:drop-shadow-[0_0_20px_rgba(99,102,241,0.4)] transition-all duration-300 font-space">
                    99.99%
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-350 transition-colors">
                    System Uptime
                  </div>
                </div>

                {/* Stat 2 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:text-purple-400 group-hover:drop-shadow-[0_0_20px_rgba(168,85,247,0.4)] transition-all duration-300 font-space">
                    85%
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-350 transition-colors">
                    Time Reduction
                  </div>
                </div>

                {/* Stat 3 */}
                <div className="flex flex-col items-center justify-center space-y-2 group">
                  <div className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.15)] group-hover:text-blue-400 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.4)] transition-all duration-300 font-space">
                    0
                  </div>
                  <div className="text-xs md:text-sm text-slate-400 font-bold uppercase tracking-widest group-hover:text-slate-350 transition-colors">
                    Security Breaches
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>


        {/* ============================================================
            2b. WHY CHOOSE IMS SECTION (Similar size to stats panel)
           ============================================================ */}
        <section className="py-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="relative rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-purple-500/50 to-transparent" />
              
              <div className="text-center mb-10 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-purple-500/10 border border-purple-500/35 text-purple-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Core Value Propositions
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-space">
                  Why Choose IMS
                </h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative z-10">
                
                {/* Prop 1 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">Air-Gapped Setup</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">Run completely offline within local defense containers.</p>
                  </div>
                </div>

                {/* Prop 2 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    <Database className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">Isolated DB Nodes</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">Isolated database cores featuring strict Row Level Security (RLS).</p>
                  </div>
                </div>

                {/* Prop 3 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    <Zap className="w-5 h-5 animate-pulse" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">Automatic Decrements</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">Packaging module syncs dispatch counts to stock instantly.</p>
                  </div>
                </div>

                {/* Prop 4 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-purple-500/30 transition-all duration-300 flex flex-col items-start space-y-3 group">
                  <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-bold">
                    <Activity className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white group-hover:text-purple-400 transition-colors">Immutable History</h4>
                    <p className="text-xs text-slate-400 font-light mt-1">Every material movement tracked chronologically.</p>
                  </div>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ============================================================
            2c. WHO USES IMS SECTION (Similar size to stats panel)
           ============================================================ */}
        <section className="py-12 relative z-20">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="relative rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
              <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/50 to-transparent" />
              
              <div className="text-center mb-10 relative z-10">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/35 text-cyan-400 text-xs font-bold uppercase tracking-widest mb-3">
                  Target Sectors
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white font-space">
                  Built for Secure Enterprise & Defense
                </h3>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative z-10">
                
                {/* Sector 1 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Indian Defense Institutions</span>
                </div>

                {/* Sector 2 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Security Infrastructure Teams</span>
                </div>

                {/* Sector 3 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Heavy Material Warehouses</span>
                </div>

              </div>

              {/* Second row of 2 centered items on desktop */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative z-10 mt-6 max-w-4xl mx-auto">
                
                {/* Sector 4 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">Military Logistics Centers</span>
                </div>

                {/* Sector 5 */}
                <div className="p-6 rounded-2xl bg-slate-950/45 border border-white/5 hover:border-cyan-500/30 transition-all duration-300 flex items-center space-x-4 group">
                  <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0 font-bold">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <span className="text-xs font-black text-white group-hover:text-cyan-400 transition-colors uppercase tracking-wider">On-Premise Enterprise Facilities</span>
                </div>

              </div>

            </div>

          </div>
        </section>


        {/* ============================================================
            3. INTERACTIVE LOGISTICS SAVINGS CALCULATOR
           ============================================================ */}
        <section className="py-24 border-t border-white/5 bg-[#050b14]/35">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-cyan-400">Logistics Calculator</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 font-space">IMS Savings & Time Estimator</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Estimate your time savings and audit cost reductions based on system scale.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto items-center">
              
              {/* Sliders Form Card */}
              <div className="p-8 md:p-10 rounded-[2rem] bg-slate-900/50 border border-white/10 backdrop-blur-lg shadow-xl space-y-8 relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-indigo-500 to-cyan-400" />
                <h3 className="text-xl font-black text-white mb-6 tracking-tight flex items-center gap-2">
                  <Sliders className="w-5 h-5 text-indigo-400" />
                  Scale Setup
                </h3>

                {/* Slider 1 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Number of Inventory Assets</span>
                    <span className="text-indigo-400 font-mono text-sm">{calcAssets.toLocaleString()} Items</span>
                  </div>
                  <input 
                    type="range" 
                    min="1000" 
                    max="100000" 
                    step="1000"
                    value={calcAssets} 
                    onChange={(e) => setCalcAssets(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-indigo-500" 
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                    <span>1,000 items</span>
                    <span>100,000 items</span>
                  </div>
                </div>

                {/* Slider 2 */}
                <div className="space-y-3">
                  <div className="flex justify-between items-center text-xs font-bold uppercase tracking-wider text-slate-400">
                    <span>Admin Operator Seats</span>
                    <span className="text-cyan-400 font-mono text-sm">{calcAdmins} Operator{calcAdmins > 1 ? 's' : ''}</span>
                  </div>
                  <input 
                    type="range" 
                    min="1" 
                    max="50" 
                    step="1"
                    value={calcAdmins} 
                    onChange={(e) => setCalcAdmins(parseInt(e.target.value))}
                    className="w-full h-1 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-cyan-400" 
                  />
                  <div className="flex justify-between text-[10px] text-slate-600 font-bold">
                    <span>1 Operator</span>
                    <span>50 Operators</span>
                  </div>
                </div>
              </div>

              {/* Dynamic Outputs Card */}
              <div className="space-y-6">
                
                {/* Panel 1 */}
                <div className="p-6 rounded-2xl bg-[#0a1128]/50 border border-indigo-500/20 relative overflow-hidden flex items-center gap-6">
                  <div className="absolute inset-y-0 left-0 w-1 bg-indigo-500" />
                  <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shrink-0">
                    <Hourglass className="w-7 h-7 text-indigo-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Hours Saved / Year</span>
                    <div className="text-3xl font-black text-white tracking-tight mt-0.5">
                      ~ {estTimeSaved.toLocaleString()} hours
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mt-1 font-light">Calculated against manual verification workflows.</p>
                  </div>
                </div>

                {/* Panel 2 */}
                <div className="p-6 rounded-2xl bg-[#081525]/50 border border-cyan-500/20 relative overflow-hidden flex items-center gap-6">
                  <div className="absolute inset-y-0 left-0 w-1 bg-cyan-400" />
                  <div className="w-14 h-14 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center shrink-0">
                    <CheckCircle2 className="w-7 h-7 text-cyan-400" />
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">Est. Annual Audit Cost Saved</span>
                    <div className="text-3xl font-black text-white tracking-tight mt-0.5">
                      ₹ {estCostSaved.toLocaleString()}
                    </div>
                    <p className="text-xs text-slate-400 leading-normal mt-1 font-light">Includes reductions in audit processing overhead.</p>
                  </div>
                </div>

              </div>

            </div>
          </div>
        </section>


        {/* ============================================================
            4. DYNAMIC MODULE SELECTOR & PARAMETER SHOWCASE (TABS)
           ============================================================ */}
        <section id="modules" className="py-24 border-t border-white/5">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <span className="text-xs font-bold uppercase tracking-widest text-indigo-500">System Architecture</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 font-space">Custom Modular Capabilities</h2>
              <p className="text-slate-400 max-w-2xl mx-auto">Toggle the tabs below to view detailed specifications and licensing tiers for each module.</p>
            </div>

            {/* Selector tabs */}
            <div className="flex justify-center border-b border-white/5 mb-12 max-w-lg mx-auto overflow-x-auto gap-2">
              {(["core", "flow", "dispatch"] as const).map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveModuleTab(tab)}
                  className={`px-6 py-4 text-xs font-black uppercase tracking-widest border-b-2 transition-all whitespace-nowrap ${
                    activeModuleTab === tab
                      ? "border-indigo-500 text-indigo-400"
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
                    <div className="w-14 h-14 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center mb-6">
                      <ModuleIcon className="w-7 h-7 text-indigo-400" />
                    </div>
                    <span className="text-xs font-bold uppercase tracking-widest text-slate-500">{activeModule.tagline}</span>
                    <h3 className="text-3xl font-black text-white mt-1 mb-4 font-space">{activeModule.name}</h3>
                    <p className="text-slate-450 leading-relaxed font-light mb-8 text-base">{activeModule.desc}</p>

                    <h4 className="text-xs font-black uppercase tracking-widest text-white mb-4">Core capabilities</h4>
                    <ul className="space-y-3">
                      {activeModule.capabilities.map((cap, i) => (
                        <li key={i} className="flex items-center gap-3 text-sm">
                          <CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
                          <span className="text-slate-350">{cap}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-6 border-t border-white/5">
                    <Link
                      href="/request-proposal"
                      className="inline-flex items-center gap-2 text-sm font-black uppercase tracking-wider text-indigo-400 hover:text-white transition-colors group"
                    >
                      Request module deployment
                      <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  </div>
                </div>

                {/* Technical Specs Panels */}
                <div className="lg:col-span-5 flex flex-col justify-center gap-4">
                  <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">System Complexity</span>
                    <span className="text-lg font-bold text-white mt-1 block font-mono">{activeModule.specs.complexity}</span>
                  </div>
                  <div className="p-6 rounded-2xl bg-slate-950/40 border border-white/5">
                    <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest block">Core Database Engine</span>
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
                    Select your {activeModule.name} Licensing Tier
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {activeModule.pricing.map((tier, idx) => {
                      const hoverClass = 
                        activeModuleTab === "core" ? "hover:border-indigo-500/40 shadow-[0_0_20px_rgba(99,102,241,0.05)]" :
                        activeModuleTab === "flow" ? "hover:border-purple-500/40 shadow-[0_0_20px_rgba(168,85,247,0.05)]" :
                        "hover:border-blue-500/40 shadow-[0_0_20px_rgba(59,130,246,0.05)]";
                      
                      const accentTextClass = 
                        activeModuleTab === "core" ? "text-indigo-400" :
                        activeModuleTab === "flow" ? "text-purple-400" :
                        "text-blue-400";
                      
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
                              <span className="text-[10px] text-slate-500 font-medium font-sans">
                                / month
                              </span>
                            </div>

                            {/* Quotas */}
                            <div className="space-y-1.5 mb-6 text-[11px] text-slate-400 border-y border-white/5 py-3.5 font-sans">
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-semibold">Scale Quota:</span>
                                <span className="text-white font-bold font-mono">{tier.assets}</span>
                              </div>
                              <div className="flex justify-between">
                                <span className="text-slate-500 font-semibold">Support / Integration:</span>
                                <span className="text-white font-bold font-mono">{tier.admins}</span>
                              </div>
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
                            Choose Tier
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


        {/* ============================================================
            5. FAQ SECTION
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
                  className={`border ${openFaq === idx ? 'border-indigo-500/50 bg-[#0a1128]/40' : 'border-white/5 bg-[#0a1128]/10'} rounded-2xl overflow-hidden transition-all duration-300`}
                >
                  <button 
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                    className="w-full px-6 py-5 flex items-center justify-between text-left focus:outline-none"
                  >
                    <span className="text-base font-semibold text-white font-space">{faq.question}</span>
                    {openFaq === idx ? (
                      <Minus className="w-4 h-4 text-indigo-400 shrink-0" />
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
            6. FINAL GLOWING CALL TO ACTION
           ============================================================ */}
        <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto mb-20 relative">
          <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/10 via-purple-500/5 to-transparent rounded-[2.5rem] blur-xl pointer-events-none" />
          <div className="relative p-12 md:p-16 rounded-[2.5rem] bg-slate-900/60 border border-white/10 text-center space-y-6 overflow-hidden shadow-2xl backdrop-blur-md">
            
            <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[80px] rounded-full pointer-events-none" />
            
            <span className="text-xs font-bold uppercase tracking-widest text-indigo-400">Secure Enterprise Architecture</span>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white leading-tight font-space max-w-2xl mx-auto">
              Ready to deploy your local IMS instance?
            </h2>
            <p className="text-sm text-slate-400 max-w-md mx-auto font-light leading-relaxed">
              Create a custom configuration schema to integrate IMS with your secure operational grids.
            </p>
            
            <div className="pt-4">
              <Link 
                href="/request-proposal"
                className="inline-flex items-center gap-2 px-8 py-4 bg-indigo-600 hover:bg-indigo-500 text-white rounded-2xl font-black uppercase tracking-wider transition-all duration-300 shadow-[0_0_20px_rgba(99,102,241,0.25)] hover:shadow-[0_0_35px_rgba(99,102,241,0.45)] hover:scale-[1.02] active:scale-[0.98]"
              >
                <span>Request Deployment Proposal</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </section>

      </div>
    </main>
  );
}

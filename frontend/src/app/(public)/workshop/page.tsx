/* eslint-disable react/no-unescaped-entities, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Calendar,
  Clock,
  MapPin,
  Download,
  Laptop,
  Mouse,
  BatteryCharging,
  ExternalLink,
  Sparkles,
  ChevronRight
} from "lucide-react";

const InstagramIcon = ({ className = "w-4 h-4" }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
  </svg>
);

// ─────────────────────────────────────────
// DATA
// ─────────────────────────────────────────
const BLENDER_VERSIONS = [
  { config: "i3 / Ryzen 3 — No dedicated GPU", version: "Blender 2.8", link: "https://download.blender.org/release/Blender2.80/" },
  { config: "i3 / Ryzen 3 — Integrated GPU",   version: "Blender 3.0", link: "https://download.blender.org/release/Blender3.0/" },
  { config: "i3 / Ryzen 3 — Dedicated GPU",    version: "Blender 3.1", link: "https://download.blender.org/release/Blender3.1/" },
  { config: "i5 / Ryzen 5 — No dedicated GPU", version: "Blender 3.1", link: "https://download.blender.org/release/Blender3.1/" },
  { config: "i5 / Ryzen 5 — Integrated GPU",   version: "Blender 3.3", link: "https://download.blender.org/release/Blender3.3/" },
  { config: "i5 / Ryzen 5 — RTX 3050",         version: "Blender 3.6", link: "https://www.blender.org/download/lts/3-6/" },
  { config: "i7 / Ryzen 7 — No dedicated GPU", version: "Blender 3.3", link: "https://download.blender.org/release/Blender3.3/" },
  { config: "i7 / Ryzen 7 — Integrated GPU",   version: "Blender 3.3", link: "https://download.blender.org/release/Blender3.3/" },
  { config: "i5 / Ryzen 5 — GPU > RTX 3060",   version: "Blender 4.0", link: "https://download.blender.org/release/Blender4.0/" },
  { config: "i7 / Ryzen 7 — GPU > RTX 3060",   version: "Blender 4.0", link: "https://download.blender.org/release/Blender4.0/" },
  { config: "i9 / Ryzen 9 — GPU > RTX 3060",   version: "Blender 4.0", link: "https://download.blender.org/release/Blender4.0/" },
];

const SHORTCUT_SECTIONS = [
  {
    title: "Navigation & Viewport",
    items: [
      { key: "TAB",        action: "Toggle Object ↔ Edit Mode" },
      { key: "CTRL+TAB",   action: "Pie menu (Sculpt / Paint)" },
      { key: "1 / 2 / 3",  action: "Vertex / Edge / Face Select" },
      { key: "N",          action: "Toggle Side Panel" },
    ],
  },
  {
    title: "Selection",
    items: [
      { key: "A",       action: "Select All" },
      { key: "ALT+A",   action: "Deselect All" },
      { key: "B",       action: "Box Select" },
      { key: "C",       action: "Circle Select" },
      { key: "L",       action: "Select Linked Under Mouse" },
      { key: "H",       action: "Hide Selected" },
      { key: "ALT+H",   action: "Unhide All" },
    ],
  },
  {
    title: "Modelling & Editing",
    items: [
      { key: "E",         action: "Extrude" },
      { key: "E + RClick",action: "Extrude in place" },
      { key: "I",         action: "Inset Face" },
      { key: "CTRL+R",    action: "Loop Cut" },
      { key: "K",         action: "Knife Tool" },
      { key: "CTRL+B",    action: "Bevel" },
      { key: "SHIFT+D",   action: "Duplicate" },
      { key: "X / Del",   action: "Delete Menu" },
      { key: "CTRL+X",    action: "Dissolve (cleaner)" },
    ],
  },
  {
    title: "Transform",
    items: [
      { key: "G",             action: "Grab / Move" },
      { key: "R",             action: "Rotate" },
      { key: "S",             action: "Scale" },
      { key: "G/R/S + X/Y/Z", action: "Lock to axis" },
      { key: "CTRL+A",        action: "Apply Transforms" },
    ],
  },
  {
    title: "Object Operations",
    items: [
      { key: "SHIFT+A", action: "Add Mesh / Light / Camera" },
      { key: "ALT+D",   action: "Linked Duplicate" },
      { key: "CTRL+J",  action: "Join Objects" },
    ],
  },
  {
    title: "Render",
    items: [
      { key: "F12",      action: "Render Still Image" },
      { key: "CTRL+F12", action: "Render Animation" },
    ],
  },
];

const LEARN_ITEMS = [
  "3D Basics & Blender Interface",
  "Modelling Essentials",
  "Lighting & Materials",
  "Rendering Basics",
  "Hands-on Mini Project",
];

const BRING_ITEMS = [
  { icon: Laptop,         text: "Your laptop" },
  { icon: Download,       text: "Blender pre-installed" },
  { icon: Mouse,          text: "USB mouse (recommended)" },
  { icon: BatteryCharging, text: "Fully charged laptop" },
];

const RESOURCES = [
  "Workshop Slides",
  "Blender Starter Files (.blend)",
  "Texture Packs",
  "Session Recording",
  "YouTube Channel Recommendations",
  "Practice Exercises",
];

// ─────────────────────────────────────────
// COMPONENT
// ─────────────────────────────────────────
export default function WorkshopPage() {
  return (
    <main className="relative w-full min-h-screen bg-white text-[#111827] overflow-hidden">
      {/* Page background */}
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: "url('/bgimage.png')", backgroundSize: "cover", backgroundPosition: "center" }} />
      <div className="absolute inset-0 z-0 pointer-events-none" style={{ backgroundImage: "radial-gradient(#CBD5E1 1.5px, transparent 1.5px)", backgroundSize: "32px 32px", opacity: 0.55 }} />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-36 md:pt-44 pb-28 space-y-24">

        {/* ══════════════════════════════════════
            HERO
        ══════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">

          {/* Left */}
          <div className="lg:col-span-7 space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#EFF6FF] border border-[#BFDBFE] text-[#2563EB] text-sm font-bold uppercase tracking-widest"
            >
              <Sparkles className="w-3.5 h-3.5" />
              Glyptika Studios × Blender
            </motion.div>

            <motion.h1
              initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.55, delay: 0.08 }}
              className="text-5xl sm:text-6xl md:text-[4rem] font-black text-[#111827] tracking-tight leading-[1.08] uppercase"
            >
              🎬 3D Designing &{" "}
              <span className="text-[#2563EB]">Modelling Workshop</span>
            </motion.h1>

            <motion.p
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.15 }}
              className="text-lg sm:text-xl text-[#4B5563] leading-relaxed max-w-xl"
            >
              Learn 3D designing, modelling, materials, lighting, and rendering using Blender through a fun, hands-on workshop.
            </motion.p>

            {/* Event detail pills */}
            <motion.div
              initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45, delay: 0.2 }}
              className="grid grid-cols-1 sm:grid-cols-3 gap-3"
            >
              {[
                { icon: Calendar, label: "Dates", value: "5th & 6th Aug", sub: "Tuesday & Wednesday" },
                { icon: Clock,    label: "Time",  value: "5:00 PM onwards" },
                { icon: MapPin,   label: "Venue", value: "LP-108" },
              ].map(({ icon: Icon, label, value, sub }, i) => (
                <div key={i} className="p-3.5 rounded-2xl bg-white/90 border border-[#E5E7EB] shadow-sm flex items-center gap-3 backdrop-blur-sm">
                  <div className="w-9 h-9 rounded-xl bg-[#EFF6FF] flex items-center justify-center shrink-0">
                    <Icon className="w-4 h-4 text-[#2563EB]" />
                  </div>
                  <div>
                    <span className="text-xs font-bold text-[#9CA3AF] uppercase tracking-wider block">{label}</span>
                    <span className="text-sm font-bold text-[#111827]">{value}</span>
                    {sub && <span className="text-xs text-[#2563EB] font-medium block">{sub}</span>}
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Highlight callout */}
            <motion.div
              initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.28 }}
              className="p-5 rounded-2xl bg-gradient-to-r from-[#EFF6FF] to-[#DBEAFE] border border-[#BFDBFE] space-y-2"
            >
              <p className="text-base text-[#1E40AF] font-semibold">🎓 All first-year students welcome — no prior experience needed!</p>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-gradient-to-r from-[#D97706] to-[#F59E0B] text-white font-extrabold text-sm shadow-md shadow-amber-200">
                🎁 First 100 attendees get a surprise gift!
              </div>
            </motion.div>
          </div>

          {/* Right: Poster */}
          <div className="lg:col-span-5 flex justify-center">
            <motion.div
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.55, delay: 0.25 }}
              className="w-full max-w-[420px] rounded-3xl overflow-hidden shadow-[0_20px_60px_rgba(15,23,42,0.15)] border border-[#E5E7EB]"
            >
              <img
                src="/workshop/poster.jpg"
                alt="Glyptika Studios Blender Workshop Poster"
                className="w-full h-auto object-contain"
              />
            </motion.div>
          </div>
        </section>

        {/* ══════════════════════════════════════
            WHAT YOU'LL LEARN
        ══════════════════════════════════════ */}
        <section className="space-y-6">
          <SectionHeader emoji="🚀" title="What You'll Learn" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {LEARN_ITEMS.map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }} transition={{ duration: 0.35, delay: idx * 0.07 }}
                className="p-5 rounded-2xl bg-white/90 border border-[#E5E7EB] shadow-sm flex items-start gap-3 backdrop-blur-sm hover:border-[#2563EB]/30 hover:shadow-md transition-all duration-200"
              >
                <div className="w-8 h-8 rounded-lg bg-[#EFF6FF] text-[#2563EB] flex items-center justify-center shrink-0 font-bold text-xs font-mono">
                  {String(idx + 1).padStart(2, "0")}
                </div>
                <p className="text-sm font-semibold text-[#111827] leading-snug pt-0.5">{item}</p>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            BEFORE YOU ATTEND
        ══════════════════════════════════════ */}
        <section className="rounded-3xl bg-[#EFF6FF] border border-[#BFDBFE] overflow-hidden shadow-sm">
          <div className="px-8 pt-8 pb-6 border-b border-[#BFDBFE]">
            <SectionHeader emoji="💻" title="Before You Attend" />
            <p className="text-base text-[#4B5563] mt-1">Make sure you have these ready before coming to LP-108.</p>
          </div>
          <div className="p-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {BRING_ITEMS.map(({ icon: Icon, text }, idx) => (
              <div key={idx} className="p-4 rounded-2xl bg-white border border-[#BFDBFE] flex items-center gap-3 hover:border-[#2563EB]/40 hover:shadow-sm transition-all">
                <div className="w-10 h-10 rounded-xl bg-[#EFF6FF] border border-[#BFDBFE] flex items-center justify-center shrink-0">
                  <Icon className="w-5 h-5 text-[#2563EB]" />
                </div>
                <span className="text-sm font-semibold text-[#111827] leading-snug">{text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            BLENDER INSTALLATION GUIDE
        ══════════════════════════════════════ */}
        <section className="space-y-6">
          <div>
            <SectionHeader emoji="⬇️" title="Blender Installation Guide" />
            <p className="text-base text-[#6B7280] mt-1">
              Find your CPU + GPU below and download the correct Blender version <strong className="text-[#111827]">before the workshop</strong>.
            </p>
          </div>

          <div className="bg-white border border-[#E5E7EB] rounded-2xl overflow-hidden shadow-sm">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse min-w-[560px]">
                <thead>
                  <tr className="bg-[#F1F5F9] border-b border-[#E5E7EB] text-xs font-bold uppercase text-[#6B7280] tracking-widest">
                    <th className="py-3 px-5">Hardware Configuration</th>
                    <th className="py-3 px-5">Recommended Version</th>
                    <th className="py-3 px-5 text-right">Download</th>
                  </tr>
                </thead>
                <tbody className="text-xs sm:text-sm">
                  {BLENDER_VERSIONS.map((item, idx) => (
                    <tr key={idx} className={`border-b border-[#F1F5F9] hover:bg-[#F8FAFC] transition-colors ${idx === BLENDER_VERSIONS.length - 1 ? "border-b-0" : ""}`}>
                      <td className="py-3.5 px-5 font-medium text-[#374151] text-sm">{item.config}</td>
                      <td className="py-3.5 px-5">
                        <span className="inline-block px-3 py-1 rounded-md bg-[#EFF6FF] text-[#2563EB] font-bold text-sm">
                          {item.version}
                        </span>
                      </td>
                      <td className="py-3 px-5 text-right">
                        <a href={item.link} target="_blank" rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-sm font-bold text-[#2563EB] hover:text-[#1D4ED8] hover:underline transition-colors"
                        >
                          Download <ExternalLink className="w-3 h-3" />
                        </a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-5 rounded-2xl bg-[#FFFBEB] border border-[#FDE68A] text-[#92400E] text-sm space-y-2">
            <p className="font-bold text-[#78350F] mb-2">⚠️ Important Notes</p>
            <p className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D97706]" /> Intel 6th / 7th / 8th Gen (below 9th Gen) — use <strong>Blender 3.0 or lower</strong>.</p>
            <p className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D97706]" /> Intel 9th–14th Gen or Ryzen 3000 and above — refer to the table above.</p>
            <p className="flex items-start gap-2"><ChevronRight className="w-3.5 h-3.5 mt-0.5 shrink-0 text-[#D97706]" /> Integrated GPUs can run Blender but rendering will be slower.</p>
          </div>
        </section>

        {/* ══════════════════════════════════════
            BLENDER CHEAT SHEET
        ══════════════════════════════════════ */}
        <section className="space-y-8">
          <div>
            <SectionHeader emoji="⌨️" title="Blender Cheat Sheet" />
            <p className="text-base text-[#6B7280] mt-1">Keep this page open during the workshop for quick reference.</p>
          </div>

          {/* Official Shortcut Card Graphics */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md bg-[#0F172A]">
              <img src="/workshop/shortcuts-1.png" alt="Blender Shortcuts Card 1" className="w-full h-auto object-contain" />
            </div>
            <div className="rounded-2xl overflow-hidden border border-[#E5E7EB] shadow-md bg-[#0F172A]">
              <img src="/workshop/shortcuts-2.png" alt="Blender Shortcuts Card 2" className="w-full h-auto object-contain" />
            </div>
          </div>

          {/* Text shortcut reference grids */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
            {SHORTCUT_SECTIONS.map((sec, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm space-y-3 hover:border-[#2563EB]/25 hover:shadow-md transition-all duration-200">
                <h3 className="text-sm font-extrabold text-[#2563EB] uppercase tracking-widest pb-2 border-b border-[#F1F5F9]">
                  {sec.title}
                </h3>
                <div className="space-y-2">
                  {sec.items.map((item, iIdx) => (
                    <div key={iIdx} className="flex items-center gap-3">
                      <span className="font-mono font-bold text-xs px-2 py-1 rounded-md bg-[#0F172A] text-white shrink-0 whitespace-nowrap">
                        {item.key}
                      </span>
                      <span className="text-sm text-[#374151] font-medium leading-snug">{item.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            WORKSHOP RESOURCES
        ══════════════════════════════════════ */}
        <section className="space-y-6">
          <div>
            <SectionHeader emoji="📦" title="Workshop Resources" />
            <p className="text-base text-[#6B7280] mt-1">
              Bookmark this page — all resources will be uploaded here after the workshop.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {RESOURCES.map((res, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-white border border-[#E5E7EB] shadow-sm flex items-center justify-between gap-3">
                <span className="text-base font-semibold text-[#111827]">{res}</span>
                <span className="text-[9px] font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-600 uppercase tracking-wider whitespace-nowrap">
                  Post-Event
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* ══════════════════════════════════════
            FOOTER STRIP: ABOUT + CONTACT
        ══════════════════════════════════════ */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* About */}
          <div className="p-8 rounded-3xl bg-white border border-[#E5E7EB] shadow-sm space-y-3">
            <h3 className="text-xl font-bold text-[#111827]">About Glyptika Studios</h3>
            <p className="text-base text-[#4B5563] leading-relaxed">
              Glyptika Studios is a student-led technology studio building products in AI, 3D, VR, and immersive technologies — fostering a community of students passionate about innovation and emerging tech.
            </p>
          </div>

          {/* Help / Instagram */}
          <div className="p-8 rounded-3xl bg-gradient-to-br from-[#FFF7ED] to-[#FEF3C7] border border-[#FDE68A] shadow-sm flex flex-col justify-between space-y-4">
            <div>
              <h3 className="text-xl font-bold text-[#78350F] mb-2">❓ Need Help?</h3>
              <p className="text-base text-[#92400E] leading-relaxed">
                Having trouble installing Blender or have questions before the workshop? Reach out to us on Instagram — we are happy to help!
              </p>
            </div>
            <a
              href="https://www.instagram.com/glyptika_studios/"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-full text-base font-bold text-white bg-[#E1306C] hover:bg-[#C13584] transition-all shadow-md w-full sm:w-auto"
            >
              <InstagramIcon className="w-4 h-4" />
              @glyptika_studios on Instagram
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </section>

      </div>
    </main>
  );
}

// ─────────────────────────────────────────
// HELPER
// ─────────────────────────────────────────
function SectionHeader({ emoji, title, light = false }: { emoji: string; title: string; light?: boolean }) {
  return (
    <h2 className={`text-2xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-2 ${light ? "text-white" : "text-[#111827]"}`}>
      <span>{emoji}</span>
      {title}
    </h2>
  );
}

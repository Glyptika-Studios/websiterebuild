"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { Search, Layers } from "lucide-react";

export default function Hero() {
  const sectionRef = useRef<HTMLDivElement>(null);

  // Parallax: hero content scrolls slightly slower for professional depth
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroY     = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.97]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Card parallax offset
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -40]);

  const serviceCards = [
    { title: "3D Modeling", desc: "Photorealistic assets & animations", color: "#2563EB" },
    { title: "VR Simulation", desc: "Defense & commercial training", color: "#2563EB" },
    { title: "AI Automation", desc: "AI-powered workflow tools", color: "#2563EB" },
    { title: "IMS", desc: "ERM for Indian Defense institutions", color: "#2563EB" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden pt-40 pb-28 md:pt-48 md:pb-32 flex flex-col justify-center min-h-screen"
      style={{ background: "radial-gradient(circle at top, rgba(238, 245, 255, 0.65) 0%, transparent 60%)" }}
    >
      {/* Looping Background Video for Home Screen Hero */}
      <div className="absolute inset-0 w-full h-full z-0 overflow-hidden">
        <video 
          src="/home_bgvid.mp4" 
          autoPlay 
          loop 
          muted 
          playsInline 
          className="absolute inset-0 w-full h-full object-cover opacity-45"
        />
        {/* Premium Google gradient overlays to blend the video smoothly */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#F8F9FA]/10 via-[#F8F9FA]/40 to-[#F8F9FA]" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#F8F9FA]/30 via-transparent to-[#F8F9FA]/30" />
      </div>

      {/* Parallax Content Wrapper */}
      <motion.div
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="relative z-10 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

          {/* Badge */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#E8F0FE] text-[#1A73E8] text-xs font-semibold tracking-wide mb-8 border border-[#D2E3FC] shadow-sm"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-[#1A73E8] animate-pulse" />
            For the Top 1%
          </motion.div>

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#111827] tracking-tight mb-5 leading-[1.1]">
              Building the Technology Of Tomorrow <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#2563EB] via-[#3B82F6] to-[#0F172A] pb-1 block">
                3D · VR · AI · Automation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#6B7280] max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
              Creating Customised, Efficient, Affordable, and Accessible technology to empower tomorrow with AI/ML enabled Automations and a Creative touch.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="#services"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-[0_10px_24px_rgba(37,99,235,0.20)] hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              Explore Services
            </Link>
            <Link
              href="#products"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl text-sm font-semibold text-[#2563EB] bg-white border border-[#2563EB] hover:bg-[#F3F7FF] shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <Layers className="w-4 h-4" />
              View Products
            </Link>
          </motion.div>

          {/* Service Cards — reduced hover lift */}
          <motion.div
            style={{ y: cardsY }}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl"
          >
            {serviceCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.55 + idx * 0.06 }}
                whileHover={{ y: -2 }}
                className="group flex flex-col items-center justify-center text-center gap-2.5 p-6 rounded-[20px] bg-white border border-[#E5E7EB] shadow-[0_12px_32px_rgba(15,23,42,0.06)] hover:-translate-y-1 hover:border-[#2563EB] hover:shadow-[0_18px_48px_rgba(15,23,42,0.08)] transition-all duration-250 cursor-default"
              >
                <span
                  className="text-sm font-semibold transition-colors duration-200"
                  style={{ color: card.color }}
                >
                  {card.title}
                </span>
                <span className="text-xs text-[#5F6368] leading-snug">{card.desc}</span>
              </motion.div>
            ))}
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
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
    { title: "3D Modeling", desc: "Photorealistic assets & animations", color: "#1A73E8" },
    { title: "VR Simulation", desc: "Defense & commercial training", color: "#0D652D" },
    { title: "AI Automation", desc: "AI-powered workflow tools", color: "#A142F4" },
    { title: "IMS", desc: "ERM for Indian Defense institutions", color: "#E37400" },
  ];

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden pt-40 pb-28 md:pt-48 md:pb-32 flex flex-col justify-center min-h-screen"
      style={{ background: "#F8F9FA" }}
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
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-[#202124] tracking-tight mb-5 leading-[1.1]">
              Building the Technology Of Tomorrow <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#1A73E8] via-[#8B5CF6] to-[#EC4899] pb-1 block">
                3D · VR · AI · Automation
              </span>
            </h1>
            <p className="text-lg md:text-xl text-[#5F6368] max-w-3xl mx-auto mb-12 font-normal leading-relaxed">
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
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-[#1A73E8] hover:bg-[#1765CC] shadow-sm hover:shadow-md transition-all duration-200"
            >
              <Search className="w-4 h-4" />
              Explore Services
            </Link>
            <Link
              href="#products"
              className="group inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-[#1A73E8] bg-white border border-[#DADCE0] hover:bg-[#F1F3F4] hover:border-[#BDC1C6] shadow-sm transition-all duration-200"
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
                className="group flex flex-col items-center justify-center text-center gap-2 p-5 rounded-2xl bg-white/95 backdrop-blur-sm border border-[#DADCE0] shadow-sm hover:shadow-md hover:border-[#BDC1C6] transition-all duration-200 cursor-default"
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
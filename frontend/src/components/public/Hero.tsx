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

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden pt-40 pb-28 md:pt-48 md:pb-32 flex flex-col justify-center min-h-screen"
    >
      {/* Home Screen Hero Grid Background */}
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

      {/* Parallax Content Wrapper */}
      <motion.div
        style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
        className="relative z-10 w-full"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

          {/* Headline */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="w-full"
          >
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-[#111827] tracking-tight mb-8 leading-[1.05] uppercase">
              Building <br />
              the Technology <br />
              <span className="text-[#2563EB] pb-1 block">
                of Tomorrow
              </span>
            </h1>
            <p className="text-lg md:text-xl lg:text-2xl text-[#374151] max-w-4xl mx-auto mb-12 font-normal leading-relaxed">
              One unified platform for 3D, virtual reality, AI, and automation — built for teams that refuse to settle for ordinary.
            </p>
          </motion.div>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.35 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-4"
          >
            <Link
              href="#services"
              className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-base font-medium text-[#111827] bg-transparent border border-[#111827] hover:bg-[#1A73E8] hover:border-[#1A73E8] hover:text-white shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <Search className="w-4 h-4 transition-colors" />
              Explore Services
            </Link>
            <Link
              href="#products"
              className="group inline-flex items-center gap-2.5 px-8 py-3 rounded-full text-base font-medium text-[#111827] bg-transparent border border-[#111827] hover:bg-[#1A73E8] hover:border-[#1A73E8] hover:text-white shadow-sm hover:-translate-y-0.5 active:scale-[0.98] transition-all duration-200"
            >
              <Layers className="w-4 h-4 transition-colors" />
              View Products
            </Link>
          </motion.div>

        </div>
      </motion.div>
    </section>
  );
}
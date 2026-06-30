"use client";

import { useRef } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

export default function ContactTeaser() {
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.9", "end 0.2"],
  });

  // Card scales up as it enters view and floats upward
  const cardScale = useTransform(scrollYProgress, [0, 0.5], [0.92, 1]);
  const cardY = useTransform(scrollYProgress, [0, 0.5], [60, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  // Inner content has a slight additional parallax offset for depth
  const contentY = useTransform(scrollYProgress, [0, 0.6], [30, 0]);

  return (
    <section ref={sectionRef} className="relative w-full py-32 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        <motion.div
          style={{
            scale: cardScale,
            y: cardY,
            opacity: cardOpacity,
          }}
          className="relative rounded-[3rem] p-10 md:p-16 text-center overflow-hidden"
          {...{
            style: {
              scale: cardScale,
              y: cardY,
              opacity: cardOpacity,
              background: "linear-gradient(135deg, rgba(37,99,235,0.12) 0%, rgba(255,255,255,0.04) 50%, rgba(99,102,241,0.10) 100%)",
              backdropFilter: "blur(40px)",
              WebkitBackdropFilter: "blur(40px)",
              border: "1px solid rgba(255,255,255,0.12)",
              boxShadow: "0 30px 100px rgba(0,0,0,0.6), 0 0 80px rgba(37,99,235,0.12), inset 0 1px 0 rgba(255,255,255,0.15), inset 0 -1px 0 rgba(37,99,235,0.08)",
            },
          }}
        >
          {/* Ambient glows inside the card */}
          <div
            className="absolute -top-1/2 -left-1/4 w-3/4 h-[150%] rounded-full blur-[120px] pointer-events-none"
            style={{ background: "rgba(37,99,235,0.20)", animation: "pulse 8s ease-in-out infinite" }}
          />
          <div
            className="absolute -bottom-1/2 -right-1/4 w-3/4 h-[150%] rounded-full blur-[100px] pointer-events-none"
            style={{ background: "rgba(99,102,241,0.15)", animation: "pulse 12s ease-in-out infinite 4s" }}
          />

          {/* Top shimmer line */}
          <div className="absolute top-0 left-1/6 w-2/3 h-px bg-gradient-to-r from-transparent via-blue-400/50 to-transparent pointer-events-none" />
          {/* Corner accents */}
          <div className="absolute top-6 left-6 w-10 h-10 rounded-tl-2xl border-t-2 border-l-2 border-blue-400/30 pointer-events-none" />
          <div className="absolute top-6 right-6 w-10 h-10 rounded-tr-2xl border-t-2 border-r-2 border-indigo-400/30 pointer-events-none" />
          <div className="absolute bottom-6 left-6 w-10 h-10 rounded-bl-2xl border-b-2 border-l-2 border-blue-400/30 pointer-events-none" />
          <div className="absolute bottom-6 right-6 w-10 h-10 rounded-br-2xl border-b-2 border-r-2 border-indigo-400/30 pointer-events-none" />

          {/* Content — with additional parallax for depth */}
          <motion.div
            style={{ y: contentY }}
            className="relative z-20 max-w-3xl mx-auto flex flex-col items-center gap-6"
          >
            {/* Sparkle badge */}
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest text-blue-300"
              style={{
                background: "rgba(37,99,235,0.12)",
                border: "1px solid rgba(37,99,235,0.25)",
                backdropFilter: "blur(8px)",
              }}
            >
              <Sparkles className="w-3 h-3" />
              Work With Us
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight">
              Request a Custom Proposal
            </h2>

            <p className="text-base md:text-lg text-slate-300 font-light leading-relaxed max-w-2xl">
              Tell us about your project and our team will craft a fully customized proposal tailored to your goals, timeline, and budget.
            </p>

            {/* CTA button — glassmorphic */}
            <Link
              href="/request-proposal"
              className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl text-base font-bold text-white overflow-hidden transition-all duration-400"
              style={{
                background: "linear-gradient(135deg, rgba(37,99,235,0.80) 0%, rgba(99,102,241,0.70) 100%)",
                backdropFilter: "blur(12px)",
                border: "1px solid rgba(255,255,255,0.20)",
                boxShadow: "0 0 30px rgba(37,99,235,0.35), inset 0 1px 0 rgba(255,255,255,0.20)",
              }}
            >
              {/* Shine sweep */}
              <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 ease-out rounded-2xl" />
              <span className="relative z-10">Request Proposal</span>
              <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </motion.div>
        </motion.div>

      </div>
    </section>
  );
}

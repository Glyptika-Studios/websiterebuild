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

  const cardY = useTransform(scrollYProgress, [0, 0.5], [30, 0]);
  const cardOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="relative w-full py-24 overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          style={{ y: cardY, opacity: cardOpacity }}
          className="relative rounded-2xl p-10 md:p-16 text-center overflow-hidden bg-[#D2E3FC] border border-[#B4D0FB] shadow-sm"
        >
          {/* Content */}
          <div className="relative z-10 max-w-3xl mx-auto flex flex-col items-center gap-5">
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-widest text-[#2563EB] bg-[#2563EB]/10 border border-[#2563EB]/20">
              <Sparkles className="w-3 h-3" />
              Work With Us
            </div>

            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-[#111827] tracking-tight">
              Request a Custom Proposal
            </h2>

            <p className="text-base md:text-lg text-[#374151] font-normal leading-relaxed max-w-2xl">
              Tell us about your project and our team will craft a fully customized proposal tailored to your goals, timeline, and budget.
            </p>

            {/* CTA button */}
            <Link
              href="/request-proposal"
              className="group inline-flex items-center justify-center gap-2.5 px-7 py-3.5 rounded-full text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] shadow-sm transition-all duration-200 mt-2"
            >
              <span>Request Proposal</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

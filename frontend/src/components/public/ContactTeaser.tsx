"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

export default function ContactTeaser() {
  return (
    <section className="relative w-full py-32 bg-[#0a0f1c] overflow-hidden">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="relative rounded-[3rem] p-10 md:p-16 text-center overflow-hidden border border-white/10 shadow-2xl"
        >
          {/* Complex Distorted Background */}
          <div className="absolute inset-0 bg-blue-900/40 backdrop-blur-3xl -z-10" />
          <div className="absolute -top-[50%] -left-[10%] w-[70%] h-[150%] bg-blue-600/50 blur-[120px] rounded-full rotate-12 -z-10 animate-pulse" style={{ animationDuration: '8s' }} />
          <div className="absolute -bottom-[50%] -right-[10%] w-[70%] h-[150%] bg-indigo-500/40 blur-[100px] rounded-full -rotate-12 -z-10 animate-pulse" style={{ animationDuration: '12s' }} />
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNSIvPjwvc3ZnPg==')] opacity-50 mix-blend-overlay -z-10" />

          {/* Content */}
          <div className="relative z-20 max-w-3xl mx-auto flex flex-col items-center">
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white tracking-tight mb-4 drop-shadow-lg">
              Request a Custom Proposal
            </h2>
            <p className="text-base md:text-lg text-white font-light mb-8 max-w-2xl leading-relaxed">
              Tell us about your project and our team will create a customized proposal tailored to your specific needs and requirements.
            </p>
            
            <Link
              href="/request-proposal"
              className="group relative flex items-center justify-center gap-3 px-8 py-4 rounded-lg text-lg font-semibold text-blue-600 bg-white hover:bg-slate-50 transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>Request Proposal</span>
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

        </motion.div>
        
      </div>
    </section>
  );
}

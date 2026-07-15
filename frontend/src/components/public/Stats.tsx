/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useMotionValue, useTransform, animate } from "framer-motion";

interface StatItem {
  id: number;
  value: number;
  suffix: string;
  label: string;
}

const MOCK_STATS: StatItem[] = [
  { id: 1, value: 10, suffix: "+", label: "Projects Delivered" },
  { id: 2, value: 4, suffix: "+", label: "Defense Projects" },
  { id: 3, value: 25, suffix: "+", label: "VR Environments" },
  { id: 4, value: 3, suffix: "", label: "Proprietary Softwares" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const count = useMotionValue(0);
  const rounded = useTransform(count, (latest) => Math.round(latest));
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const controls = animate(count, value, { duration: 1.5, ease: "easeOut" });
    return () => controls.stop();
  }, [count, value]);

  useEffect(() => {
    return rounded.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = latest.toString() + suffix;
      }
    });
  }, [rounded, suffix]);

  return <span ref={ref}>0{suffix}</span>;
}

export default function Stats() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<StatItem[]>(MOCK_STATS);

  useEffect(() => {
    setMounted(true);
    fetch("/api/v1/pages/home")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.content && Array.isArray(json.data.content.stats)) {
          const dbStats = json.data.content.stats;
          const mapped = dbStats.map((s: any, idx: number) => ({
            id: idx + 1,
            value: Number(s.value) || 0,
            suffix: s.suffix || "",
            label: s.label || ""
          }));
          if (mapped.length > 0) {
            setStats(mapped);
          }
        }
      })
      .catch(err => console.error("Error loading stats content:", err))
      .finally(() => {
        setLoading(false);
      });
  }, []);

  if (!mounted || loading) {
    return (
      <section className="relative w-full py-16 bg-transparent">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="bg-white rounded-2xl border border-[#DCE3EC] h-[100px] animate-pulse" />
        </div>
      </section>
    );
  }

  return (
    <section className="relative w-full py-16 bg-transparent">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="bg-white rounded-2xl border border-[#DCE3EC] shadow-[0_12px_32px_rgba(15,23,42,0.05)] overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 p-8 md:p-10">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="flex flex-col items-center justify-center text-center space-y-1.5 group"
              >
                <div className="text-3xl md:text-4xl font-bold text-[#202124] tracking-tight group-hover:text-[#1A73E8] transition-colors duration-200">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-[#5F6368] font-medium uppercase tracking-widest group-hover:text-[#202124] transition-colors duration-200">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

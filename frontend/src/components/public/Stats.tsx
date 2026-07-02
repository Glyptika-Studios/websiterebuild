"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

const MOCK_STATS = [
  { id: "stat-1", label: "Projects Delivered", value: 10, suffix: "+" },
  { id: "stat-2", label: "Defense Projects", value: 4, suffix: "+" },
  { id: "stat-3", label: "VR Environments", value: 25, suffix: "+" },
  { id: "stat-4", label: "Proprietary Softwares", value: 3, suffix: "" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      const duration = 2000;
      const startTime = performance.now();
      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(ease * value));
        if (progress < 1) requestAnimationFrame(animate);
      };
      requestAnimationFrame(animate);
    }
  }, [inView, value]);

  return <span ref={nodeRef}>{count}{suffix}</span>;
}

export default function Stats() {
  return (
    <section className="relative w-full py-8 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-2xl border border-[#DADCE0] shadow-sm overflow-hidden">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8 p-8 md:p-10">
            {MOCK_STATS.map((stat, index) => (
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

"use client";

import { motion, useInView } from "framer-motion";
import { useEffect, useRef, useState } from "react";

// Mock Data - structured for future API integration
const MOCK_STATS = [
  { id: "stat-1", label: "Projects Delivered", value: 10, suffix: "+" },
  { id: "stat-2", label: "Defense Projects", value: 4, suffix: "+" },
  { id: "stat-3", label: "VR Environments", value: 25, suffix: "+" },
  { id: "stat-4", label: "Proprietary Softwares Created", value: 3, suffix: "" },
];

function AnimatedCounter({ value, suffix }: { value: number; suffix: string }) {
  const [count, setCount] = useState(0);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      // Animate over 2 seconds
      const duration = 2000;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsedTime = currentTime - startTime;
        const progress = Math.min(elapsedTime / duration, 1);
        
        // Easing function (easeOutQuart)
        const easeProgress = 1 - Math.pow(1 - progress, 4);
        
        setCount(Math.floor(easeProgress * value));

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }
  }, [inView, value]);

  return (
    <span ref={nodeRef}>
      {count}{suffix}
    </span>
  );
}

export default function Stats() {
  return (
    <section className="relative w-full py-16 bg-[#0a0f1c] z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="relative rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-xl p-8 md:p-12 shadow-2xl overflow-hidden">
          
          {/* Subtle glowing lines inside the container */}
          <div className="absolute top-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          <div className="absolute bottom-0 left-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent" />
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10">
            {MOCK_STATS.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.6, delay: index * 0.1, ease: "easeOut" }}
                className="flex flex-col items-center justify-center text-center space-y-2 group"
              >
                <div className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight drop-shadow-[0_0_15px_rgba(255,255,255,0.2)] group-hover:text-blue-400 group-hover:drop-shadow-[0_0_20px_rgba(96,165,250,0.5)] transition-all duration-300">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-sm md:text-base text-slate-400 font-medium uppercase tracking-widest group-hover:text-slate-300 transition-colors">
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

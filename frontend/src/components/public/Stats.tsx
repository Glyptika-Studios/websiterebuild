"use client";

import { motion, useInView, useScroll, useTransform } from "framer-motion";
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
  const sectionRef = useRef<HTMLElement>(null);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.95", "end 0.3"],
  });

  // Glass panel floats upward with a parallax offset
  const panelY = useTransform(scrollYProgress, [0, 1], [40, -20]);
  const panelOpacity = useTransform(scrollYProgress, [0, 0.3], [0, 1]);

  return (
    <section ref={sectionRef} className="relative w-full py-12 z-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Glass panel — with parallax float */}
        <motion.div
          style={{
            y: panelY,
            opacity: panelOpacity,
            background: "linear-gradient(135deg, rgba(255,255,255,0.06) 0%, rgba(255,255,255,0.02) 50%, rgba(37,99,235,0.04) 100%)",
            backdropFilter: "blur(24px)",
            WebkitBackdropFilter: "blur(24px)",
            border: "1px solid rgba(255,255,255,0.10)",
            boxShadow: "0 8px 40px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.08), 0 0 0 1px rgba(37,99,235,0.08)",
          }}
          className="relative rounded-3xl overflow-hidden"
        >
          {/* Top edge highlight */}
          <div className="absolute top-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent" />
          {/* Bottom edge */}
          <div className="absolute bottom-0 left-1/4 w-1/2 h-px bg-gradient-to-r from-transparent via-teal-400/20 to-transparent" />

          {/* Inner glow orb */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-32 bg-blue-600/6 blur-3xl rounded-full pointer-events-none" />

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-12 relative z-10 p-8 md:p-10">
            {MOCK_STATS.map((stat, index) => (
              <motion.div
                key={stat.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="flex flex-col items-center justify-center text-center space-y-2 group"
              >
                <div className="text-4xl md:text-5xl font-bold text-white tracking-tight group-hover:text-blue-300 transition-colors duration-300 drop-shadow-[0_0_20px_rgba(96,165,250,0.3)]">
                  <AnimatedCounter value={stat.value} suffix={stat.suffix} />
                </div>
                <div className="text-xs text-slate-400 font-semibold uppercase tracking-widest group-hover:text-slate-300 transition-colors">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}

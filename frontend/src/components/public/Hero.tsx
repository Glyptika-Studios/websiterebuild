"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight, Layers } from "lucide-react";

export default function Hero() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const sectionRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<unknown>(null);

  // Parallax: hero content scrolls at 40% of scroll speed (stays visible longer)
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });
  const heroY     = useTransform(scrollYProgress, [0, 1], [0,  -120]);
  const heroScale = useTransform(scrollYProgress, [0, 0.8], [1, 0.96]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  // Badge parallax (moves faster — creates depth)
  const badgeY = useTransform(scrollYProgress, [0, 1], [0, -200]);

  // Card strip parallax (moves slower — feels heavier)
  const cardsY = useTransform(scrollYProgress, [0, 1], [0, -60]);

  useEffect(() => {
    const initVanta = () => {
      // @ts-expect-error - VANTA is loaded dynamically via external script
      if (!vantaEffect && window.VANTA && window.VANTA.HALO) {
        setVantaEffect(
          // @ts-expect-error - VANTA is loaded dynamically via external script
          window.VANTA.HALO({
            el: vantaRef.current,
            mouseControls: true,
            touchControls: true,
            gyroControls: false,
            minHeight: 200.0,
            minWidth: 200.0,
            baseColor: 0x1e3a8a,
            backgroundColor: 0x000000,
            amplitudeFactor: 1.0,
            xOffset: 0,
            yOffset: 0.1,
            size: 0.6,
          })
        );
      }
    };

    const interval = setInterval(() => {
      // @ts-expect-error - VANTA is loaded dynamically via external script
      if (window.VANTA && window.VANTA.HALO) {
        initVanta();
        clearInterval(interval);
      }
    }, 200);

    return () => {
      clearInterval(interval);
      if (vantaEffect) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (vantaEffect as any).destroy();
      }
    };
  }, [vantaEffect]);

  const glassCard = {
    background: "linear-gradient(135deg, rgba(255,255,255,0.07) 0%, rgba(255,255,255,0.02) 100%)",
    backdropFilter: "blur(16px)",
    WebkitBackdropFilter: "blur(16px)",
    border: "1px solid rgba(255,255,255,0.09)",
    boxShadow: "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)",
  };

  const serviceCards = [
    { title: "3D Modeling",  desc: "Photorealistic assets & animations",   rgb: "59,130,246" },
    { title: "VR Simulation", desc: "Defense & commercial training",        rgb: "6,182,212" },
    { title: "AI Automation", desc: "AI-powered workflow tools",            rgb: "99,102,241" },
    { title: "IMS",           desc: "ERM for Indian Defense institutions",  rgb: "20,184,166" },
  ];

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js" strategy="afterInteractive" />

      {/* The VANTA background is pinned to the section */}
      <section
        ref={sectionRef}
        className="relative w-full overflow-hidden pt-40 pb-28 md:pt-48 md:pb-32 flex flex-col justify-center min-h-screen"
        style={{ background: "transparent" }}
      >
        {/* VANTA canvas — separate div so parallax on content doesn't affect it */}
        <div
          ref={vantaRef}
          className="absolute inset-0 pointer-events-none z-0"
          aria-hidden="true"
        />

        {/* ── Parallax content wrapper ── */}
        <motion.div
          style={{ y: heroY, scale: heroScale, opacity: heroOpacity }}
          className="relative z-10 w-full"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col items-center text-center">

            {/* Subtitle Badge — faster parallax layer */}
            <motion.div
              style={{ y: badgeY }}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative inline-flex items-center gap-2 px-5 py-2 rounded-full text-blue-300 text-sm font-bold tracking-wide mb-8"
            >
              <div
                className="absolute inset-0 rounded-full pointer-events-none"
                style={{
                  background: "rgba(59,130,246,0.10)",
                  border: "1px solid rgba(59,130,246,0.22)",
                }}
              />
              <span className="relative z-10 w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
              <span className="relative z-10">For the Top 1%</span>
            </motion.div>

            {/* Headline */}
            <motion.div
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                Building the Technology Of Tomorrow <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  3D · VR · AI · Automation
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12 font-light leading-relaxed">
                Creating Customised, Efficient, Affordable, and Accessible technology to empower tomorrow with AI/ML enabled Automations and a Creative touch.
              </p>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.9, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
            >
              <Link
                href="#services"
                className="group relative inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "linear-gradient(135deg, rgba(37,99,235,0.85) 0%, rgba(59,130,246,0.70) 100%)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.20)",
                  boxShadow: "0 0 30px rgba(37,99,235,0.40), inset 0 1px 0 rgba(255,255,255,0.25)",
                }}
              >
                <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full bg-gradient-to-r from-transparent via-white/15 to-transparent transition-transform duration-700 rounded-2xl" />
                <span className="relative z-10">Explore Services</span>
                <ArrowRight className="relative z-10 w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                href="#products"
                className="group inline-flex items-center gap-2 px-8 py-4 rounded-2xl text-base font-bold text-white overflow-hidden transition-all duration-300 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  backdropFilter: "blur(12px)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  boxShadow: "0 4px 20px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.07)",
                }}
              >
                <Layers className="w-4 h-4 text-blue-400" />
                View Products
              </Link>
            </motion.div>

            {/* Glass Service Cards — slower parallax (feels heavier) */}
            <motion.div
              style={{ y: cardsY }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.1, delay: 0.8 }}
              className="grid grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-5xl"
            >
              {serviceCards.map((card, idx) => (
                <motion.div
                  key={idx}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.9 + idx * 0.08 }}
                  whileHover={{ y: -6, scale: 1.03 }}
                  className="group flex flex-col items-center justify-center text-center gap-2 p-5 rounded-2xl cursor-default overflow-hidden relative"
                  style={glassCard}
                  onMouseEnter={(e) => {
                    const el = e.currentTarget;
                    el.style.border = `1px solid rgba(${card.rgb},0.30)`;
                    el.style.boxShadow = `0 8px 30px rgba(0,0,0,0.4), 0 0 20px rgba(${card.rgb},0.15), inset 0 1px 0 rgba(255,255,255,0.10)`;
                  }}
                  onMouseLeave={(e) => {
                    const el = e.currentTarget;
                    el.style.border = "1px solid rgba(255,255,255,0.09)";
                    el.style.boxShadow = "0 4px 24px rgba(0,0,0,0.3), inset 0 1px 0 rgba(255,255,255,0.06)";
                  }}
                >
                  <div
                    className="absolute top-0 left-0 right-0 h-px pointer-events-none"
                    style={{ background: `linear-gradient(90deg, transparent, rgba(${card.rgb},0.5), transparent)` }}
                  />
                  <span className="text-sm font-bold text-blue-300 group-hover:text-white transition-colors">
                    {card.title}
                  </span>
                  <span className="text-xs text-slate-400 leading-snug">{card.desc}</span>
                </motion.div>
              ))}
            </motion.div>

          </div>
        </motion.div>
      </section>
    </>
  );
}
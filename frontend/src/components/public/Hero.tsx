"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { motion } from "framer-motion";
import { ArrowRight, Box } from "lucide-react";

export default function Hero() {
  const vantaRef = useRef<HTMLDivElement>(null);
  const [vantaEffect, setVantaEffect] = useState<unknown>(null);

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
            minHeight: 200.00,
            minWidth: 200.00,
            baseColor: 0x1e3a8a,
            backgroundColor: 0x000000,
            amplitudeFactor: 1.0,
            xOffset: 0,
            yOffset: 0.1,
            size: 0.6
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

  return (
    <>
      <Script src="https://cdnjs.cloudflare.com/ajax/libs/three.js/r134/three.min.js" strategy="afterInteractive" />
      <Script src="https://cdn.jsdelivr.net/npm/vanta@latest/dist/vanta.halo.min.js" strategy="afterInteractive" />

      <section ref={vantaRef} className="relative w-full overflow-hidden bg-[#000000] pt-40 pb-28 md:pt-48 md:pb-32 flex flex-col justify-center min-h-screen">
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 w-full flex flex-col items-center text-center">

        {/* Subtitle Badge */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="inline-flex items-center gap-2 px-6 py-2 rounded-full bg-blue-500/10 border border-blue-500/20 text-blue-400 text-sm font-medium tracking-wide mb-8"
            >
              For the Top 1%
            </motion.div>

        {/* Headline */}
        <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight mb-4">
                Building the Technology Of Tomorrow <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-300">
                  3D-VR-AI-Automation<br />Solutions
                </span>
              </h1>
              <p className="text-lg md:text-xl text-slate-300 max-w-3xl mx-auto mb-12">
                Creating Customised Efficient, Affordable, and Accessible technology to empower tomorrow with AI/ML enabled Automations and a Creative touch.
              </p>
            </motion.div>

        {/* Glowing Pill CTA */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative group mb-12"
        >
          <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row items-center justify-center gap-4"
            >
              <Link 
                href="#services" 
                className="group relative px-8 py-4 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-bold tracking-wide overflow-hidden transition-all duration-300"
              >
                Explore Services <ArrowRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link 
                href="#products" 
                className="group flex items-center gap-2 px-8 py-4 bg-[#111827] hover:bg-[#1f2937] text-white rounded-lg font-bold tracking-wide border border-white/10 transition-all duration-300"
              >
                <Box className="w-5 h-5 text-blue-400" />
                View Products
              </Link>
            </motion.div>
        </motion.div>

        {/* Service Cards Grid (Below Hero) */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full max-w-6xl mt-8"
        >
          {[
            { title: "3D Modeling", desc: "Photorealistic assets & animations", color: "text-blue-400" },
            { title: "VR Simulation", desc: "Defense & commercial training", color: "text-cyan-400" },
            { title: "Digital Automation", desc: "AI-powered workflow tools", color: "text-indigo-400" },
            { title: "Inventory Management Solutions", desc: "ERM Solution with Automated workflows customised for Indian Defense institutions", color: "text-blue-500" },
          ].map((card, idx) => {
            return (
              <motion.div
                key={idx}
                className="flex flex-col items-center justify-center text-center gap-3 p-6 rounded-2xl bg-[#0a0f1c]/40 border border-white/5 backdrop-blur-md hover:bg-[#0a0f1c]/60 transition-colors"
              >
                <span className={`text-lg font-semibold ${card.color}`}>{card.title}</span>
                <span className="text-sm text-slate-400">{card.desc}</span>
              </motion.div>
            );
          })}
        </motion.div>

      </div>
    </section>
    </>
  );
}
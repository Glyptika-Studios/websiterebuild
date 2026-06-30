"use client";

import { motion, useScroll, useTransform, useSpring } from "framer-motion";

/**
 * ScrollProgressLine — Two premium scroll-driven elements:
 *
 * 1. A thin gradient bar at the top of the viewport that fills left→right as the user scrolls.
 * 2. A vertical "rail" on the right edge with a glowing dot that descends the page,
 *    leaving a gradient trail behind it — like a design studio scroll signature.
 */
export default function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();

  // Smooth spring for the progress bar and dot
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 30,
    restDelta: 0.001,
  });

  // The trailing gradient opacity — starts fading once you've scrolled 5%
  const trailOpacity = useTransform(smoothProgress, [0, 0.05, 0.95, 1], [0, 0.6, 0.6, 0]);

  // Dot glow intensity increases then fades at bottom
  const dotGlow = useTransform(smoothProgress, [0, 0.1, 0.9, 1], [0, 1, 1, 0]);

  return (
    <>
      {/* ═══ TOP PROGRESS BAR ═══ */}
      <motion.div
        className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
        style={{
          scaleX: smoothProgress,
          background: "linear-gradient(90deg, #2563eb, #06b6d4, #818cf8)",
          boxShadow: "0 0 12px rgba(37,99,235,0.5), 0 0 30px rgba(37,99,235,0.2)",
        }}
      />

      {/* ═══ VERTICAL RAIL (right side) ═══ */}
      <div className="fixed right-6 top-0 bottom-0 z-[90] w-[1px] pointer-events-none hidden lg:block">
        {/* Static faint rail line */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(180deg, transparent 5%, rgba(37,99,235,0.08) 15%, rgba(37,99,235,0.08) 85%, transparent 95%)",
          }}
        />

        {/* Gradient trail that follows progress — the "painted" portion */}
        <motion.div
          className="absolute top-0 left-0 w-full origin-top"
          style={{
            scaleY: smoothProgress,
            opacity: trailOpacity,
            background: "linear-gradient(180deg, rgba(37,99,235,0.3) 0%, rgba(6,182,212,0.4) 50%, rgba(129,140,248,0.3) 100%)",
            height: "100%",
          }}
        />

        {/* Glowing dot that rides the rail */}
        <motion.div
          className="absolute left-1/2 -translate-x-1/2"
          style={{
            top: useTransform(smoothProgress, [0, 1], ["5%", "95%"]),
            opacity: dotGlow,
          }}
        >
          {/* Outer glow */}
          <div
            className="w-5 h-5 rounded-full absolute -top-2.5 -left-2.5"
            style={{
              background: "radial-gradient(circle, rgba(37,99,235,0.5) 0%, transparent 70%)",
            }}
          />
          {/* Inner dot */}
          <div
            className="w-2 h-2 rounded-full"
            style={{
              background: "linear-gradient(135deg, #60a5fa, #06b6d4)",
              boxShadow: "0 0 8px rgba(37,99,235,0.8), 0 0 20px rgba(37,99,235,0.4)",
            }}
          />
        </motion.div>
      </div>
    </>
  );
}

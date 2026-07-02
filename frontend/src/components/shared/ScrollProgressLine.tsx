"use client";

import { motion, useScroll, useSpring } from "framer-motion";

/**
 * ScrollProgressLine — Clean thin progress bar at the top of the viewport.
 */
export default function ScrollProgressLine() {
  const { scrollYProgress } = useScroll();

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <motion.div
      className="fixed top-0 left-0 right-0 z-[100] h-[2px] origin-left"
      style={{
        scaleX: smoothProgress,
        background: "#1A73E8",
      }}
    />
  );
}

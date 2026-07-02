"use client";

import { useEffect, useState, useTransition } from "react";

export function useScrollProgress() {
  const [progress, setProgress] = useState(0);
  const [mousePos, setMousePos] = useState({ x: 0.5, y: 0.5 });
  const [reducedMotion, setReducedMotion] = useState(false);
  const [, startTransition] = useTransition();

  useEffect(() => {
    // Check reduced motion preference
    const mediaQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReducedMotion(mediaQuery.matches);

    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    mediaQuery.addEventListener("change", handleMotionChange);

    const handleScroll = () => {
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll <= 0) return;
      const rawProgress = window.scrollY / totalScroll;
      startTransition(() => {
        setProgress(Math.max(0, Math.min(1, rawProgress)));
      });
    };

    const handleMouseMove = (e: MouseEvent) => {
      startTransition(() => {
        setMousePos({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
        });
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    handleScroll(); // initialize

    return () => {
      mediaQuery.removeEventListener("change", handleMotionChange);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  return {
    progress,
    mouseX: mousePos.x,
    mouseY: mousePos.y,
    reducedMotion,
  };
}

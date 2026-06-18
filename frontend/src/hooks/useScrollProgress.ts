"use client";

import { useEffect, useRef, useState } from "react";

export interface ScrollState {
  progress: number;   // 0 → 1, normalized scroll position
  mouseX: number;     // 0 → 1, normalized mouse X within viewport
  mouseY: number;     // 0 → 1, normalized mouse Y within viewport
  reducedMotion: boolean;
}

const INITIAL: ScrollState = {
  progress: 0,
  mouseX: 0.5,
  mouseY: 0.5,
  reducedMotion: false,
};

export function useScrollProgress(): ScrollState {
  const [state, setState] = useState<ScrollState>(INITIAL);
  const rafRef = useRef<number | null>(null);
  const targetRef = useRef({ progress: 0, mouseX: 0.5, mouseY: 0.5 });
  const currentRef = useRef({ progress: 0, mouseX: 0.5, mouseY: 0.5 });
  const reducedMotionRef = useRef(false);

  useEffect(() => {
    // Detect reduced motion
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    reducedMotionRef.current = mq.matches;
    const onMqChange = (e: MediaQueryListEvent) => {
      reducedMotionRef.current = e.matches;
    };
    mq.addEventListener("change", onMqChange);

    // Update target scroll progress on scroll
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      targetRef.current.progress = max > 0 ? Math.min(1, window.scrollY / max) : 0;
    };

    // Update target mouse on move
    const onMouse = (e: MouseEvent) => {
      if (reducedMotionRef.current) return;
      targetRef.current.mouseX = e.clientX / window.innerWidth;
      targetRef.current.mouseY = e.clientY / window.innerHeight;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });

    // Smoothly lerp current values toward target each frame
    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
    const LERP_SCROLL = 0.06; // slower = smoother
    const LERP_MOUSE  = 0.08;

    const tick = () => {
      const t = targetRef.current;
      const c = currentRef.current;
      const rm = reducedMotionRef.current;

      const nextProgress = rm ? t.progress : lerp(c.progress, t.progress, LERP_SCROLL);
      const nextMouseX   = rm ? t.mouseX   : lerp(c.mouseX,   t.mouseX,   LERP_MOUSE);
      const nextMouseY   = rm ? t.mouseY   : lerp(c.mouseY,   t.mouseY,   LERP_MOUSE);

      const changed =
        Math.abs(nextProgress - c.progress) > 0.0001 ||
        Math.abs(nextMouseX   - c.mouseX)   > 0.0001 ||
        Math.abs(nextMouseY   - c.mouseY)   > 0.0001;

      if (changed) {
        c.progress = nextProgress;
        c.mouseX   = nextMouseX;
        c.mouseY   = nextMouseY;
        setState({
          progress: nextProgress,
          mouseX:   nextMouseX,
          mouseY:   nextMouseY,
          reducedMotion: rm,
        });
      }

      rafRef.current = requestAnimationFrame(tick);
    };

    rafRef.current = requestAnimationFrame(tick);

    // Seed initial scroll position
    onScroll();

    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
      mq.removeEventListener("change", onMqChange);
    };
  }, []);

  return state;
}

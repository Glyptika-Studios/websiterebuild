"use client";

import React, { useEffect, useRef } from "react";

interface AmbientGridProps {
  progress: number;
  reducedMotion: boolean;
}

function mapGridOpacity(progress: number): number {
  // Multi-stop interpolation for grid visibility
  const stops = [
    { p: 0.00, o: 0.04 },
    { p: 0.25, o: 0.10 },
    { p: 0.55, o: 0.07 },
    { p: 0.80, o: 0.12 },
    { p: 1.00, o: 0.05 },
  ];

  for (let i = 1; i < stops.length; i++) {
    if (progress <= stops[i].p) {
      const t = (progress - stops[i - 1].p) / (stops[i].p - stops[i - 1].p);
      return stops[i - 1].o + (stops[i].o - stops[i - 1].o) * t;
    }
  }
  return stops[stops.length - 1].o;
}

export default function AmbientGrid({ progress, reducedMotion }: AmbientGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const opacityRef = useRef(0.04);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const SPACING    = 80;          // px between grid lines
    const LINE_COLOR = "rgba(26, 115, 232, 1)"; // Google blue tinted grid lines

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const targetOpacity = reducedMotion ? 0.03 : mapGridOpacity(opacityRef.current);
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth   = 0.5;
      ctx.globalAlpha = targetOpacity;

      // Vertical lines
      for (let x = 0; x < W; x += SPACING) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, H);
        ctx.stroke();
      }

      // Horizontal lines
      for (let y = 0; y < H; y += SPACING) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      ctx.globalAlpha = 1;
      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, [reducedMotion]);

  useEffect(() => {
    opacityRef.current = progress;
  }, [progress]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 1,
        willChange: "opacity",
      }}
    />
  );
}

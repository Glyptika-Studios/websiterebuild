"use client";

import React, { useEffect, useRef } from "react";

interface AmbientGridProps {
  progress: number;
  reducedMotion: boolean;
}

function mapGridOpacity(progress: number): number {
  // Multi-stop interpolation for subtle grid line visibility (6% to 12% opacity)
  const stops = [
    { p: 0.00, o: 0.08 },
    { p: 0.25, o: 0.12 },
    { p: 0.55, o: 0.09 },
    { p: 0.80, o: 0.14 },
    { p: 1.00, o: 0.10 },
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
  const opacityRef = useRef(0.08);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const SPACING = 72; // Spacing in px (reduced from 96px to 72px for slightly smaller boxes)
    const LINE_COLOR = "rgba(37, 99, 235, 1)"; // Google blue grid lines

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      const targetOpacity = reducedMotion ? 0.06 : mapGridOpacity(opacityRef.current);

      // Draw grid lines
      ctx.strokeStyle = LINE_COLOR;
      ctx.lineWidth = 2.5; // Thicker weight for soft, subtle grid line aesthetic
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
        WebkitMaskImage: "radial-gradient(circle at 50% 50%, black 45%, transparent 88%)",
        maskImage: "radial-gradient(circle at 50% 50%, black 45%, transparent 88%)",
      }}
    />
  );
}

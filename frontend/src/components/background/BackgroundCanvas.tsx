"use client";

import React, { useMemo } from "react";
import AmbientGrid from "./AmbientGrid";

interface BackgroundCanvasProps {
  progress: number;
  mouseX: number;
  mouseY: number;
  reducedMotion: boolean;
}

// ─── Glow blob definitions ────────────────────────────────────────────────────
// Each blob belongs to a scroll zone [start, end] (0-1).
// Opacity peaks at the midpoint of its zone, fades in/out at edges.
// This creates vivid FLASH of colour rather than gradual grey blending.
const GLOW_BLOBS = [
  {
    // Hero — electric blue, top-centre
    zone: [0.00, 0.28] as [number, number],
    color: "37,99,235",
    maxOpacity: 0.28,
    size: "80vw",
    xPct: 52,
    yPct: 28,
    parallaxStrength: 0.06, // how far it drifts on scroll (fraction of viewport)
    blurPx: 140,
    animDuration: "9s",
  },
  {
    // Services — teal, left edge
    zone: [0.18, 0.50] as [number, number],
    color: "20,184,166",
    maxOpacity: 0.22,
    size: "65vw",
    xPct: 12,
    yPct: 55,
    parallaxStrength: -0.08,
    blurPx: 130,
    animDuration: "11s",
  },
  {
    // Portfolio — indigo, right edge
    zone: [0.38, 0.68] as [number, number],
    color: "99,102,241",
    maxOpacity: 0.20,
    size: "70vw",
    xPct: 88,
    yPct: 62,
    parallaxStrength: 0.07,
    blurPx: 150,
    animDuration: "13s",
  },
  {
    // Lab — cyan, centre-right
    zone: [0.58, 0.82] as [number, number],
    color: "6,182,212",
    maxOpacity: 0.18,
    size: "55vw",
    xPct: 60,
    yPct: 72,
    parallaxStrength: -0.05,
    blurPx: 120,
    animDuration: "10s",
  },
  {
    // Footer — deep violet, bottom
    zone: [0.75, 1.00] as [number, number],
    color: "124,58,237",
    maxOpacity: 0.16,
    size: "50vw",
    xPct: 40,
    yPct: 88,
    parallaxStrength: 0.04,
    blurPx: 110,
    animDuration: "14s",
  },
];

function triangleOpacity(
  progress: number,
  zone: [number, number],
  maxOpacity: number
): number {
  const [start, end] = zone;
  if (progress < start || progress > end) return 0;
  const mid = (start + end) / 2;
  const raw =
    progress <= mid
      ? (progress - start) / (mid - start)
      : (end - progress) / (end - mid);
  // ease-in-out the raw triangle
  return maxOpacity * (raw * raw * (3 - 2 * raw));
}

export default function BackgroundCanvas({
  progress,
  mouseX,
  mouseY,
  reducedMotion,
}: BackgroundCanvasProps) {
  // Mouse-glow opacity — brighter in mid sections
  const mouseGlowOpacity = useMemo(() => {
    const stops = [
      { p: 0.0, o: 0.10 },
      { p: 0.4, o: 0.20 },
      { p: 0.8, o: 0.12 },
      { p: 1.0, o: 0.06 },
    ];
    for (let i = 1; i < stops.length; i++) {
      if (progress <= stops[i].p) {
        const t = (progress - stops[i - 1].p) / (stops[i].p - stops[i - 1].p);
        return stops[i - 1].o + (stops[i].o - stops[i - 1].o) * t;
      }
    }
    return 0.06;
  }, [progress]);

  return (
    <>
      {/* ── Fixed dark base — never changes, no colour interpolation ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, backgroundColor: "#060C18" }}
      />

      {/* ── Vivid scroll-zone glow blobs ── */}
      {GLOW_BLOBS.map((blob, idx) => {
        const opacity = reducedMotion ? 0 : triangleOpacity(progress, blob.zone, blob.maxOpacity);
        // Parallax: blob drifts vertically as scroll progress changes
        const midZone = (blob.zone[0] + blob.zone[1]) / 2;
        const drift = reducedMotion ? 0 : (progress - midZone) * blob.parallaxStrength * 100;

        return (
          <div
            key={idx}
            aria-hidden="true"
            className="fixed pointer-events-none"
            style={{
              zIndex: 0,
              left: `${blob.xPct}%`,
              top: `${blob.yPct}%`,
              width: blob.size,
              height: blob.size,
              borderRadius: "50%",
              transform: `translate(-50%, calc(-50% + ${drift}vh))`,
              background: `radial-gradient(ellipse at center, rgba(${blob.color},${opacity}) 0%, transparent 70%)`,
              filter: `blur(${blob.blurPx}px)`,
              transition: reducedMotion
                ? "none"
                : "opacity 0.25s ease-out, transform 0.6s ease-out",
              animation: reducedMotion
                ? "none"
                : `glowBreathe ${blob.animDuration} ease-in-out infinite`,
              willChange: "transform, opacity",
            }}
          />
        );
      })}

      {/* ── Interactive mouse glow — always electric blue, tracks cursor ── */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `radial-gradient(ellipse 50% 40% at ${mouseX * 100}% ${mouseY * 60 + 20}%, rgba(37,99,235,${mouseGlowOpacity}) 0%, transparent 70%)`,
          transition: reducedMotion ? "none" : "background 0.5s ease-out",
        }}
      />

      {/* ── Blueprint grid ── */}
      <AmbientGrid progress={progress} reducedMotion={reducedMotion} />
    </>
  );
}

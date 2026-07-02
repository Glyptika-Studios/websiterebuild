"use client";

import React, { useMemo } from "react";
import AmbientGrid from "./AmbientGrid";

interface BackgroundCanvasProps {
  progress: number;
  mouseX: number;
  mouseY: number;
  reducedMotion: boolean;
}

// Glow blobs designed to fit a light Google Developers layout.
const GLOW_BLOBS = [
  {
    // Hero — soft Google blue, top-centre
    zone: [0.00, 0.28] as [number, number],
    color: "26, 115, 232", // Google Blue
    maxOpacity: 0.12,
    size: "75vw",
    xPct: 52,
    yPct: 25,
    parallaxStrength: 0.05,
    blurPx: 120,
    animDuration: "10s",
  },
  {
    // Services — soft amber/orange, left
    zone: [0.18, 0.50] as [number, number],
    color: "230, 120, 20", // Amber
    maxOpacity: 0.08,
    size: "65vw",
    xPct: 15,
    yPct: 50,
    parallaxStrength: -0.06,
    blurPx: 130,
    animDuration: "12s",
  },
  {
    // Projects — soft purple, right
    zone: [0.38, 0.68] as [number, number],
    color: "161, 66, 244", // Purple
    maxOpacity: 0.08,
    size: "70vw",
    xPct: 85,
    yPct: 60,
    parallaxStrength: 0.06,
    blurPx: 140,
    animDuration: "14s",
  },
  {
    // Lab — soft rose, centre-right
    zone: [0.58, 0.82] as [number, number],
    color: "244, 63, 94", // Rose
    maxOpacity: 0.06,
    size: "60vw",
    xPct: 60,
    yPct: 70,
    parallaxStrength: -0.04,
    blurPx: 110,
    animDuration: "11s",
  },
  {
    // Footer — soft warm gold/beige, bottom
    zone: [0.75, 1.00] as [number, number],
    color: "227, 116, 0", // Gold
    maxOpacity: 0.08,
    size: "55vw",
    xPct: 40,
    yPct: 85,
    parallaxStrength: 0.03,
    blurPx: 100,
    animDuration: "15s",
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
  return maxOpacity * (raw * raw * (3 - 2 * raw));
}

export default function BackgroundCanvas({
  progress,
  mouseX,
  mouseY,
  reducedMotion,
}: BackgroundCanvasProps) {
  // Soft mouse-glow intensity stops
  const mouseGlowOpacity = useMemo(() => {
    const stops = [
      { p: 0.0, o: 0.06 },
      { p: 0.4, o: 0.12 },
      { p: 0.8, o: 0.08 },
      { p: 1.0, o: 0.04 },
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
      {/* Fixed Google background base */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{ zIndex: 0, backgroundColor: "#F8F9FA" }}
      />

      {/* Crème glow blobs */}
      {GLOW_BLOBS.map((blob, idx) => {
        const opacity = reducedMotion ? 0 : triangleOpacity(progress, blob.zone, blob.maxOpacity);
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

      {/* Interactive mouse glow orb (Google blue) */}
      <div
        aria-hidden="true"
        className="fixed inset-0 pointer-events-none"
        style={{
          zIndex: 0,
          background: `radial-gradient(ellipse 50% 40% at ${mouseX * 100}% ${mouseY * 60 + 20}%, rgba(26, 115, 232, ${mouseGlowOpacity}) 0%, transparent 70%)`,
          transition: reducedMotion ? "none" : "background 0.5s ease-out",
        }}
      />

      {/* Blueprint grid */}
      <AmbientGrid progress={progress} reducedMotion={reducedMotion} />
    </>
  );
}

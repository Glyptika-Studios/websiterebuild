"use client";

import { useEffect, useRef } from "react";

/**
 * NoiseOverlay — renders static procedural grain onto a fixed canvas.
 * Generated once on mount; never re-animated for performance.
 * Opacity is ~3-4%, barely perceptible — adds texture to prevent flat surfaces.
 */
export default function NoiseOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const W = window.innerWidth;
    const H = window.innerHeight;
    canvas.width  = W;
    canvas.height = H;

    // Fill with random grayscale noise
    const imageData = ctx.createImageData(W, H);
    const data = imageData.data;
    for (let i = 0; i < data.length; i += 4) {
      const v = Math.floor(Math.random() * 255);
      data[i]     = v;   // R
      data[i + 1] = v;   // G
      data[i + 2] = v;   // B
      data[i + 3] = 255; // A (opacity controlled by canvas CSS)
    }
    ctx.putImageData(imageData, 0, 0);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{
        zIndex: 1,
        opacity: 0.032,
        mixBlendMode: "overlay",
        willChange: "opacity",
      }}
    />
  );
}

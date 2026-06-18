"use client";

import { useEffect, useRef } from "react";

interface SignatureObjectProps {
  progress: number;
  mouseX: number;
  mouseY: number;
  reducedMotion: boolean;
}

// ─── Icosahedron geometry ────────────────────────────────────────────────────
const PHI = (1 + Math.sqrt(5)) / 2;

// 12 vertices of a unit icosahedron
const RAW_VERTS: [number, number, number][] = [
  [-1,  PHI, 0], [ 1,  PHI, 0], [-1, -PHI, 0], [ 1, -PHI, 0],
  [0, -1,  PHI], [0,  1,  PHI], [0, -1, -PHI], [0,  1, -PHI],
  [ PHI, 0, -1], [ PHI, 0,  1], [-PHI, 0, -1], [-PHI, 0,  1],
];

// 30 edges connecting adjacent vertices
const EDGES: [number, number][] = [
  [0,1],[0,5],[0,7],[0,10],[0,11],
  [1,5],[1,7],[1,8],[1,9],
  [2,3],[2,4],[2,6],[2,10],[2,11],
  [3,4],[3,6],[3,8],[3,9],
  [4,5],[4,9],[4,11],
  [5,9],[5,11],
  [6,7],[6,8],[6,10],
  [7,8],[7,10],
  [8,9],[10,11],
];

// Normalise vertices to unit sphere
const VERTS = RAW_VERTS.map(([x, y, z]) => {
  const len = Math.sqrt(x * x + y * y + z * z);
  return [x / len, y / len, z / len] as [number, number, number];
});

// ─── Math helpers ────────────────────────────────────────────────────────────
function rotY(v: [number, number, number], a: number): [number, number, number] {
  return [
    v[0] * Math.cos(a) + v[2] * Math.sin(a),
    v[1],
    -v[0] * Math.sin(a) + v[2] * Math.cos(a),
  ];
}

function rotX(v: [number, number, number], a: number): [number, number, number] {
  return [
    v[0],
    v[1] * Math.cos(a) - v[2] * Math.sin(a),
    v[1] * Math.sin(a) + v[2] * Math.cos(a),
  ];
}

function project(
  v: [number, number, number],
  cx: number,
  cy: number,
  scale: number,
  fov: number
): [number, number, number] {
  const z = v[2] + fov;
  const s = scale * fov / z;
  return [cx + v[0] * s, cy + v[1] * s, v[2]];
}

// ─── Scroll-driven brightness ─────────────────────────────────────────────────
function getBrightness(progress: number): number {
  // hero dim → services/portfolio bright → footer dim
  const stops = [
    { p: 0.00, b: 0.4 },
    { p: 0.25, b: 0.7 },
    { p: 0.55, b: 0.9 },
    { p: 0.80, b: 0.75 },
    { p: 1.00, b: 0.35 },
  ];
  for (let i = 1; i < stops.length; i++) {
    if (progress <= stops[i].p) {
      const t = (progress - stops[i - 1].p) / (stops[i].p - stops[i - 1].p);
      return stops[i - 1].b + (stops[i].b - stops[i - 1].b) * t;
    }
  }
  return 0.35;
}

// ─── Component ───────────────────────────────────────────────────────────────
export default function SignatureObject({
  progress,
  mouseX,
  mouseY,
  reducedMotion,
}: SignatureObjectProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Live values via refs (no re-renders from props)
  const progressRef     = useRef(progress);
  const mouseXRef       = useRef(mouseX);
  const mouseYRef       = useRef(mouseY);
  const reducedMotionRef = useRef(reducedMotion);

  useEffect(() => { progressRef.current     = progress;     }, [progress]);
  useEffect(() => { mouseXRef.current       = mouseX;       }, [mouseX]);
  useEffect(() => { mouseYRef.current       = mouseY;       }, [mouseY]);
  useEffect(() => { reducedMotionRef.current = reducedMotion; }, [reducedMotion]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let rafId: number;
    let angleY = 0;
    let floatT = 0;

    const resize = () => {
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const draw = () => {
      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      const rm = reducedMotionRef.current;

      // Continuous slow rotation on Y axis
      if (!rm) {
        angleY += 0.002;
        floatT += 0.008;
      }

      // Mouse tilt — maps 0→1 mouse position to ±5° (0.087 rad)
      const tiltX = (mouseYRef.current - 0.5) * 0.087 * 2;
      const tiltY = angleY + (mouseXRef.current - 0.5) * 0.087 * 2;

      // Float offset
      const floatOffset = rm ? 0 : Math.sin(floatT) * 18;

      // Canvas center — right-of-center on large screens
      const isMobile = W < 768;
      const cx = isMobile ? W * 0.5 : W * 0.75;
      const cy = H * 0.48 + floatOffset;
      const scale = isMobile ? H * 0.14 : H * 0.22;
      const FOV   = 3.5;

      const brightness = getBrightness(progressRef.current);

      // Transform vertices
      const transformed = VERTS.map((v) => {
        let t = rotY(v, tiltY);
        t = rotX(t, tiltX);
        return t;
      });

      // Draw edges
      EDGES.forEach(([ai, bi]) => {
        const a = project(transformed[ai], cx, cy, scale, FOV);
        const b = project(transformed[bi], cx, cy, scale, FOV);

        // Depth-based alpha (far edges fade slightly)
        const avgZ    = (transformed[ai][2] + transformed[bi][2]) / 2;
        const depthAlpha = 0.3 + (avgZ + 1) * 0.35; // 0.3 → 1.0

        const alpha = depthAlpha * brightness;

        ctx.beginPath();
        ctx.moveTo(a[0], a[1]);
        ctx.lineTo(b[0], b[1]);
        ctx.strokeStyle = `rgba(96, 165, 250, ${alpha.toFixed(3)})`; // blue-400
        ctx.lineWidth = isMobile ? 0.8 : 1.0;
        ctx.stroke();
      });

      // Draw vertex dots
      transformed.forEach((v) => {
        const [px, py] = project(v, cx, cy, scale, FOV);
        const depthAlpha = 0.4 + (v[2] + 1) * 0.3;
        ctx.beginPath();
        ctx.arc(px, py, isMobile ? 1.5 : 2, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(147, 197, 253, ${(depthAlpha * brightness).toFixed(3)})`; // blue-300
        ctx.fill();
      });

      rafId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(rafId);
      window.removeEventListener("resize", resize);
    };
  }, []); // intentional — all live state via refs


  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="fixed inset-0 w-full h-full pointer-events-none"
      style={{ zIndex: 3 }}
    />
  );
}

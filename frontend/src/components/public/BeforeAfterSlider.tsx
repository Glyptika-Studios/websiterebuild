"use client";

import React, { useState, useRef, useEffect } from "react";
import { Move, Cpu } from "lucide-react";
import Image from "next/image";

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50); // percentage 0-100
  const [isDragging, setIsDragging] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const percentage = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPos(percentage);
  };

  const onMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const onMouseUp = () => {
    setIsDragging(false);
  };

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

  // Attach global listeners while dragging to ensure smooth tracking outside the bounds
  useEffect(() => {
    if (isDragging) {
      window.addEventListener("mousemove", onMouseMove);
      window.addEventListener("mouseup", onMouseUp);
      window.addEventListener("touchmove", onTouchMove);
      window.addEventListener("touchend", onMouseUp);
    }

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseup", onMouseUp);
      window.removeEventListener("touchmove", onTouchMove);
      window.removeEventListener("touchend", onMouseUp);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDragging]);

  return (
    <section className="py-24 relative z-20 overflow-hidden border-t border-white/5 bg-[#010409]">
      {/* Background Decorative Mesh Grid */}
      <div className="absolute inset-0 pointer-events-none opacity-20">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/10 blur-[120px] rounded-full" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center mb-16">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/30 text-blue-400 text-[10px] font-black uppercase tracking-widest mb-4">
            <Cpu className="w-3.5 h-3.5 animate-spin" style={{ animationDuration: "3s" }} />
            Synthesis Sandbox
          </span>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white mt-2 mb-4 font-space">
            Procedural 2D to 3D Generation
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto font-light text-sm sm:text-base leading-relaxed">
            Drag the slider to interactively witness how our automated compiler reads a static 2D vector CAD blueprint blueprint and extrudes a photorealistic 3D environment in real-time.
          </p>
        </div>

        {/* Draggable Component Frame */}
        <div className="max-w-4xl mx-auto">
          <div 
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative aspect-video w-full rounded-[2.5rem] bg-[#020617] border border-white/15 overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.8)] select-none cursor-ew-resize group"
          >
            
            {/* UNDERLAY SIDE (Right): Photorealistic 3D Render */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80"
                alt="3D Space Environment Visualisation"
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover pointer-events-none"
              />
              
              {/* Dynamic HUD Overlays for 3D */}
              <div className="absolute top-6 right-6 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[10px] font-mono tracking-wider font-bold text-emerald-400 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-ping" />
                <span>RENDER STATE: FULL SHADER COMPLETED (99.98% MATCH)</span>
              </div>
              <div className="absolute bottom-6 right-6 z-10 bg-black/65 backdrop-blur-md border border-white/10 p-4 rounded-xl text-[9px] font-mono text-slate-400 space-y-1">
                <div>POLYCOUNT: <span className="text-white font-bold">1,452,890 triangles</span></div>
                <div>RENDER ENGINE: <span className="text-blue-400 font-bold">WebGL WebXR GRID</span></div>
                <div>LIGHTING: <span className="text-yellow-400 font-bold">Bespoke Raytraced Bake</span></div>
              </div>
            </div>

            {/* OVERLAY SIDE (Left): 2D Vector CAD Blueprint */}
            <div 
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div 
                className="absolute inset-y-0 left-0 w-full h-full bg-[#050a18] flex items-center justify-center"
                style={{ width: containerRef.current?.getBoundingClientRect().width || "100%" }}
              >
                {/* Grid Blueprint Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:24px_24px] opacity-75" />
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#1d4ed8/15_1px,transparent_1px),linear-gradient(to_bottom,#1d4ed8/15_1px,transparent_1px)] bg-[size:120px_120px]" />
                
                {/* CAD Drawings SVG (Highly Detailed Layout) */}
                <svg className="w-11/12 h-5/6 opacity-85 text-blue-500/80 stroke-current z-10" viewBox="0 0 800 500" fill="none" strokeWidth="1.5">
                  {/* Exterior Walls */}
                  <rect x="50" y="50" width="700" height="400" rx="4" strokeDasharray="8 4" strokeWidth="1" />
                  <rect x="55" y="55" width="690" height="390" rx="2" strokeWidth="2" className="text-cyan-400" />
                  
                  {/* Grid Lines & Dimension lines */}
                  <line x1="50" y1="250" x2="750" y2="250" strokeDasharray="3 3" className="text-blue-800" strokeWidth="1" />
                  <line x1="300" y1="50" x2="300" y2="450" strokeDasharray="3 3" className="text-blue-800" strokeWidth="1" />
                  <line x1="550" y1="50" x2="550" y2="450" strokeDasharray="3 3" className="text-blue-800" strokeWidth="1" />

                  {/* Room Dividers */}
                  {/* Conference Room */}
                  <rect x="55" y="55" width="245" height="195" strokeWidth="2" className="text-cyan-400/90" />
                  <line x1="120" y1="55" x2="120" y2="250" strokeWidth="1.5" />
                  <circle cx="180" cy="150" r="40" className="text-slate-700" strokeWidth="1" />
                  {/* Conference Table Chairs */}
                  <rect x="170" y="85" width="20" height="15" rx="3" strokeWidth="1" />
                  <rect x="170" y="200" width="20" height="15" rx="3" strokeWidth="1" />
                  <rect x="125" y="140" width="15" height="20" rx="3" strokeWidth="1" />
                  <rect x="220" y="140" width="15" height="20" rx="3" strokeWidth="1" />
                  <text x="110" y="230" fill="currentColor" fontSize="10" fontFamily="monospace" className="stroke-none font-bold text-cyan-400">CONF_ROOM_A (2940x2210)</text>

                  {/* Executive Office */}
                  <rect x="300" y="55" width="250" height="195" strokeWidth="2" className="text-cyan-400/90" />
                  <rect x="370" y="90" width="110" height="50" rx="3" strokeWidth="1.5" />
                  <circle cx="425" cy="170" r="16" strokeWidth="1.5" />
                  <text x="350" y="230" fill="currentColor" fontSize="10" fontFamily="monospace" className="stroke-none font-bold text-cyan-400">EXEC_OFFICE_B (3000x2210)</text>

                  {/* Open Workstations */}
                  <rect x="550" y="55" width="195" height="390" strokeWidth="2" className="text-cyan-400/90" />
                  {/* Desks */}
                  <rect x="580" y="90" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="580" y="150" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="580" y="270" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="580" y="330" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="660" y="90" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="660" y="150" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="660" y="270" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="660" y="330" width="55" height="35" rx="2" strokeWidth="1" />
                  <text x="590" y="420" fill="currentColor" fontSize="10" fontFamily="monospace" className="stroke-none font-bold text-cyan-400">OPEN_WORK_C</text>

                  {/* Mechanical Room */}
                  <rect x="55" y="250" width="245" height="195" strokeWidth="2" className="text-cyan-400/90" />
                  {/* Circular system pipes */}
                  <circle cx="120" cy="350" r="30" strokeWidth="1" strokeDasharray="4 2" />
                  <circle cx="210" cy="350" r="30" strokeWidth="1" strokeDasharray="4 2" />
                  <path d="M 120 320 L 210 320" strokeWidth="1.5" />
                  <path d="M 120 380 L 210 380" strokeWidth="1.5" />
                  <text x="100" y="420" fill="currentColor" fontSize="10" fontFamily="monospace" className="stroke-none font-bold text-cyan-400">SERVER_ROOM_D</text>

                  {/* Hallway and doors details */}
                  <rect x="300" y="250" width="250" height="195" strokeWidth="2" className="text-cyan-400/90" />
                  <path d="M 330 250 A 30 30 0 0 1 300 280 L 300 250 Z" className="text-blue-400" strokeWidth="1.5" />
                  <path d="M 520 250 A 30 30 0 0 0 550 280 L 550 250 Z" className="text-blue-400" strokeWidth="1.5" />
                  <text x="380" y="350" fill="currentColor" fontSize="12" fontFamily="monospace" className="stroke-none font-bold text-blue-400">LOBBY_E</text>

                  {/* Standard CAD Dimension Indicators */}
                  <line x1="30" y1="50" x2="30" y2="450" strokeWidth="1" className="text-slate-600" />
                  <path d="M 27 55 L 30 50 L 33 55" strokeWidth="1" className="text-slate-600" />
                  <path d="M 27 445 L 30 450 L 33 445" strokeWidth="1" className="text-slate-600" />
                  
                  <line x1="50" y1="470" x2="750" y2="470" strokeWidth="1" className="text-slate-600" />
                  <path d="M 55 467 L 50 470 L 55 473" strokeWidth="1" className="text-slate-600" />
                  <path d="M 745 467 L 750 470 L 745 473" strokeWidth="1" className="text-slate-600" />
                </svg>

                {/* HUD Overlay for CAD side */}
                <div className="absolute top-6 left-6 z-10 bg-black/60 backdrop-blur-md border border-white/10 px-4 py-2 rounded-xl text-[10px] font-mono tracking-wider font-bold text-cyan-400 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-cyan-400 rounded-full animate-pulse" />
                  <span>CAD PARSING CORE: ACTIVE</span>
                </div>
                <div className="absolute bottom-6 left-6 z-10 bg-black/65 backdrop-blur-md border border-white/10 p-4 rounded-xl text-[9px] font-mono text-slate-400 space-y-1">
                  <div>BLUEPRINT: <span className="text-white font-bold">2D_WORKPLACE_LAYOUT.DXF</span></div>
                  <div>DETECTED WALLS: <span className="text-cyan-400 font-bold">144 SEGMENTS</span></div>
                  <div>SCALE RATIO: <span className="text-yellow-400 font-bold">1:50 METRIC</span></div>
                </div>
              </div>
            </div>

            {/* THE SLIDER DIVIDER BAR */}
            <div 
              className="absolute inset-y-0 w-[3px] bg-gradient-to-b from-blue-400 via-cyan-300 to-indigo-400 z-30"
              style={{ left: `${sliderPos}%` }}
            >
              {/* Draggable Circle Orb */}
              <div 
                className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-12 h-12 rounded-full bg-slate-900 border-2 border-cyan-400 flex items-center justify-center shadow-[0_0_20px_rgba(34,211,238,0.7)] group-hover:scale-110 transition-transform duration-300 pointer-events-none"
              >
                <Move className="w-4 h-4 text-cyan-400" />
              </div>
              
              {/* Drag instruction helper (Hidden on mobile) */}
              <div 
                className="hidden md:flex absolute top-12 -translate-x-1/2 bg-blue-600/90 backdrop-blur-sm border border-blue-400/50 px-3.5 py-1.5 rounded-full text-[9px] font-black font-mono tracking-widest text-white uppercase whitespace-nowrap shadow-xl"
              >
                DRAG TO DECONSTRUCT & SYNTHESIZE
              </div>
            </div>

            {/* Visual Indicators on respective sides */}
            <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-4 pointer-events-none select-none text-[10px] font-black font-mono tracking-wider">
              <span className="px-3 py-1.5 bg-[#050a18]/80 backdrop-blur-sm border border-cyan-500/20 text-cyan-400 rounded-lg shadow-md uppercase">
                &larr; CAD Blueprints
              </span>
              <span className="px-3 py-1.5 bg-[#070d1e]/80 backdrop-blur-sm border border-emerald-500/20 text-emerald-400 rounded-lg shadow-md uppercase">
                3D WebGL Mesh &rarr;
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}

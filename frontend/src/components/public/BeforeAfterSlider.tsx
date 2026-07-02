"use client";

import React, { useState, useRef, useEffect } from "react";
import { Move, Cpu } from "lucide-react";
import Image from "next/image";

export default function BeforeAfterSlider() {
  const [sliderPos, setSliderPos] = useState(50);
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

  const onMouseUp = () => setIsDragging(false);

  const onTouchMove = (e: TouchEvent) => {
    if (e.touches.length === 0) return;
    handleMove(e.touches[0].clientX);
  };

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
    <section className="py-20 relative z-20 overflow-hidden border-t border-[#DADCE0]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center mb-14">
          <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#E8F0FE] border border-[#D2E3FC] text-[#1A73E8] text-[10px] font-semibold uppercase tracking-widest mb-4">
            <Cpu className="w-3.5 h-3.5" />
            Synthesis Sandbox
          </span>
          <h2 className="text-2xl sm:text-3xl font-bold text-[#202124] mt-2 mb-3">
            Procedural 2D to 3D Generation
          </h2>
          <p className="text-[#5F6368] max-w-2xl mx-auto text-sm sm:text-base leading-relaxed">
            Drag the slider to interactively witness how our automated compiler reads a static 2D vector CAD blueprint and extrudes a photorealistic 3D environment in real-time.
          </p>
        </div>

        {/* Draggable Component */}
        <div className="max-w-4xl mx-auto">
          <div
            ref={containerRef}
            onMouseDown={() => setIsDragging(true)}
            onTouchStart={() => setIsDragging(true)}
            className="relative aspect-video w-full rounded-2xl bg-[#F1F3F4] border border-[#DADCE0] overflow-hidden shadow-sm select-none cursor-ew-resize group"
          >
            {/* Right: 3D Render */}
            <div className="absolute inset-0 w-full h-full">
              <Image
                src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1200&auto=format&fit=crop&q=80"
                alt="3D Space Environment Visualisation"
                fill
                sizes="(max-width: 1024px) 100vw, 896px"
                className="object-cover pointer-events-none"
              />
              <div className="absolute top-5 right-5 z-10 bg-white/90 backdrop-blur-sm border border-[#DADCE0] px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider font-semibold text-green-700 flex items-center gap-1.5">
                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                RENDER: COMPLETE
              </div>
            </div>

            {/* Left: 2D CAD Blueprint */}
            <div
              className="absolute inset-y-0 left-0 overflow-hidden"
              style={{ width: `${sliderPos}%` }}
            >
              <div
                className="absolute inset-y-0 left-0 w-full h-full bg-white flex items-center justify-center"
                style={{ width: containerRef.current?.getBoundingClientRect().width || "100%" }}
              >
                {/* Grid Pattern */}
                <div className="absolute inset-0 bg-[linear-gradient(to_right,#E8EAED_1px,transparent_1px),linear-gradient(to_bottom,#E8EAED_1px,transparent_1px)] bg-[size:24px_24px] opacity-80" />

                {/* CAD SVG */}
                <svg className="w-11/12 h-5/6 opacity-70 text-[#1A73E8] stroke-current z-10" viewBox="0 0 800 500" fill="none" strokeWidth="1.5">
                  <rect x="50" y="50" width="700" height="400" rx="4" strokeDasharray="8 4" strokeWidth="1" />
                  <rect x="55" y="55" width="690" height="390" rx="2" strokeWidth="2" className="text-[#1A73E8]" />
                  <line x1="50" y1="250" x2="750" y2="250" strokeDasharray="3 3" className="text-[#BDC1C6]" strokeWidth="1" />
                  <line x1="300" y1="50" x2="300" y2="450" strokeDasharray="3 3" className="text-[#BDC1C6]" strokeWidth="1" />
                  <line x1="550" y1="50" x2="550" y2="450" strokeDasharray="3 3" className="text-[#BDC1C6]" strokeWidth="1" />
                  <rect x="55" y="55" width="245" height="195" strokeWidth="2" className="text-[#1A73E8]/80" />
                  <circle cx="180" cy="150" r="40" className="text-[#BDC1C6]" strokeWidth="1" />
                  <text x="110" y="230" fill="#1A73E8" fontSize="10" fontFamily="monospace" className="stroke-none font-semibold">CONF_ROOM_A</text>
                  <rect x="300" y="55" width="250" height="195" strokeWidth="2" className="text-[#1A73E8]/80" />
                  <rect x="370" y="90" width="110" height="50" rx="3" strokeWidth="1.5" />
                  <text x="350" y="230" fill="#1A73E8" fontSize="10" fontFamily="monospace" className="stroke-none font-semibold">EXEC_OFFICE_B</text>
                  <rect x="550" y="55" width="195" height="390" strokeWidth="2" className="text-[#1A73E8]/80" />
                  <rect x="580" y="90" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="580" y="150" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="660" y="90" width="55" height="35" rx="2" strokeWidth="1" />
                  <rect x="660" y="150" width="55" height="35" rx="2" strokeWidth="1" />
                  <text x="590" y="420" fill="#1A73E8" fontSize="10" fontFamily="monospace" className="stroke-none font-semibold">OPEN_WORK_C</text>
                  <rect x="55" y="250" width="245" height="195" strokeWidth="2" className="text-[#1A73E8]/80" />
                  <circle cx="120" cy="350" r="30" strokeWidth="1" strokeDasharray="4 2" />
                  <circle cx="210" cy="350" r="30" strokeWidth="1" strokeDasharray="4 2" />
                  <text x="100" y="420" fill="#1A73E8" fontSize="10" fontFamily="monospace" className="stroke-none font-semibold">SERVER_ROOM_D</text>
                  <rect x="300" y="250" width="250" height="195" strokeWidth="2" className="text-[#1A73E8]/80" />
                  <text x="380" y="350" fill="#1A73E8" fontSize="12" fontFamily="monospace" className="stroke-none font-semibold">LOBBY_E</text>
                </svg>

                <div className="absolute top-5 left-5 z-10 bg-white/90 backdrop-blur-sm border border-[#DADCE0] px-3 py-1.5 rounded-lg text-[10px] font-mono tracking-wider font-semibold text-[#1A73E8] flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 bg-[#1A73E8] rounded-full animate-pulse" />
                  CAD PARSING: ACTIVE
                </div>
              </div>
            </div>

            {/* Slider Divider */}
            <div
              className="absolute inset-y-0 w-[2px] bg-[#1A73E8] z-30"
              style={{ left: `${sliderPos}%` }}
            >
              <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-10 h-10 rounded-full bg-white border-2 border-[#1A73E8] flex items-center justify-center shadow-md pointer-events-none">
                <Move className="w-4 h-4 text-[#1A73E8]" />
              </div>
            </div>

            {/* Labels */}
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 z-20 flex gap-3 pointer-events-none select-none text-[10px] font-semibold font-mono tracking-wider">
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-[#DADCE0] text-[#1A73E8] rounded-md shadow-sm uppercase">
                &larr; CAD Blueprints
              </span>
              <span className="px-2.5 py-1 bg-white/90 backdrop-blur-sm border border-[#DADCE0] text-green-700 rounded-md shadow-sm uppercase">
                3D WebGL Mesh &rarr;
              </span>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}

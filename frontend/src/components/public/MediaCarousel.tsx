/* eslint-disable @typescript-eslint/no-explicit-any, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Layers, Cpu, Compass, HardHat } from "lucide-react";

interface CarouselItem {
  id: string | number;
  title: string;
  description: string;
  imageUrl: string;
  icon: React.ComponentType<{ className?: string }>;
}

const ITEMS: CarouselItem[] = [
  {
    id: 1,
    title: "3D Modeling",
    description: "Photorealistic assets & animations",
    imageUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&auto=format&fit=crop&q=80",
    icon: Compass,
  },
  {
    id: 2,
    title: "VR Simulation",
    description: "Defense & commercial training",
    imageUrl: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?w=1600&auto=format&fit=crop&q=80",
    icon: HardHat,
  },
  {
    id: 3,
    title: "AI Automation",
    description: "AI-powered workflow tools",
    imageUrl: "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=1600&auto=format&fit=crop&q=80",
    icon: Cpu,
  },
  {
    id: 4,
    title: "IMS",
    description: "ERM for Indian Defense institutions",
    imageUrl: "https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?w=1600&auto=format&fit=crop&q=80",
    icon: Layers,
  },
];

export default function MediaCarousel() {
  const [mounted, setMounted] = useState(false);
  const [carouselItems, setCarouselItems] = useState<CarouselItem[]>(ITEMS);
  const [activeIndex, setActiveIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const nextSlide = () => setActiveIndex((prev) => (prev + 1) % carouselItems.length);
  const prevSlide = () => setActiveIndex((prev) => (prev - 1 + carouselItems.length) % carouselItems.length);

  useEffect(() => {
    setMounted(true);
    fetch("/api/v1/pages/home")
      .then(res => res.json())
      .then(json => {
        if (json.success && json.data && json.data.content && Array.isArray(json.data.content.carousel_items)) {
          const dbCarousel = json.data.content.carousel_items;
          const mapped = dbCarousel
            .filter((c: any) => c.public_url)
            .map((c: any, idx: number) => ({
              id: c.media_id ? `${c.media_id}-${idx}` : `db-carousel-${idx}`,
              title: c.title || `Carousel Item #${idx + 1}`,
              description: c.description || "",
              imageUrl: c.public_url,
              icon: Compass
            }));
          if (mapped.length > 0) {
            setCarouselItems(mapped);
          }
        }
      })
      .catch(err => console.error("Error loading carousel content:", err));
  }, []);

  useEffect(() => {
    if (!isHovered) {
      timerRef.current = setInterval(nextSlide, 4500);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [isHovered, carouselItems.length]);

  // Layout math — all cards are 50% of the container width.
  // Since absolute cards are centered by the flex parent, each card's
  // default left edge = 25%, right edge = 75%.
  //
  // Center card  → x: "0%"   → spans [25%, 75%]
  // Right card   → x: "50%"  → translateX = 50% × 50% = 25% of container
  //                          → spans [50%, 100%]  ← right edge at stats boundary ✓
  //   Overlap with center = [50%, 75%] = 25% = 50% of card width hidden ✓
  //   Visible = [75%, 100%] = 25% = 50% of card width ✓
  const getStyle = (index: number) => {
    const total = carouselItems.length;
    const diff = (index - activeIndex + total) % total;

    if (diff === 0) {
      // Center — default centered position, full opacity
      return { x: "0%", scale: 1, zIndex: 30, opacity: 1, pointerEvents: "auto" as const };
    } else if (diff === 1) {
      // Right — scaled to 75% and translated so outer edge is exactly at 100% boundary
      return { x: "62.5%", scale: 0.75, zIndex: 20, opacity: 0.65, pointerEvents: "auto" as const };
    } else if (diff === total - 1) {
      // Left — mirror of right
      return { x: "-62.5%", scale: 0.75, zIndex: 20, opacity: 0.65, pointerEvents: "auto" as const };
    } else {
      // Hidden — fully off-screen
      return {
        x: diff === 2 ? "200%" : "-200%",
        scale: 0.6,
        zIndex: 10,
        opacity: 0,
        pointerEvents: "none" as const,
      };
    }
  };

  if (!mounted) {
    return (
      <section className="relative w-full py-10 min-h-[400px] bg-transparent flex items-center justify-center">
        <div className="animate-pulse text-slate-400 text-xs">Loading media showcase...</div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full py-10"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Container matches stats section — max-w-7xl + same padding, no overflow-hidden needed */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Track — no masking or clipping; side cards sit within bounds via pure z-index overlap */}
        <div
          className="relative w-full flex items-center justify-center select-none"
          style={{ height: "clamp(220px, 32vw, 460px)" }}
        >
          {carouselItems.map((item, idx) => {
            const pos = getStyle(idx);
            const isActive = idx === activeIndex;

            return (
              <motion.div
                key={item.id}
                animate={pos}
                transition={{ duration: 0.75, ease: [0.25, 1, 0.5, 1] }}
                onClick={() => { if (!isActive) setActiveIndex(idx); }}
                className="absolute rounded-2xl overflow-hidden cursor-pointer"
                style={{
                  /* 50% of container — side card outer edge lands exactly at stats boundary */
                  width: "50%",
                  height: "100%",
                  boxShadow: isActive
                    ? "0 20px 60px rgba(37,99,235,0.15), 0 4px 20px rgba(0,0,0,0.12)"
                    : "0 8px 24px rgba(0,0,0,0.10)",
                  border: isActive
                    ? "1px solid rgba(147,197,253,0.5)"
                    : "1px solid rgba(203,213,225,0.35)",
                }}
              >
                {/* Photo */}
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover select-none pointer-events-none"
                  draggable="false"
                />

                {/* Dark gradient for text readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/75 via-slate-950/15 to-transparent" />

                {/* Dim overlay for inactive side cards */}
                {!isActive && (
                  <div className="absolute inset-0 bg-white/20 backdrop-blur-[1px]" />
                )}

                {/* Bottom translucent label — active card only */}
                <AnimatePresence>
                  {isActive && (
                    <motion.div
                      initial={{ opacity: 0, y: 14 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: 8 }}
                      transition={{ duration: 0.35, delay: 0.1 }}
                      className="absolute bottom-0 left-0 right-0 h-[40%] px-6 pb-5 md:px-10 md:pb-7 text-white flex flex-col justify-end"
                      style={{
                        background: "linear-gradient(to top, rgba(2,6,18,0.98) 0%, rgba(2,6,18,0.85) 35%, rgba(2,6,18,0.4) 65%, transparent 100%)",
                      }}
                    >
                      <h3 className="text-xl md:text-3xl font-black tracking-tight leading-none mb-1">
                        {item.title}
                      </h3>
                      <p className="text-sm md:text-base text-slate-200/90 leading-snug">
                        {item.description}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            );
          })}

          {/* Nav arrows outside the track, above the cards */}
          <button
            onClick={(e) => { e.stopPropagation(); prevSlide(); }}
            className="absolute -left-5 lg:-left-16 z-40 w-12 h-12 rounded-full border border-slate-200 bg-white shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all active:scale-95 cursor-pointer"
            aria-label="Previous"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <button
            onClick={(e) => { e.stopPropagation(); nextSlide(); }}
            className="absolute -right-5 lg:-right-16 z-40 w-12 h-12 rounded-full border border-slate-200 bg-white shadow-md flex items-center justify-center text-slate-600 hover:text-blue-600 hover:border-blue-300 hover:bg-blue-50/50 transition-all active:scale-95 cursor-pointer"
            aria-label="Next"
          >
            <ChevronRight className="w-6 h-6" />
          </button>
        </div>

        {/* Dots */}
        <div className="flex justify-center items-center gap-2 mt-6">
          {carouselItems.map((item, idx) => (
            <button
              key={item.id}
              onClick={() => setActiveIndex(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                idx === activeIndex ? "w-7 bg-blue-600" : "w-1.5 bg-slate-300 hover:bg-slate-400"
              }`}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}

"use client";

import { useEffect, useState } from "react";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      aria-label="Scroll to top"
      className="fixed bottom-6 right-6 z-40 w-10 h-10 rounded-full flex items-center justify-center bg-white border border-[#DADCE0] shadow-md hover:shadow-lg hover:border-[#BDC1C6] transition-all duration-300 cursor-pointer group"
      style={{
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? "auto" : "none",
        transform: visible ? "translateY(0)" : "translateY(12px)",
      }}
    >
      <ChevronUp className="w-5 h-5 text-[#5F6368] group-hover:text-[#1A73E8] group-hover:-translate-y-0.5 transition-all duration-200" />
    </button>
  );
}

"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "./Header";
import Footer from "./Footer";
import { Volume2, VolumeX } from "lucide-react";
import ScrollBackgroundController from "@/components/background/ScrollBackgroundController";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ScrollProgressLine from "@/components/shared/ScrollProgressLine";

// ============================================================
// PROCEDURAL AUDIO SYNTHESIZER (WEB AUDIO API)
// ============================================================
let audioCtx: AudioContext | null = null;
let gainNode: GainNode | null = null;
let osc1: OscillatorNode | null = null;
let osc2: OscillatorNode | null = null;
let lfo: OscillatorNode | null = null;

const startAmbientSynth = () => {
  if (audioCtx) return;
  
  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
    audioCtx = new AudioContextClass();
    
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.04, audioCtx.currentTime + 1.5); // Subtle low-volume pad

    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(130, audioCtx.currentTime);

    // Osc 1 (triangle wave at A1 = 55Hz)
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // Osc 2 (sine wave at E2 = 165Hz)
    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(165, audioCtx.currentTime);

    // Modulation LFO
    lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.08;
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 35;

    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    osc1.start();
    osc2.start();
    lfo.start();
  } catch {
    // browser unsupported
  }
};

const stopAmbientSynth = () => {
  if (!audioCtx) return;
  
  const localGain = gainNode;
  const localCtx = audioCtx;
  const localOsc1 = osc1;
  const localOsc2 = osc2;
  const localLfo = lfo;

  if (localGain && localCtx) {
    try {
      localGain.gain.setValueAtTime(localGain.gain.value, localCtx.currentTime);
      localGain.gain.linearRampToValueAtTime(0, localCtx.currentTime + 0.4);
    } catch {
      // ignore
    }
  }

  setTimeout(() => {
    try {
      localOsc1?.stop();
      localOsc2?.stop();
      localLfo?.stop();
      localCtx?.close();
    } catch {
      // ignore
    }
  }, 500);

  audioCtx = null;
  gainNode = null;
  osc1 = null;
  osc2 = null;
  lfo = null;
};

// ============================================================
// GLOBAL MOUSE GLOW ORB (Light Theme Google Gradient style)
// ============================================================
function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: -200, y: -200 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const updateMousePos = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener("mousemove", updateMousePos, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    return () => {
      window.removeEventListener("mousemove", updateMousePos);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  return (
    <div 
      className="hidden md:block fixed inset-0 pointer-events-none z-30 transition-opacity duration-300"
      style={{ opacity }}
    >
      {/* Soft color-mixing light spotlight that trails the cursor and dynamically highlights the crème background */}
      <div 
        className="w-[400px] h-[400px] bg-gradient-to-r from-blue-500/8 via-purple-500/8 to-pink-500/8 blur-[100px] rounded-full absolute -translate-x-1/2 -translate-y-1/2"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
    </div>
  );
}

// ============================================================
// AMBIENT TRACK PLAYER WIDGET (Light Theme)
// ============================================================
function AmbientAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);

  const togglePlayback = () => {
    if (isPlaying) {
      stopAmbientSynth();
      setIsPlaying(false);
    } else {
      startAmbientSynth();
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    return () => {
      stopAmbientSynth();
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button 
        onClick={togglePlayback}
        className="flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-white border border-[#2563EB] text-[#2563EB] hover:bg-[#F3F7FF] transition-all duration-250 shadow-sm hover:shadow-md text-[10px] font-bold tracking-wider uppercase"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-[#2563EB] animate-pulse" />
            <div className="flex gap-0.5 items-end h-3 w-4 shrink-0 pb-0.5">
              <div className="w-0.5 h-full bg-[#2563EB] origin-bottom animate-[soundwave_0.8s_infinite_ease-in-out]" />
              <div className="w-0.5 h-full bg-[#2563EB] origin-bottom animate-[soundwave_0.6s_infinite_ease-in-out_0.2s]" />
              <div className="w-0.5 h-full bg-[#2563EB] origin-bottom animate-[soundwave_0.9s_infinite_ease-in-out_0.4s]" />
            </div>
            <span>Ambient: On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-[#80868B]" />
            <span>Ambient: Off</span>
          </>
        )}
      </button>
    </div>
  );
}

// ============================================================
// MAIN WRAPPER
// ============================================================
interface PublicLayoutWrapperProps {
  children: React.ReactNode;
}

export default function PublicLayoutWrapper({ children }: PublicLayoutWrapperProps) {
  const pathname = usePathname();
  const isAdminRoute = pathname?.startsWith("/admin");

  if (isAdminRoute) {
    return <>{children}</>;
  }

  return (
    <>
      <ScrollProgressLine />
      <ScrollBackgroundController />
      <Header />
      <MouseGlow />
      <AmbientAudioPlayer />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}

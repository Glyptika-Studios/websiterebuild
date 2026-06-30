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
    
    // Create gain controller (soft volume)
    gainNode = audioCtx.createGain();
    gainNode.gain.setValueAtTime(0, audioCtx.currentTime);
    gainNode.gain.linearRampToValueAtTime(0.05, audioCtx.currentTime + 1.5); // Warm fade-in

    // Warm Lowpass Filter
    const filter = audioCtx.createBiquadFilter();
    filter.type = "lowpass";
    filter.frequency.setValueAtTime(130, audioCtx.currentTime);

    // Osc 1 - Warm low-frequency drone (triangle wave at A1 = 55Hz)
    osc1 = audioCtx.createOscillator();
    osc1.type = "triangle";
    osc1.frequency.setValueAtTime(55, audioCtx.currentTime);

    // Osc 2 - Harmony pad (sine wave at E2 = 165Hz)
    osc2 = audioCtx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(165, audioCtx.currentTime);

    // Modulation LFO (breathing sweep effect)
    lfo = audioCtx.createOscillator();
    lfo.frequency.value = 0.08; // 12 seconds per cycle
    const lfoGain = audioCtx.createGain();
    lfoGain.gain.value = 35; // sweep by 35Hz

    // Audio connections
    lfo.connect(lfoGain);
    lfoGain.connect(filter.frequency);

    osc1.connect(filter);
    osc2.connect(filter);
    filter.connect(gainNode);
    gainNode.connect(audioCtx.destination);

    // Start oscillators
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
// GLOBAL MOUSE GLOW ORB COMPONENT
// ============================================================
function MouseGlow() {
  const [mousePos, setMousePos] = useState({ x: -100, y: -100 });
  const [opacity, setOpacity] = useState(0);

  useEffect(() => {
    const updateMousePos = (e: MouseEvent) => {
      setMousePos({ x: e.clientX, y: e.clientY });
      setOpacity(1);
    };

    const handleMouseLeave = () => {
      setOpacity(0);
    };

    window.addEventListener("mousemove", updateMousePos);
    document.addEventListener("mouseleave", handleMouseLeave);

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
      <div 
        className="w-[350px] h-[350px] bg-blue-500/5 blur-[80px] rounded-full absolute -translate-x-1/2 -translate-y-1/2 mix-blend-screen"
        style={{ left: mousePos.x, top: mousePos.y }}
      />
    </div>
  );
}

// ============================================================
// AMBIENT TRACK PLAYER WIDGET
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

  // Turn off synth on page unmount
  useEffect(() => {
    return () => {
      stopAmbientSynth();
    };
  }, []);

  return (
    <div className="fixed bottom-6 left-6 z-40">
      <button 
        onClick={togglePlayback}
        className="flex items-center gap-3 px-4 py-2.5 rounded-full bg-[#030712]/85 hover:bg-[#070b19] backdrop-blur-md border border-white/10 hover:border-blue-500/30 transition-all duration-300 shadow-xl text-[10px] font-black font-mono tracking-wider text-slate-350 hover:text-white uppercase"
      >
        {isPlaying ? (
          <>
            <Volume2 className="w-4 h-4 text-blue-400 animate-pulse" />
            <div className="flex gap-0.5 items-end h-3 w-4 shrink-0 pb-0.5">
              <div className="w-0.5 h-full bg-blue-400 origin-bottom animate-[soundwave_0.8s_infinite_ease-in-out]" />
              <div className="w-0.5 h-full bg-blue-400 origin-bottom animate-[soundwave_0.6s_infinite_ease-in-out_0.2s]" />
              <div className="w-0.5 h-full bg-blue-400 origin-bottom animate-[soundwave_0.9s_infinite_ease-in-out_0.4s]" />
            </div>
            <span>Ambient: On</span>
          </>
        ) : (
          <>
            <VolumeX className="w-4 h-4 text-slate-500" />
            <span>Ambient: Off</span>
          </>
        )}
      </button>
    </div>
  );
}

// ============================================================
// MAIN WRAPPER COMPONENT
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
      {children}
      <Footer />
      <ScrollToTop />
    </>
  );
}

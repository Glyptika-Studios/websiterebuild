/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import { api } from "@/lib/api";
import Header from "./Header";
import Footer from "./Footer";
import { Volume2, VolumeX } from "lucide-react";
import ScrollBackgroundController from "@/components/background/ScrollBackgroundController";
import ScrollToTop from "@/components/shared/ScrollToTop";
import ScrollProgressLine from "@/components/shared/ScrollProgressLine";

// ============================================================
// BACKGROUND MUSIC PLAYER (Configured in Admin Console)
// ============================================================
let audioInstance: HTMLAudioElement | null = null;

const startAmbientSynth = (musicSettings?: { track_url: string; volume: number }) => {
  if (audioInstance) return;

  try {
    let trackUrl = "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3";
    let volume = 35;

    if (musicSettings) {
      if (musicSettings.track_url) trackUrl = musicSettings.track_url;
      if (musicSettings.volume !== undefined) volume = musicSettings.volume;
    }

    audioInstance = new Audio(trackUrl);
    audioInstance.volume = volume / 100;
    audioInstance.loop = true;
    audioInstance.play().catch((err) => {
      console.warn("Autoplay was blocked by browser. Interaction required.", err);
    });
  } catch (err) {
    console.error("Audio playback error:", err);
  }
};

const stopAmbientSynth = () => {
  if (audioInstance) {
    try {
      audioInstance.pause();
    } catch {
      // ignore
    }
    audioInstance = null;
  }
};



// ============================================================
// AMBIENT TRACK PLAYER WIDGET (Light Theme)
// ============================================================
function AmbientAudioPlayer() {
  const [isPlaying, setIsPlaying] = useState(false);
  const [musicSettings, setMusicSettings] = useState<{ track_url: string; volume: number } | null>(null);

  const togglePlayback = () => {
    if (isPlaying) {
      stopAmbientSynth();
      setIsPlaying(false);
    } else {
      startAmbientSynth(musicSettings || undefined);
      setIsPlaying(true);
    }
  };

  useEffect(() => {
    const fetchMusicSettings = async () => {
      try {
        const res = await api.get<any>("/api/v1/pages/home");
        if (res.success && res.data?.content?.ambient_music) {
          setMusicSettings(res.data.content.ambient_music);
        }
      } catch (err) {
        console.error("Failed to fetch ambient music settings:", err);
      }
    };
    fetchMusicSettings();

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash && (hash.includes("access_token=") || hash.includes("error="))) {
        window.location.href = `/admin/login${hash}`;
      }
    }
  }, []);

  if (isAdminRoute) {
    return <>{children}</>;
  }
  return (
    <>
      <ScrollProgressLine />
      <ScrollBackgroundController />
      <Header />
      <AmbientAudioPlayer />
      <div className="relative z-10 flex flex-col min-h-screen">
        {children}
      </div>
      <Footer />
      <ScrollToTop />
    </>
  );
}

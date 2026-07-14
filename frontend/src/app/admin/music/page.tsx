/* eslint-disable @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, @next/next/no-img-element, react-hooks/exhaustive-deps */
"use client";

import React, { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import {
  Music,
  Volume2,
  VolumeX,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  RefreshCw,
} from "lucide-react";

interface MusicSettings {
  track_url: string;
  volume: number;
}

const DEFAULT_MUSIC: MusicSettings = {
  track_url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
  volume: 35,
};

export default function MusicConfigManager() {
  const { hasPermission } = useAuth();
  const canWrite = hasPermission("media", "write"); // 'media' scope mapped to music config too

  const [music, setMusic] = useState<MusicSettings>(DEFAULT_MUSIC);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);

  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    const saved = localStorage.getItem("glyptika_admin_music");
    if (saved) {
      try {
        setMusic(JSON.parse(saved));
      } catch (e) {
        setMusic(DEFAULT_MUSIC);
      }
    } else {
      setMusic(DEFAULT_MUSIC);
      localStorage.setItem("glyptika_admin_music", JSON.stringify(DEFAULT_MUSIC));
    }
  }, []);

  // Sync audio object when track changes
  useEffect(() => {
    if (audio) {
      audio.pause();
    }
    const newAudio = new Audio(music.track_url);
    newAudio.volume = music.volume / 100;
    newAudio.loop = true;
    setAudio(newAudio);
    setIsPlaying(false);

    return () => {
      newAudio.pause();
    };
  }, [music.track_url]);

  // Sync volume when slider changes
  useEffect(() => {
    if (audio) {
      audio.volume = music.volume / 100;
    }
  }, [music.volume, audio]);

  const handleTogglePlay = () => {
    if (!audio) return;
    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio.play().catch((err) => {
        alert("Audio playback failed. Verify if track URL is valid and accessible.");
      });
      setIsPlaying(true);
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    if (!music.track_url.trim()) {
      setFormError("Track audio URL is required.");
      return;
    }

    localStorage.setItem("glyptika_admin_music", JSON.stringify(music));
    setSaveSuccess(true);
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  return (
    <div className="space-y-8 font-space text-white relative">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black tracking-tight text-white mb-1">
            Ambient Music
          </h1>
          <p className="text-sm text-slate-400">
            Set global background sound files and defaults for public site visitors
          </p>
        </div>
        {saveSuccess && (
          <div className="px-4 py-2 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-2xl text-xs font-bold flex items-center gap-1.5 animate-bounce self-start">
            <CheckCircle className="w-4 h-4" />
            <span>Sound settings saved!</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

        {/* Left Column: Music Form */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between self-start">
          <form onSubmit={handleSave} className="space-y-6 w-full">
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-4">
              <Music className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white uppercase tracking-wider">Audio Configuration</h3>
            </div>

            {/* Error Message */}
            {formError && (
              <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold flex gap-2 items-center">
                <AlertCircle className="w-4 h-4" />
                <span>{formError}</span>
              </div>
            )}

            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-black uppercase tracking-wider text-slate-400">Audio Track (.MP3 URL)</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={music.track_url}
                  onChange={(e) => setMusic({ ...music, track_url: e.target.value })}
                  disabled={!canWrite}
                  className="w-full px-4 py-3 bg-slate-950/40 border border-white/5 focus:border-blue-500/40 rounded-2xl text-xs text-white focus:outline-none"
                />
              </div>

              {/* Volume Slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center text-xs font-black uppercase tracking-wider text-slate-400">
                  <span>Default Playback Volume</span>
                  <span className="text-blue-400">{music.volume}%</span>
                </div>
                <div className="flex items-center gap-4 py-2">
                  <VolumeX className="w-4 h-4 text-slate-500" />
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={music.volume}
                    onChange={(e) => setMusic({ ...music, volume: Number(e.target.value) })}
                    disabled={!canWrite}
                    className="flex-1 accent-blue-500 bg-slate-950/40 border border-white/5 h-1.5 rounded-full cursor-pointer"
                  />
                  <Volume2 className="w-4 h-4 text-slate-500" />
                </div>
              </div>
            </div>

            {canWrite && (
              <button
                type="submit"
                className="w-full py-3 bg-blue-600 hover:bg-blue-500 rounded-xl text-xs font-black uppercase tracking-wider transition-all"
              >
                Apply Audio Layout
              </button>
            )}
          </form>
        </div>

        {/* Right Column: Audio Playback Live Tester */}
        <div className="p-6 rounded-3xl bg-slate-900/40 border border-white/5 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-3 border-b border-white/5 pb-4 mb-6">
              <Volume2 className="w-4 h-4 text-blue-400" />
              <h3 className="text-sm font-black text-white tracking-wide">Live Feed Playback Test</h3>
            </div>

            <div className="flex flex-col items-center justify-center p-8 bg-slate-950/40 border border-white/5 rounded-3xl mb-6 space-y-4">
              <div className={`p-6 rounded-full border bg-blue-500/5 flex items-center justify-center transition-all ${isPlaying ? "border-blue-500/40 animate-pulse text-blue-400 shadow-[0_0_20px_rgba(37,99,235,0.2)]" : "border-white/5 text-slate-500"
                }`}>
                <Music className="w-10 h-10" />
              </div>
              <div className="text-center min-w-0 max-w-sm">
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-500 block mb-1">
                  Now playing track (Live Simulation)
                </span>
                <p className="text-xs text-slate-350 truncate font-mono">{music.track_url}</p>
              </div>
            </div>

            <div className="flex items-center justify-center gap-4">
              <button
                onClick={handleTogglePlay}
                type="button"
                className="px-6 py-2.5 rounded-full text-xs font-black uppercase tracking-wider text-white bg-white/5 hover:bg-white/10 border border-white/5 transition-all flex items-center gap-2"
              >
                {isPlaying ? (
                  <>
                    <Pause className="w-4 h-4" />
                    <span>Pause Demo</span>
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    <span>Play Demo</span>
                  </>
                )}
              </button>
            </div>
          </div>

          <div className="mt-8 pt-6 border-t border-white/5 text-[9px] text-slate-500 font-bold text-center">
            Visitor browser policies require a manual scroll click interaction before background playback triggers automatically.
          </div>
        </div>
      </div>
    </div>
  );
}

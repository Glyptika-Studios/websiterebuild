"use client";

import React from "react";

interface BackgroundCanvasProps {
  progress: number;
  mouseX: number;
  mouseY: number;
  reducedMotion: boolean;
}

export default function BackgroundCanvas({
  progress,
  mouseX,
  mouseY,
  reducedMotion,
}: BackgroundCanvasProps) {
  return (
    <div
      aria-hidden="true"
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -10, backgroundColor: "#FFFFFF" }}
    />
  );
}

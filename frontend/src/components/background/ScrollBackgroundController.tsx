"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import BackgroundCanvas from "./BackgroundCanvas";

export default function ScrollBackgroundController() {
  const { progress, mouseX, mouseY, reducedMotion } = useScrollProgress();

  return (
    <BackgroundCanvas
      progress={progress}
      mouseX={mouseX}
      mouseY={mouseY}
      reducedMotion={reducedMotion}
    />
  );
}

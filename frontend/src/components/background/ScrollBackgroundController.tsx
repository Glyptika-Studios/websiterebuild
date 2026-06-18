"use client";

import { useScrollProgress } from "@/hooks/useScrollProgress";
import BackgroundCanvas from "./BackgroundCanvas";

/**
 * ScrollBackgroundController — thin orchestrator.
 * Calls useScrollProgress once here so BackgroundCanvas
 * receives clean props without needing its own scroll listeners.
 */
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

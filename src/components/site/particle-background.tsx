"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

import { SceneViewport } from "@/components/common/scene-viewport";
import { particleStore } from "@/hooks/use-particle-formed";
import { useMotionOff } from "@/hooks/use-motion-off";
import type { ParticleField } from "@/lib/scene/particle-field";

/** Particles drawn — the engine is 2D canvas, so this is cheap. */
const PARTICLE_COUNT = 1800;
/** Below this width the swarm is not started at all (phones and small tablets). */
const MIN_WIDTH_QUERY = "(min-width: 768px)";

/**
 * The fixed background swarm (engine: `lib/scene/particle-field.ts`). It sits
 * behind the content in the large-viewport box, takes no pointer events, and
 * is mounted once in the root layout so it survives page changes.
 *
 * It is not started — and its chunk is not downloaded — on screens under
 * 768 px, with reduced motion, or on the robot form; `particleStore` then
 * reports `off`, so every `<ParticleStage>` shows its real image at once.
 * Colours come from the `--accent` and `--muted` tokens.
 */
export const ParticleBackground = () => {
  const motionOff = useMotionOff();
  const pathname = usePathname();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const fieldRef = useRef<ParticleField | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const query = window.matchMedia(MIN_WIDTH_QUERY);
    let cancelled = false;
    let starting = false;

    const stop = (): void => {
      fieldRef.current?.dispose();
      fieldRef.current = null;
    };

    const start = async (): Promise<void> => {
      if (starting || fieldRef.current) return;
      starting = true;
      const { createParticleField } = await import("@/lib/scene/particle-field");
      starting = false;
      if (cancelled || !query.matches || fieldRef.current) return;
      const styles = getComputedStyle(document.documentElement);
      fieldRef.current = createParticleField(canvas, {
        count: PARTICLE_COUNT,
        accent: styles.getPropertyValue("--accent").trim(),
        muted: styles.getPropertyValue("--muted").trim(),
        onFormed: particleStore.setFormed,
      });
      particleStore.setStatus("engine");
    };

    const apply = (): void => {
      if (motionOff || !query.matches) {
        stop();
        particleStore.setStatus("off");
      } else {
        void start();
      }
    };

    apply();
    query.addEventListener("change", apply);
    return () => {
      cancelled = true;
      query.removeEventListener("change", apply);
      stop();
      particleStore.setStatus("idle");
    };
  }, [motionOff]);

  // A route change swaps the stages on the page — re-read them.
  useEffect(() => {
    const frame = requestAnimationFrame(() => requestAnimationFrame(() => fieldRef.current?.remeasure()));
    return () => cancelAnimationFrame(frame);
  }, [pathname]);

  return (
    <SceneViewport className="pointer-events-none -z-10">
      <canvas ref={canvasRef} aria-hidden className="absolute inset-0 size-full" />
    </SceneViewport>
  );
};

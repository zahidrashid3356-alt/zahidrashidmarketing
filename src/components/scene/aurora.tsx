"use client";

import { useEffect, useRef } from "react";

import { SceneViewport } from "@/components/common/scene-viewport";
import { useMotionOff } from "@/hooks/use-motion-off";
import { keepSceneAlive, releaseContext, watchContext } from "@/lib/scene/webgl-context";

/**
 * The page's fixed background. Behind everything (`-z-10`), the full large
 * viewport, so a phone's toolbar never resizes it.
 *
 * The WebGL scene is a separate chunk, imported only here, only when motion is
 * on: the robot form and reduced-motion visitors get the still (a soft glow in
 * the brand colour) and never download three.js. The still also sits under the
 * canvas, so a lost context or a slow load shows the glow, not a black box.
 */
export const Aurora = () => {
  const motionOff = useMotionOff();
  const boxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = boxRef.current;
    if (motionOff || !container) return;

    return keepSceneAlive({
      container,
      build: async ({ settled, onContextChange }) => {
        const { createAurora } = await import("./aurora-scene");
        const scene = createAurora(container, { settled });
        const stopWatching = watchContext(scene.canvas, onContextChange);
        return {
          isBroken: () => scene.gl.isContextLost(),
          frames: scene.frames,
          dispose: () => {
            stopWatching();
            scene.dispose();
            releaseContext(scene.gl);
            scene.canvas.remove();
          },
        };
      },
    });
  }, [motionOff]);

  return (
    <SceneViewport className="-z-10 transform-gpu">
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(60%_45%_at_75%_25%,var(--accent-glow),transparent)]"
      />
      <div
        ref={boxRef}
        aria-hidden
        className="absolute inset-0 [&>canvas]:block [&>canvas]:size-full"
      />
    </SceneViewport>
  );
};

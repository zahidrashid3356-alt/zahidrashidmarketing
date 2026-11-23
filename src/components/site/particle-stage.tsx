"use client";

import type { ReactNode } from "react";

import { Spring } from "@/components/common/robot-spring";
import { useParticleFormed } from "@/hooks/use-particle-formed";

const FROM = { opacity: 0, scale: 0.97 };
const TO = { opacity: 1, scale: 1 };
const CONFIG = { tension: 140, friction: 24 };

/**
 * A slot the swarm can form into. The engine finds it by `data-particle-stage`
 * and gathers on its shape; once 99% of the particles have landed, `children`
 * (the real image) fade in while the swarm fades out. With no swarm (phone,
 * reduced motion, robot form) the image is simply shown. The slot's size and
 * position come from `className`.
 */
export const ParticleStage = ({
  id,
  className = "",
  children,
}: {
  id: string;
  className?: string;
  children: ReactNode;
}) => {
  const formed = useParticleFormed(id);
  return (
    <div data-particle-stage={id} className={`relative ${className}`}>
      <Spring
        tag="div"
        enabled={formed}
        mode="always"
        from={FROM}
        to={TO}
        config={CONFIG}
        className="absolute inset-0"
      >
        {children}
      </Spring>
    </div>
  );
};

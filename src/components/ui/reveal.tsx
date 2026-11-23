"use client";

import type { ComponentProps } from "react";

import { Inview } from "@/components/common/robot-inview";

type RevealProps = Omit<ComponentProps<typeof Inview>, "from" | "to" | "mode">;

/**
 * Relay's entrance: a block arrives slightly out of focus and low, then settles
 * sharp. One blur per block — never per line, word or letter (the blur is the
 * expensive part). Springs only, played once.
 */
const FROM = { opacity: 0, y: 40, filter: "blur(0.75rem)" };
const TO = { opacity: 1, y: 0, filter: "blur(0rem)" };
const CONFIG = { tension: 130, friction: 24 };

export const Reveal = ({ children, ...props }: RevealProps) => (
  <Inview mode="once" from={FROM} to={TO} config={CONFIG} {...props}>
    {children}
  </Inview>
);

"use client";

import { easings } from "@react-spring/web";

import { RobotText as TextEngine } from "@/components/common/robot-text";

interface HeadlineProps {
  children: React.ReactNode;
  /** `h1` for the page's one title, `h2` for sections, `p` for a statement. */
  tag?: "h1" | "h2" | "p";
  /**
   * Below the fold (default): plain text until the block is near the viewport,
   * then the engine — a page of engines measured at mount is one long
   * hydration task. Set `false` only for the first screen, where the swap would
   * be visible.
   */
  lazy?: boolean;
  /** Size and spacing — a `text-*` token (`text-display`, `text-headline`). */
  className?: string;
}

/**
 * A heading whose lines slide up out of a clip, once. The semantic tag is the
 * caller's choice; the look is the caller's size token.
 *
 * `leading-display` is the clip floor: `overflow` clips each line to its
 * line-height box, so a tighter leading would shave descenders.
 */
export const Headline = ({
  children,
  tag = "h2",
  lazy = true,
  className = "",
}: HeadlineProps) => (
  <TextEngine
    tag={tag}
    lazy={lazy}
    mode="once"
    overflow
    className={`justify-start text-left font-semibold leading-display tracking-tight ${className}`}
    lineIn={{ y: "0%", opacity: 1 }}
    lineOut={{ y: "100%", opacity: 0 }}
    lineStagger={90}
    lineConfig={{ duration: 900, easing: easings.easeOutCubic }}
  >
    {children}
  </TextEngine>
);

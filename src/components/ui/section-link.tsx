"use client";

import type { MouseEvent, ReactNode } from "react";

import { scrollTo } from "@/utils/scroll-to";

interface SectionLinkProps {
  /** The section's `id` on this page — the link's `href` is `#id`. */
  id: string;
  className?: string;
  children: ReactNode;
  /** Called on a plain click, before the scroll (a menu closes itself here). */
  onNavigate?: () => void;
  /**
   * Wait this long before scrolling. A full-screen menu locks the scroll while
   * it is open; the scroll must start after the lock is released.
   */
  delayMs?: number;
  tabIndex?: number;
}

/**
 * A link to a section of this page. The `href` stays a real `#id` (crawlers,
 * middle-click, no-JS); a plain click goes through `scrollTo` so the scroll
 * runs through Lenis instead of jumping.
 */
export const SectionLink = ({
  id,
  className,
  children,
  onNavigate,
  delayMs = 0,
  tabIndex,
}: SectionLinkProps) => {
  const onClick = (event: MouseEvent<HTMLAnchorElement>) => {
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.button !== 0) {
      return;
    }
    event.preventDefault();
    onNavigate?.();
    if (delayMs > 0) setTimeout(() => scrollTo(id), delayMs);
    else scrollTo(id);
  };

  return (
    <a href={`#${id}`} onClick={onClick} className={className} tabIndex={tabIndex}>
      {children}
    </a>
  );
};

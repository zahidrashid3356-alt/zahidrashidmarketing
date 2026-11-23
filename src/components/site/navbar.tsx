"use client";

import { animated, useSpring } from "@react-spring/web";
import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";

import { buttonClass } from "@/components/ui/button-styles";
import { CONTACT_CTA, MEGA_MENU, NAV_ENTRIES, PHONE } from "@/data/content";
import { useMotionOff } from "@/hooks/use-motion-off";

import { ContactLink } from "./contact-link";
import { Logo } from "./logo";
import { MegaMenu } from "./mega-menu";
import { MobileMenu } from "./mobile-menu";
import { PhoneIcon } from "./phone-icon";

/** The capsule forms once the page has scrolled this far. */
const SCROLL_THRESHOLD = 50;
const SPRING_CONFIG = { tension: 210, friction: 26 };
/** Closing waits a beat so the pointer can cross the gap to the panel. */
const CLOSE_DELAY_MS = 140;

const LINK =
  "text-base text-muted transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-foreground";

const Chevron = ({ open }: { open: boolean }) => (
  <svg
    aria-hidden
    viewBox="0 0 20 20"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={`size-4 transition-transform duration-[var(--duration-fast)] ease-entrance ${open ? "rotate-180" : ""}`}
  >
    <path d="m5 8 5 5 5-5" />
  </svg>
);

/**
 * The header. At the top of the page it is full width and transparent; after
 * 50 px of scroll it springs into a floating, centred, frosted-glass capsule
 * holding the same three parts — logo, links (Services opens the mega menu),
 * and the two calls to action. One spring value `p` (0 → 1) drives width,
 * radius, padding, tint, border, shadow and blur, so the whole morph is one
 * motion. Springs, not CSS: this is scroll-driven and layout-affecting.
 *
 * The outer element has no filter or transform, so the mega menu (a sibling of
 * the capsule) positions against it and its own backdrop blur works.
 */
export const Navbar = () => {
  const motionOff = useMotionOff();
  const panelId = useId();
  const rootRef = useRef<HTMLElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { p } = useSpring({ p: scrolled ? 1 : 0, config: SPRING_CONFIG, immediate: motionOff });

  const cancelClose = useCallback(() => clearTimeout(timer.current), []);
  const openNow = useCallback(() => {
    cancelClose();
    setOpen(true);
  }, [cancelClose]);
  const closeSoon = useCallback(() => {
    cancelClose();
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  }, [cancelClose]);
  const closeNow = useCallback(() => {
    cancelClose();
    setOpen(false);
  }, [cancelClose]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") closeNow();
    };
    const onPointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) closeNow();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointerDown);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointerDown);
    };
  }, [open, closeNow]);

  useEffect(() => () => clearTimeout(timer.current), []);

  const onBlur = (event: FocusEvent<HTMLElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeSoon();
  };

  return (
    <animated.header
      ref={rootRef}
      onBlur={onBlur}
      className="nav-shell pointer-events-none fixed inset-x-0 top-0 z-50 px-gutter"
      style={{ ["--p" as string]: p }}
    >
      <div className="nav-capsule pointer-events-auto mx-auto flex w-full items-center justify-between gap-4 py-3">
        <Logo />

        <nav aria-label="Primary" className="hidden xl:block">
          <ul className="flex items-center gap-8">
            {NAV_ENTRIES.map((entry) =>
              entry.kind === "services" ? (
                <li key="services" onMouseEnter={openNow} onMouseLeave={closeSoon}>
                  <button
                    type="button"
                    aria-expanded={open}
                    aria-controls={panelId}
                    onClick={() => setOpen((value) => !value)}
                    className={`${LINK} flex items-center gap-1.5 ${open ? "text-foreground" : ""}`}
                  >
                    {MEGA_MENU.title}
                    <Chevron open={open} />
                  </button>
                </li>
              ) : (
                <li key={entry.link.href}>
                  <Link href={entry.link.href} className={LINK}>
                    {entry.link.label}
                  </Link>
                </li>
              ),
            )}
          </ul>
        </nav>

        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-3 xl:flex">
            <ContactLink className={buttonClass("primary", "sm")}>{CONTACT_CTA.label}</ContactLink>
            <a
              href={`tel:${PHONE.tel}`}
              className="inline-flex items-center justify-center gap-2 rounded-pill border border-muted px-5 py-2.5 text-sm font-medium text-muted transition-colors duration-[var(--duration-fast)] ease-entrance hover:bg-muted hover:text-background"
            >
              <PhoneIcon />
              Call Now
            </a>
          </div>
          <a
            href={`tel:${PHONE.tel}`}
            aria-label="Call now"
            className="flex size-11 items-center justify-center rounded-pill border border-muted text-muted xl:hidden"
          >
            <PhoneIcon className="size-5" />
          </a>
          <MobileMenu />
        </div>
      </div>

      <MegaMenu
        id={panelId}
        open={open}
        onClose={closeNow}
        onPointerEnter={openNow}
        onPointerLeave={closeSoon}
      />
    </animated.header>
  );
};

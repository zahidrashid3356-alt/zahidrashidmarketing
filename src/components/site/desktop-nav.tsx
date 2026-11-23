"use client";

import Link from "next/link";
import { useCallback, useEffect, useId, useRef, useState, type FocusEvent } from "react";

import { Spring } from "@/components/common/robot-spring";
import { buttonClass } from "@/components/ui/button-styles";
import { MEGA_MENU, NAV_LINKS } from "@/data/content";
import { SERVICE_CATEGORIES, serviceHref } from "@/data/services";

const PANEL_FROM = { opacity: 0, y: -12, filter: "blur(0.5rem)" };
const PANEL_TO = { opacity: 1, y: 0, filter: "blur(0rem)" };
const PANEL_CONFIG = { tension: 260, friction: 26 };
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
 * The header's links on a tablet or desktop. "Services" opens the mega menu — all
 * five services with their sub-services — on hover, focus and click (the button
 * is a real disclosure). Escape and a click outside close it. The panel is
 * always in the DOM (real links) and `inert` while closed; it positions against
 * the fixed header, so it spans the full width under the bar.
 */
export const DesktopNav = () => {
  const panelId = useId();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLLIElement>(null);
  const timer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const cancelClose = useCallback(() => clearTimeout(timer.current), []);
  const openNow = () => {
    cancelClose();
    setOpen(true);
  };
  const closeSoon = () => {
    cancelClose();
    timer.current = setTimeout(() => setOpen(false), CLOSE_DELAY_MS);
  };
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

  const onBlur = (event: FocusEvent<HTMLLIElement>) => {
    if (!event.currentTarget.contains(event.relatedTarget)) closeSoon();
  };

  return (
    <nav aria-label="Primary" className="hidden md:block">
      <ul className="flex items-center gap-9">
        <li
          ref={rootRef}
          onMouseEnter={openNow}
          onMouseLeave={closeSoon}
          onBlur={onBlur}
        >
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

          <Spring
            tag="div"
            id={panelId}
            enabled={open}
            mode="always"
            from={PANEL_FROM}
            to={PANEL_TO}
            config={PANEL_CONFIG}
            inert={!open}
            className={`absolute inset-x-0 top-full border-b border-line bg-surface-raised px-gutter shadow-glow ${open ? "" : "pointer-events-none"}`}
          >
            <div className="mx-auto grid w-full max-w-page gap-x-8 gap-y-8 py-9 lg:grid-cols-[repeat(5,1fr)]">
              {SERVICE_CATEGORIES.map((category) => (
                <div key={category.slug}>
                  <Link
                    href={serviceHref(category.slug)}
                    onClick={closeNow}
                    className="block text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-accent"
                  >
                    {category.title}
                  </Link>
                  <ul className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
                    {category.items.map((service) => (
                      <li key={service.slug}>
                        <Link
                          href={serviceHref(category.slug, service.slug)}
                          onClick={closeNow}
                          className="block text-sm leading-snug text-muted transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-accent"
                        >
                          {service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            <div className="mx-auto flex w-full max-w-page flex-wrap items-center justify-between gap-6 border-t border-line py-6">
              <div>
                <p className="text-base font-semibold tracking-tight">{MEGA_MENU.promo.title}</p>
                <p className="mt-1 text-sm text-muted">{MEGA_MENU.promo.body}</p>
              </div>
              <Link
                href="/contact"
                onClick={closeNow}
                className={buttonClass("primary", "sm")}
              >
                {MEGA_MENU.promo.action}
              </Link>
            </div>
          </Spring>
        </li>

        {NAV_LINKS.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className={LINK}>
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

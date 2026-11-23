"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, useSyncExternalStore } from "react";
import { createPortal } from "react-dom";

import { Spring } from "@/components/common/robot-spring";
import { buttonClass } from "@/components/ui/button-styles";
import { HEADER_CTA, NAV_LINKS } from "@/data/content";
import { SERVICE_CATEGORIES, serviceHref } from "@/data/services";
import { useScrollLock } from "@/hooks/use-scroll-lock";

const ROW_FROM = { opacity: 0, y: 20, filter: "blur(0.5rem)" };
const ROW_TO = { opacity: 1, y: 0, filter: "blur(0rem)" };
const ROW_CONFIG = { tension: 220, friction: 24 };
const ROW_STAGGER_MS = 45;

const noopSubscribe = () => () => {};

interface PanelProps {
  open: boolean;
  onClose: () => void;
  closeRef: React.RefObject<HTMLButtonElement | null>;
}

/**
 * The full-screen phone menu. Built to `.claude/rules/menus.md`: a portal under
 * `<body>`, `h-dvh` + the bottom safe area, its own colour tokens, `inert`
 * while closed, scroll locked while open, Escape closes, focus moves in on open
 * and back out on close. Services expand per category (native `<details>`).
 */
const MobileMenuPanel = ({ open, onClose, closeRef }: PanelProps) => {
  const mounted = useSyncExternalStore(noopSubscribe, () => true, () => false);
  if (!mounted) return null;

  return createPortal(
    <Spring
      tag="div"
      id="mobile-menu"
      role="dialog"
      aria-modal="true"
      aria-label="Menu"
      enabled={open}
      mode="always"
      from={{ opacity: 0 }}
      to={{ opacity: 1 }}
      config={{ tension: 260, friction: 30 }}
      inert={!open}
      className={`fixed inset-x-0 top-0 z-[100] flex h-dvh flex-col overflow-y-auto overscroll-contain bg-menu-surface px-gutter pb-[env(safe-area-inset-bottom)] text-menu-foreground ${open ? "" : "pointer-events-none"}`}
    >
      <div className="flex items-center justify-between py-3">
        <span className="text-lg font-semibold tracking-tight">Menu</span>
        <button
          ref={closeRef}
          type="button"
          onClick={onClose}
          aria-label="Close menu"
          className="flex size-11 items-center justify-center rounded-pill border border-glass-line bg-glass"
        >
          <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
            <path d="m5 5 10 10M15 5 5 15" />
          </svg>
        </button>
      </div>

      <nav aria-label="Menu" className="mt-4 flex-1">
        <ul className="flex flex-col">
          <Spring
            tag="li"
            enabled={open}
            mode="always"
            from={ROW_FROM}
            to={ROW_TO}
            config={ROW_CONFIG}
            className="border-b border-line py-3"
          >
            <Link href="/services" onClick={onClose} className="block py-1 text-title font-semibold tracking-tight">
              Services
            </Link>
            <div className="mt-2 flex flex-col">
              {SERVICE_CATEGORIES.map((category) => (
                <details key={category.slug} className="group border-t border-line first:border-t-0">
                  <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-base font-medium [&::-webkit-details-marker]:hidden">
                    {category.title}
                    <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="size-4 transition-transform duration-[var(--duration-fast)] ease-entrance group-open:rotate-180">
                      <path d="m5 8 5 5 5-5" />
                    </svg>
                  </summary>
                  <ul className="flex flex-col pb-3 pl-3">
                    <li>
                      <Link href={serviceHref(category.slug)} onClick={onClose} className="block py-1.5 text-sm font-medium text-accent">
                        All {category.title}
                      </Link>
                    </li>
                    {category.items.map((service) => (
                      <li key={service.slug}>
                        <Link href={serviceHref(category.slug, service.slug)} onClick={onClose} className="block py-1.5 text-sm text-muted">
                          {service.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </details>
              ))}
            </div>
          </Spring>

          {NAV_LINKS.map((item, index) => (
            <Spring
              key={item.href}
              tag="li"
              enabled={open}
              mode="always"
              from={ROW_FROM}
              to={ROW_TO}
              config={ROW_CONFIG}
              delayIn={(index + 1) * ROW_STAGGER_MS}
              className="border-b border-line py-3"
            >
              <Link href={item.href} onClick={onClose} className="block py-1 text-title font-semibold tracking-tight">
                {item.label}
              </Link>
            </Spring>
          ))}
        </ul>
      </nav>

      <div className="py-6">
        <Link href={HEADER_CTA.href} onClick={onClose} className={`${buttonClass("primary")} w-full`}>
          {HEADER_CTA.label}
        </Link>
      </div>
    </Spring>,
    document.body,
  );
};

/** The phone's menu button and its full-screen panel. */
export const MobileMenu = () => {
  const [open, setOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const closeRef = useRef<HTMLButtonElement>(null);
  const wasOpen = useRef(false);

  useScrollLock(open);

  const close = useCallback(() => setOpen(false), []);

  useEffect(() => {
    if (open) closeRef.current?.focus();
    else if (wasOpen.current) toggleRef.current?.focus();
    wasOpen.current = open;
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onKey = (event: KeyboardEvent) => {
      if (event.key === "Escape") close();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, close]);

  return (
    <div className="md:hidden">
      <button
        ref={toggleRef}
        type="button"
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Close menu" : "Open menu"}
        onClick={() => setOpen((value) => !value)}
        className="flex size-11 items-center justify-center rounded-pill border border-glass-line bg-glass"
      >
        <svg aria-hidden viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" className="size-5">
          <path d="M3 7h14M3 13h14" />
        </svg>
      </button>
      <MobileMenuPanel open={open} onClose={close} closeRef={closeRef} />
    </div>
  );
};

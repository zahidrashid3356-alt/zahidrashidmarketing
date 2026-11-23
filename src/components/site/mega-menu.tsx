"use client";

import Link from "next/link";

import { Spring } from "@/components/common/robot-spring";
import { buttonClass } from "@/components/ui/button-styles";
import { MEGA_MENU } from "@/data/content";
import { SERVICE_CATEGORIES, serviceHref } from "@/data/services";

import { ContactLink } from "./contact-link";

const FROM = { opacity: 0, y: -10 };
const TO = { opacity: 1, y: 0 };
const CONFIG = { tension: 280, friction: 26 };

interface MegaMenuProps {
  id: string;
  open: boolean;
  onClose: () => void;
  /** Hover handlers — the pointer may cross the gap between the trigger and the panel. */
  onPointerEnter: () => void;
  onPointerLeave: () => void;
}

/**
 * The Services mega menu: a wide frosted-glass panel listing all five services
 * as columns with every sub-service as a real link, plus a call to action.
 * Always in the DOM (links stay crawlable) and `inert` while closed. It is a
 * sibling of the capsule, not a child — a backdrop-filter inside another
 * backdrop-filter blurs nothing.
 */
export const MegaMenu = ({ id, open, onClose, onPointerEnter, onPointerLeave }: MegaMenuProps) => (
  <Spring
    tag="div"
    id={id}
    enabled={open}
    mode="always"
    from={FROM}
    to={TO}
    config={CONFIG}
    inert={!open}
    onMouseEnter={onPointerEnter}
    onMouseLeave={onPointerLeave}
    className={`absolute inset-x-gutter top-full mx-auto mt-3 max-w-page overflow-hidden rounded-card border border-glass-line bg-glass-panel shadow-glow backdrop-blur-xl ${open ? "pointer-events-auto" : "pointer-events-none"}`}
  >
    <div className="grid gap-x-8 gap-y-8 p-9 xl:grid-cols-5">
      {SERVICE_CATEGORIES.map((category) => (
        <div key={category.slug}>
          <Link
            href={serviceHref(category.slug)}
            onClick={onClose}
            className="block text-base font-semibold leading-snug tracking-tight text-foreground transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-accent"
          >
            {category.title}
          </Link>
          <ul className="mt-3 flex flex-col gap-1.5 border-t border-line pt-3">
            {category.items.map((service) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(category.slug, service.slug)}
                  onClick={onClose}
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
    <div className="flex flex-wrap items-center justify-between gap-6 border-t border-line px-9 py-6">
      <div>
        <p className="text-base font-semibold tracking-tight">{MEGA_MENU.promo.title}</p>
        <p className="mt-1 text-sm text-muted">{MEGA_MENU.promo.body}</p>
      </div>
      <ContactLink onNavigate={onClose} className={buttonClass("primary", "sm")}>
        {MEGA_MENU.promo.action}
      </ContactLink>
    </div>
  </Spring>
);

"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

import { SectionLink } from "@/components/ui/section-link";

/**
 * The "Contact Us" call to action. On the home page it smooth-scrolls to the
 * `#contact` section; on any other page there is no such section, so it goes to
 * the contact page. Either way the `href` is a real link.
 */
export const ContactLink = ({
  className,
  children,
  onNavigate,
  delayMs,
}: {
  className?: string;
  children: ReactNode;
  onNavigate?: () => void;
  delayMs?: number;
}) => {
  const pathname = usePathname();
  if (pathname === "/" || pathname === "/robot-view") {
    return (
      <SectionLink id="contact" className={className} onNavigate={onNavigate} delayMs={delayMs}>
        {children}
      </SectionLink>
    );
  }
  return (
    <Link href="/contact" className={className} onClick={onNavigate}>
      {children}
    </Link>
  );
};

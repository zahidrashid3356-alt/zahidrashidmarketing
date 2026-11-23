import Link from "next/link";

import { siteConfig } from "@/lib/site";

/**
 * PLACEHOLDER wordmark — a rounded mark and the name. Swap for the real logo
 * file when it is supplied; the one place the brand mark lives.
 */
export const Logo = ({ className = "" }: { className?: string }) => (
  <Link
    href="/"
    aria-label={`${siteConfig.name} — home`}
    className={`flex items-center gap-3 text-lg font-semibold tracking-tight ${className}`}
  >
    <span
      aria-hidden
      className="flex size-9 items-center justify-center rounded-lg bg-accent text-sm font-bold text-accent-foreground"
    >
      MP
    </span>
    {siteConfig.name}
  </Link>
);

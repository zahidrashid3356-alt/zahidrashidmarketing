import Link from "next/link";

import { buttonClass } from "@/components/ui/button-styles";
import { HEADER_CTA } from "@/data/content";

import { DesktopNav } from "./desktop-nav";
import { Logo } from "./logo";
import { MobileMenu } from "./mobile-menu";

/**
 * The fixed top bar: logo, the links (the desktop mega menu lives in
 * `DesktopNav`), the call to action, and on a phone the menu button. A solid
 * translucent ground, no backdrop blur and no transform or filter on this
 * element, so the mega menu can position against it.
 */
export const SiteHeader = () => (
  <header className="fixed inset-x-0 top-0 z-50 border-b border-line bg-background/95 px-gutter py-3">
    <div className="mx-auto flex w-full max-w-page items-center justify-between gap-6">
      <Logo />
      <DesktopNav />
      <div className="flex items-center gap-3">
        <Link href={HEADER_CTA.href} className={`${buttonClass("primary", "sm")} hidden md:inline-flex`}>
          {HEADER_CTA.label}
        </Link>
        <MobileMenu />
      </div>
    </div>
  </header>
);

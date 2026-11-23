import Link from "next/link";

import { FOOTER } from "@/data/content";
import { SERVICE_CATEGORIES, serviceHref } from "@/data/services";
import { siteConfig } from "@/lib/site";

import { Logo } from "./logo";

const LINK =
  "text-sm text-muted transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-accent";

/** Footer: every category with its sub-services (internal links for crawlers), company and legal. */
export const SiteFooter = () => (
  <footer className="w-full border-t border-line bg-blush-soft px-gutter pb-8 pt-16">
    <div className="mx-auto w-full max-w-page">
      <div className="grid gap-12 lg:grid-cols-[1.1fr_3fr]">
        <div>
          <Logo />
          <p className="mt-4 max-w-xs text-sm text-muted">{FOOTER.blurb}</p>
        </div>

        <div className="grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-3 xl:grid-cols-5">
          {SERVICE_CATEGORIES.map((category) => (
            <div key={category.slug}>
              <Link href={serviceHref(category.slug)} className="text-sm font-semibold tracking-tight hover:text-accent">
                {category.title}
              </Link>
              <ul className="mt-3 flex flex-col gap-2">
                {category.items.map((service) => (
                  <li key={service.slug}>
                    <Link href={serviceHref(category.slug, service.slug)} className={LINK}>
                      {service.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      <div className="mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-line pt-6">
        <p className="text-sm text-muted">
          © {new Date().getFullYear()} {siteConfig.name}
        </p>
        <nav aria-label="Company" className="flex flex-wrap gap-x-6 gap-y-2">
          {[...FOOTER.company, ...FOOTER.legal].map((item) => (
            <Link key={item.href} href={item.href} className={LINK}>
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  </footer>
);

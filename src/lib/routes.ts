// 📖 Docs: obsidian/frontend/seo-metadata.md

/**
 * The route registry — every public page the site serves, in one list.
 *
 * `sitemap.xml`, `/llms.txt` and the breadcrumb JSON-LD all read it, so a page
 * can't be in one and missing from another. `.claude/scripts/verify.sh` FAILs
 * when an `app/**\/page.tsx` has no entry here — a route left out of a
 * hand-kept sitemap array was the most common SEO miss on sites built from
 * this starter.
 *
 * Plain data, no imports: a client component (a nav, a footer) may read it
 * without pulling in `siteConfig` (server-only, it ships zod).
 */

import { SERVICE_CATEGORIES } from "@/data/services";

export type ChangeFrequency =
  | "always"
  | "hourly"
  | "daily"
  | "weekly"
  | "monthly"
  | "yearly"
  | "never";

export interface SiteRoute {
  /** The path, no trailing slash (`/`, `/about`, `/services/branding`). */
  path: `/${string}`;
  /** A short name — the breadcrumb, the `/llms.txt` link text, a nav label. */
  label: string;
  /**
   * What the page gives a reader, one sentence — `/llms.txt` lists it. The
   * home page falls back to `siteConfig.description`.
   */
  summary?: string;
  /** `false` keeps it out of `sitemap.xml` and `/llms.txt` (set `noIndex` on its metadata too). */
  indexable: boolean;
  /**
   * When the page's content last really changed — `YYYY-MM-DD`. Omitted → no
   * `<lastmod>`. Never the build time: a date that moves on every deploy
   * teaches Google to ignore the site's dates.
   */
  updated?: string;
  changeFrequency?: ChangeFrequency;
  /** 0–1, relative to the site's other pages. */
  priority?: number;
  /** The parent's path, for the breadcrumb trail. Omitted → the home page. */
  parent?: `/${string}`;
  /**
   * Multi-language sites only (skill: i18n-seo): every language version of
   * this page — hreflang code → path, **its own included** — the same map on
   * each version's entry, e.g. `{ en: "/about", de: "/de/uber-uns" }`.
   * `x-default` → the first listed unless named. Feeds hreflang in `<head>`
   * (`routeLanguages()` in `src/utils/seo/hreflang.ts`) and `sitemap.xml`.
   */
  alternates?: Readonly<Record<string, `/${string}`>>;
}

/**
 * One entry per route in `src/app`. A new page = a new entry here, in the same
 * change (obsidian/workflows/new-page.md). `/robot-view` is never listed — it
 * is served under `/`.
 *
 * The service pages are generated from `src/data/services.ts`: a catalogue
 * entry is a page, a route and a sitemap line in one move.
 */
const STATIC_ROUTES: readonly SiteRoute[] = [
  {
    path: "/",
    label: "Home",
    summary:
      "Marketing Pro AI: SEO, web development, paid ads, social media and graphic design for businesses in the USA, UK, UAE, Australia and Pakistan.",
    indexable: true,
    changeFrequency: "monthly",
    priority: 1,
  },
  {
    path: "/services",
    label: "Services",
    summary: "Every service Marketing Pro AI offers: marketing, development and design, social media, graphic design and paid advertising.",
    indexable: true,
    changeFrequency: "monthly",
    priority: 0.9,
  },
  { path: "/about", label: "About", summary: "Who we are and how we work.", indexable: false, changeFrequency: "yearly", priority: 0.6 },
  { path: "/our-work", label: "Our Work", summary: "Selected projects and client work.", indexable: false, changeFrequency: "monthly", priority: 0.7 },
  { path: "/blog", label: "Blog", summary: "Guides and notes on SEO, web and marketing.", indexable: false, changeFrequency: "weekly", priority: 0.6 },
  { path: "/contact", label: "Contact", summary: "Get a free quote or ask a question.", indexable: false, changeFrequency: "yearly", priority: 0.8 },
  { path: "/terms-and-conditions", label: "Terms & Conditions", summary: "The terms that apply to our services and this site.", indexable: false, changeFrequency: "yearly", priority: 0.2 },
  { path: "/privacy-policy", label: "Privacy Policy", summary: "What the site collects, why, how long it is kept, and the choices a visitor has.", indexable: true, changeFrequency: "yearly", priority: 0.2 },
  { path: "/refund-and-return", label: "Refund & Return", summary: "When and how refunds and cancellations work.", indexable: false, changeFrequency: "yearly", priority: 0.2 },
];

const SERVICE_ROUTES: readonly SiteRoute[] = SERVICE_CATEGORIES.flatMap((category) => [
  {
    path: `/services/${category.slug}` as const,
    label: category.title,
    summary: category.short,
    indexable: true,
    parent: "/services",
    changeFrequency: "monthly",
    priority: 0.8,
  } satisfies SiteRoute,
  ...category.items.map(
    (service) =>
      ({
        path: `/services/${category.slug}/${service.slug}` as const,
        label: service.title,
        summary: service.short,
        indexable: true,
        parent: `/services/${category.slug}`,
        changeFrequency: "monthly",
        priority: 0.7,
      }) satisfies SiteRoute,
  ),
]);

export const ROUTES: readonly SiteRoute[] = [...STATIC_ROUTES, ...SERVICE_ROUTES];

export type RoutePath = SiteRoute["path"];

/** The registry entry for a path, if it has one. */
export const findRoute = (path: string): SiteRoute | undefined =>
  ROUTES.find((route) => route.path === path);

/** Home → … → the page, following `parent`. Unknown paths give `[]`. */
export function routeTrail(path: string): SiteRoute[] {
  const trail: SiteRoute[] = [];
  let current = findRoute(path);
  // The length guard stops a `parent` cycle typed by mistake.
  while (current && trail.length < ROUTES.length) {
    trail.unshift(current);
    if (current.path === "/") break;
    current = findRoute(current.parent ?? "/");
  }
  return trail;
}

/**
 * Site-wide copy: navigation, the home hero, the footer. Content lives here
 * (props, not hardcoded in markup). Everything marked SAMPLE is placeholder
 * text for the build stage — replace before launch (see the launch checklist
 * in obsidian/meta/launch-checklist.md).
 */

export interface NavLink {
  label: string;
  href: `/${string}`;
}

/** The header's plain links. "Services" is the mega menu, rendered from `services.ts`. */
export const NAV_LINKS: readonly NavLink[] = [
  { label: "About", href: "/about" },
  { label: "Our Work", href: "/our-work" },
  { label: "Blog", href: "/blog" },
  { label: "Contact", href: "/contact" },
];

export const HEADER_CTA = { label: "Get a free quote", href: "/contact" } as const;

export const MEGA_MENU = {
  title: "Services",
  /** The promo panel in the mega menu. */
  promo: {
    title: "Not sure what you need?",
    body: "Tell us about your business and we will point you to the one thing that will help most.",
    action: "Talk to us",
  },
} as const;

/** SAMPLE copy — the positioning draft. */
export const HERO = {
  eyebrow: "Digital marketing agency",
  headline: "Marketing, websites and design that bring you customers.",
  lead: "SEO, web development, paid ads, social media and graphic design from one team, for businesses in the USA, UK, UAE, Australia and Pakistan.",
  primaryCta: { label: "Get a free quote", href: "/contact" },
  secondaryCta: { label: "See our services", href: "/services" },
  markets: ["USA", "UK", "UAE", "Australia", "Pakistan"],
  marketsLabel: "Working with businesses in",
} as const;

export const SERVICES_INTRO = {
  eyebrow: "What we do",
  title: "Five services. One team.",
  body: "Pick one service or combine them. SEO, a faster website and the ads that point to it work better when the same people run all three.",
} as const;

export const FOOTER = {
  blurb: "Marketing, development and design for growing businesses.",
  company: [
    { label: "About", href: "/about" },
    { label: "Our Work", href: "/our-work" },
    { label: "Blog", href: "/blog" },
    { label: "Contact", href: "/contact" },
  ],
  legal: [
    { label: "Terms & Conditions", href: "/terms-and-conditions" },
    { label: "Privacy Policy", href: "/privacy-policy" },
    { label: "Refund & Return", href: "/refund-and-return" },
  ],
} as const satisfies {
  blurb: string;
  company: readonly NavLink[];
  legal: readonly NavLink[];
};

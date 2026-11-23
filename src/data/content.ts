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

/**
 * The header's links in order. `services` is the mega menu (rendered from
 * `services.ts`), so it carries no href of its own.
 */
export type NavEntry = { kind: "link"; link: NavLink } | { kind: "services" };

export const NAV_ENTRIES: readonly NavEntry[] = [
  { kind: "link", link: { label: "About Us", href: "/about" } },
  { kind: "services" },
  { kind: "link", link: { label: "Blog", href: "/blog" } },
  { kind: "link", link: { label: "Our Work", href: "/our-work" } },
  { kind: "link", link: { label: "Areas We Serve", href: "/areas-we-serve" } },
];

/** Every plain link, in order — the phone menu and the footer read this. */
export const NAV_LINKS: readonly NavLink[] = NAV_ENTRIES.flatMap((entry) =>
  entry.kind === "link" ? [entry.link] : [],
);

/** SAMPLE number — replace with the real one (tel: link, header + phone menu). */
export const PHONE = { display: "+1 000 000 0000", tel: "+10000000000" } as const;

export const CONTACT_CTA = { label: "Contact Us" } as const;

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
    { label: "About Us", href: "/about" },
    { label: "Blog", href: "/blog" },
    { label: "Our Work", href: "/our-work" },
    { label: "Areas We Serve", href: "/areas-we-serve" },
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

/** SAMPLE copy — the About preview on the home page. */
export const ABOUT_PREVIEW = {
  eyebrow: "About us",
  title: "A small team that does the work.",
  body: [
    "Marketing Pro AI is a digital marketing agency. We handle SEO, websites, paid ads, social media and design, so one team is accountable for how it all fits together.",
    "We work with businesses in the USA, UK, UAE, Australia and Pakistan, and we tell you plainly what will and will not help.",
  ],
} as const;

/** SAMPLE copy — the contact section on the home page. */
export const CONTACT_PREVIEW = {
  eyebrow: "Contact",
  title: "Tell us what you need.",
  body: "Send a few details about your business and we will reply with what we would do first.",
  action: "Get a free quote",
} as const;

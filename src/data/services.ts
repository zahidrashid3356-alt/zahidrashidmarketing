/**
 * The service catalogue — five main services, 26 sub-services. One source for
 * the mega menu, the footer, the home page cards, every service page, the
 * route registry (sitemap, llms.txt) and the JSON-LD. A page exists because
 * its entry is here; change a name or slug here and nowhere else.
 *
 * URLs: `/services/<category>` and `/services/<category>/<slug>`. Slugs are
 * the keyword in plain words and, once live, never change (a changed URL
 * needs a redirect and loses time).
 */

export interface SubService {
  slug: string;
  title: string;
  /** One line for menus and cards. */
  short: string;
}

export interface ServiceCategory {
  slug: string;
  title: string;
  /** One line for menus and cards. */
  short: string;
  items: readonly SubService[];
}

export const SERVICE_CATEGORIES: readonly ServiceCategory[] = [
  {
    slug: "marketing",
    title: "Marketing",
    short: "Be found on Google and in AI answers, then turn visits into customers.",
    items: [
      { slug: "search-engine-optimization", title: "Search Engine Optimization", short: "Rank for the searches that bring customers." },
      { slug: "generative-engine-optimization", title: "Generative Engine Optimization", short: "Get cited by ChatGPT, Gemini and AI search." },
      { slug: "email-marketing", title: "Email Marketing", short: "Campaigns and flows that bring people back." },
      { slug: "conversion-rate-optimization", title: "Conversion Rate Optimization", short: "Turn more of your visitors into enquiries." },
      { slug: "content-marketing", title: "Content Marketing", short: "Content that answers questions and earns trust." },
    ],
  },
  {
    slug: "development-design",
    title: "Development & Design",
    short: "Fast, clear websites built to convert, on the platform that fits.",
    items: [
      { slug: "wordpress-development", title: "WordPress Development", short: "Custom WordPress sites you can edit yourself." },
      { slug: "shopify-development", title: "Shopify Development", short: "Online stores built to sell." },
      { slug: "custom-website-development", title: "Custom Website Development", short: "Hand-built sites for needs templates can't meet." },
      { slug: "ai-powered-website-development", title: "AI-Powered Website Development", short: "Sites with AI features that do real work." },
      { slug: "ui-ux-design", title: "UI/UX Design", short: "Interfaces people understand at first glance." },
      { slug: "landing-page-design", title: "Landing Page Design", short: "Single pages built for one goal." },
      { slug: "responsive-web-design", title: "Responsive Web Design", short: "Sites that work on every screen size." },
    ],
  },
  {
    slug: "social-media-marketing",
    title: "Social Media Marketing",
    short: "Your brand, managed and posting consistently on the right platforms.",
    items: [
      { slug: "facebook-instagram-management", title: "Facebook & Instagram Management", short: "Content, posting and community on Meta." },
      { slug: "x-twitter-management", title: "X (Twitter) Management", short: "A clear voice and steady presence on X." },
      { slug: "linkedin-management", title: "LinkedIn Management", short: "B2B visibility and thought leadership." },
      { slug: "tiktok-management", title: "TikTok Management", short: "Short video that fits the platform." },
    ],
  },
  {
    slug: "graphic-design",
    title: "Graphic Design",
    short: "A brand that looks the same, and looks right, everywhere.",
    items: [
      { slug: "branding-services", title: "Branding Services", short: "Identity, voice and guidelines." },
      { slug: "logo-design", title: "Logo Design", short: "A mark that works at every size." },
      { slug: "business-card-design", title: "Business Card Design", short: "Print-ready cards that get kept." },
      { slug: "company-profile-design", title: "Company Profile Design", short: "A profile that sells your company." },
      { slug: "packaging-design", title: "Packaging Design", short: "Packaging that stands out on the shelf." },
    ],
  },
  {
    slug: "paid-advertising",
    title: "Paid Advertising",
    short: "Ads that are measured against leads and sales, not clicks.",
    items: [
      { slug: "google-ads-ppc", title: "PPC / Google Advertising", short: "Search, Shopping and Performance Max campaigns." },
      { slug: "facebook-marketing", title: "Facebook Marketing", short: "Meta ads built around your customer." },
      { slug: "tiktok-marketing", title: "TikTok Marketing", short: "Paid reach where attention is cheap." },
      { slug: "youtube-marketing", title: "YouTube Marketing", short: "Video ads and channel growth." },
      { slug: "linkedin-marketing", title: "LinkedIn Marketing", short: "Targeted B2B campaigns by role and industry." },
    ],
  },
] as const;

export const findCategory = (slug: string): ServiceCategory | undefined =>
  SERVICE_CATEGORIES.find((category) => category.slug === slug);

export const findService = (
  categorySlug: string,
  slug: string,
): { category: ServiceCategory; service: SubService } | undefined => {
  const category = findCategory(categorySlug);
  const service = category?.items.find((item) => item.slug === slug);
  return category && service ? { category, service } : undefined;
};

export const serviceHref = (categorySlug: string, slug?: string): `/${string}` =>
  slug ? `/services/${categorySlug}/${slug}` : `/services/${categorySlug}`;

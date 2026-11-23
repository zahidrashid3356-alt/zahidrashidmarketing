import Link from "next/link";

import { buttonClass } from "@/components/ui/button-styles";
import {
  SERVICE_CATEGORIES,
  serviceHref,
  type ServiceCategory,
  type SubService,
} from "@/data/services";
import { siteConfig } from "@/lib/site";
import { getServiceStructuredData } from "@/utils/seo/structured-data";

import { PageShell } from "./page-shell";

const AREAS = ["United States", "United Kingdom", "United Arab Emirates", "Australia", "Pakistan"];

/**
 * SAMPLE — the same four-step shape for every service until each page gets its
 * own copy (one section at a time). Replace per service; a page whose body is
 * identical to its siblings will not be indexed well, so these are a scaffold,
 * not the finished text.
 */
const WHAT_YOU_GET: Record<string, readonly { title: string; body: string }[]> = {
  marketing: [
    { title: "A clear starting point", body: "We review where you are today and what is holding results back." },
    { title: "A plan in plain language", body: "Priorities ranked by effect and effort, so you know what comes first." },
    { title: "Work done and reported", body: "We do the work and report it against numbers you can check." },
  ],
  "development-design": [
    { title: "Built for speed", body: "Pages that load fast on a phone, because speed affects rankings and sales." },
    { title: "Designed to convert", body: "Layouts that make the next step obvious to a first-time visitor." },
    { title: "Yours to run", body: "A site you can edit and grow, with handover that makes sense." },
  ],
  "social-media-management": [
    { title: "A consistent presence", body: "A posting plan that fits your brand and your audience." },
    { title: "Content made for the platform", body: "Posts, captions and visuals written for how people use each channel." },
    { title: "Community and reporting", body: "Replies handled and a simple report of what worked." },
  ],
  "graphic-design": [
    { title: "A look that fits you", body: "Concepts shaped by your business, not a template." },
    { title: "Files that are ready to use", body: "Print and web files in the formats you actually need." },
    { title: "Revisions that finish", body: "A clear round of changes, then final files." },
  ],
  "paid-advertisement": [
    { title: "Campaigns set up properly", body: "Tracking first, so every lead and sale can be traced to an ad." },
    { title: "Budget watched closely", body: "Spend moves to what works and away from what does not." },
    { title: "Reports tied to results", body: "Leads and sales, not just clicks and impressions." },
  ],
};

const STEPS = [
  { title: "Discover", body: "We learn your business, customers and goals." },
  { title: "Plan", body: "We agree what to do, in what order, and how success is measured." },
  { title: "Deliver", body: "We do the work and keep you updated as it goes." },
  { title: "Improve", body: "We review results and decide the next change." },
] as const;

const CtaBand = () => (
  <section aria-label="Get started" className="mt-section rounded-card bg-blush p-8 sm:p-12">
    <h2 className="max-w-3xl text-headline font-semibold leading-display tracking-tight">
      Tell us about your business.
    </h2>
    <p className="mt-4 max-w-2xl text-lead text-muted">
      Send a few details and we will reply with what we would do first.
    </p>
    <Link href="/contact" className={`${buttonClass("primary")} mt-8`}>
      Get a free quote
    </Link>
  </section>
);

/** `/services` — the whole catalogue. */
export const ServicesIndexView = () => (
  <PageShell path="/services">
    <h1 className="max-w-4xl text-display font-semibold leading-display tracking-tight">
      Our services
    </h1>
    <p className="mt-6 max-w-2xl text-lead text-muted">
      Marketing, websites, social media, design and paid ads, from one team. Choose a service to see what it
      includes.
    </p>

    <div className="mt-14 flex flex-col gap-12">
      {SERVICE_CATEGORIES.map((category) => (
        <section key={category.slug} aria-labelledby={`cat-${category.slug}`} className="grid gap-6 lg:grid-cols-[0.8fr_1.2fr] lg:gap-16">
          <div>
            <h2 id={`cat-${category.slug}`} className="text-headline font-semibold leading-display tracking-tight">
              <Link href={serviceHref(category.slug)} className="hover:text-accent">
                {category.title}
              </Link>
            </h2>
            <p className="mt-3 text-base text-muted">{category.short}</p>
          </div>
          <ul className="grid gap-3 sm:grid-cols-2">
            {category.items.map((service) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(category.slug, service.slug)}
                  className="block h-full rounded-2xl border border-glass-line bg-surface-raised p-5 transition-colors duration-[var(--duration-fast)] ease-entrance hover:border-accent"
                >
                  <span className="block text-base font-semibold tracking-tight">{service.title}</span>
                  <span className="mt-1 block text-sm text-muted">{service.short}</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
    <CtaBand />
  </PageShell>
);

/** `/services/<category>` */
export const ServiceCategoryView = ({ category }: { category: ServiceCategory }) => (
  <PageShell path={serviceHref(category.slug)}>
    <h1 className="max-w-4xl text-display font-semibold leading-display tracking-tight">
      {category.title}
    </h1>
    <p className="mt-6 max-w-2xl text-lead text-muted">{category.short}</p>

    <ul className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
      {category.items.map((service, index) => (
        <li key={service.slug}>
          <Link
            href={serviceHref(category.slug, service.slug)}
            className="flex h-full flex-col rounded-card border border-glass-line bg-surface-raised p-8 transition-colors duration-[var(--duration-fast)] ease-entrance hover:border-accent"
          >
            <span className="text-sm font-medium tabular-nums text-accent">
              {String(index + 1).padStart(2, "0")}
            </span>
            <h2 className="mt-4 text-title font-semibold leading-snug tracking-tight">{service.title}</h2>
            <p className="mt-3 text-base text-muted">{service.short}</p>
          </Link>
        </li>
      ))}
    </ul>
    <CtaBand />
  </PageShell>
);

/** `/services/<category>/<slug>` */
export const ServiceDetailView = ({
  category,
  service,
}: {
  category: ServiceCategory;
  service: SubService;
}) => {
  const path = serviceHref(category.slug, service.slug);
  const related = category.items.filter((item) => item.slug !== service.slug);
  const gets = WHAT_YOU_GET[category.slug] ?? [];

  return (
    <PageShell
      path={path}
      nodes={[
        getServiceStructuredData({
          path,
          name: service.title,
          description: `${service.title} from ${siteConfig.name}. ${service.short}`,
          serviceType: service.title,
          areaServed: AREAS,
        }),
      ]}
    >
      <p className="text-sm font-medium uppercase tracking-widest text-accent">{category.title}</p>
      <h1 className="mt-4 max-w-4xl text-display font-semibold leading-display tracking-tight">
        {service.title}
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-muted">{service.short}</p>
      <Link href="/contact" className={`${buttonClass("primary")} mt-9`}>
        Get a free quote
      </Link>

      <section aria-labelledby="gets" className="mt-section">
        <h2 id="gets" className="text-headline font-semibold leading-display tracking-tight">
          What you get
        </h2>
        <ul className="mt-10 grid gap-5 md:grid-cols-3">
          {gets.map((item) => (
            <li key={item.title} className="rounded-card border border-glass-line bg-surface-raised p-8">
              <h3 className="text-title font-semibold leading-snug tracking-tight">{item.title}</h3>
              <p className="mt-3 text-base text-muted">{item.body}</p>
            </li>
          ))}
        </ul>
      </section>

      <section aria-labelledby="steps" className="mt-section">
        <h2 id="steps" className="text-headline font-semibold leading-display tracking-tight">
          How we work
        </h2>
        <ol className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {STEPS.map((step, index) => (
            <li key={step.title} className="rounded-card bg-blush-soft p-8">
              <p className="text-sm font-medium tabular-nums text-accent">
                {String(index + 1).padStart(2, "0")}
              </p>
              <h3 className="mt-4 text-title font-semibold leading-snug tracking-tight">{step.title}</h3>
              <p className="mt-3 text-base text-muted">{step.body}</p>
            </li>
          ))}
        </ol>
      </section>

      <section aria-labelledby="related" className="mt-section">
        <h2 id="related" className="text-headline font-semibold leading-display tracking-tight">
          More {category.title.toLowerCase()} services
        </h2>
        <ul className="mt-10 grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {related.map((item) => (
            <li key={item.slug}>
              <Link
                href={serviceHref(category.slug, item.slug)}
                className="block h-full rounded-2xl border border-glass-line bg-surface-raised p-5 transition-colors duration-[var(--duration-fast)] ease-entrance hover:border-accent"
              >
                <span className="block text-base font-semibold tracking-tight">{item.title}</span>
                <span className="mt-1 block text-sm text-muted">{item.short}</span>
              </Link>
            </li>
          ))}
        </ul>
      </section>
      <CtaBand />
    </PageShell>
  );
};

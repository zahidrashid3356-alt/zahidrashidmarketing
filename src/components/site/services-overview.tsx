import Link from "next/link";

import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { SERVICES_INTRO } from "@/data/content";
import { SERVICE_CATEGORIES, serviceHref } from "@/data/services";

/** The five main services as cards, each listing its sub-services as real links. */
export const ServicesOverview = () => (
  <Section id="services" label="Services">
    <div className="flex flex-col items-start gap-6">
      <Reveal>
        <Eyebrow>{SERVICES_INTRO.eyebrow}</Eyebrow>
      </Reveal>
      <Headline className="max-w-4xl text-headline">{SERVICES_INTRO.title}</Headline>
      <Reveal tag="p" className="max-w-2xl text-lead text-muted">
        {SERVICES_INTRO.body}
      </Reveal>
    </div>

    <ul className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
      {SERVICE_CATEGORIES.map((category, index) => (
        <Reveal
          key={category.slug}
          tag="li"
          delayIn={(index % 3) * 100}
          className="flex flex-col rounded-card border border-glass-line bg-surface-raised p-8"
        >
          <p className="text-sm font-medium tabular-nums text-accent">
            {String(index + 1).padStart(2, "0")}
          </p>
          <h3 className="mt-4 text-title font-semibold leading-snug tracking-tight">
            <Link href={serviceHref(category.slug)} className="hover:text-accent">
              {category.title}
            </Link>
          </h3>
          <p className="mt-3 text-base text-muted">{category.short}</p>
          <ul className="mt-6 flex flex-col gap-2 border-t border-line pt-5">
            {category.items.map((service) => (
              <li key={service.slug}>
                <Link
                  href={serviceHref(category.slug, service.slug)}
                  className="text-sm text-foreground transition-colors duration-[var(--duration-fast)] ease-entrance hover:text-accent"
                >
                  {service.title}
                </Link>
              </li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ul>
  </Section>
);

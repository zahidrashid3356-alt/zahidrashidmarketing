import Link from "next/link";

import { buttonClass } from "@/components/ui/button-styles";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { CONTACT_PREVIEW, PHONE } from "@/data/content";

/** The `#contact` target the header's Contact Us button scrolls to (SAMPLE copy; the form comes later). */
export const ContactCta = () => (
  <Section id="contact" label="Contact">
    <div className="rounded-card bg-blush p-8 sm:p-14">
      <Reveal>
        <Eyebrow>{CONTACT_PREVIEW.eyebrow}</Eyebrow>
      </Reveal>
      <Headline className="mt-6 max-w-3xl text-headline">{CONTACT_PREVIEW.title}</Headline>
      <Reveal tag="p" delayIn={150} className="mt-5 max-w-2xl text-lead text-muted">
        {CONTACT_PREVIEW.body}
      </Reveal>
      <Reveal delayIn={250} className="mt-9 flex flex-wrap gap-4">
        <Link href="/contact" className={buttonClass("primary")}>
          {CONTACT_PREVIEW.action}
        </Link>
        <a href={`tel:${PHONE.tel}`} className={buttonClass("secondary")}>
          Call {PHONE.display}
        </a>
      </Reveal>
    </div>
  </Section>
);

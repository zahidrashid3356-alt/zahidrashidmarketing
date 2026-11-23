import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { Section } from "@/components/ui/section";
import { ABOUT_PREVIEW } from "@/data/content";

/**
 * A text-only section (SAMPLE copy). The background swarm is dispersed here —
 * faint and slow — so the text stays fully readable.
 */
export const AboutPreview = () => (
  <Section id="about" label="About us" className="flex min-h-[80svh] items-center">
    <div className="grid gap-10 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
      <div className="flex flex-col items-start gap-6">
        <Reveal>
          <Eyebrow>{ABOUT_PREVIEW.eyebrow}</Eyebrow>
        </Reveal>
        <Headline className="text-headline">{ABOUT_PREVIEW.title}</Headline>
      </div>
      <div>
        {ABOUT_PREVIEW.body.map((paragraph, index) => (
          <Reveal
            key={paragraph}
            tag="p"
            delayIn={index * 120}
            className="mb-6 max-w-3xl text-lead text-muted last:mb-0"
          >
            {paragraph}
          </Reveal>
        ))}
      </div>
    </div>
  </Section>
);

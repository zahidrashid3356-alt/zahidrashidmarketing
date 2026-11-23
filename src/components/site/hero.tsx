import Link from "next/link";

import { buttonClass } from "@/components/ui/button-styles";
import { Eyebrow } from "@/components/ui/eyebrow";
import { Headline } from "@/components/ui/headline";
import { Reveal } from "@/components/ui/reveal";
import { HERO } from "@/data/content";

import { GeometricShape } from "./geometric-shape";
import { ParticleStage } from "./particle-stage";

/**
 * First screen. The `<h1>` is the page's one title; the lead answers it in two
 * sentences. The right-hand slot is a particle stage: the background swarm
 * gathers on its shape, then the real image (a PLACEHOLDER geometric drawing)
 * fades in. Replace the drawing with real artwork when supplied.
 */
export const Hero = () => (
  <section
    id="top"
    aria-label="Introduction"
    className="relative flex min-h-svh w-full items-center px-gutter pb-16 pt-28 sm:pt-32"
  >
    <div className="mx-auto grid w-full max-w-page items-center gap-14 lg:grid-cols-[1.15fr_0.85fr]">
      <div className="flex flex-col items-start">
        <Reveal>
          <Eyebrow>{HERO.eyebrow}</Eyebrow>
        </Reveal>

        <Headline tag="h1" lazy={false} className="mt-6 text-display">
          {HERO.headline}
        </Headline>

        <Reveal tag="p" delayIn={200} className="mt-7 max-w-2xl text-lead text-muted">
          {HERO.lead}
        </Reveal>

        <Reveal delayIn={300} className="mt-9 flex flex-wrap gap-4">
          <Link href={HERO.primaryCta.href} className={buttonClass("primary")}>
            {HERO.primaryCta.label}
          </Link>
          <Link href={HERO.secondaryCta.href} className={buttonClass("secondary")}>
            {HERO.secondaryCta.label}
          </Link>
        </Reveal>

        <Reveal delayIn={400} className="mt-12">
          <p className="text-sm text-muted">{HERO.marketsLabel}</p>
          <ul className="mt-3 flex flex-wrap gap-x-6 gap-y-2 text-base font-medium">
            {HERO.markets.map((market) => (
              <li key={market}>{market}</li>
            ))}
          </ul>
        </Reveal>
      </div>

      <ParticleStage id="hero" className="mx-auto aspect-square w-full max-w-xl">
        <GeometricShape />
      </ParticleStage>
    </div>
  </section>
);

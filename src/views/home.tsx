import { RobotProvider, RobotView } from "@/components/common/robot-view";
import { AboutPreview } from "@/components/site/about-preview";
import { ContactCta } from "@/components/site/contact-cta";
import { Hero } from "@/components/site/hero";
import { ServicesOverview } from "@/components/site/services-overview";
import { SiteFooter } from "@/components/site/site-footer";
import { Navbar } from "@/components/site/navbar";

/**
 * Home view — a Server Component; every section is a Server Component or a thin
 * client leaf, so the HTML is complete before hydration. `robot` is the robot
 * form (obsidian/frontend/robot-form.md): `app/robot-view` renders
 * `<HomeView robot />` for crawlers, routed there by the proxy. Never read
 * `headers()` here: `/` must stay static.
 */
export const HomeView = ({ robot = false }: { robot?: boolean }) => (
  <RobotProvider robot={robot}>
    {robot && <RobotView />}
    <a
      href="#main"
      className="sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-2 focus:text-accent-foreground"
    >
      Skip to content
    </a>
    <Navbar />
    <main id="main" className="relative w-full overflow-x-clip">
      <Hero />
      <AboutPreview />
      <ServicesOverview />
      <ContactCta />
    </main>
    <SiteFooter />
  </RobotProvider>
);

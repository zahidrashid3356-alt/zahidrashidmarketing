import Link from "next/link";

import { JsonLd } from "@/components/common/json-ld";
import { SiteFooter } from "@/components/site/site-footer";
import { Navbar } from "@/components/site/navbar";
import { routeTrail } from "@/lib/routes";
import { getBreadcrumbStructuredData, jsonLdGraph, type JsonLdNode } from "@/utils/seo/structured-data";

interface PageShellProps {
  /** This page's path — its breadcrumb trail comes from the route registry. */
  path: string;
  /** Extra JSON-LD nodes for the page (a Service, an Article…). */
  nodes?: JsonLdNode[];
  children: React.ReactNode;
}

/**
 * The frame of every inner page: skip link, header, a visible breadcrumb (also
 * emitted as BreadcrumbList JSON-LD), the main landmark and the footer. A Server
 * Component with no motion — inner pages are read, and the HTML is complete
 * before hydration.
 */
export const PageShell = ({ path, nodes = [], children }: PageShellProps) => {
  const trail = routeTrail(path);
  const breadcrumb = getBreadcrumbStructuredData(path);

  return (
    <>
      <JsonLd data={jsonLdGraph(...(breadcrumb ? [breadcrumb] : []), ...nodes)} />
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-gutter focus:top-4 focus:z-[60] focus:rounded-pill focus:bg-accent focus:px-5 focus:py-2 focus:text-accent-foreground"
      >
        Skip to content
      </a>
      <Navbar />
      <main id="main" className="relative w-full overflow-x-clip px-gutter pb-section pt-28 sm:pt-32">
        <div className="mx-auto w-full max-w-page">
          {trail.length > 1 ? (
            <nav aria-label="Breadcrumb" className="mb-8">
              <ol className="flex flex-wrap items-center gap-2 text-sm text-muted">
                {trail.map((route, index) => (
                  <li key={route.path} className="flex items-center gap-2">
                    {index > 0 ? <span aria-hidden>/</span> : null}
                    {index === trail.length - 1 ? (
                      <span aria-current="page" className="text-foreground">
                        {route.label}
                      </span>
                    ) : (
                      <Link href={route.path} className="hover:text-accent">
                        {route.label}
                      </Link>
                    )}
                  </li>
                ))}
              </ol>
            </nav>
          ) : null}
          {children}
        </div>
      </main>
      <SiteFooter />
    </>
  );
};

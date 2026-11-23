import Link from "next/link";

import { buttonClass } from "@/components/ui/button-styles";
import { findRoute } from "@/lib/routes";

import { PageShell } from "./services/page-shell";

/**
 * A page that exists so links never 404, but whose real content is built in a
 * later step. Its route is `indexable: false`. Delete this view's use per page
 * as each one is built.
 */
export const StubView = ({ path }: { path: string }) => {
  const route = findRoute(path);
  return (
    <PageShell path={path}>
      <h1 className="max-w-4xl text-display font-semibold leading-display tracking-tight">
        {route?.label ?? "Page"}
      </h1>
      <p className="mt-6 max-w-2xl text-lead text-muted">{route?.summary}</p>
      <p className="mt-6 max-w-2xl text-base text-muted">This page is being built.</p>
      <Link href="/" className={`${buttonClass("secondary")} mt-9`}>
        Back to home
      </Link>
    </PageShell>
  );
};

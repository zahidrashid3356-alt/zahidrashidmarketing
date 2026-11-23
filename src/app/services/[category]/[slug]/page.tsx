import { notFound } from "next/navigation";

import { SERVICE_CATEGORIES, findService, serviceHref } from "@/data/services";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { ServiceDetailView } from "@/views/services/service-views";

type Params = { category: string; slug: string };

export const dynamicParams = false;

export const generateStaticParams = (): Params[] =>
  SERVICE_CATEGORIES.flatMap((category) =>
    category.items.map((service) => ({ category: category.slug, slug: service.slug })),
  );

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, slug } = await params;
  const found = findService(categorySlug, slug);
  if (!found) return {};
  return buildMetadata({
    title: found.service.title,
    description: `${found.service.title} by Marketing Pro AI. ${found.service.short}`,
    url: serviceHref(found.category.slug, found.service.slug),
  });
}

export default async function ServicePage({ params }: { params: Promise<Params> }) {
  const { category: categorySlug, slug } = await params;
  const found = findService(categorySlug, slug);
  if (!found) notFound();
  return <ServiceDetailView category={found.category} service={found.service} />;
}

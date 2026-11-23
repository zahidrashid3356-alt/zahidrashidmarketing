import { notFound } from "next/navigation";

import { SERVICE_CATEGORIES, findCategory, serviceHref } from "@/data/services";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { ServiceCategoryView } from "@/views/services/service-views";

type Params = { category: string };

export const dynamicParams = false;

export const generateStaticParams = (): Params[] =>
  SERVICE_CATEGORIES.map((category) => ({ category: category.slug }));

export async function generateMetadata({ params }: { params: Promise<Params> }) {
  const category = findCategory((await params).category);
  if (!category) return {};
  return buildMetadata({
    title: category.title,
    description: `${category.title} services from Marketing Pro AI: ${category.items
      .map((item) => item.title)
      .join(", ")}.`,
    url: serviceHref(category.slug),
  });
}

export default async function ServiceCategoryPage({ params }: { params: Promise<Params> }) {
  const category = findCategory((await params).category);
  if (!category) notFound();
  return <ServiceCategoryView category={category} />;
}

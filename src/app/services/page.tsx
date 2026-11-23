import { ServicesIndexView } from "@/views/services/service-views";
import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";

export const metadata = buildMetadata({
  title: "Services",
  description:
    "Marketing, web development and design, social media, graphic design and paid advertising from one team. See every service Marketing Pro AI offers.",
  url: "/services",
});

export default function ServicesPage() {
  return <ServicesIndexView />;
}

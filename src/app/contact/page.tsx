import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { StubView } from "@/views/stub";

export const metadata = buildMetadata({
  title: "Contact",
  description: "Contact — Marketing Pro AI.",
  url: "/contact",
  noIndex: true,
});

export default function Page() {
  return <StubView path="/contact" />;
}

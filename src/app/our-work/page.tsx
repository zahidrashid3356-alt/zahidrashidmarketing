import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { StubView } from "@/views/stub";

export const metadata = buildMetadata({
  title: "Our Work",
  description: "Our Work — Marketing Pro AI.",
  url: "/our-work",
  noIndex: true,
});

export default function Page() {
  return <StubView path="/our-work" />;
}

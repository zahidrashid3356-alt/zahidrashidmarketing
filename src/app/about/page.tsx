import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { StubView } from "@/views/stub";

export const metadata = buildMetadata({
  title: "About",
  description: "About — Marketing Pro AI.",
  url: "/about",
  noIndex: true,
});

export default function Page() {
  return <StubView path="/about" />;
}

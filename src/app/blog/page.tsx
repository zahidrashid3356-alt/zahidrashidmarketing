import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { StubView } from "@/views/stub";

export const metadata = buildMetadata({
  title: "Blog",
  description: "Blog — Marketing Pro AI.",
  url: "/blog",
  noIndex: true,
});

export default function Page() {
  return <StubView path="/blog" />;
}

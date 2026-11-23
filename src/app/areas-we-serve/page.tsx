import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { StubView } from "@/views/stub";

export const metadata = buildMetadata({
  title: "Areas We Serve",
  description: "Areas We Serve — Marketing Pro AI.",
  url: "/areas-we-serve",
  noIndex: true,
});

export default function Page() {
  return <StubView path="/areas-we-serve" />;
}

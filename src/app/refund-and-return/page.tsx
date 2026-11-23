import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { StubView } from "@/views/stub";

export const metadata = buildMetadata({
  title: "Refund & Return",
  description: "Refund & Return — Marketing Pro AI.",
  url: "/refund-and-return",
  noIndex: true,
});

export default function Page() {
  return <StubView path="/refund-and-return" />;
}

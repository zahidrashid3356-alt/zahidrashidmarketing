import { generateMetadata as buildMetadata } from "@/utils/seo/generate-page-metadata";
import { StubView } from "@/views/stub";

export const metadata = buildMetadata({
  title: "Terms & Conditions",
  description: "Terms & Conditions — Marketing Pro AI.",
  url: "/terms-and-conditions",
  noIndex: true,
});

export default function Page() {
  return <StubView path="/terms-and-conditions" />;
}

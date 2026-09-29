import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { legalPageDefaults } from "@/components/legal/legal-page-content";
import { createSeoMetadata } from "@/lib/seo";
import { getLegalPageContent } from "@/lib/site-settings";

export const revalidate = 86400;

export async function generateMetadata() {
  const data = await getLegalPageContent("disclaimer", legalPageDefaults.disclaimer);
  return createSeoMetadata({ title: data.title, description: data.description, path: "/disclaimer" });
}

export default async function DisclaimerPage() {
  const data = await getLegalPageContent("disclaimer", legalPageDefaults.disclaimer);
  return <LegalPageLayout data={data} path="/disclaimer" />;
}

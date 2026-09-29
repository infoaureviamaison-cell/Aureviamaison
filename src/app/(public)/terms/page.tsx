import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { legalPageDefaults } from "@/components/legal/legal-page-content";
import { createSeoMetadata } from "@/lib/seo";
import { getLegalPageContent } from "@/lib/site-settings";

export const revalidate = 86400;

export async function generateMetadata() {
  const data = await getLegalPageContent("terms", legalPageDefaults.terms);
  return createSeoMetadata({ title: data.title, description: data.description, path: "/terms" });
}

export default async function TermsPage() {
  const data = await getLegalPageContent("terms", legalPageDefaults.terms);
  return <LegalPageLayout data={data} path="/terms" />;
}

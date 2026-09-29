import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { legalPageDefaults } from "@/components/legal/legal-page-content";
import { createSeoMetadata } from "@/lib/seo";
import { getLegalPageContent } from "@/lib/site-settings";

export const revalidate = 86400;

export async function generateMetadata() {
  const data = await getLegalPageContent("refund-policy", legalPageDefaults["refund-policy"]);
  return createSeoMetadata({ title: data.title, description: data.description, path: "/refund-policy" });
}

export default async function RefundPolicyPage() {
  const data = await getLegalPageContent("refund-policy", legalPageDefaults["refund-policy"]);
  return <LegalPageLayout data={data} path="/refund-policy" />;
}

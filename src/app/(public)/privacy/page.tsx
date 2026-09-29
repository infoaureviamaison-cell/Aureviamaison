import { LegalPageLayout } from "@/components/legal/legal-page-layout";
import { legalPageDefaults } from "@/components/legal/legal-page-content";
import { createSeoMetadata } from "@/lib/seo";
import { getLegalPageContent } from "@/lib/site-settings";

export const revalidate = 86400;

export async function generateMetadata() {
  const data = await getLegalPageContent("privacy", legalPageDefaults.privacy);
  return createSeoMetadata({ title: data.title, description: data.description, path: "/privacy" });
}

export default async function PrivacyPage() {
  const data = await getLegalPageContent("privacy", legalPageDefaults.privacy);
  return <LegalPageLayout data={data} path="/privacy" />;
}

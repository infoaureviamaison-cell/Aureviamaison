import { CertificateShowcase, type PublicCertificate } from "@/components/features/certifications/certificate-showcase";
import { prisma } from "@/lib/prisma";
import { createSeoMetadata } from "@/lib/seo";

export const metadata = createSeoMetadata({
  title: "Certificates & Verifications | Auerviamaison",
  description: "Review Auerviamaison certificates, issuing organizations and available verification details.",
  path: "/certificates",
  keywords: ["Auerviamaison certificates", "verified beauty products", "Auerviamaison authenticity"],
});

export const revalidate = 900;

export default async function CertificatesPage() {
  let certificates: PublicCertificate[] = [];
  try {
    const records = await prisma.certificate.findMany({ where: { active: true }, orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "asc" }] });
    certificates = records.map((certificate) => ({ ...certificate, issueDate: certificate.issueDate.toISOString(), expiryDate: certificate.expiryDate?.toISOString() || null }));
  } catch (error) {
    console.warn("Unable to load certificates page:", error instanceof Error ? error.message : error);
  }
  return <CertificateShowcase certificates={certificates} />;
}

import { prisma } from "@/lib/prisma"
import { serializeVideo } from "@/lib/video-utils"
import { FeaturedVideoSection } from "@/components/features/videos/featured-video-section"
import { AboutPageContent } from "./_components/about-page-content"
import { createSeoMetadata } from "@/lib/seo"

export const metadata = createSeoMetadata({
  title: "About Auerviamaison",
  description: "Learn about Auerviamaison and the beauty, skincare, fragrance, and personal-style essentials we curate for modern routines.",
  path: "/about-us",
  keywords: ["Auerviamaison", "beauty store Pakistan", "skincare Pakistan", "makeup products Pakistan", "premium fragrance Pakistan"],
})

export const revalidate = 3600;

export default async function AboutPage() {
  const aboutVideos = await prisma.video.findMany({
    where: { active: true, placement: "ABOUT" },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
    take: 8,
  });

  return (
    <>
      <AboutPageContent />
      <FeaturedVideoSection
        videos={aboutVideos.map(serializeVideo)}
        heading="Meet our work through video"
        description="A separate featured story for the about page, managed from the admin video module."
      />
    </>
  );
}



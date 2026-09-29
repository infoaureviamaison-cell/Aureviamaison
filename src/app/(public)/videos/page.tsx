import { prisma } from "@/lib/prisma";
import { serializeVideo } from "@/lib/video-utils";
import { VideosPageClient } from "@/components/features/videos/videos-page-client";
import { createSeoMetadata } from "@/lib/seo";

export const revalidate = 900;

export const metadata = createSeoMetadata({
  title: "Product Videos and Tech Guides Pakistan",
  description: "Watch Auerviamaison product demos, buying guides, beauty guidance, and product updates for Pakistan.",
  path: "/videos",
  keywords: ["Product guides Pakistan", "Natural wellness product videos", "Shilajit Pakistan"],
});

export default async function VideosPage() {
  const videos = await prisma.video.findMany({
    where: { active: true },
    orderBy: [{ featured: "desc" }, { displayOrder: "asc" }, { createdAt: "desc" }],
  });

  return <VideosPageClient videos={videos.map(serializeVideo)} />;
}

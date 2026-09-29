import { getCollectionList } from "./service";
import { CollectionsPageContent } from "./_components/collections-page-content";
import { createSeoMetadata } from "@/lib/seo";

export const revalidate = 60;

export const metadata = createSeoMetadata({
  title: "Product and Tech Collections Pakistan",
  description: "Explore salt lamps, herbal products, Himalayan Shilajit, Windows products, accessories, storage, memory and tech collections in Pakistan.",
  path: "/collections",
  keywords: ["Salt Lamps", "Herbal Products", "Himalayan Shilajit", "Related Products", "Storage & Memory"],
});

export default async function Page() {
  let data: Awaited<ReturnType<typeof getCollectionList>> = {
    pageInfo: { hasNextPage: false },
    edges: [],
  };

  try {
    data = await getCollectionList();
  } catch (error) {
    console.error("Failed to load collections:", error);
  }

  return <CollectionsPageContent data={data} />;
}


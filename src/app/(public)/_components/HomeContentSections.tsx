import { CategoriesSection, CollectionsSection, ProductsSection } from "@/components/features/home/products-section";
import { WhyChooseUsSection } from "@/components/features/home/why-choose-us";
import { FeaturedBlogSection } from "@/components/features/home/featured-blog-section";
import { CustomerVoicesSection } from "@/components/features/home/customer-voices-section";
import { FeaturedVideoSection } from "@/components/features/videos/featured-video-section";
import type { PublicVideo } from "@/lib/video-utils";
import { CertificationsSlider, type CertificateLogo } from "@/components/features/certifications/certifications-slider";
import { PromoBannerSection } from "@/components/features/home/promo-banner-section";
import type { PromoBanner } from "@/components/features/home/promo-banner-types";
import {
  PinkSaltWellnessSection,
  PhilosophySection,
  TrustStrip,
} from "@/components/features/home/homepage-static-sections";

type HomeContentSectionsProps = {
  categories: Array<{ id: string; name: string; slug: string; description: string | null; image: string | null; parentId?: string | null; order?: number }>;
  promoBanners: PromoBanner[];
  products: Array<{
    id: string;
    handle: string;
    title: string;
    price: number | null;
    compareAtPrice: number | null;
    featuredImage: string | null;
    images: unknown;
    tags: unknown;
    categoryId: string | null;
    subcategoryId: string | null;
    isFeatured: boolean;
    displayOrder?: number;
    createdAt?: Date;
    updatedAt?: Date;
  }>;
  collections: Array<{ id: string; handle: string; title: string; image: string | null; isFeatured?: boolean; productHandles?: string[] }>;
  featuredBlogs: Array<{
    id: string;
    title: string;
    slug: string;
    excerpt?: string | null;
    featuredImage?: string | null;
    publishedAt?: Date | string | null;
    content?: string | null;
  }>;
  homeVideos: PublicVideo[];
  certificates: CertificateLogo[];
};

export function HomeContentSections({
  categories,
  promoBanners,
  products,
  collections,
  featuredBlogs,
  homeVideos,
  certificates,
}: HomeContentSectionsProps) {
  return (
    <>
      <TrustStrip />
      <CategoriesSection categories={categories} />
      <PromoBannerSection banners={promoBanners} />
      <ProductsSection categories={categories} products={products} collections={collections} />
      <WhyChooseUsSection />
      <FeaturedVideoSection
        videos={homeVideos}
        heading="See the latest from Auerviamaison"
        description="Watch featured beauty launches, expert styling inspiration, and shop updates selected by the Auerviamaison team."
        singleAtATime
      />
      <CollectionsSection collections={collections} />
      <PhilosophySection />
      <PinkSaltWellnessSection />
      <CertificationsSlider certificates={certificates} />
      <FeaturedBlogSection articles={featuredBlogs} />
      <CustomerVoicesSection />
    </>
  );
}

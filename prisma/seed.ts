import bcrypt from "bcryptjs";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const PRODUCT_IMAGE = "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=1200&q=80";
const CATEGORY_IMAGE = "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=1200&q=80";
const HERO_IMAGE = "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=1600&q=80";

const categories = [
  {
    name: "Skincare",
    slug: "skincare",
    description: "Hydrating serums, cleansers, and everyday glow-enhancing routines.",
    order: 1,
    featured: true,
  },
  {
    name: "Makeup",
    slug: "makeup",
    description: "Foundations, lip care, bronzers, and complexion essentials.",
    order: 2,
    featured: true,
  },
  {
    name: "Hair Care",
    slug: "hair-care",
    description: "Repairing oils, scalp care, and luminous styling essentials.",
    order: 3,
    featured: true,
  },
  {
    name: "Fragrances",
    slug: "fragrances",
    description: "Fine perfumes and signature scents for daily wear and gifting.",
    order: 4,
    featured: true,
  },
  {
    name: "Beauty Accessories",
    slug: "beauty-accessories",
    description: "Brushes, mirror sets, and beauty tools for polished routines.",
    order: 5,
    featured: true,
  },
  {
    name: "Watches",
    slug: "watches",
    description: "Refined timepieces with a luxe, everyday finish.",
    order: 6,
    featured: false,
  },
  {
    name: "Smart Watches",
    slug: "smart-watches",
    description: "Connected wearables with fitness, style, and productivity features.",
    order: 7,
    featured: false,
  },
  {
    name: "Jewelry",
    slug: "jewelry",
    description: "Pearl, gold, and statement pieces for elevated personal styling.",
    order: 8,
    featured: false,
  },
  {
    name: "Personal Care",
    slug: "personal-care",
    description: "Body care, self-care rituals, and everyday wellness essentials.",
    order: 9,
    featured: false,
  },
  {
    name: "Grooming Tools",
    slug: "grooming-tools",
    description: "Precision grooming essentials for beard, skin, and personal care.",
    order: 10,
    featured: false,
  },
];

const products = [
  {
    handle: "maybelline-fit-me-foundation",
    title: "Maybelline Fit Me Matte + Poreless Foundation",
    category: "makeup",
    price: 4590,
    compareAtPrice: 5590,
    description: "Lightweight matte foundation that helps smooth pores and gives a natural, polished finish for everyday wear.",
    image: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 28,
  },
  {
    handle: "the-body-shop-vitamin-c-serum",
    title: "The Body Shop Vitamin C Glow Boosting Serum",
    category: "skincare",
    price: 4890,
    compareAtPrice: 5890,
    description: "Brightening serum with vitamin C and skin-loving ingredients to help revive dull-looking skin and add radiance.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 24,
  },
  {
    handle: "garnier-fructis-shine-serum",
    title: "Garnier Fructis Sleek & Shine Serum",
    category: "hair-care",
    price: 3290,
    compareAtPrice: 3990,
    description: "Silicone-enriched serum that helps tame frizz, smooth hair texture, and add a sleek, healthy shine.",
    image: "https://images.unsplash.com/photo-1521590832167-7bcbfaa6381f?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 32,
  },
  {
    handle: "dove-nourishing-shampoo",
    title: "Dove Nourishing Shampoo",
    category: "hair-care",
    price: 2790,
    compareAtPrice: 3490,
    description: "Daily care shampoo designed to cleanse and hydrate hair while helping to retain softness and shine.",
    image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
    inventory: 40,
  },
  {
    handle: "revlon-super-lustrous-lipstick",
    title: "Revlon Super Lustrous Lipstick",
    category: "makeup",
    price: 2190,
    compareAtPrice: 2990,
    description: "Classic lipstick formula with rich color payoff, a creamy feel, and a polished finish for effortless glam.",
    image: "https://images.unsplash.com/photo-1586495777744-4413f21062fa?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 36,
  },
  {
    handle: "nina-ricci-love-in-paris",
    title: "Nina Ricci Love in Paris Eau de Parfum",
    category: "fragrances",
    price: 7990,
    compareAtPrice: 9490,
    description: "Floral and feminine fragrance with a soft romantic profile that feels modern, elegant, and easy to wear.",
    image: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 18,
  },
  {
    handle: "dior-jadore-eau-de-parfum",
    title: "Dior J'adore Eau de Parfum",
    category: "fragrances",
    price: 12990,
    compareAtPrice: 14990,
    description: "Signature floral fragrance layered with fresh notes and a luminous finish designed for special days and evening elegance.",
    image: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
    inventory: 12,
  },
  {
    handle: "beautyblender-original-makeup-sponge",
    title: "Beautyblender Original Makeup Sponge",
    category: "beauty-accessories",
    price: 1890,
    compareAtPrice: 2390,
    description: "A popular makeup sponge for smooth blending, soft coverage, and an even finish with foundation or concealer.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 52,
  },
  {
    handle: "philips-trimmer-series-5000",
    title: "Philips Trimmer Series 5000",
    category: "grooming-tools",
    price: 6990,
    compareAtPrice: 8390,
    description: "Cordless grooming trimmer with precision blades and a comfortable design for beard and face styling at home.",
    image: "https://images.unsplash.com/photo-1515377905703-c4788e51af15?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 16,
  },
  {
    handle: "vaseline-intensive-care-lotion",
    title: "Vaseline Intensive Care Lotion",
    category: "personal-care",
    price: 2290,
    compareAtPrice: 2890,
    description: "Body lotion that delivers long-lasting hydration with a soft finish for dry skin and daily comfort.",
    image: "https://images.unsplash.com/photo-1556228720-195a672e8a03?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
    inventory: 48,
  },
  {
    handle: "casio-ae-1200whd-watch",
    title: "Casio AE-1200WHD Digital Watch",
    category: "watches",
    price: 8990,
    compareAtPrice: 10490,
    description: "Classic digital watch designed for daily wear with durable construction, water resistance, and a clean sporty look.",
    image: "https://images.unsplash.com/photo-1542496658-e33a6d0d50f6?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 19,
  },
  {
    handle: "xiaomi-redmi-watch-4-active",
    title: "Xiaomi Redmi Watch 4 Active",
    category: "smart-watches",
    price: 16990,
    compareAtPrice: 19990,
    description: "Smartwatch with fitness tracking, notifications, and a lightweight design built for everyday routines and health awareness.",
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?auto=format&fit=crop&w=900&q=80",
    isFeatured: true,
    inventory: 11,
  },
  {
    handle: "pearl-statement-earrings",
    title: "Pearl Statement Earrings",
    category: "jewelry",
    price: 5390,
    compareAtPrice: 6490,
    description: "Elegant pearl earrings that bring a touch of refinement and softness to both formal and casual styling.",
    image: "https://images.unsplash.com/photo-1617038220319-276d3cfab536?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
    inventory: 22,
  },
  {
    handle: "led-makeup-mirror",
    title: "LED Makeup Mirror with Touch Sensor",
    category: "beauty-accessories",
    price: 2590,
    compareAtPrice: 3290,
    description: "Compact vanity mirror with clear LED lighting that helps create precise makeup application and better visibility.",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
    inventory: 27,
  },
  {
    handle: "neutrogena-hydro-boost-water-gel",
    title: "Neutrogena Hydro Boost Water Gel",
    category: "skincare",
    price: 4190,
    compareAtPrice: 5190,
    description: "Hydrating water-gel moisturizer made to refresh skin with a lightweight feel and smooth, comfortable finish.",
    image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
    inventory: 26,
  },
  {
    handle: "loreal-paris-hydra-energetic-serum",
    title: "L'Oréal Paris Hydra Energetic Serum",
    category: "skincare",
    price: 4690,
    compareAtPrice: 5690,
    description: "Recharge and smooth skin with this hydrating serum that blends comfort, luminosity, and daily care.",
    image: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=900&q=80",
    isFeatured: false,
    inventory: 23,
  },
];

const collections = [
  {
    handle: "hot-deals",
    title: "Hot Deals",
    description: "Limited-time offers on beauty favorites and premium essentials.",
    isFeatured: true,
  },
  {
    handle: "new-arrivals",
    title: "New Arrivals",
    description: "Fresh beauty and lifestyle edits just landed for a new-season glow.",
    isFeatured: true,
  },
  {
    handle: "glow-edit",
    title: "Glow Edit",
    description: "Your everyday beauty ritual with skincare and finished looks in one edit.",
    isFeatured: true,
  },
  {
    handle: "signature-gifts",
    title: "Signature Gifts",
    description: "Curated beauty gifting sets for birthdays, celebrations, and self-care moments.",
    isFeatured: false,
  },
];

async function main() {
  const adminEmail = process.env.ADMIN_USER ?? "admin@dev.com";
  const adminPassword = process.env.ADMIN_PASS ?? "admin123";
  const hashedPassword = await bcrypt.hash(adminPassword, 10);

  await prisma.adminUser.upsert({
    where: { email: adminEmail },
    update: { password: hashedPassword },
    create: {
      email: adminEmail,
      password: hashedPassword,
      name: "Auerviamaison Admin",
    },
  });

  await prisma.productVariation.deleteMany();
  await prisma.product.deleteMany();
  await prisma.collection.deleteMany();
  await prisma.category.deleteMany();
  await prisma.review.deleteMany();
  await prisma.certificate.deleteMany();
  await prisma.blogPost.deleteMany();
  await prisma.homepageSection.deleteMany();

  const categoryMap = new Map<string, string>();

  for (const cat of categories) {
    const created = await prisma.category.create({
      data: {
        name: cat.name,
        slug: cat.slug,
        description: cat.description,
        image: CATEGORY_IMAGE,
        order: cat.order,
        featured: cat.featured,
        seoTitle: `${cat.name} – Auerviamaison`,
        seoDescription: `Shop premium ${cat.name.toLowerCase()} essentials at Auerviamaison.`,
      },
    });
    categoryMap.set(cat.slug, created.id);
  }

  const productHandles: string[] = [];

  for (const product of products) {
    const categoryId = categoryMap.get(product.category);
    const created = await prisma.product.create({
      data: {
        handle: product.handle,
        title: product.title,
        description: product.description,
        descriptionHtml: `<p>${product.description}</p>`,
        price: product.price,
        compareAtPrice: product.compareAtPrice,
        inventory: product.inventory,
        availableForSale: true,
        status: "ACTIVE",
        featuredImage: product.image,
        images: JSON.stringify([{ url: product.image, altText: product.title }]),
        productType: product.category,
        categoryId,
        vendor: "Auerviamaison",
        tags: JSON.stringify(["beauty", "lifestyle", product.category]),
        isFeatured: product.isFeatured,
        seoTitle: `${product.title} – Auerviamaison`,
        seoDescription: product.description,
      },
    });
    productHandles.push(created.handle);
  }

  const featuredHandles = products.filter((p) => p.isFeatured).map((p) => p.handle);

  for (const col of collections) {
    await prisma.collection.create({
      data: {
        handle: col.handle,
        title: col.title,
        description: col.description,
        descriptionHtml: `<p>${col.description}</p>`,
        image: CATEGORY_IMAGE,
        isFeatured: col.isFeatured,
        productHandles: JSON.stringify(featuredHandles.slice(0, 6)),
        seoTitle: `${col.title} – Auerviamaison`,
        seoDescription: col.description,
      },
    });
  }

  const reviews = [
    {
      authorName: "Ayesha K.",
      rating: 5,
      content: "The serum and foundation feel premium and the glow is so natural. Auerviamaison nails the beauty edit.",
      isFeatured: true,
    },
    {
      authorName: "Hina S.",
      rating: 5,
      content: "I ordered a fragrance and brush set; packaging was elegant and delivery was smooth.",
      isFeatured: true,
    },
    {
      authorName: "Zara R.",
      rating: 5,
      content: "The hair oil and gifting items are beautiful quality. I will definitely shop again.",
      isFeatured: true,
    },
    {
      authorName: "Maryam A.",
      rating: 4,
      content: "Love the smart watch and the overall style. Everything feels polished and premium.",
      isFeatured: false,
    },
    {
      authorName: "Nadia B.",
      rating: 5,
      content: "Their beauty details and skincare picks look luxurious and work beautifully.",
      isFeatured: false,
    },
  ];

  for (const review of reviews) {
    await prisma.review.create({
      data: {
        ...review,
        status: "approved",
        isVerifiedPurchase: true,
      },
    });
  }

  const certificates = [
    {
      title: "Beauty Curated",
      certificateImage: "https://images.unsplash.com/photo-1522335789203-aabd1fc54bc9?auto=format&fit=crop&w=300&q=80",
      shortDescription: "Expertly selected beauty essentials for modern routines.",
      displayOrder: 1,
    },
    {
      title: "Authentic Brands",
      certificateImage: "https://images.unsplash.com/photo-1571781926291-c477ebfd024b?auto=format&fit=crop&w=300&q=80",
      shortDescription: "Premium beauty picks chosen for quality, performance, and elegance.",
      displayOrder: 2,
    },
    {
      title: "Gift-Ready Packaging",
      certificateImage: "https://images.unsplash.com/photo-1528740561666-dc2479dc08ab?auto=format&fit=crop&w=300&q=80",
      shortDescription: "Beautifully presented for gifting, routine updates, and self-care moments.",
      displayOrder: 3,
    },
    {
      title: "Secure Checkout",
      certificateImage: "https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=300&q=80",
      shortDescription: "Safe transactions with trusted ordering and delivery support.",
      displayOrder: 4,
    },
  ];

  for (const cert of certificates) {
    await prisma.certificate.create({ data: { ...cert, active: true } });
  }

  await prisma.homepageSection.create({
    data: {
      sectionKey: "essence",
      title: "Beauty, glow and modern style",
      subtitle: "Premium skincare, makeup, fragrance, and lifestyle essentials for confident everyday routines.",
      content: [],
      isActive: true,
      order: 1,
      image: HERO_IMAGE,
    },
  });

  const blogPosts = [
    {
      title: "How to Build a 5-Minute Glow Routine",
      slug: "5-minute-glow-routine",
      excerpt: "A simple beauty routine for hydrated skin, soft color, and an elevated everyday look.",
      content: "<p>Your ideal glow routine can be simple, quick, and high-impact. Start with hydration, add a soft tint, and finish with a signature fragrance.</p>",
      featuredImage: PRODUCT_IMAGE,
      author: "Auerviamaison Studio",
      status: "published",
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: "3 Fragrance Notes Every Signature Scent Needs",
      slug: "signature-fragrance-notes",
      excerpt: "Discover the ingredients that make a fragrance feel premium, memorable, and easy to wear.",
      content: "<p>Soft florals, warm woods, and clean musk create a balanced scent profile that feels polished from day to night.</p>",
      featuredImage: PRODUCT_IMAGE,
      author: "Auerviamaison Studio",
      status: "published",
      isFeatured: true,
      publishedAt: new Date(),
    },
    {
      title: "The Everyday Accessories That Elevate Your Look",
      slug: "everyday-accessories-that-elevate-your-look",
      excerpt: "From mirrors to watches to beauty brushes, small details can completely reshape your routine.",
      content: "<p>Beauty is in the details. Thoughtful accessories bring polish, convenience, and personality to even the simplest daily styling choices.</p>",
      featuredImage: PRODUCT_IMAGE,
      author: "Auerviamaison Studio",
      status: "published",
      isFeatured: false,
      publishedAt: new Date(),
    },
  ];

  for (const post of blogPosts) {
    await prisma.blogPost.create({ data: post });
  }

  await prisma.navigationMenu.upsert({
    where: { location: "header" },
    update: {
      items: [
        { text: "Home", href: "/" },
        { text: "Skincare", href: "/category/skincare" },
        { text: "Makeup", href: "/category/makeup" },
        { text: "Fragrance", href: "/category/fragrances" },
        { text: "Deals", href: "/collections/hot-deals" },
        { text: "About", href: "/about-us" },
        { text: "Contact", href: "/contact" },
      ],
    },
    create: {
      location: "header",
      items: [
        { text: "Home", href: "/" },
        { text: "Skincare", href: "/category/skincare" },
        { text: "Makeup", href: "/category/makeup" },
        { text: "Fragrance", href: "/category/fragrances" },
        { text: "Deals", href: "/collections/hot-deals" },
        { text: "About", href: "/about-us" },
        { text: "Contact", href: "/contact" },
      ],
    },
  });

  const siteSettings = [
    { key: "siteName", value: "Auerviamaison" },
    {
      key: "termsOfService",
      value: {
        title: "Terms and Conditions",
        body: "<p>Welcome to Auerviamaison. These terms and conditions outline how our online store operates and how customers can shop with confidence.</p>",
      },
    },
    {
      key: "privacyPolicy",
      value: {
        title: "Privacy Policy",
        body: "<p>At Auerviamaison, we protect the information you share with us and use it only to support secure shopping and customer service.</p>",
      },
    },
    {
      key: "refundPolicy",
      value: {
        title: "Refund Policy",
        body: "<p>If you are not satisfied with your purchase, contact us within 7 days and we will do our best to resolve your order quickly.</p>",
      },
    },
    { key: "blogArticles", value: [] },
  ];

  for (const setting of siteSettings) {
    await prisma.siteSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    });
  }

  console.log(`Seeded ${categories.length} categories, ${products.length} products, ${collections.length} collections`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

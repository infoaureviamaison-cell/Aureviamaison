# OrganoCity SEO, Performance & UX Upgrade Report

Date: 2026-07-25

## Completed work

- Audited routing, public pages, Prisma access, metadata, structured data, images, search, admin SEO, accessibility, analytics, sitemaps, and robots.
- Preserved the App Router layout with shared header/footer and confirmed storefront navigation uses `Link` for internal page transitions.
- Added timed homepage/blog revalidation, narrower Prisma selections, query indexes, paginated category queries, and stale-search-result protection.
- Configured AVIF/WebP output and image caching; retained `next/image`, responsive sizing, priority hero imagery, alt fallbacks, and fixed aspect ratios.
- Added canonical metadata, robots controls, Open Graph/Twitter coverage, and editable SEO fields for products, categories, and articles.
- Expanded Organization, OnlineStore, WebSite, ItemList, Product, Offer, Review, AggregateRating, shipping, returns, CollectionPage, BlogPosting, Article, Person, ImageObject, and breadcrumb schema.
- Added general, product, category, and blog sitemaps plus robots references.
- Added visible category/article breadcrumbs and matching breadcrumb schema.
- Improved category introductions, sorting, pagination, subcategory links, and related category links.
- Added debounced search, recent searches, product previews, match highlighting, and race-condition protection.
- Added a Google Merchant XML feed at `/google-merchant-feed.xml`.
- Added keyboard skip navigation, zoom-safe viewport settings, labels/current state for mobile navigation, and semantic page headings.
- Added mutually exclusive GA4/GTM loading, Search Console verification support, Vercel Analytics/Speed Insights, and existing Meta Pixel integration.
- Added a reusable blog publishing checklist and health-information disclaimer.

## Database changes

- Extended `BlogPost` with image, author, scheduling, revision, canonical, keyword, Open Graph, and indexability fields.
- Added indexes for blog publication, category, and author queries.
- Added canonical, robots, Open Graph image, image alt, and focus keyword fields to Product, Category, and Collection.
- No existing records are deleted or rewritten by the migrations.

## Expected search impact

- Cleaner canonical URLs and permanent legacy redirects reduce duplicate URL signals.
- More precise metadata and structured data improve Google’s understanding and rich-result eligibility.
- Published/indexable-only blog discovery prevents draft and low-value archive indexing.
- Split sitemaps improve crawl monitoring and troubleshooting in Search Console.
- Stronger category/article internal linking improves discovery and distributes relevance.
- Merchant feed output enables product submission and diagnostics in Google Merchant Center.

## Performance and Core Web Vitals

- Expected LCP improvement from cached public rendering, optimized image formats, stable image dimensions, and removal of the full-height blog hero.
- Expected INP improvement from smaller server-rendered page responsibilities, debounced search, and stale-request cancellation.
- Expected CLS improvement from fixed image aspect ratios and explicit responsive image sizing.

No Lighthouse or field Core Web Vitals numbers are claimed because no controlled production baseline was supplied. Capture mobile and desktop Lighthouse runs against the same deployed URL and use Search Console/CrUX field data after sufficient traffic.

## Remaining production recommendations

- Deploy both migrations before deploying application code.
- Add real shipping prices to the Merchant feed instead of the current zero-cost placeholder if delivery is not universally free.
- Populate new SEO and author fields for existing records.
- Submit all sitemap URLs in Search Console and the feed URL in Merchant Center.
- Run Lighthouse, Rich Results Test, Schema Markup Validator, keyboard/screen-reader checks, and a broken-link crawler against production.
- Use Search Console data for ongoing CTR, query, position, coverage, and content-refresh decisions.

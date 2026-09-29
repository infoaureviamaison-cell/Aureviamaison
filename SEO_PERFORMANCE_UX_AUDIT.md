# OrganoCity SEO, Performance & UX Audit

Date: 2026-07-25

## Baseline findings

- Blog URLs use `/blogs/news/[slug]` rather than the requested `/blog/[slug]`.
- Blog pages are forced dynamic and cannot benefit from timed revalidation.
- Published articles are not filtered by an explicit indexability flag or scheduled publication time.
- Blog CMS is missing image alt text, related keywords, focus keyword, canonical URL, Open Graph image, robots, scheduling, and author profile fields.
- Article JSON-LD is limited to `Article`; `BlogPosting`, `ImageObject`, author details, and dedicated blog breadcrumbs are incomplete.
- No dedicated blog sitemap, blog category archive, author archive, preview indexing rules, previous/next navigation, or related article UI exists.
- Blog listing and article copy contains stale laptop-store language and malformed encoded punctuation.
- Main article HTML is server-rendered, which is a sound baseline, but the article hero is excessively tall and can hurt LCP/UX.
- The general sitemap, robots route, shared metadata helper, `next/image`, root layout, and reusable JSON-LD component already provide good foundations.
- Product, category, and collection data models already include several SEO fields, but the complete 20-step brief requires a separate page-by-page content and production Lighthouse validation pass.

## Implementation priorities

1. Establish canonical `/blog` routes and preserve legacy URLs with permanent redirects.
2. Extend the blog schema and admin validation without deleting or rewriting existing data.
3. Add unique metadata, indexing rules, rich structured data, category/author pages, and a dedicated sitemap.
4. Improve server rendering, caching, article navigation, internal links, accessibility, and image stability.
5. Validate types, lint, production build, and route output.

## Measurement note

No defensible “before” Lighthouse or field Core Web Vitals score was available in the repository. Scores must not be invented. Production Lighthouse and Search Console field data should be captured after deployment.

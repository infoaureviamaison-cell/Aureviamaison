---

name: organocity
description: Development rules for OrganoCity
---------------------------------------------

# OrganoCity Development Rules

Use these rules for all development, new features, bug fixes, APIs, admin, UI, database, SEO, performance, blog, and optimization tasks.

## Core Principles

* Preserve all existing functionality.
* Never reset the database or delete production data.
* Never run seed scripts unless explicitly requested.
* Do not modify unrelated files.
* Avoid breaking changes.
* Maintain backward compatibility whenever possible.

## Workflow

1. Analyze the existing implementation.
2. Understand dependencies before making changes.
3. Modify only the required files.
4. Keep changes modular and reusable.
5. Verify no regressions.
6. Run build and type checks after implementation.

## Code Standards

* Follow Next.js 15 App Router best practices.
* Prefer Server Components.
* Use Client Components only when required.
* Keep components small and reusable.
* Separate UI, business logic, database, and utilities.
* Remove duplication.
* Keep the project architecture clean and scalable.
* Use TypeScript strict typing.
* Reuse existing services and helpers before creating new ones.

## Frontend

* Next.js 15
* TypeScript
* Tailwind CSS
* Responsive design for desktop, tablet, and mobile.
* Accessible UI (WCAG friendly).
* Use `next/image`.
* Use `next/link` for internal navigation.
* Avoid unnecessary client-side rendering.

## Backend

* Prisma + PostgreSQL (Neon)
* Protect all admin APIs.
* Validate and sanitize all inputs.
* Optimize database queries.
* Keep schema backward compatible.
* Never expose secrets.
* Use proper error handling.

## SEO

* Every public page must have dynamic metadata.
* Use canonical URLs.
* Implement JSON-LD where applicable.
* Maintain robots.txt and sitemaps.
* Keep pages crawlable.
* Prevent duplicate content.
* Optimize all images with meaningful alt text.

## Blog

* Write original, helpful, SEO-focused articles.
* Follow Google's Search Essentials and Helpful Content guidelines.
* Use clean heading hierarchy (H1 → H2 → H3).
* Include internal links to products, categories, and related articles.
* Generate structured data for articles.
* Keep content informative, trustworthy, and easy to read.

## Performance

* Optimize Core Web Vitals.
* Minimize JavaScript.
* Lazy-load heavy components.
* Use dynamic imports where beneficial.
* Cache public data appropriately.
* Optimize Cloudinary images.
* Reduce unnecessary re-renders.
* Avoid loading unnecessary data.

## E-commerce

* Keep pricing, discounts, inventory, schema, checkout, and Merchant feeds synchronized.
* Never duplicate pricing logic.
* Use one shared pricing service across the application.
* Preserve product data integrity.
* Ensure product schema matches visible product information.

## Admin

* Keep admin scalable and modular.
* Validate all forms.
* Support SEO fields where applicable.
* Prevent duplicate slugs.
* Preserve uploaded media and existing records.

## Project Context

* Project: **OrganoCity**
* Tech Stack: **Next.js 15, TypeScript, Tailwind CSS, Prisma, PostgreSQL (Neon), Cloudinary**
* Website Type: **International B2B + B2C Organic Products E-commerce**
* Products: **Shilajit, Himalayan Pink Salt, Salt Lamps, Black Salt, Herbal Products, Honey, Dry Fruits, and related natural products**
* Features: **Blog, Wholesale, Certificates, Product Reviews, FAQs, Google Merchant Feed, SEO, AI-ready architecture**
* Prioritize SEO, performance, scalability, maintainability, accessibility, and clean architecture.

## Restrictions

* Do not install unnecessary packages.
* Do not refactor unrelated code.
* Do not modify unrelated files.
* Do not remove existing functionality unless requested.
* Focus only on the requested task.
* Always verify changes before completion.

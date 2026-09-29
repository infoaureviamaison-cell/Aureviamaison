ALTER TABLE "Product"
ADD COLUMN "canonicalUrl" TEXT,
ADD COLUMN "robots" TEXT NOT NULL DEFAULT 'index,follow',
ADD COLUMN "openGraphImage" TEXT,
ADD COLUMN "imageAlt" TEXT,
ADD COLUMN "focusKeyword" TEXT;

ALTER TABLE "Category"
ADD COLUMN "canonicalUrl" TEXT,
ADD COLUMN "robots" TEXT NOT NULL DEFAULT 'index,follow',
ADD COLUMN "openGraphImage" TEXT,
ADD COLUMN "imageAlt" TEXT,
ADD COLUMN "focusKeyword" TEXT;

ALTER TABLE "Collection"
ADD COLUMN "canonicalUrl" TEXT,
ADD COLUMN "robots" TEXT NOT NULL DEFAULT 'index,follow',
ADD COLUMN "openGraphImage" TEXT,
ADD COLUMN "imageAlt" TEXT,
ADD COLUMN "focusKeyword" TEXT;

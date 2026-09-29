ALTER TABLE "BlogPost"
ADD COLUMN "featuredImageAlt" TEXT,
ADD COLUMN "openGraphImage" TEXT,
ADD COLUMN "authorRole" TEXT,
ADD COLUMN "authorBio" TEXT,
ADD COLUMN "authorImage" TEXT,
ADD COLUMN "scheduledAt" TIMESTAMP(3),
ADD COLUMN "contentRevisedAt" TIMESTAMP(3),
ADD COLUMN "canonicalUrl" TEXT,
ADD COLUMN "focusKeyword" TEXT,
ADD COLUMN "relatedKeywords" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "isIndexable" BOOLEAN NOT NULL DEFAULT true;

CREATE INDEX "BlogPost_status_publishedAt_idx" ON "BlogPost"("status", "publishedAt");
CREATE INDEX "BlogPost_categoryId_status_idx" ON "BlogPost"("categoryId", "status");
CREATE INDEX "BlogPost_author_status_idx" ON "BlogPost"("author", "status");

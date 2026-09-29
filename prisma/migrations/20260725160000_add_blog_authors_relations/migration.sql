CREATE TABLE "Author" (
  "id" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "slug" TEXT NOT NULL,
  "role" TEXT,
  "bio" TEXT,
  "image" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "Author_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "Author_slug_key" ON "Author"("slug");

ALTER TABLE "BlogPost"
ADD COLUMN "authorId" TEXT,
ADD COLUMN "relatedArticleIds" JSONB NOT NULL DEFAULT '[]',
ADD COLUMN "relatedProductHandles" JSONB NOT NULL DEFAULT '[]';

ALTER TABLE "BlogPost"
ADD CONSTRAINT "BlogPost_authorId_fkey"
FOREIGN KEY ("authorId") REFERENCES "Author"("id") ON DELETE SET NULL ON UPDATE CASCADE;

CREATE INDEX "BlogPost_authorId_status_idx" ON "BlogPost"("authorId", "status");

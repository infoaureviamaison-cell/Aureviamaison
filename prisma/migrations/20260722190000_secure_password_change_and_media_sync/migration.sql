ALTER TABLE "AdminUser" ADD COLUMN "passwordChangedAt" TIMESTAMP(3);

CREATE TABLE "PasswordChangeRequest" (
    "id" TEXT NOT NULL,
    "adminId" TEXT NOT NULL,
    "otpHash" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "PasswordChangeRequest_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "PasswordChangeRequest" ADD CONSTRAINT "PasswordChangeRequest_adminId_fkey"
  FOREIGN KEY ("adminId") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "PasswordChangeRequest_adminId_createdAt_idx" ON "PasswordChangeRequest"("adminId", "createdAt");
CREATE INDEX "PasswordChangeRequest_expiresAt_idx" ON "PasswordChangeRequest"("expiresAt");

WITH ranked AS (
  SELECT "id", ROW_NUMBER() OVER (PARTITION BY "publicId" ORDER BY "createdAt" DESC, "id" DESC) AS position
  FROM "MediaAsset"
)
DELETE FROM "MediaAsset" WHERE "id" IN (SELECT "id" FROM ranked WHERE position > 1);
CREATE UNIQUE INDEX "MediaAsset_publicId_key" ON "MediaAsset"("publicId");

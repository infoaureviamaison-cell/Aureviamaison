-- Preserve the original Certificate columns and rows. Prisma maps the legacy
-- name/image/description/order/status columns to their clearer application names.
ALTER TABLE "Certificate"
ADD COLUMN "organizationName" TEXT NOT NULL DEFAULT 'OrganoCity Verified Organization',
ADD COLUMN "organizationLogo" TEXT NOT NULL DEFAULT '',
ADD COLUMN "orientation" TEXT NOT NULL DEFAULT 'LANDSCAPE',
ADD COLUMN "issueDate" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN "expiryDate" TIMESTAMP(3),
ADD COLUMN "certificateNumber" TEXT,
ADD COLUMN "verificationUrl" TEXT;

CREATE INDEX "Certificate_isActive_order_idx" ON "Certificate"("isActive", "order");
CREATE INDEX "Certificate_isVerifiedBy_idx" ON "Certificate"("isVerifiedBy");

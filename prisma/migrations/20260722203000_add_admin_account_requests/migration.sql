CREATE TABLE "AdminAccountRequest" (
    "id" TEXT NOT NULL,
    "requestedById" TEXT NOT NULL,
    "action" TEXT NOT NULL,
    "targetAdminId" TEXT,
    "newEmail" TEXT NOT NULL,
    "passwordHash" TEXT,
    "otpHash" TEXT NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "AdminAccountRequest_pkey" PRIMARY KEY ("id")
);

ALTER TABLE "AdminAccountRequest" ADD CONSTRAINT "AdminAccountRequest_requestedById_fkey"
  FOREIGN KEY ("requestedById") REFERENCES "AdminUser"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE INDEX "AdminAccountRequest_requestedById_createdAt_idx" ON "AdminAccountRequest"("requestedById", "createdAt");
CREATE INDEX "AdminAccountRequest_expiresAt_idx" ON "AdminAccountRequest"("expiresAt");

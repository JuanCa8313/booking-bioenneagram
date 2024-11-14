-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "clientName" TEXT NOT NULL,
    "referrerEmail" TEXT,
    "referrerPhone" TEXT,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateIndex
CREATE INDEX "Referral_referrerEmail_idx" ON "Referral"("referrerEmail");

-- CreateIndex
CREATE INDEX "Referral_referrerPhone_idx" ON "Referral"("referrerPhone");

-- CreateTable
CREATE TABLE "referrals" (
    "id" TEXT NOT NULL,
    "clientName" TEXT NOT NULL,
    "clientEmail" TEXT NOT NULL,
    "referrerEmail" TEXT,
    "referrerPhone" TEXT,
    "termsAccepted" BOOLEAN DEFAULT false,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "referrerName" TEXT,

    CONSTRAINT "referrals_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "referrals_referrerEmail_idx" ON "referrals"("referrerEmail");

-- CreateIndex
CREATE INDEX "referrals_referrerPhone_idx" ON "referrals"("referrerPhone");

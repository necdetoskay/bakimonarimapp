-- CreateTable
CREATE TABLE "UzmanlikAlani" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "ekbilgi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UzmanlikAlani_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UzmanlikAlani_ad_key" ON "UzmanlikAlani"("ad");

-- CreateTable
CREATE TABLE "ArizaTipi" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "ekbilgi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArizaTipi_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ArizaTipi_ad_key" ON "ArizaTipi"("ad");

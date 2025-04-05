-- CreateTable
CREATE TABLE "Proje" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "ekbilgi" TEXT,
    "adres" TEXT NOT NULL,
    "konum" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Proje_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Proje_ad_key" ON "Proje"("ad");

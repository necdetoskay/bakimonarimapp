-- CreateTable
CREATE TABLE "Randevu" (
    "id" TEXT NOT NULL,
    "tarih" TIMESTAMP(3) NOT NULL,
    "notlar" TEXT,
    "durum" TEXT NOT NULL DEFAULT 'Planlandı',
    "sonuc" TEXT,
    "teknikerId" TEXT,
    "arizaId" TEXT NOT NULL,
    "oncekiRandevuId" TEXT,
    "sonrakiRandevuId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Randevu_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "RandevuMalzeme" (
    "id" TEXT NOT NULL,
    "randevuId" TEXT NOT NULL,
    "malzemeId" TEXT NOT NULL,
    "miktar" DOUBLE PRECISION NOT NULL,
    "birim" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RandevuMalzeme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Randevu_sonrakiRandevuId_key" ON "Randevu"("sonrakiRandevuId");

-- CreateIndex
CREATE UNIQUE INDEX "RandevuMalzeme_randevuId_malzemeId_key" ON "RandevuMalzeme"("randevuId", "malzemeId");

-- AddForeignKey
ALTER TABLE "Randevu" ADD CONSTRAINT "Randevu_teknikerId_fkey" FOREIGN KEY ("teknikerId") REFERENCES "Tekniker"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Randevu" ADD CONSTRAINT "Randevu_arizaId_fkey" FOREIGN KEY ("arizaId") REFERENCES "Ariza"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Randevu" ADD CONSTRAINT "Randevu_sonrakiRandevuId_fkey" FOREIGN KEY ("sonrakiRandevuId") REFERENCES "Randevu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RandevuMalzeme" ADD CONSTRAINT "RandevuMalzeme_randevuId_fkey" FOREIGN KEY ("randevuId") REFERENCES "Randevu"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RandevuMalzeme" ADD CONSTRAINT "RandevuMalzeme_malzemeId_fkey" FOREIGN KEY ("malzemeId") REFERENCES "Malzeme"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

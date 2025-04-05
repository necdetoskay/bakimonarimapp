-- CreateTable
CREATE TABLE "Ariza" (
    "id" TEXT NOT NULL,
    "bildirenKisi" TEXT,
    "telefon" TEXT,
    "aciklama" TEXT NOT NULL,
    "ekbilgi" TEXT,
    "oncelik" TEXT NOT NULL DEFAULT 'Orta',
    "durum" TEXT NOT NULL DEFAULT 'Bekliyor',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "daireId" TEXT NOT NULL,
    "arizaTipiId" TEXT,

    CONSTRAINT "Ariza_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Ariza" ADD CONSTRAINT "Ariza_daireId_fkey" FOREIGN KEY ("daireId") REFERENCES "Daire"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ariza" ADD CONSTRAINT "Ariza_arizaTipiId_fkey" FOREIGN KEY ("arizaTipiId") REFERENCES "ArizaTipi"("id") ON DELETE SET NULL ON UPDATE CASCADE;

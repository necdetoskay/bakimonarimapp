-- CreateTable
CREATE TABLE "Blok" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "ekbilgi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "projeId" TEXT NOT NULL,

    CONSTRAINT "Blok_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Daire" (
    "id" TEXT NOT NULL,
    "numara" TEXT NOT NULL,
    "ekbilgi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "blokId" TEXT NOT NULL,

    CONSTRAINT "Daire_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Blok" ADD CONSTRAINT "Blok_projeId_fkey" FOREIGN KEY ("projeId") REFERENCES "Proje"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Daire" ADD CONSTRAINT "Daire_blokId_fkey" FOREIGN KEY ("blokId") REFERENCES "Blok"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- CreateTable
CREATE TABLE "Tekniker" (
    "id" TEXT NOT NULL,
    "adsoyad" TEXT NOT NULL,
    "telefon" TEXT,
    "ekbilgi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tekniker_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TeknikerUzmanlikAlani" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_TeknikerUzmanlikAlani_AB_unique" ON "_TeknikerUzmanlikAlani"("A", "B");

-- CreateIndex
CREATE INDEX "_TeknikerUzmanlikAlani_B_index" ON "_TeknikerUzmanlikAlani"("B");

-- AddForeignKey
ALTER TABLE "_TeknikerUzmanlikAlani" ADD CONSTRAINT "_TeknikerUzmanlikAlani_A_fkey" FOREIGN KEY ("A") REFERENCES "Tekniker"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TeknikerUzmanlikAlani" ADD CONSTRAINT "_TeknikerUzmanlikAlani_B_fkey" FOREIGN KEY ("B") REFERENCES "UzmanlikAlani"("id") ON DELETE CASCADE ON UPDATE CASCADE;

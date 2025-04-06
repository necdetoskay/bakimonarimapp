/*
  Warnings:

  - You are about to drop the column `sonrakiRandevuId` on the `Randevu` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[oncekiRandevuId]` on the table `Randevu` will be added. If there are existing duplicate values, this will fail.

*/
-- DropForeignKey
ALTER TABLE "Randevu" DROP CONSTRAINT "Randevu_arizaId_fkey";

-- DropForeignKey
ALTER TABLE "Randevu" DROP CONSTRAINT "Randevu_sonrakiRandevuId_fkey";

-- DropIndex
DROP INDEX "Randevu_sonrakiRandevuId_key";

-- AlterTable
ALTER TABLE "Randevu" DROP COLUMN "sonrakiRandevuId";

-- CreateTable
CREATE TABLE "RandevuTekniker" (
    "id" TEXT NOT NULL,
    "randevuId" TEXT NOT NULL,
    "teknikerId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "RandevuTekniker_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "RandevuTekniker_randevuId_teknikerId_key" ON "RandevuTekniker"("randevuId", "teknikerId");

-- CreateIndex
CREATE UNIQUE INDEX "Randevu_oncekiRandevuId_key" ON "Randevu"("oncekiRandevuId");

-- AddForeignKey
ALTER TABLE "Randevu" ADD CONSTRAINT "Randevu_arizaId_fkey" FOREIGN KEY ("arizaId") REFERENCES "Ariza"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Randevu" ADD CONSTRAINT "Randevu_oncekiRandevuId_fkey" FOREIGN KEY ("oncekiRandevuId") REFERENCES "Randevu"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RandevuTekniker" ADD CONSTRAINT "RandevuTekniker_randevuId_fkey" FOREIGN KEY ("randevuId") REFERENCES "Randevu"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "RandevuTekniker" ADD CONSTRAINT "RandevuTekniker_teknikerId_fkey" FOREIGN KEY ("teknikerId") REFERENCES "Tekniker"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

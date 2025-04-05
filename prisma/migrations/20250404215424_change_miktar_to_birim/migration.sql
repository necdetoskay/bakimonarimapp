/*
  Warnings:

  - You are about to drop the column `miktar` on the `Malzeme` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Malzeme" DROP COLUMN "miktar",
ADD COLUMN     "birim" TEXT;

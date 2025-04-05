-- CreateTable
CREATE TABLE "Malzeme" (
    "id" TEXT NOT NULL,
    "ad" TEXT NOT NULL,
    "miktar" INTEGER NOT NULL DEFAULT 0,
    "ekbilgi" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Malzeme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Malzeme_ad_key" ON "Malzeme"("ad");

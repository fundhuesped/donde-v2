/*
  Warnings:

  - A unique constraint covering the columns `[legacyId]` on the table `Establishment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "legacyId" INTEGER;

-- CreateIndex
CREATE UNIQUE INDEX "Establishment_legacyId_key" ON "Establishment"("legacyId");

/*
  Warnings:

  - You are about to alter the column `latitude` on the `Establishment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(8,6)` to `DoublePrecision`.
  - You are about to alter the column `longitude` on the `Establishment` table. The data in that column could be lost. The data in that column will be cast from `Decimal(9,6)` to `DoublePrecision`.

*/
-- AlterTable
ALTER TABLE "Establishment" ALTER COLUMN "latitude" SET DATA TYPE DOUBLE PRECISION,
ALTER COLUMN "longitude" SET DATA TYPE DOUBLE PRECISION;

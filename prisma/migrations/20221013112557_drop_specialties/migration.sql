/*
  Warnings:

  - You are about to drop the `SpecialtiesOnEstablishments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `Specialty` table. If the table is not empty, all the data it contains will be lost.

*/

-- DropForeignKey
ALTER TABLE "SpecialtiesOnEstablishments" DROP CONSTRAINT "SpecialtiesOnEstablishments_establishmentId_fkey";

-- DropForeignKey
ALTER TABLE "SpecialtiesOnEstablishments" DROP CONSTRAINT "SpecialtiesOnEstablishments_specialtyId_fkey";

-- DropForeignKey
ALTER TABLE "Specialty" DROP CONSTRAINT "Specialty_serviceId_fkey";

-- DropTable
DROP TABLE "SpecialtiesOnEstablishments";

-- DropTable
DROP TABLE "Specialty";

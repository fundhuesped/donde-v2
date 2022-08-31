/*
  Warnings:

  - Added the required column `city` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `department` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `latitude` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `longitude` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `province` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `status` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `street` to the `Establishment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `Establishment` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "EstablishmentType" AS ENUM ('HEALTH_ESTABLISHMENT', 'SOCIAL_ORGANIZATION', 'PUBLIC_INSTITUTION', 'PRIVATE_INSTITUTION', 'EDUCATIONAL_INSTITUTION', 'OTHER');

-- CreateEnum
CREATE TYPE "EstablishmentStatus" AS ENUM ('PUBLISHED', 'REJECTED');

-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "apartment" VARCHAR(100),
ADD COLUMN     "city" VARCHAR(100) NOT NULL,
ADD COLUMN     "country" VARCHAR(100) NOT NULL,
ADD COLUMN     "department" VARCHAR(100) NOT NULL,
ADD COLUMN     "details" VARCHAR(100),
ADD COLUMN     "intersection" VARCHAR(100),
ADD COLUMN     "latitude" DECIMAL(8,6) NOT NULL,
ADD COLUMN     "longitude" DECIMAL(9,6) NOT NULL,
ADD COLUMN     "officialId" VARCHAR(100),
ADD COLUMN     "province" VARCHAR(100) NOT NULL,
ADD COLUMN     "status" "EstablishmentStatus" NOT NULL,
ADD COLUMN     "street" VARCHAR(100) NOT NULL,
ADD COLUMN     "streetNumber" VARCHAR(100),
ADD COLUMN     "type" "EstablishmentType" NOT NULL,
ADD COLUMN     "website" VARCHAR(100);

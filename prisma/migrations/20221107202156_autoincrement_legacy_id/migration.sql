/*
  Warnings:

  - Made the column `legacyId` on table `Establishment` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
CREATE SEQUENCE "establishment_legacyid_seq";
ALTER TABLE "Establishment" ALTER COLUMN "legacyId" SET NOT NULL,
ALTER COLUMN "legacyId" SET DEFAULT nextval('establishment_legacyid_seq');
ALTER SEQUENCE "establishment_legacyid_seq" OWNED BY "Establishment"."legacyId";

SELECT setval(pg_get_serial_sequence('"Establishment"', 'legacyId'), coalesce(max("legacyId")+1, 1), false) FROM "Establishment";

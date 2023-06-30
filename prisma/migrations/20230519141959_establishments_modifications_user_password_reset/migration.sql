/*
  Warnings:

  - A unique constraint covering the columns `[reset_password_token]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Establishment" ADD COLUMN     "createdBy" VARCHAR(100),
ADD COLUMN     "lastModifiedBy" VARCHAR(100);

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "reset_password_token" VARCHAR(200);

-- CreateIndex
CREATE UNIQUE INDEX "User_reset_password_token_key" ON "User"("reset_password_token");

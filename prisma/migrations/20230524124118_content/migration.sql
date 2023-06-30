/*
  Warnings:

  - You are about to drop the `About` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "About";

-- CreateTable
CREATE TABLE "Content" (
    "id" TEXT NOT NULL,
    "text" VARCHAR(1024) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Content_id_key" ON "Content"("id");

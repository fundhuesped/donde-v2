-- CreateTable
CREATE TABLE "FAQ" (
    "id" UUID NOT NULL,
    "question" VARCHAR(254) NOT NULL,
    "answer" VARCHAR(254) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "About" (
    "id" TEXT NOT NULL DEFAULT 'about',
    "text" VARCHAR(1024) NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "About_id_key" ON "About"("id");

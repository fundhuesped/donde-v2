-- CreateEnum
CREATE TYPE "Day" AS ENUM ('M', 'T', 'W', 'R', 'F', 'S', 'U');

-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- CreateTable
CREATE TABLE "ServiceOnEstablishment" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "establishmentId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "phoneNumber" VARCHAR(100),
    "details" TEXT,

    CONSTRAINT "ServiceOnEstablishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServiceOnEstablishmentOpeningTime" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "serviceOnEstablishmentId" UUID NOT NULL,
    "day" "Day" NOT NULL,
    "startTime" TIME NOT NULL,
    "endTime" TIME NOT NULL,

    CONSTRAINT "ServiceOnEstablishmentOpeningTime_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ServiceOnEstablishment_establishmentId_idx" ON "ServiceOnEstablishment"("establishmentId");

-- CreateIndex
CREATE INDEX "ServiceOnEstablishment_serviceId_idx" ON "ServiceOnEstablishment"("serviceId");

-- CreateIndex
CREATE INDEX "ServiceOnEstablishmentOpeningTime_serviceOnEstablishmentId_idx" ON "ServiceOnEstablishmentOpeningTime"("serviceOnEstablishmentId");

-- AddForeignKey
ALTER TABLE "ServiceOnEstablishment" ADD CONSTRAINT "ServiceOnEstablishment_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOnEstablishment" ADD CONSTRAINT "ServiceOnEstablishment_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOnEstablishmentOpeningTime" ADD CONSTRAINT "ServiceOnEstablishmentOpeningTime_serviceOnEstablishmentId_fkey" FOREIGN KEY ("serviceOnEstablishmentId") REFERENCES "ServiceOnEstablishment"("id") ON DELETE CASCADE ON UPDATE CASCADE;

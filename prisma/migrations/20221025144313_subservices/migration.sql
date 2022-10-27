-- AlterTable
ALTER TABLE "ServiceOnEstablishment" ADD COLUMN     "subserviceId" UUID;

-- CreateTable
CREATE TABLE "Subservice" (
    "id" UUID NOT NULL DEFAULT uuid_generate_v4(),
    "serviceId" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Subservice_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Subservice_serviceId_idx" ON "Subservice"("serviceId");

-- CreateIndex
CREATE UNIQUE INDEX "Subservice_serviceId_name_key" ON "Subservice"("serviceId", "name");

-- AddForeignKey
ALTER TABLE "Subservice" ADD CONSTRAINT "Subservice_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServiceOnEstablishment" ADD CONSTRAINT "ServiceOnEstablishment_subserviceId_fkey" FOREIGN KEY ("subserviceId") REFERENCES "Subservice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- Create Subservices if abortion service exists
INSERT INTO "Subservice"("serviceId", "name") 
    SELECT (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo'), 'No está confirmado que asesore o realice interrupción legal del embarazo'
    WHERE EXISTS (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo');

INSERT INTO "Subservice"("serviceId", "name") 
    SELECT (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo'), 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo'
    WHERE EXISTS (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo');

INSERT INTO "Subservice"("serviceId", "name") 
    SELECT (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo'), 'Ofrece asesoramiento y derivación sobre interrupción voluntaria del embarazo'
    WHERE EXISTS (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo');

INSERT INTO "Subservice"("serviceId", "name") 
    SELECT (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo'), 'Ofrece asesoramiento y realiza interrupción legal del embarazo'
    WHERE EXISTS (SELECT "id" from "Service" WHERE name='Interrupción voluntaria del embarazo');

-- Link Subservices to each ServiceOnEstablishment
UPDATE
    "ServiceOnEstablishment" AS serviceOnEstablishment1
SET
    "subserviceId" = "Subservice"."id",
    "details" = ''
FROM "ServiceOnEstablishment" AS serviceOnEstablishment2
INNER JOIN "Subservice"
ON serviceOnEstablishment2."details" = "Subservice"."name"
WHERE serviceOnEstablishment1."id" = serviceOnEstablishment2."id";

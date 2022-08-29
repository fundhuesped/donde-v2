-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "icon" VARCHAR(100) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Specialty" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "serviceId" UUID NOT NULL,

    CONSTRAINT "Specialty_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Establishment" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SpecialtiesOnEstablishments" (
    "establishmentId" UUID NOT NULL,
    "specialtyId" UUID NOT NULL,

    CONSTRAINT "SpecialtiesOnEstablishments_pkey" PRIMARY KEY ("establishmentId","specialtyId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Specialty_name_key" ON "Specialty"("name");

-- CreateIndex
CREATE INDEX "Specialty_serviceId_idx" ON "Specialty"("serviceId");

-- CreateIndex
CREATE INDEX "SpecialtiesOnEstablishments_establishmentId_specialtyId_idx" ON "SpecialtiesOnEstablishments"("establishmentId", "specialtyId");

-- AddForeignKey
ALTER TABLE "Specialty" ADD CONSTRAINT "Specialty_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtiesOnEstablishments" ADD CONSTRAINT "SpecialtiesOnEstablishments_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SpecialtiesOnEstablishments" ADD CONSTRAINT "SpecialtiesOnEstablishments_specialtyId_fkey" FOREIGN KEY ("specialtyId") REFERENCES "Specialty"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

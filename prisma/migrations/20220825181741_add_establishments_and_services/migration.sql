-- CreateTable
CREATE TABLE "Establishment" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Establishment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Service" (
    "id" UUID NOT NULL,
    "name" VARCHAR(100) NOT NULL,

    CONSTRAINT "Service_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ServicesOnEstablishments" (
    "establishmentId" UUID NOT NULL,
    "serviceId" UUID NOT NULL,
    "subtype" VARCHAR(100),

    CONSTRAINT "ServicesOnEstablishments_pkey" PRIMARY KEY ("establishmentId","serviceId")
);

-- CreateIndex
CREATE UNIQUE INDEX "Service_name_key" ON "Service"("name");

-- AddForeignKey
ALTER TABLE "ServicesOnEstablishments" ADD CONSTRAINT "ServicesOnEstablishments_establishmentId_fkey" FOREIGN KEY ("establishmentId") REFERENCES "Establishment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ServicesOnEstablishments" ADD CONSTRAINT "ServicesOnEstablishments_serviceId_fkey" FOREIGN KEY ("serviceId") REFERENCES "Service"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

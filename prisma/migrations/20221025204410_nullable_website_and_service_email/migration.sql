-- AlterTable
ALTER TABLE "ServiceOnEstablishment" ADD COLUMN     "email" VARCHAR(254);

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "organization_website" DROP NOT NULL;

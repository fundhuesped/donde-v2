import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  await prisma.establishment.create({
    data: {
      name: 'Hospital 1',
      services: {
        create: [
          {
            subtype: 'Subtipo 1',
            service: {
              create: {
                name: 'Servicio 1',
              },
            },
          },
          {
            service: {
              create: {
                name: 'Servicio 2',
              },
            },
          },
        ],
      },
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

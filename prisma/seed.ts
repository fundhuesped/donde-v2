import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const preservativos = await prisma.service.create({
    data: {
      name: 'preservativos',
      icon: 'preservativos.svg',
    },
  });
  const aborto = await prisma.service.create({
    data: {
      name: 'aborto',
      icon: 'aborto.svg',
    },
  });

  const preservativosEspecializacion = await prisma.specialization.create({
    data: {
      name: 'preservativos',
      service: {
        connect: {
          id: preservativos.id,
        },
      },
    },
  });
  const aborto1 = await prisma.specialization.create({
    data: {
      name: 'especializacion 1',
      service: {
        connect: {
          id: aborto.id,
        },
      },
    },
  });
  const aborto2 = await prisma.specialization.create({
    data: {
      name: 'especializacion 2',
      service: {
        connect: {
          id: aborto.id,
        },
      },
    },
  });

  await prisma.establishment.create({
    data: {
      name: 'garrahan',
      specializations: {
        create: [
          {
            specialization: {
              connect: {
                id: preservativosEspecializacion.id,
              },
            },
          },
          {
            specialization: {
              connect: {
                id: aborto1.id,
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

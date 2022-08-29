import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const preservativos = await prisma.service.create({
    data: {
      name: 'preservativos',
      icon: 'Condones.svg',
    },
  });
  const aborto = await prisma.service.create({
    data: {
      name: 'aborto',
      icon: 'aborto.svg',
    },
  });

  const preservativosEspecializacion = await prisma.specialty.create({
    data: {
      name: 'preservativos',
      service: {
        connect: {
          id: preservativos.id,
        },
      },
    },
  });
  const aborto1 = await prisma.specialty.create({
    data: {
      name: 'No está confirmado que asesore o realice interrupción legal del embarazo.',
      service: {
        connect: {
          id: aborto.id,
        },
      },
    },
  });
  const aborto2 = await prisma.specialty.create({
    data: {
      name: 'Ofrece asesoramiento y realiza interrupción legal del embarazo.',
      service: {
        connect: {
          id: aborto.id,
        },
      },
    },
  });

  await prisma.establishment.create({
    data: {
      name: 'Hospital de Pediatría Garrahan',
      specialties: {
        create: [
          {
            specialty: {
              connect: {
                id: preservativosEspecializacion.id,
              },
            },
          },
          {
            specialty: {
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

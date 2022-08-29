import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { EstablishmentType, EstablishmentStatus } from '@prisma/client';

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
      idHuesped: 136772,
      type: EstablishmentType.HEALTH_ESTABLISHMENT,
      street: 'Combate de Los Pozos',
      streetNumber: 1881,
      city: 'Parque Patricios',
      department: 'COMUNA 4',
      province: 'Ciudad Autónoma De Buenos Aires',
      country: 'Argentina',
      status: EstablishmentStatus.PUBLISHED,
      latitude: -34.62994536,
      longitude: -58.39187918,
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

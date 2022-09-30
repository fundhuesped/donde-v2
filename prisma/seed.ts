import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();
import { EstablishmentType, EstablishmentStatus } from '@prisma/client';
import { ServiceIcon } from '../model/services';

async function main() {
  const preservativos = await prisma.service.create({
    data: {
      name: 'Preservativos',
      icon: ServiceIcon.PRESERVATIVOS,
    },
  });

  const tests = await prisma.service.create({
    data: {
      name: 'Test de ITS',
      icon: ServiceIcon.ITS,
    },
  });

  const anticonceptivos = await prisma.service.create({
    data: {
      name: 'Métodos anticonceptivos',
      icon: ServiceIcon.MAC,
    },
  });

  const vacunatorios = await prisma.service.create({
    data: {
      name: 'Vacunatorios',
      icon: ServiceIcon.VACUNATORIOS,
    },
  });

  const aborto = await prisma.service.create({
    data: {
      name: 'Interrupción voluntaria del embarazo',
      icon: ServiceIcon.ABORTO,
    },
  });


  await prisma.establishment.create({
    data: {
      name: 'Hospital de Pediatría Garrahan',
      type: EstablishmentType.HEALTH_ESTABLISHMENT,
      street: 'Combate de Los Pozos',
      streetNumber: '1881',
      city: 'Parque Patricios',
      department: 'COMUNA 4',
      province: 'Ciudad Autónoma De Buenos Aires',
      country: 'Argentina',
      status: EstablishmentStatus.PUBLISHED,
      latitude: -34.62994536,
      longitude: -58.39187918,
      services: {
        create: [
          {
            service: {
              connect: {
                id: preservativos.id,
              },
            },
            details: 'Siempre disponible',
            phoneNumber: '51351433541'
          },
          {
            service: {
              connect: {
                id: aborto.id,
              },
            },
            details: 'Ofrece asesoramiento y realiza interrupción legal del embarazo',
            phoneNumber: '51351433541'
          },
        ]
      },
    }
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

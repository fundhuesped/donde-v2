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

  const centrosInfectologia = await prisma.service.create({
    data: {
      name: 'Centros de Infectología',
      icon: 'infectologia.svg',
    },
  });
  const infectologiaEspecializacion = await prisma.specialty.create({
    data: {
      name: 'Centros de Infectología',
      service: {
        connect: {
          id: centrosInfectologia.id,
        },
      },
    },
  });

  const tests = await prisma.service.create({
    data: {
      name: 'Test de ITS',
      icon: 'its.svg',
    },
  });
  const testEspecializacion = await prisma.specialty.create({
    data: {
      name: 'Test de ITS',
      service: {
        connect: {
          id: tests.id,
        },
      },
    },
  });

  const anticonceptivos = await prisma.service.create({
    data: {
      name: 'Métodos anticonceptivos',
      icon: 'anticonceptivos.svg',
    },
  });
  const anticonceptivosEspecializacion = await prisma.specialty.create({
    data: {
      name: 'Métodos anticonceptivo',
      service: {
        connect: {
          id: anticonceptivos.id,
        },
      },
    },
  });

  const vacunatorios = await prisma.service.create({
    data: {
      name: 'Vacunatorios',
      icon: 'vacuntorios.svg',
    },
  });
  const vacunatoriosEspecializacion = await prisma.specialty.create({
    data: {
      name: 'Vacunatorios',
      service: {
        connect: {
          id: vacunatorios.id,
        },
      },
    },
  });

  const aborto = await prisma.service.create({
    data: {
      name: 'Interrupción voluntaria del embarazo',
      icon: 'ive.svg',
    },
  });
  const aborto1 = await prisma.specialty.create({
    data: {
      name: 'No está confirmado que asesore o realice interrupción legal del embarazo',
      service: {
        connect: {
          id: aborto.id,
        },
      },
    },
  });
  const aborto2 = await prisma.specialty.create({
    data: {
      name: 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo',
      service: {
        connect: {
          id: aborto.id,
        },
      },
    },
  });
  const aborto3 = await prisma.specialty.create({
    data: {
      name: 'Ofrece asesoramiento y derivación sobre interrupción voluntaria del embarazo',
      service: {
        connect: {
          id: aborto.id,
        },
      },
    },
  });
  const aborto4 = await prisma.specialty.create({
    data: {
      name: 'Ofrece asesoramiento y realiza interrupción legal del embarazo',
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

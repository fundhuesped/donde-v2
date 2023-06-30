import { EstablishmentStatus, EstablishmentType, PrismaClient } from '@prisma/client';
import { ServiceIcon } from '../model/services';
const prisma = new PrismaClient();

async function main() {
  await prisma.fAQ.create({
    data: {
      question: '¿Cómo funciona Dónde?',
      answer: `Seleccioná los servicios que quieras encontrar. Después, escribí una ubicación o compartirla desde tu dispositivo.
La plataforma te mostrará los resultados más cercanos a la dirección que indicaste. En ese momento, vas a poder modificar tu búsqueda con el botón de "Filtrar".`,
    },
  });

  await prisma.content.create({
    data: {
      id: 'about',
      text: `Dónde es una plataforma que te permite encontrar servicios de salud.

Buscá el lugar más cercano para acceder a preservativos, métodos anticonceptivos, información sobre interrupción voluntaria del embarazo, test de infecciones de transmisión sexual (ITS) y vacunatorios.

Fue creada por Fundación Huésped en 2013 desarrollada en varias etapas gracias al trabajo de muchas personas. El sitio actual fue hecho por Wingu.

Es una plataforma de código abierto, disponible en: Github.

Al recorrer y utilizar esta plataforma estás aceptando nuestras políticas de privacidad.`,
    },
  });

  const preservativos = await prisma.service.create({
    data: {
      name: 'Preservativos',
      icon: ServiceIcon.PRESERVATIVOS,
    },
  });

  const tests = await prisma.service.create({
    data: {
      name: 'Test VIH y otras ITS',
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

  const abortoSubservice1 = await prisma.subservice.create({
    data: {
      service: {
        connect: {
          id: aborto.id,
        },
      },
      name: 'No está confirmado que asesore o realice interrupción voluntaria del embarazo.',
    },
  });

  const abortoSubservice2 = await prisma.subservice.create({
    data: {
      service: {
        connect: {
          id: aborto.id,
        },
      },
      name: 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo y derivación.',
    },
  });

  const abortoSubservice3 = await prisma.subservice.create({
    data: {
      service: {
        connect: {
          id: aborto.id,
        },
      },
      name: 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo.',
    },
  });

  const abortoSubservice4 = await prisma.subservice.create({
    data: {
      service: {
        connect: {
          id: aborto.id,
        },
      },
      name: 'Ofrece asesoramiento y realiza interrupción voluntaria del embarazo.',
    },
  });

  const establishment = await prisma.establishment.create({
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
            details: 'No hace falta agendar una cita',
            phoneNumber: '51351433541',
            openingTimes: {
              create: [
                {
                  day: 'M',
                  startTime: new Date('1970-01-01:08:00Z'),
                  endTime: new Date('1970-01-01:11:00Z'),
                },
                {
                  day: 'M',
                  startTime: new Date('1970-01-01:13:00Z'),
                  endTime: new Date('1970-01-01:15:00Z'),
                },
                {
                  day: 'R',
                  startTime: new Date('1970-01-01:08:00Z'),
                  endTime: new Date('1970-01-01:11:00Z'),
                },
                {
                  day: 'S',
                  startTime: new Date('1970-01-01:09:00Z'),
                  endTime: new Date('1970-01-01:14:00Z'),
                },
              ],
            },
          },
          {
            service: {
              connect: {
                id: aborto.id,
              },
            },
            subservice: {
              connect: {
                id: abortoSubservice4.id,
              },
            },
            details: 'Pedir cita primero',
            phoneNumber: '51351433541',
            openingTimes: {
              create: [
                {
                  day: 'T',
                  startTime: new Date('1970-01-01:09:00Z'),
                  endTime: new Date('1970-01-01:10:00Z'),
                },
                {
                  day: 'W',
                  startTime: new Date('1970-01-01:14:00Z'),
                  endTime: new Date('1970-01-01:19:00Z'),
                },
                {
                  day: 'R',
                  startTime: new Date('1970-01-01:12:00Z'),
                  endTime: new Date('1970-01-01:19:00Z'),
                },
                {
                  day: 'S',
                  startTime: new Date('1970-01-01:20:00Z'),
                  endTime: new Date('1970-01-01:23:00Z'),
                },
              ],
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

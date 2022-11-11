import { Day, EstablishmentStatus, EstablishmentType, Prisma, Subservice } from '@prisma/client';
import { parse } from 'csv-parse/sync';
import fs from 'fs';
import { literal, z, ZodError } from 'zod';
import { Service } from '../model/services';
import { prismaClient } from '../server/prisma/client';

enum LegacyDataField {
  OFFICIAL_ID = 'ID Oficial',
  LEGACY_ID = 'ID FH',
  NAME = 'establecimiento',
  TYPE = 'tipo',
  STREET = 'calle',
  STREET_NUMBER = 'altura',
  APARTMENT = 'piso_dpto',
  INTERSECTION = 'cruce',
  DETAILS = 'observacion establecimiento',
  WEBSITE = 'web',
  CITY = 'ciudad',
  DEPARTMENT = 'departamento',
  PROVINCE = 'provincia',
  COUNTRY = 'pais',
  PUBLISHED = 'estado',
  LATITUDE = 'latitud',
  LONGITUDE = 'longitud',
  SERVICE_PRESERVATIVOS = 'preservativos',
  SERVICE_ITS = 'its',
  SERVICE_VACUNATORIO = 'vacunatorio',
  SERVICE_MAC = 'mac',
  SERVICE_ABORTO = 'aborto',
  SERVICE_ABORTO_SUBSERVICE = 'aborto_tipo',
  PHONE_NUMBER_PRESERVATIVOS = 'tel_preservativos',
  EMAIL_PRESERVATIVOS = 'mail_preservativos',
  DETAILS_PRESERVATIVOS = 'comentarios_preservativos',
  OPENING_TIMES_PRESERVATIVOS = 'horario_preservativos',
  PHONE_NUMBER_ITS = 'tel_its',
  EMAIL_ITS = 'mail_its',
  DETAILS_ITS = 'comentarios_its',
  OPENING_TIMES_ITS = 'horario_its',
  PHONE_NUMBER_VACUNATORIO = 'tel_vac',
  EMAIL_VACUNATORIO = 'mail_vac',
  DETAILS_VACUNATORIO = 'comentarios_vac',
  OPENING_TIMES_VACUNATORIO = 'horario_vac',
  PHONE_NUMBER_MAC = 'tel_mac',
  EMAIL_MAC = 'mail_mac',
  DETAILS_MAC = 'comentarios_mac',
  OPENING_TIMES_MAC = 'horario_mac',
  PHONE_NUMBER_ABORTO = 'tel_aborto',
  EMAIL_ABORTO = 'mail_aborto',
  DETAILS_ABORTO = 'comentarios_aborto',
  OPENING_TIMES_ABORTO = 'horario_aborto',
}

enum LegacyDataEstablishmentType {
  HEALTH_ESTABLISHMENT = 'Establecimiento de salud público',
  SOCIAL_ORGANIZATION = 'Organización Social',
  PUBLIC_INSTITUTION = 'Organismo Público',
  PRIVATE_INSTITUTION = 'Privado',
  EDUCATIONAL_INSTITUTION = 'Establecimiento Educativo',
  OTHER = 'Otro',
}

const LegacyDataEstablishmentTypeScheme = z.enum([
  LegacyDataEstablishmentType.HEALTH_ESTABLISHMENT,
  LegacyDataEstablishmentType.EDUCATIONAL_INSTITUTION,
  LegacyDataEstablishmentType.PRIVATE_INSTITUTION,
  LegacyDataEstablishmentType.PUBLIC_INSTITUTION,
  LegacyDataEstablishmentType.SOCIAL_ORGANIZATION,
  LegacyDataEstablishmentType.OTHER,
]);

enum LegacyDataBoolean {
  TRUE = 'SI',
  FALSE = 'NO',
}

const LegacyDataBooleanSchema = z.enum([LegacyDataBoolean.TRUE, LegacyDataBoolean.FALSE]);

enum LegacyDataAbortoSubservice {
  NO_CONFIRMADO = 'No está confirmado que asesore o realice interrupción voluntaria del embarazo.',
  ASESORAMIENTO_Y_DERIVACION = 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo y derivación.',
  SOLO_ASESORAMIENTO = 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo.',
  ASESORAMIENTO_E_INTERRUPCION = 'Ofrece asesoramiento y realiza interrupción voluntaria del embarazo.',
}

const LegacyDataAbortoSubserviceSchema = z
  .preprocess(
    (val) => (val ? val : null),
    z
      .enum([
        LegacyDataAbortoSubservice.NO_CONFIRMADO,
        LegacyDataAbortoSubservice.ASESORAMIENTO_Y_DERIVACION,
        LegacyDataAbortoSubservice.SOLO_ASESORAMIENTO,
        LegacyDataAbortoSubservice.ASESORAMIENTO_E_INTERRUPCION,
      ])
      .nullable(),
  )
  .optional();

const OpeningTimesRegex =
  /(\s*[L, M, X, J, V, S, D]-(([0-2][0-3]|[0-1][0-9]):[0-5][0-9])-(([0-2][0-3]|[0-1][0-9]):[0-5][0-9])\s*;?$)+/;

const ServiceOnEstablishmentPhoneNumberSchema = z
  .preprocess((val) => (val ? val : null), z.string().max(100).nullable())
  .optional();
const ServiceOnEstablishmentEmailSchema = z.preprocess((val) => (val ? val : null), z.string().max(254).nullable()).optional();
const ServiceOnEstablishmentDetailsSchema = z.preprocess((val) => (val ? val : null), z.string().nullable()).optional();
const ServiceOnEstablishmentOpeningTimes = z.string().regex(OpeningTimesRegex).or(literal('')).optional();

enum LegacyPublishedStatus {
  TRUE = 1,
  FALSE = -1,
}

const LegacyPublishedStatusSchema = z.union([z.literal(1), z.literal(-1)]);

type LegacyDataRecord = z.infer<typeof LegacyDataRecordSchema>;
const LegacyDataRecordSchema = z.object({
  [LegacyDataField.OFFICIAL_ID]: z.string().max(100).optional(),
  [LegacyDataField.LEGACY_ID]: z.preprocess((val) => (val ? val : null), z.number().nullable()).optional(),
  [LegacyDataField.NAME]: z.string().min(1).max(100),
  [LegacyDataField.TYPE]: LegacyDataEstablishmentTypeScheme,
  [LegacyDataField.STREET]: z.union([z.string().min(1).max(200), z.number()]),
  [LegacyDataField.STREET_NUMBER]: z.union([z.string().max(100), z.number()]).optional(),
  [LegacyDataField.APARTMENT]: z.union([z.string().max(100), z.number()]).optional(),
  [LegacyDataField.INTERSECTION]: z.union([z.string().max(400), z.number()]).optional(),
  [LegacyDataField.DETAILS]: z.string().max(500).optional(),
  [LegacyDataField.WEBSITE]: z.union([z.literal(''), z.string().url().max(2048)]).optional(),
  [LegacyDataField.CITY]: z.string().min(1).max(200),
  [LegacyDataField.DEPARTMENT]: z.string().min(1).max(200),
  [LegacyDataField.PROVINCE]: z.string().min(1).max(200),
  [LegacyDataField.COUNTRY]: z.string().min(1).max(100),
  [LegacyDataField.PUBLISHED]: LegacyPublishedStatusSchema,
  [LegacyDataField.LATITUDE]: z.number().min(-90).max(90),
  [LegacyDataField.LONGITUDE]: z.number().min(-180).max(180),
  [LegacyDataField.SERVICE_PRESERVATIVOS]: LegacyDataBooleanSchema,
  [LegacyDataField.SERVICE_ITS]: LegacyDataBooleanSchema,
  [LegacyDataField.SERVICE_VACUNATORIO]: LegacyDataBooleanSchema,
  [LegacyDataField.SERVICE_MAC]: LegacyDataBooleanSchema,
  [LegacyDataField.SERVICE_ABORTO]: LegacyDataBooleanSchema,
  [LegacyDataField.SERVICE_ABORTO_SUBSERVICE]: LegacyDataAbortoSubserviceSchema,
  [LegacyDataField.PHONE_NUMBER_PRESERVATIVOS]: ServiceOnEstablishmentPhoneNumberSchema,
  [LegacyDataField.EMAIL_PRESERVATIVOS]: ServiceOnEstablishmentEmailSchema,
  [LegacyDataField.DETAILS_PRESERVATIVOS]: ServiceOnEstablishmentDetailsSchema,
  [LegacyDataField.OPENING_TIMES_PRESERVATIVOS]: ServiceOnEstablishmentOpeningTimes,
  [LegacyDataField.PHONE_NUMBER_ITS]: ServiceOnEstablishmentPhoneNumberSchema,
  [LegacyDataField.EMAIL_ITS]: ServiceOnEstablishmentEmailSchema,
  [LegacyDataField.DETAILS_ITS]: ServiceOnEstablishmentDetailsSchema,
  [LegacyDataField.OPENING_TIMES_ITS]: ServiceOnEstablishmentOpeningTimes,
  [LegacyDataField.PHONE_NUMBER_VACUNATORIO]: ServiceOnEstablishmentPhoneNumberSchema,
  [LegacyDataField.EMAIL_VACUNATORIO]: ServiceOnEstablishmentEmailSchema,
  [LegacyDataField.DETAILS_VACUNATORIO]: ServiceOnEstablishmentDetailsSchema,
  [LegacyDataField.OPENING_TIMES_VACUNATORIO]: ServiceOnEstablishmentOpeningTimes,
  [LegacyDataField.PHONE_NUMBER_MAC]: ServiceOnEstablishmentPhoneNumberSchema,
  [LegacyDataField.EMAIL_MAC]: ServiceOnEstablishmentEmailSchema,
  [LegacyDataField.DETAILS_MAC]: ServiceOnEstablishmentDetailsSchema,
  [LegacyDataField.OPENING_TIMES_MAC]: ServiceOnEstablishmentOpeningTimes,
  [LegacyDataField.PHONE_NUMBER_ABORTO]: ServiceOnEstablishmentPhoneNumberSchema,
  [LegacyDataField.EMAIL_ABORTO]: ServiceOnEstablishmentEmailSchema,
  [LegacyDataField.DETAILS_ABORTO]: ServiceOnEstablishmentDetailsSchema,
  [LegacyDataField.OPENING_TIMES_ABORTO]: ServiceOnEstablishmentOpeningTimes,
});

type ServicesPossibleNames = 'preservativos' | 'its' | 'vacunatorio' | 'mac' | 'aborto';
type ServicesData = Record<ServicesPossibleNames, Service>;

async function findServicesFromDB(): Promise<ServicesData> {
  const preservativos = await prismaClient.service.findUniqueOrThrow({
    where: {
      name: 'Preservativos',
    },
  });
  const its = await prismaClient.service.findUniqueOrThrow({
    where: {
      name: 'Test de ITS',
    },
  });
  const vacunatorio = await prismaClient.service.findUniqueOrThrow({
    where: {
      name: 'Vacunatorios',
    },
  });
  const mac = await prismaClient.service.findUniqueOrThrow({
    where: {
      name: 'Métodos anticonceptivos',
    },
  });
  const aborto = await prismaClient.service.findUniqueOrThrow({
    where: {
      name: 'Interrupción voluntaria del embarazo',
    },
    include: {
      subservices: true,
    },
  });

  return {
    preservativos,
    its,
    vacunatorio,
    mac,
    aborto,
  };
}

type AbortoSubservicesData = Record<
  'noConfirmado' | 'soloAsesoramiento' | 'asesoramientoYDerivacion' | 'asesoramientoEInterrupcion',
  Subservice
>;

function getAbortoSubservices(abortoSubservices: Subservice[]): AbortoSubservicesData {
  const noConfirmado = abortoSubservices.find((subservice) => {
    return subservice.name == LegacyDataAbortoSubservice.NO_CONFIRMADO;
  });
  const soloAsesoramiento = abortoSubservices.find((subservice) => {
    return subservice.name == LegacyDataAbortoSubservice.SOLO_ASESORAMIENTO;
  });
  const asesoramientoYDerivacion = abortoSubservices.find((subservice) => {
    return subservice.name == LegacyDataAbortoSubservice.ASESORAMIENTO_Y_DERIVACION;
  });
  const asesoramientoEInterrupcion = abortoSubservices.find((subservice) => {
    return subservice.name == LegacyDataAbortoSubservice.ASESORAMIENTO_E_INTERRUPCION;
  });

  if (!noConfirmado) {
    throw new Error(
      `No se encontró el siguiente tipo de aborto en la base de datos: \"${LegacyDataAbortoSubservice.NO_CONFIRMADO}\"`,
    );
  }
  if (!soloAsesoramiento) {
    throw new Error(
      `No se encontró el siguiente tipo de aborto en la base de datos: \"${LegacyDataAbortoSubservice.SOLO_ASESORAMIENTO}\"`,
    );
  }
  if (!asesoramientoYDerivacion) {
    throw new Error(
      `No se encontró el siguiente tipo de aborto en la base de datos: \"${LegacyDataAbortoSubservice.ASESORAMIENTO_Y_DERIVACION}\"`,
    );
  }
  if (!asesoramientoEInterrupcion) {
    throw new Error(
      `No se encontró el siguiente tipo de aborto en la base de datos: \"${LegacyDataAbortoSubservice.ASESORAMIENTO_E_INTERRUPCION}\"`,
    );
  }

  return {
    noConfirmado,
    soloAsesoramiento,
    asesoramientoYDerivacion,
    asesoramientoEInterrupcion,
  };
}

function parseLegacyData(path: string): LegacyDataRecord[] {
  let records = undefined;
  try {
    const buffer = fs.readFileSync(path);
    records = parse(buffer, {
      columns: true,
      skip_empty_lines: true,
      trim: true,
      cast: true,
    });
  } catch (e) {
    throw new Error(
      'Hubo un fallo al leer el archivo en la fase inicial de la importación. Si el error persiste contacte al equipo de desarrollo.',
    );
  }

  let row = 1;
  let validationErrors: string[] = [];
  const data = records.map((record: unknown) => {
    try {
      row++;
      return LegacyDataRecordSchema.parse(record);
    } catch (error) {
      const zodError = error as ZodError;
      validationErrors.push(
        `La fila ${row} tiene valores incorrectos en los campos: ` +
          zodError.issues
            .map((value) => {
              return value.path[0];
            })
            .join(', ') +
          '.',
      );
    }
  });

  if (validationErrors.length > 0) {
    throw new Error(validationErrors.join('\n'));
  }

  return data;
}

type Services = { [x in keyof ServicesData]: Service };

function mapLegacyEstablishmentType(legacyValue: LegacyDataEstablishmentType): EstablishmentType {
  switch (legacyValue) {
    case LegacyDataEstablishmentType.EDUCATIONAL_INSTITUTION:
      return EstablishmentType.EDUCATIONAL_INSTITUTION;
    case LegacyDataEstablishmentType.SOCIAL_ORGANIZATION:
      return EstablishmentType.SOCIAL_ORGANIZATION;
    case LegacyDataEstablishmentType.PUBLIC_INSTITUTION:
      return EstablishmentType.PUBLIC_INSTITUTION;
    case LegacyDataEstablishmentType.PRIVATE_INSTITUTION:
      return EstablishmentType.PRIVATE_INSTITUTION;
    case LegacyDataEstablishmentType.HEALTH_ESTABLISHMENT:
      return EstablishmentType.HEALTH_ESTABLISHMENT;
    case LegacyDataEstablishmentType.OTHER:
      return EstablishmentType.OTHER;
  }
}

function mapLegacyPublishedStatus(legacyValue: LegacyPublishedStatus): EstablishmentStatus {
  switch (legacyValue) {
    case LegacyPublishedStatus.TRUE:
      return EstablishmentStatus.PUBLISHED;
    case LegacyPublishedStatus.FALSE:
      return EstablishmentStatus.REJECTED;
  }
}

function mapLegacyBoolean(legacyValue: LegacyDataBoolean): boolean {
  switch (legacyValue) {
    case LegacyDataBoolean.TRUE:
      return true;
    case LegacyDataBoolean.FALSE:
      return false;
  }
}

function mapLegacyString(legacyValue: string | undefined): string | null {
  return legacyValue ? legacyValue : null;
}

function transformSpanishDayToEnglishDay(day: string): Day | null {
  switch (day) {
    case 'L':
      return Day['M'];
    case 'M':
      return Day['T'];
    case 'X':
      return Day['W'];
    case 'J':
      return Day['R'];
    case 'V':
      return Day['F'];
    case 'S':
      return Day['S'];
    case 'D':
      return Day['U'];
    default:
      return null;
  }
}

function getOpeningTimesFromRecordValue(
  rawValue: string,
): Prisma.ServiceOnEstablishmentOpeningTimeCreateNestedManyWithoutServiceOnEstablishmentInput {
  const rawOpeningTimes = rawValue?.split(';').map((value) => value.trim());
  let openingTimes = undefined;
  if (rawOpeningTimes) {
    openingTimes = rawOpeningTimes.map((rawOpeningTime) => {
      const deconstrutedOpeningTime = rawOpeningTime.split('-');
      const day = transformSpanishDayToEnglishDay(deconstrutedOpeningTime[0]);
      if (!day) {
        throw new Error(
          'Un horario pasó la fase de validación a pesar de tener un error. Es necesario contactar al equipo de desarrollo.',
        );
      }
      return {
        day: day,
        startTime: '1970-01-01T' + deconstrutedOpeningTime[1] + ':00.000Z',
        endTime: '1970-01-01T' + deconstrutedOpeningTime[2] + ':00.000Z',
      };
    });
  }
  if (!openingTimes) {
    return {
      create: [],
    };
  } else {
    return {
      create: openingTimes,
    };
  }
}

function getSubservicesOnEstablishmentCreate(
  record: LegacyDataRecord,
  services: Services,
  abortoSubservices: AbortoSubservicesData,
): Prisma.ServiceOnEstablishmentCreateNestedManyWithoutEstablishmentInput {
  const servicesOnEstablishment: Prisma.ServiceOnEstablishmentCreateWithoutEstablishmentInput[] = [];
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_PRESERVATIVOS])) {
    const rawOpeningTimes = record[LegacyDataField.OPENING_TIMES_PRESERVATIVOS];
    const openingTimes = rawOpeningTimes ? getOpeningTimesFromRecordValue(rawOpeningTimes) : undefined;
    servicesOnEstablishment.push({
      service: {
        connect: {
          id: services.preservativos.id,
        },
      },
      phoneNumber: record[LegacyDataField.PHONE_NUMBER_PRESERVATIVOS],
      email: record[LegacyDataField.EMAIL_PRESERVATIVOS],
      details: record[LegacyDataField.DETAILS_PRESERVATIVOS],
      openingTimes: openingTimes,
    });
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_ITS])) {
    const rawOpeningTimes = record[LegacyDataField.OPENING_TIMES_ITS];
    const openingTimes = rawOpeningTimes ? getOpeningTimesFromRecordValue(rawOpeningTimes) : undefined;
    servicesOnEstablishment.push({
      service: {
        connect: {
          id: services.its.id,
        },
      },
      phoneNumber: record[LegacyDataField.PHONE_NUMBER_ITS],
      email: record[LegacyDataField.EMAIL_ITS],
      details: record[LegacyDataField.DETAILS_ITS],
      openingTimes: openingTimes,
    });
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_MAC])) {
    const rawOpeningTimes = record[LegacyDataField.OPENING_TIMES_MAC];
    const openingTimes = rawOpeningTimes ? getOpeningTimesFromRecordValue(rawOpeningTimes) : undefined;
    servicesOnEstablishment.push({
      service: {
        connect: {
          id: services.mac.id,
        },
      },
      phoneNumber: record[LegacyDataField.PHONE_NUMBER_MAC],
      email: record[LegacyDataField.EMAIL_MAC],
      details: record[LegacyDataField.DETAILS_MAC],
      openingTimes: openingTimes,
    });
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_VACUNATORIO])) {
    const rawOpeningTimes = record[LegacyDataField.OPENING_TIMES_VACUNATORIO];
    const openingTimes = rawOpeningTimes ? getOpeningTimesFromRecordValue(rawOpeningTimes) : undefined;
    servicesOnEstablishment.push({
      service: {
        connect: {
          id: services.vacunatorio.id,
        },
      },
      phoneNumber: record[LegacyDataField.PHONE_NUMBER_VACUNATORIO],
      email: record[LegacyDataField.EMAIL_VACUNATORIO],
      details: record[LegacyDataField.DETAILS_VACUNATORIO],
      openingTimes: openingTimes,
    });
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_ABORTO])) {
    let abortoSubserviceConnect = undefined;
    const rawOpeningTimes = record[LegacyDataField.OPENING_TIMES_ABORTO];
    const openingTimes = rawOpeningTimes ? getOpeningTimesFromRecordValue(rawOpeningTimes) : undefined;
    switch (record[LegacyDataField.SERVICE_ABORTO_SUBSERVICE]) {
      case LegacyDataAbortoSubservice.NO_CONFIRMADO:
        abortoSubserviceConnect = {
          connect: {
            id: abortoSubservices.noConfirmado.id,
          },
        };
        break;
      case LegacyDataAbortoSubservice.SOLO_ASESORAMIENTO:
        abortoSubserviceConnect = {
          connect: {
            id: abortoSubservices.soloAsesoramiento.id,
          },
        };
        break;
      case LegacyDataAbortoSubservice.ASESORAMIENTO_Y_DERIVACION:
        abortoSubserviceConnect = {
          connect: {
            id: abortoSubservices.asesoramientoYDerivacion.id,
          },
        };
        break;
      case LegacyDataAbortoSubservice.ASESORAMIENTO_E_INTERRUPCION:
        abortoSubserviceConnect = {
          connect: {
            id: abortoSubservices.asesoramientoEInterrupcion.id,
          },
        };
        break;
      default:
        abortoSubserviceConnect = undefined;
    }
    servicesOnEstablishment.push({
      service: {
        connect: {
          id: services.aborto.id,
        },
      },
      subservice: abortoSubserviceConnect,
      phoneNumber: record[LegacyDataField.PHONE_NUMBER_PRESERVATIVOS],
      email: record[LegacyDataField.EMAIL_PRESERVATIVOS],
      details: record[LegacyDataField.DETAILS_PRESERVATIVOS],
      openingTimes: openingTimes,
    });
  }
  return { create: servicesOnEstablishment };
}

export async function importDataFromCSV(path: string) {
  const legacyData = parseLegacyData(path);

  let services = undefined;
  try {
    services = await findServicesFromDB();
  } catch (e) {
    throw new Error(
      'La lista de servicios no fue encontrada en la base de dato. Es necesario contactar al equipo de desarrollo.',
    );
  }

  if (!services.aborto.subservices) {
    throw new Error(
      'La lista de subtipos de aborto no fueron encontrados en la base de datos. Es necesario contactar al equipo de desarrollo.',
    );
  }

  const abortoSubservices = getAbortoSubservices(services.aborto.subservices);

  let transactions = [];
  for (const record of legacyData) {
    const legacyId = record[LegacyDataField.LEGACY_ID];
    const dataCreate: Prisma.EstablishmentCreateInput = {
      name: record[LegacyDataField.NAME],
      type: mapLegacyEstablishmentType(record[LegacyDataField.TYPE]),
      status: mapLegacyPublishedStatus(record[LegacyDataField.PUBLISHED]),
      street: record[LegacyDataField.STREET].toString(),
      apartment: mapLegacyString(record[LegacyDataField.APARTMENT]?.toString()),
      streetNumber: mapLegacyString(record[LegacyDataField.STREET_NUMBER]?.toString()),
      city: record[LegacyDataField.CITY],
      department: record[LegacyDataField.DEPARTMENT],
      province: record[LegacyDataField.PROVINCE],
      country: record[LegacyDataField.COUNTRY],
      latitude: record[LegacyDataField.LATITUDE],
      longitude: record[LegacyDataField.LONGITUDE],
      details: record[LegacyDataField.DETAILS],
      officialId: record[LegacyDataField.OFFICIAL_ID],
      legacyId: legacyId ? legacyId : undefined,
      services: getSubservicesOnEstablishmentCreate(record, services, abortoSubservices),
    };
    const dataUpdate = JSON.parse(JSON.stringify(dataCreate)) as Prisma.EstablishmentUpdateInput;
    if (dataUpdate.services) {
      dataUpdate.services.deleteMany = {};
    }
    if (legacyId) {
      transactions.push(
        prismaClient.establishment.upsert({
          where: { legacyId },
          create: dataCreate,
          update: dataUpdate,
        }),
      );
    } else {
      transactions.push(
        prismaClient.establishment.create({
          data: dataCreate,
        }),
      );
    }
  }

  try {
    await prismaClient.$transaction(transactions);
  } catch (e) {
    throw new Error(
      'Hubo un fallo al tratar de realizar los cambios en la base de datos. Ninguna modificación o creación de establecimientos fue realizada.',
    );
  }
}

import yargs from 'yargs';
import fs from 'fs';
import { parse } from 'csv-parse/sync';
import { z } from 'zod';
import { EstablishmentStatus, EstablishmentType, Prisma, Specialty } from '@prisma/client';
import { prismaClient } from '../server/prisma/client';

const argv = yargs.strict().showHelpOnFail(true).string('csv').demandOption('csv').parseSync();

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
  SERVICE_ABORTO_SPECIALTY = 'aborto_tipo',
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

enum LegacyDataAbortoSpecialty {
  NO_CONFIRMADO = 'No está confirmado que asesore o realice interrupción voluntaria del embarazo.',
  ASESORAMIENTO_Y_DERIVACION = 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo y derivación.',
  SOLO_ASESORAMIENTO = 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo.',
  ASESORAMIENTO_E_INTERRUPCION = 'Ofrece asesoramiento y realiza interrupción voluntaria del embarazo',
}

const LegacyDataAbortoSpecialtySchema = z.enum([
  LegacyDataAbortoSpecialty.NO_CONFIRMADO,
  LegacyDataAbortoSpecialty.ASESORAMIENTO_Y_DERIVACION,
  LegacyDataAbortoSpecialty.SOLO_ASESORAMIENTO,
  LegacyDataAbortoSpecialty.ASESORAMIENTO_E_INTERRUPCION,
]);

enum LegacyPublishedStatus {
  TRUE = 1,
  FALSE = -1,
}

const LegacyPublishedStatusSchema = z.union([z.literal(1), z.literal(1)]);

type LegacyDataRecord = z.infer<typeof LegacyDataRecordSchema>;
const LegacyDataRecordSchema = z.object({
  [LegacyDataField.OFFICIAL_ID]: z.string().optional(),
  [LegacyDataField.LEGACY_ID]: z.number(),
  [LegacyDataField.NAME]: z.string(),
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
  [LegacyDataField.SERVICE_ABORTO_SPECIALTY]: z.union([LegacyDataAbortoSpecialtySchema, z.literal('')]).optional(),
});

type ServicesData = Record<'preservativos' | 'its' | 'vacunatorio' | 'mac' | 'aborto', Prisma.ServiceCreateInput>;
const SERVICES_DATA: ServicesData = {
  preservativos: {
    id: 'e502b8c8-cf55-4126-a777-cbac12fa8e52',
    name: 'Preservativos',
    icon: 'Preservativos',
  },
  its: {
    id: 'd3009057-7f1e-4225-bf27-2e46384b2585',
    name: 'Test de ITS',
    icon: 'ITS',
  },
  vacunatorio: {
    id: 'ba958f83-5319-4bc7-b901-aaac19a57ac0',
    name: 'Vacunatorios',
    icon: 'Vacunatorios',
  },
  mac: {
    id: '01a57be5-7569-40d5-9d18-805426773378',
    name: 'Métodos anticonceptivos',
    icon: 'MAC',
  },
  aborto: {
    id: 'b70f5413-e71d-4661-a916-6244039bf731',
    name: 'Interrupción voluntaria del embarazo',
    icon: 'IVE',
  },
};

type AbortoSpecialtiesData = Record<
  'noConfirmado' | 'soloAsesoramiento' | 'asesoramientoYDerivacion' | 'asesoramientoEInterrupcion',
  Prisma.SpecialtyCreateInput & { id: string }
>;
const ABORTO_SPECIALTIES_DATA: AbortoSpecialtiesData = {
  noConfirmado: {
    id: 'c3663cb1-25b0-4378-ace7-fc1dfc05338a',
    name: 'No está confirmado que asesore o realice interrupción voluntaria del embarazo.',
    service: { connect: { id: SERVICES_DATA.aborto.id } },
  },
  soloAsesoramiento: {
    id: '14c991a3-fa45-4313-992e-dc763a89ef89',
    name: 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo.',
    service: { connect: { id: SERVICES_DATA.aborto.id } },
  },
  asesoramientoYDerivacion: {
    id: 'f2271a3d-284a-40ce-b191-229fa147ffba',
    name: 'Ofrece asesoramiento sobre interrupción voluntaria del embarazo y derivación.',
    service: { connect: { id: SERVICES_DATA.aborto.id } },
  },
  asesoramientoEInterrupcion: {
    id: '30c3cee9-f460-463f-baca-e29dbd32936d',
    name: 'Ofrece asesoramiento y realiza interrupción voluntaria del embarazo.',
    service: { connect: { id: SERVICES_DATA.aborto.id } },
  },
};

async function upsertServices() {
  console.info('Upserting services...');

  Object.fromEntries(
    await Promise.all(
      Object.entries(SERVICES_DATA).map(async ([serviceKey, serviceData]) => [
        serviceKey,
        await prismaClient.service.upsert({
          where: { id: serviceData.id },
          update: serviceData,
          create: serviceData,
          include: {
            specialties: true,
          },
        }),
      ]),
    ),
  );

  console.info('Done upserting services.');
}

async function upsertSpecialties() {
  console.info('Upserting specialties...');

  // Upsert default specialties
  console.info('Upserting default specialties...');
  for (const service of Object.values(SERVICES_DATA)) {
    const defaultSpecialties = await prismaClient.specialty.findMany({
      where: {
        name: null,
        service: { id: service.id },
      },
    });
    if (defaultSpecialties.length === 0) {
      await prismaClient.specialty.create({
        data: {
          name: null,
          service: { connect: { id: service.id } },
        },
      });
    }
  }

  // Upser aborto specialties
  console.info('Upserting aborto specialties...');
  for (const specialty of Object.values(ABORTO_SPECIALTIES_DATA)) {
    await prismaClient.specialty.upsert({
      where: { id: specialty.id },
      update: specialty,
      create: specialty,
    });
  }

  console.info('Done upserting specialties.');
}

function parseLegacyData(path: string): LegacyDataRecord[] {
  console.info('Parsing legacy data...');
  const buffer = fs.readFileSync(path);
  const records = parse(buffer, {
    columns: true,
    skip_empty_lines: true,
    trim: true,
    cast: true,
  });
  const data = records.map((record: unknown) => {
    try {
      return LegacyDataRecordSchema.parse(record);
    } catch (e) {
      console.error(record);
      throw e;
    }
  });
  console.info('Done parsing legacy data...');
  return data;
}

type DefaultSpecialtiesByService = { [x in keyof ServicesData]: Specialty };

async function fetchDefaultSpecialties(): Promise<DefaultSpecialtiesByService> {
  return Object.fromEntries(
    await Promise.all(
      Object.entries(SERVICES_DATA).map(async ([serviceKey, serviceData]) => [
        serviceKey,
        await prismaClient.specialty.findFirst({
          where: {
            name: null,
            service: { id: serviceData.id },
          },
        }),
      ]),
    ),
  );
}

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

function getSpecialtyIdsForLegacyDataRecord(record: LegacyDataRecord, defaultSpecialties: DefaultSpecialtiesByService): string[] {
  const specialtyIds = [];
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_PRESERVATIVOS])) {
    specialtyIds.push(defaultSpecialties.preservativos.id);
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_ITS])) {
    specialtyIds.push(defaultSpecialties.its.id);
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_MAC])) {
    specialtyIds.push(defaultSpecialties.mac.id);
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_VACUNATORIO])) {
    specialtyIds.push(defaultSpecialties.vacunatorio.id);
  }
  if (mapLegacyBoolean(record[LegacyDataField.SERVICE_ABORTO])) {
    let abortoSpecialtyId: string;
    switch (record[LegacyDataField.SERVICE_ABORTO_SPECIALTY]) {
      case LegacyDataAbortoSpecialty.NO_CONFIRMADO:
        abortoSpecialtyId = ABORTO_SPECIALTIES_DATA.noConfirmado.id;
        break;
      case LegacyDataAbortoSpecialty.SOLO_ASESORAMIENTO:
        abortoSpecialtyId = ABORTO_SPECIALTIES_DATA.soloAsesoramiento.id;
        break;
      case LegacyDataAbortoSpecialty.ASESORAMIENTO_Y_DERIVACION:
        abortoSpecialtyId = ABORTO_SPECIALTIES_DATA.asesoramientoYDerivacion.id;
        break;
      case LegacyDataAbortoSpecialty.ASESORAMIENTO_E_INTERRUPCION:
        abortoSpecialtyId = ABORTO_SPECIALTIES_DATA.asesoramientoEInterrupcion.id;
        break;
      default:
        specialtyIds.push(defaultSpecialties.aborto.id);
    }
  }
  return specialtyIds;
}

async function main() {
  const { csv } = argv;

  const legacyData = parseLegacyData(csv);
  console.info('---');
  await upsertServices();
  console.info('---');
  await upsertSpecialties();

  console.info('---');

  console.info('Upserting establishments...');

  let successCount = 0;
  const failedRecords: { record: LegacyDataRecord; error: unknown }[] = [];
  const defaultSpecialties = await fetchDefaultSpecialties();

  for (const record of legacyData) {
    const legacyId = record[LegacyDataField.LEGACY_ID];
    const specialtyIds = getSpecialtyIdsForLegacyDataRecord(record, defaultSpecialties);
    const data: Prisma.EstablishmentCreateInput = {
      name: record[LegacyDataField.NAME],
      type: mapLegacyEstablishmentType(record[LegacyDataField.TYPE]),
      status: mapLegacyPublishedStatus(record[LegacyDataField.PUBLISHED]),
      street: record[LegacyDataField.STREET].toString(),
      apartment: record[LegacyDataField.APARTMENT]?.toString(),
      streetNumber: record[LegacyDataField.STREET_NUMBER]?.toString(),
      city: record[LegacyDataField.CITY],
      department: record[LegacyDataField.DEPARTMENT],
      province: record[LegacyDataField.PROVINCE],
      country: record[LegacyDataField.COUNTRY],
      latitude: record[LegacyDataField.LATITUDE],
      longitude: record[LegacyDataField.LONGITUDE],
      details: record[LegacyDataField.DETAILS],
      officialId: record[LegacyDataField.OFFICIAL_ID],
      legacyId,
    };
    try {
      const establishment = await prismaClient.establishment.upsert({
        where: { legacyId },
        create: data,
        update: data,
      });
      for (const specialtyId of specialtyIds) {
        const specialtyOnEstablishment = {
          establishmentId: establishment.id,
          specialtyId,
        };
        await prismaClient.specialtiesOnEstablishments.upsert({
          where: {
            establishmentId_specialtyId: specialtyOnEstablishment,
          },
          create: specialtyOnEstablishment,
          update: specialtyOnEstablishment,
        });
      }

      successCount += 1;
    } catch (error) {
      failedRecords.push({ record, error });
    }
  }

  const processedCount = successCount + failedRecords.length;
  const totalCount = legacyData.length;
  console.info(`Done upserting establishments.`);
  console.info(`Processed ${processedCount}/${totalCount} - ${successCount} succeeded, ${failedRecords.length} failed`);
  console.error(failedRecords);
}

main()
  .then(async () => {
    await prismaClient.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prismaClient.$disconnect();
    process.exit(1);
  });

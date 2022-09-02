import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin, {
  emptyEstablishmentModel,
  EstablishmentModel,
} from '../../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../../utils/establishments';
import { AvailableSpecialty } from '../nuevo';
import * as PrismaClient from '@prisma/client';
import { tryGetAvailableSpecialities } from '../../../server/api/specialties';
import { getEstablishment } from '../../../server/api/establishments';
import { Establishment } from '../../../model/establishment';

type ServerSideProps = {
  googleMapsApiKey: string;
  establishment: Establishment;
  availableSpecialties: AvailableSpecialty[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  const { id } = context.query;
  const establishment = await getEstablishment(id);
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableSpecialties = await tryGetAvailableSpecialities();
  return {
    props: {
      googleMapsApiKey,
      establishment,
      availableSpecialties,
    },
  };
};
const anEstablishmentModel = {
  name: 'Hospital de ejemplo',
  address: 'Calle falsa 123',
  streetName: 'Calle falsa 123',
  type: 'publico',
  fullAddress: 'Calle falsa 123, La quiaca, Saturno',
  streetNumber: '123',
  floor: '1',
  surroundingStreets: 'Calle a y Calle b',
  availableServices: new Set<string>(),
  website: 'www.callefalsa.com',
  phone: '1111111111',
  whatsApp: '1122221111',
  email: 'calle@falsa.com',
  tosCheckbox: false,
  additionalDescription: 'gran calle, mejor hospital',
  availability: 'Lunes-Lunes 00:00-00:00',
  latitude: -34.58956,
  longitude: -58.4040549,
};

const mapIntoEstablishmentModel = (establishment: Establishment): EstablishmentModel => {
  const specialties =
    establishment.specialties.map(
      (
        specialty: PrismaClient.SpecialtiesOnEstablishments & {
          specialty: PrismaClient.Specialty & { service: PrismaClient.Service };
        },
      ) => {
        return specialty.specialty.id;
      },
    ) || [];

  return {
    ...emptyEstablishmentModel,
    ...establishment,
    specialties: new Set(specialties),
    fullAddress: establishment.province,
  };
};
const EstablishmentEdit: NextPage<ServerSideProps> = ({ googleMapsApiKey, establishment, availableSpecialties }) => {
  const establishmentModel = mapIntoEstablishmentModel(establishment);
  return (
    <EstablishmentAdmin
      googleMapsApiKey={googleMapsApiKey}
      establishment={establishmentModel}
      availableSpecialties={availableSpecialties}
    />
  );
};

export default EstablishmentEdit;

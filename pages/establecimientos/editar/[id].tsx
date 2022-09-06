import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin, {
  emptyEstablishmentModel,
  EstablishmentModel,
} from '../../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../../utils/establishments';
import * as PrismaClient from '@prisma/client';
import { tryGetAvailableSpecialities } from '../../../server/api/specialties';
import { getEstablishment } from '../../../server/api/establishments';
import { Establishment } from '../../../model/establishment';
import { Specialty } from '../../../model/specialty';
import { tryGetServices } from '../../../server/api/services';

type ServerSideProps = {
  googleMapsApiKey: string;
  establishment: Establishment;
  availableSpecialties: Specialty[];
  availableServices: { id: string; name: string }[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  const { id } = context.query;
  const establishment = await getEstablishment(id);
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableSpecialties = await tryGetAvailableSpecialities();
  const availableServices = (await tryGetServices()).map((service) => ({ id: service.id, name: service.name }));

  return {
    props: {
      googleMapsApiKey,
      establishment,
      availableSpecialties,
      availableServices,
    },
  };
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
const EstablishmentEdit: NextPage<ServerSideProps> = ({
  googleMapsApiKey,
  establishment,
  availableSpecialties,
  availableServices,
}) => {
  const establishmentModel = mapIntoEstablishmentModel(establishment);
  return (
    <EstablishmentAdmin
      googleMapsApiKey={googleMapsApiKey}
      establishment={establishmentModel}
      availableSpecialties={availableSpecialties}
      availableServices={availableServices}
    />
  );
};

export default EstablishmentEdit;

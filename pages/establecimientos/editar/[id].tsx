import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin, {
  emptyEstablishmentModel,
  EstablishmentModel,
} from '../../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../../utils/establishments';
import * as PrismaClient from '@prisma/client';
import { getServices } from '../../../server/api/services';
import { getEstablishment } from '../../../server/api/establishments';
import { Establishment } from '../../../model/establishment';
import { Service } from '../../../model/services';

type ServerSideProps = {
  googleMapsApiKey: string;
  establishment: Establishment;
  availableServices: Service[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  const { id } = context.query;
  const establishment = await getEstablishment(id);
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableServices = await getServices();

  return {
    props: {
      googleMapsApiKey,
      establishment,
      availableServices,
    },
  };
};

const mapIntoEstablishmentModel = (establishment: Establishment): EstablishmentModel => {
  const services =
    establishment.services.map(
      (
        service
      ) => {
        return service.id;
      },
    ) || [];

  return {
    ...emptyEstablishmentModel,
    ...establishment,
    services: new Set(services),
    fullAddress: establishment.province,
  };
};
const EstablishmentEdit: NextPage<ServerSideProps> = ({ googleMapsApiKey, establishment, availableServices }) => {
  const establishmentModel = mapIntoEstablishmentModel(establishment);
  return (
    <EstablishmentAdmin
      googleMapsApiKey={googleMapsApiKey}
      establishment={establishmentModel}
      availableServices={availableServices}
    />
  );
};

export default EstablishmentEdit;

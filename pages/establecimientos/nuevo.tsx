import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../utils/establishments';
import { tryGetAvailableSpecialities } from '../../server/api/specialties';
import { Specialty } from '../../model/specialty';
import { tryGetServices } from '../../server/api/services';

type ServerSideProps = {
  googleMapsApiKey: string;
  availableSpecialties: Specialty[];
  availableServices: { id: string; name: string }[];
};
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableSpecialties = await tryGetAvailableSpecialities();
  const availableServices = (await tryGetServices()).map((service) => ({ id: service.id, name: service.name }));
  return {
    props: {
      googleMapsApiKey,
      availableSpecialties,
      availableServices,
    },
  };
};
const EstablishmentNew: NextPage<ServerSideProps> = ({ googleMapsApiKey, availableSpecialties, availableServices }) => {
  return (
    <EstablishmentAdmin
      googleMapsApiKey={googleMapsApiKey}
      availableSpecialties={availableSpecialties}
      availableServices={availableServices}
    />
  );
};

export default EstablishmentNew;

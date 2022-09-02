import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../utils/establishments';
import { tryGetAvailableSpecialities } from '../../server/api/specialties';
export type AvailableSpecialty = {
  id: string;
  name: string | null;
};
type ServerSideProps = {
  googleMapsApiKey: string;
  availableSpecialties: AvailableSpecialty[];
};
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableSpecialties = await tryGetAvailableSpecialities();
  return {
    props: {
      googleMapsApiKey,
      availableSpecialties,
    },
  };
};
const EstablishmentNew: NextPage<ServerSideProps> = ({ googleMapsApiKey, availableSpecialties }) => {
  return <EstablishmentAdmin googleMapsApiKey={googleMapsApiKey} availableSpecialties={availableSpecialties} />;
};

export default EstablishmentNew;

import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../utils/establishments';
import { getServices } from '../../server/api/services';
import { Service } from '../../model/services';

type ServerSideProps = {
  googleMapsApiKey: string;
  availableServices: Service[];
};
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableServices = await getServices();
  return {
    props: {
      googleMapsApiKey,
      availableServices,
    },
  };
};
const EstablishmentNew: NextPage<ServerSideProps> = ({ googleMapsApiKey, availableServices }) => {
  return <EstablishmentAdmin googleMapsApiKey={googleMapsApiKey} availableServices={availableServices} />;
};

export default EstablishmentNew;

import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../utils/establishments';

type ServerSideProops = {
  googleMapsApiKey: string;
};
export const getServerSideProps: GetServerSideProps<ServerSideProops> = async () => {
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  return {
    props: {
      googleMapsApiKey,
    },
  };
};
const EstablishmentNew: NextPage<ServerSideProops> = ({ googleMapsApiKey }) => {
  return <EstablishmentAdmin googleMapsApiKey={googleMapsApiKey} />;
};

export default EstablishmentNew;

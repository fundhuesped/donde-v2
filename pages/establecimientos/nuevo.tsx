import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';

type ServerSideProops = {
  googleMapsApiKey: string;
};
export const getServerSideProps: GetServerSideProps<ServerSideProops> = async () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }
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

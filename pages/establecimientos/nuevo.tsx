import React from 'react';
import { GetStaticProps, NextPage } from 'next';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';

type StaticProps = {
  googleMapsApiKey: string;
};
export const getStaticProps: GetStaticProps<StaticProps> = async () => {
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
const EstablishmentNew: NextPage<StaticProps> = ({ googleMapsApiKey }) => {
  return <EstablishmentAdmin googleMapsApiKey={googleMapsApiKey} />;
};

export default EstablishmentNew;

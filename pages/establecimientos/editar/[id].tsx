import React from 'react';
import {GetStaticProps, NextPage} from "next";
import EstablishmentAdmin from "../../../components/Establishment/EstablishmentAdmin";

type StaticProps = {
  googleMapsApiKey: string;
};
export async function getStaticPaths() {
  return {
    paths: [{ params: { id: '1' } }],
    fallback: 'blocking',
  }
}
export const getStaticProps: GetStaticProps<StaticProps> = async () => {
  const googleMapsApiKey = process.env.GOOGLE_MAPS_API_KEY;
  if (!googleMapsApiKey) {
    throw new Error('Environment variable not set: GOOGLE_MAPS_API_KEY');
  }
  return {
    props: {
      googleMapsApiKey,
    },
    revalidate: 10
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
  location: { lat: -34.6989, lng: -64.7597 }
};

const EstablishmentEdit: NextPage<StaticProps> = ({ googleMapsApiKey }) => {
  return (
    <EstablishmentAdmin googleMapsApiKey={googleMapsApiKey} establishment={anEstablishmentModel}/>
  );
};

export default EstablishmentEdit;

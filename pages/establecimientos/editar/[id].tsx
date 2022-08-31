import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin, {
  emptyEstablishmentModel,
  EstablishmentModel,
} from '../../../components/Establishment/EstablishmentAdmin';
import { tryGetAvailableSpecialities, tryGetGoogleMapsApiKey } from '../../../utils/establishments';
import axios from 'axios';
import { AvailableSpecialty } from '../nuevo';

type ServerSideProps = {
  googleMapsApiKey: string;
  establishment: EstablishmentModel;
  availableSpecialties: AvailableSpecialty[];
};

export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  const { id } = context.query;
  const { data: establishment } = await axios.get(`${process.env['HOST']}/api/establishments/${id}`);
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
const mapIntoEstablishmentModel = (establishment: any) => {
  const specialties = establishment.specialties?.map((specialty) => specialty.specialtyId) || [];
  return {
    ...emptyEstablishmentModel,
    ...establishment,
    specialties: new Set(specialties),
    latitude: parseFloat(establishment.latitude),
    longitude: parseFloat(establishment.longitude),
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

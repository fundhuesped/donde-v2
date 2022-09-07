import React from 'react';
import { GetServerSideProps, NextPage } from 'next';
import EstablishmentAdmin from '../../components/Establishment/EstablishmentAdmin';
import { tryGetGoogleMapsApiKey } from '../../utils/establishments';
import { getSpecialtiesWithServices } from '../../server/api/specialties';
import { SpecialtyWithService } from '../../model/specialty';

type ServerSideProps = {
  googleMapsApiKey: string;
  availableSpecialties: SpecialtyWithService[];
};
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async () => {
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableSpecialties = await getSpecialtiesWithServices();
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

import React from 'react';
import {GetServerSideProps, NextPage} from 'next';
import * as yup from 'yup';
import EstablishmentAdmin, {
  emptyEstablishmentModel,
  EstablishmentModel,
} from '../../../components/Establishment/EstablishmentAdmin';
import {tryGetGoogleMapsApiKey} from '../../../utils/establishments';
import axios from 'axios';
import {AvailableSpecialty} from '../nuevo';
import * as PrismaClient from '@prisma/client';
import isEmpty from 'lodash/isEmpty';
import {tryGetAvailableSpecialities} from "../../../server/api/specialties";

type ServerSideProps = {
  googleMapsApiKey: string;
  establishment: EstablishmentModel;
  availableSpecialties: AvailableSpecialty[];
};
const establishmentSchema = yup.object({
  id: yup.string().uuid().required(),
  officialId: yup.string().nullable(),
  name: yup.string(),
  type: yup.mixed().oneOf(Object.values(PrismaClient.EstablishmentType)),
  street: yup.string().required(),
  streetNumber: yup.string(),
  apartment: yup.string(),
  intersection: yup.string(),
  details: yup.string(),
  website: yup.string().url(),
  city: yup.string(),
  department: yup.string(),
  province: yup.string().required(),
  country: yup.string().required(),
  latitude: yup.number(),
  longitude: yup.number(),
  specialties: yup
    .array()
    .of(yup.object({ specialty: yup.object({ id: yup.string().uuid(), service: yup.object({ name: yup.string() }) }) }))
});
export const getServerSideProps: GetServerSideProps<ServerSideProps> = async (context) => {
  const { id } = context.query;
  const { data } = await axios.get(`${process.env['HOST']}/api/establishments/${id}`);
  const googleMapsApiKey = tryGetGoogleMapsApiKey();
  const availableSpecialties = await tryGetAvailableSpecialities();
  const establishment = establishmentSchema.validateSync(data);
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
  console.log(establishment)
  const specialties = establishment.specialties.map((specialty: Specialty) => {
    return specialty.specialty.id
  }) || [];

  return {
    ...emptyEstablishmentModel,
    ...establishment,
    specialties: new Set(specialties),
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

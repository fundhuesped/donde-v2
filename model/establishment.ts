import * as PrismaClient from '@prisma/client';
import * as yup from 'yup';
import { createServiceOnEstablishmentSchema } from './serviceOnEstablishment';

export const urlRegex =
  /^((ftp|http|https):\/\/)?(www.)?(?!.*(ftp|http|https|www.))[a-zA-Z0-9_-]+(\.[a-zA-Z]+)+((\/)[\w#]+)*(\/\w+\?[a-zA-Z0-9_]+=\w+(&[a-zA-Z0-9_]+=\w+)*)?$/gm;

export const createEstablishmentSchema = yup.object({
  officialId: yup.string().max(100),
  name: yup.string().min(1).max(100).required(),
  type: yup.mixed().oneOf(Object.values(PrismaClient.EstablishmentType)).required(),
  street: yup.string().min(1).max(200).required(),
  streetNumber: yup.string().max(100),
  apartment: yup.string().max(100),
  intersection: yup.string().max(400),
  details: yup.string().max(500),
  website: yup.string().matches(urlRegex, 'Website is not valid').max(2048),
  city: yup.string().min(1).max(200).required(),
  department: yup.string().min(1).max(200).required(),
  province: yup.string().min(1).max(200).required(),
  country: yup.string().min(1).max(100).required(),
  latitude: yup.number().min(-90).max(90).required(),
  longitude: yup.number().min(-180).max(180).required(),
  services: yup.array().of(createServiceOnEstablishmentSchema).min(1).required(),
});

export const editEstablishmentSchema = yup.object({
  officialId: yup.string().max(100),
  name: yup.string().min(1).max(100),
  type: yup.mixed().oneOf(Object.values(PrismaClient.EstablishmentType)),
  street: yup.string().min(1).max(200),
  streetNumber: yup.string().max(100),
  apartment: yup.string().max(100),
  intersection: yup.string().max(400),
  details: yup.string().max(500),
  website: yup.string().matches(urlRegex, 'Website is not valid').max(2048),
  city: yup.string().min(1).max(200),
  department: yup.string().min(1).max(200),
  province: yup.string().min(1).max(200),
  country: yup.string().min(1).max(100),
  latitude: yup.number().min(-90).max(90),
  longitude: yup.number().min(-180).max(180),
  services: yup.array().of(createServiceOnEstablishmentSchema).min(1),
});

export type Establishment = {
  id: string;
  officialId: string | null;
  name: string;
  type:
    | 'HEALTH_ESTABLISHMENT'
    | 'SOCIAL_ORGANIZATION'
    | 'PUBLIC_INSTITUTION'
    | 'PRIVATE_INSTITUTION'
    | 'EDUCATIONAL_INSTITUTION'
    | 'OTHER';
  street: string;
  streetNumber: string | null;
  apartment: string | null;
  intersection: string | null;
  details: string | null;
  website: string | null;
  city: string;
  department: string;
  province: string;
  country: string;
  latitude: number;
  longitude: number;
  services: (PrismaClient.ServiceOnEstablishment & {
    service: PrismaClient.Service;
    subservice: PrismaClient.Subservice | null;
    openingTimes: PrismaClient.ServiceOnEstablishmentOpeningTime[];
  })[];
};
export const establishmentTypes = {
  HEALTH_ESTABLISHMENT: 'Establecimiento de salud público',
  SOCIAL_ORGANIZATION: 'Organizacion social',
  PUBLIC_INSTITUTION: 'Organismo público',
  PRIVATE_INSTITUTION: 'Privado',
  EDUCATIONAL_INSTITUTION: 'Establecimiento educativo',
  OTHER: 'Otro',
};

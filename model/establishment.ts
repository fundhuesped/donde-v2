import * as PrismaClient from '@prisma/client';
import * as yup from 'yup';

export const createEstablishmentSchema = yup.object({
  officialId: yup.string(),
  name: yup.string().required(),
  type: yup.mixed().oneOf(Object.values(PrismaClient.EstablishmentType)).required(),
  street: yup.string().required(),
  streetNumber: yup.string(),
  apartment: yup.string(),
  intersection: yup.string(),
  details: yup.string(),
  website: yup.string().url(),
  city: yup.string().required(),
  department: yup.string().required(),
  province: yup.string().required(),
  country: yup.string().required(),
  latitude: yup.number().min(-90).max(90).required(),
  longitude: yup.number().min(-180).max(180).required(),
  specialties: yup.array().of(yup.string().uuid().required()).min(1).required(),
});

export const editEstablishmentSchema = yup.object({
  id: yup.string().uuid().required(),
  officialId: yup.string(),
  name: yup.string(),
  type: yup.mixed().oneOf(Object.values(PrismaClient.EstablishmentType)),
  street: yup.string(),
  streetNumber: yup.string(),
  apartment: yup.string(),
  intersection: yup.string(),
  details: yup.string(),
  website: yup.string().url(),
  city: yup.string(),
  department: yup.string(),
  province: yup.string(),
  country: yup.string(),
  latitude: yup.number(),
  longitude: yup.number(),
  specialties: yup.array().of(yup.string().uuid().required()).min(1),
});

export type Establishment = {
  id: string;
  officialId: string | null;
  name: string;
  type: string;
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
  specialties: any;
};

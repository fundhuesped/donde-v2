import { Establishment, Service, ServiceOnEstablishmentOpeningTime, Subservice } from '@prisma/client';
import * as yup from 'yup';
import { createServiceOnEstablishmentOpeningTimeSchema } from './openingTime';

export type ServiceOnEstablishment = {
  id: string;
  establishmentId: Establishment;
  service: Service;
  serviceId: string;
  subservice: Subservice;
  subserviceId: string;
  phoneNumber: string | null;
  email: string | null;
  details: string | null;
  openingTimes: ServiceOnEstablishmentOpeningTime[];
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const createServiceOnEstablishmentSchema = yup.object({
  serviceId: yup.string().uuid().required(),
  subserviceId: yup.string().uuid().nullable(),
  phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid').nullable(),
  details: yup.string().nullable(),
  email: yup.string().email().nullable(),
  openingTimes: yup.array().of(createServiceOnEstablishmentOpeningTimeSchema),
});

export const updateServiceOnEstablishmentSchema = yup.object({
  serviceId: yup.string().uuid(),
  subserviceId: yup.string().uuid().nullable(),
  phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid').nullable(),
  details: yup.string().nullable(),
  email: yup.string().email().nullable(),
  openingTimes: yup.array().of(createServiceOnEstablishmentOpeningTimeSchema),
});

import { Establishment, Service, ServiceOnEstablishmentOpeningTime } from '@prisma/client';
import * as yup from 'yup';
import { createServiceOnEstablishmentOpeningTimeSchema } from './openingTime';

export type ServiceOnEstablishment = {
  id: string;
  establishmentId: Establishment;
  service: Service;
  serviceId: string;
  phoneNumber: string | null;
  details: string | null;
  openingTimes: ServiceOnEstablishmentOpeningTime[];
};

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;

export const createServiceOnEstablishmentSchema = yup.object({
  serviceId: yup.string().uuid().required(),
  phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  details: yup.string(),
  openingTimes: yup.array().of(createServiceOnEstablishmentOpeningTimeSchema).min(1).required(),
});

export const updateServiceOnEstablishmentSchema = yup.object({
  serviceId: yup.string().uuid(),
  phoneNumber: yup.string().matches(phoneRegExp, 'Phone number is not valid'),
  details: yup.string(),
  openingTimes: yup.array().of(createServiceOnEstablishmentOpeningTimeSchema).min(1),
});

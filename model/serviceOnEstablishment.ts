import { Establishment, Service, ServiceOnEstablishmentOpeningTime } from '@prisma/client';

export type ServiceOnEstablishment = {
  id: string;
  establishment: Establishment;
  service: Service;
  phoneNumber: string | null;
  details: string | null;
  openingTimes: ServiceOnEstablishmentOpeningTime[];
};

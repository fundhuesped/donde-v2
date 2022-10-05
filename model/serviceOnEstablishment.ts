import { Establishment, Service, ServiceOnEstablishmentOpeningTime } from '@prisma/client';

export type ServiceOnEstablishment = {
  id: string;
  establishmentId: Establishment;
  service: Service;
  serviceId: string;
  phoneNumber: string | null;
  details: string | null;
  openingTimes: ServiceOnEstablishmentOpeningTime[];
};

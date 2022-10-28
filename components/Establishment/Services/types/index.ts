export type SubService = {
  id: string;
  name: string;
  serviceId: string;
};

export type Day = 'M' | 'T' | 'W' | 'R' | 'F' | 'S' | 'U';

export type ServiceOnEstablishmentOpeningTimeFormat = {
  id: string;
  serviceOnEstablishmentId: string;
  day: Day;
  startTime: string | Date;
  endTime: string | Date;
};

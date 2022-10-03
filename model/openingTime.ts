import { ServiceOnEstablishment } from '@prisma/client';

export type ServiceOnEstablishmentOpeningTime = {
    id: string;
    serviceOnEstablishment: ServiceOnEstablishment;
    day:
        | 'M'
        | 'T'
        | 'W'
        | 'R'
        | 'F'
        | 'S'
        | 'U';
    startTime: Date;
    endTime: Date;   
};

export const Day = {
    M: 'M',
    T: 'T',
    W: 'W',
    R: 'R',
    F: 'F',
    S: 'S',
    U: 'U',
}

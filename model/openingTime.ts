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
    M: 'Monday',
    T: 'Tuesday',
    W: 'Wednesday',
    R: 'Thursday',
    F: 'Friday',
    S: 'Saturday',
    U: 'Sunday',
}

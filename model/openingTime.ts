import * as PrismaClient from '@prisma/client';
import * as yup from 'yup';

export const createServiceOnEstablishmentOpeningTimeSchema = yup.object({
    day: yup.mixed().oneOf(Object.values(PrismaClient.Day)).required(),
    startTime: yup.string().required(),
    endTime: yup.string().required(),
});

export type ServiceOnEstablishmentOpeningTime = {
    id: string;
    serviceOnEstablishment: PrismaClient.ServiceOnEstablishment;
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

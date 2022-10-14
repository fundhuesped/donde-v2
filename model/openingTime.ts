import * as PrismaClient from '@prisma/client';
import * as yup from 'yup';


const timeRegex = /^([0-2][0-3]|[0-1][0-9]):[0-5][0-9]+$/;

export const createServiceOnEstablishmentOpeningTimeSchema = yup.object({
    day: yup.mixed().oneOf(Object.values(PrismaClient.Day)).required(),
    startTime: yup.string().matches(timeRegex, 'Start time is not valid').required(),
    endTime: yup.string().matches(timeRegex, 'End time is not valid').required(),
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

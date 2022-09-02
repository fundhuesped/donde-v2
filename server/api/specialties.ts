import { prismaClient } from '../prisma/client';
import { AvailableSpecialty } from '../../pages/establecimientos/nuevo';

export const tryGetAvailableSpecialities = async (): Promise<AvailableSpecialty[]> => {
  try {
    return await prismaClient.specialty.findMany();
  } catch (e) {
    throw new Error('Unable to get services from database');
  }
};

import { prismaClient } from '../prisma/client';
import { Specialty } from '../../model/specialty';

export const tryGetAvailableSpecialities = async (): Promise<Specialty[]> => {
  try {
    return await prismaClient.specialty.findMany();
  } catch (e) {
    throw new Error('Unable to get services from database');
  }
};

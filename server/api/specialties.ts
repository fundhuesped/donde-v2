import { prismaClient } from '../prisma/client';
import { SpecialtyWithService } from '../../model/specialty';

export const getSpecialtiesWithServices = async (): Promise<SpecialtyWithService[]> => {
  try {
    return await prismaClient.specialty.findMany({
      include: {
        service: true,
      },
    });
  } catch (e) {
    throw new Error('Unable to get services from database');
  }
};

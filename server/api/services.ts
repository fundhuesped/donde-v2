import { prismaClient } from '../prisma/client';
import { Service } from '../../model/services';

export const getServices = async (): Promise<Service[]> => {
  try {
    return await prismaClient.service.findMany({
      include: {
        subservices: true,
      },
    });
  } catch (e) {
    throw new Error('Unable to get services from database');
  }
};

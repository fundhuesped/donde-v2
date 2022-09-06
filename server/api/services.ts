import { prismaClient } from '../prisma/client';
export type Service = {
  id: string;
  name: string;
  icon: string;
};
export const tryGetServices = async (): Promise<Service[]> => {
  try {
    return await prismaClient.service.findMany();
  } catch (e) {
    throw new Error('Unable to get services from database');
  }
};

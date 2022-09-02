import * as yup from 'yup';
import { prismaClient } from '../prisma/client';
import { Establishment } from '../../model/establishment';

export const getEstablishment = async (id: any): Promise<Establishment> => {
  const idSchema = yup.string().uuid().required();
  if (!idSchema.isValidSync(id)) {
    throw new Error('Invalid id');
  }
  return await prismaClient.establishment.findUniqueOrThrow({
    where: {
      id: id,
    },
    include: {
      specialties: {
        include: {
          specialty: {
            include: {
              service: true,
            },
          },
        },
      },
    },
  });
};

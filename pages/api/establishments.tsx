import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../server/prisma/client';
import { EstablishmentStatus } from '@prisma/client';
import { createEstablishmentSchema as establishmentSchema } from '../../model/establishment';
import { z } from 'zod';
import isEmpty from 'lodash/isEmpty';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getEstablishments(req, res);
    case 'POST':
      return createEstablishment(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const queryParamsSchema = z.object({
  'services[]': z.union([z.array(z.string().uuid()), z.string().uuid()]).optional(),
});

const getEstablishments = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  let where = {};
  const queryParse = queryParamsSchema.safeParse(req.query);
  if (!queryParse.success) {
    res.status(400).send(queryParse.error.message).end();
    return;
  }

  const query = queryParse.data;
  const servicesParam = query['services[]'];
  const services = typeof servicesParam === 'string' ? [servicesParam] : servicesParam;

  if (services && services.length !== 0) {
    where = {
      specialties: {
        some: {
          specialty: {
            service: {
              id: { in: services },
            },
          },
        },
      },
    };
  }
  const establishments = await prismaClient.establishment.findMany({
    where: where,
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
  return res.status(200).json(establishments);
};

const createEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (!establishmentSchema.isValidSync(req.body)) {
    return res.status(400).end();
  }
  const specialties = mapSpecialtiesToPrismaObject(req.body.specialties);
  const establishment = await prismaClient.establishment.create({
    data: {
      ...req.body,
      status: EstablishmentStatus.PUBLISHED,
      specialties: specialties,
    },
  });
  return res.status(201).json(establishment);
};

export const mapSpecialtiesToPrismaObject = (specialties: string[]) => {
  if (isEmpty(specialties)) return { create: [] };
  const specialtiesObjects = specialties.map((specialtyId: string) => {
    return {
      specialty: {
        connect: {
          id: specialtyId,
        },
      },
    };
  });
  return {
    create: specialtiesObjects,
  };
};

export default handler;

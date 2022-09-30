import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import { EstablishmentStatus } from '@prisma/client';
import { createEstablishmentSchema as establishmentSchema } from '../../../model/establishment';
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
    return res.status(400).send(queryParse.error.message);
  }

  const query = queryParse.data;
  const servicesParam = query['services[]'];
  const services = typeof servicesParam === 'string' ? [servicesParam] : servicesParam;

  if (services && services.length !== 0) {
    where = {
      services: {
        some: {
          service: {
            id: { in: services },
          },
        },
      },
    };
  }
  const establishments = await prismaClient.establishment.findMany({
    where: where,
    include: {
      services: {
        include: {
          service: true,
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
  const services = mapServicesToPrismaObject(req.body.services);
  const establishment = await prismaClient.establishment.create({
    data: {
      ...req.body,
      status: EstablishmentStatus.PUBLISHED,
      services: services,
    },
  });
  return res.status(201).json(establishment);
};

export const mapServicesToPrismaObject = (services: string[]) => {
  if (isEmpty(services)) return { create: [] };
  const servicesObjects = services.map((serviceId: string) => {
    return {
      service: {
        connect: {
          id: serviceId,
        },
      },
    };
  });
  return {
    create: servicesObjects,
  };
};

export default handler;

import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import { EstablishmentStatus } from '@prisma/client';
import { createEstablishmentSchema as establishmentSchema } from '../../../model/establishment';
import { createServiceOnEstablishmentSchema } from '../../../model/serviceOnEstablishment';
import { Establishment as EstablishmentModel } from '../../../model/establishment';
import { Establishment } from '@prisma/client';
import { z } from 'zod';
import * as yup from 'yup';

import isEmpty from 'lodash/isEmpty';
import { mapServicesOnEstablishmentOpeningTimesToPrismaObject } from './[id]/services';

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
          openingTimes: true,
        },
      },
    },
  });

  return res.status(200).json(
    establishments.map((establishment) => {
      return transformEstablishmentIntoJSONResponse(establishment);
    }),
  );
};

const createEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (!establishmentSchema.isValidSync(req.body)) {
    return res.status(400).end();
  }

  const services = mapServicesOnEstablishmentToPrismaObject(req.body.services);
  const establishment = await prismaClient.establishment.create({
    data: {
      ...req.body,
      status: EstablishmentStatus.PUBLISHED,
      services: services,
    },
  });

  return res.status(201).json(establishment);
};

export const mapServicesOnEstablishmentToPrismaObject = (services: yup.Asserts<typeof createServiceOnEstablishmentSchema>[]) => {
  if (isEmpty(services)) return { create: [] };
  const servicesObjects = services.map((service) => {
    return {
      service: {
        connect: {
          id: service.serviceId,
        },
      },
      phoneNumber: service.phoneNumber,
      details: service.details,
      openingTimes: mapServicesOnEstablishmentOpeningTimesToPrismaObject(service.openingTimes),
    };
  });
  return {
    create: servicesObjects,
  };
};

export const transformEstablishmentIntoJSONResponse = (establishment: Establishment | EstablishmentModel): any => {
  const jsonEstablishment = JSON.parse(JSON.stringify(establishment));
  for (const service of jsonEstablishment.services) {
    for (const openingTimes of service.openingTimes) {
      openingTimes.startTime = openingTimes.startTime.substring(11, 16);
      openingTimes.endTime = openingTimes.endTime.substring(11, 16);
    }
  }
  return jsonEstablishment;
};

export default handler;

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
import { createServiceOnEstablishmentOpeningTimeSchema } from '../../../model/openingTime';

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
          subservice: true,
          openingTimes: true,
        },
      },
    },
  });

  return res.status(200).json(
    establishments.map((establishment: Establishment) => {
      return transformEstablishmentIntoJSONResponse(establishment);
    }),
  );
};

const createEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  try {
    establishmentSchema.validateSync(req.body, { abortEarly: false });
  } catch (err: any) {
    return res.status(400).json(err.inner);
  }

  let services = undefined;
  try {
    services = await mapServicesOnEstablishmentToPrismaObject(req.body.services);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }

  const establishment = await prismaClient.establishment.create({
    data: {
      ...req.body,
      status: EstablishmentStatus.PUBLISHED,
      services: services,
    },
  });

  return res.status(201).json(establishment);
};

export const mapServicesOnEstablishmentToPrismaObject = async (
  services: yup.Asserts<typeof createServiceOnEstablishmentSchema>[],
) => {
  if (isEmpty(services)) return { create: [] };

  const servicesObjects = await Promise.all(
    services.map(async (service) => {
      let connectSubservice = undefined;
      if (service.subserviceId) {
        const subservice = await prismaClient.subservice.findUnique({
          where: {
            id: service.subserviceId,
          },
        });
        if (subservice?.serviceId != service.serviceId) {
          throw new Error('subservice does not belong to service');
        } else {
          connectSubservice = {
            connect: {
              id: service.subserviceId,
            },
          };
        }
      }

      return {
        service: {
          connect: {
            id: service.serviceId,
          },
        },
        subservice: connectSubservice,
        phoneNumber: service.phoneNumber,
        details: service.details,
        email: service.email,
        openingTimes: service.openingTimes
          ? mapServicesOnEstablishmentOpeningTimesToPrismaObject(service.openingTimes)
          : undefined,
      };
    }),
  );
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

const mapServicesOnEstablishmentOpeningTimesToPrismaObject = (
  openingTimes: yup.Asserts<typeof createServiceOnEstablishmentOpeningTimeSchema>[],
) => {
  if (isEmpty(openingTimes)) return { create: [] };
  const servicesObjects = openingTimes.map((openingTime) => {
    return {
      day: openingTime.day,
      startTime: '1970-01-01T' + openingTime.startTime + ':00.000Z',
      endTime: '1970-01-01T' + openingTime.endTime + ':00.000Z',
    };
  });
  return {
    create: servicesObjects,
  };
};

export default handler;

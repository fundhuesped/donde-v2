import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../../../server/prisma/client';
import * as yup from 'yup';
import { createServiceOnEstablishmentSchema } from '../../../../../model/serviceOnEstablishment';
import { createServiceOnEstablishmentOpeningTimeSchema } from '../../../../../model/openingTime';
import isEmpty from 'lodash/isEmpty';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return createServiceOnEstablishment(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const createServiceOnEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const idSchema = yup.string().uuid().required();
  const establishmentId = req.query.id;
  if (!idSchema.isValidSync(establishmentId)) {
    return res.status(400).end();
  }

  if (!createServiceOnEstablishmentSchema.isValidSync(req.body)) {
    return res.status(400).end();
  }

  const openingTimes = mapServicesOnEstablishmentOpeningTimesToPrismaObject(req.body.openingTimes);

  const serviceOnstablishment = await prismaClient.serviceOnEstablishment.create({
    data: {
      establishment: {
       connect: {
        id: establishmentId,
       } 
      },
      service: {
        connect: {
          id: req.body.serviceId
        }
      },
      details: req.body.details,
      phoneNumber: req.body.phoneNumber,
      openingTimes: openingTimes,
    },
  });
  return res.status(201).json(serviceOnstablishment);
};

export const mapServicesOnEstablishmentOpeningTimesToPrismaObject = (openingTimes: yup.Asserts<typeof createServiceOnEstablishmentOpeningTimeSchema>[])  => {
  if (isEmpty(openingTimes)) return { create: [] };
  const servicesObjects = openingTimes.map(openingTime => {
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

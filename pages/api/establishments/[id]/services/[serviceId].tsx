import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';
import { prismaClient } from '../../../../../server/prisma/client';
import * as yup from 'yup';
import { updateServiceOnEstablishmentSchema } from '../../../../../model/serviceOnEstablishment';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'PUT':
      return updateServiceOnEstablishment(req, res);
    case 'DELETE':
      return deleteServiceOnEstablishment(req, res)
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const updateServiceOnEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (!req.query.serviceId) {
    return res.status(400).end();
  }
  const idSchema = yup.string().uuid().required();
  const serviceOnEstablishmentId = req.query.serviceId;
  if (!idSchema.isValidSync(serviceOnEstablishmentId)) {
    return res.status(400).end();
  }

  if (!updateServiceOnEstablishmentSchema.isValidSync(req.body)) {
    return res.status(400).end();
  }

  const disconnectPreviouslyConnectedFeatures = prismaClient.serviceOnEstablishment.update({
    where: {
      id: serviceOnEstablishmentId,
    },
    data: {
      openingTimes: {
        deleteMany: {},
      },
    },
  });

  let connectService = undefined
  if (req.body.serviceId) {
    connectService =  {
      connect: {
        id: req.body.serviceId
      }
    };
  }

  const updateServiceOnEstablishment = prismaClient.serviceOnEstablishment.update({
    where: {
      id: serviceOnEstablishmentId,
    },
    data: {
      service: connectService,
      details: req.body.details,
      phoneNumber: req.body.phoneNumber,
    },
  });

  await prismaClient.$transaction([disconnectPreviouslyConnectedFeatures, updateServiceOnEstablishment]);

  return res.status(200).end();
};

const deleteServiceOnEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  if (!req.query.serviceId) {
    return res.status(400).end();
  }
  const idSchema = yup.string().uuid().required();
  const serviceOnEstablishmentId = req.query.serviceId;
  if (!idSchema.isValidSync(serviceOnEstablishmentId)) {
    return res.status(400).end();
  }

  await prismaClient.serviceOnEstablishment.delete({
    where: {
      id: serviceOnEstablishmentId,
    }
  });

  return res.status(200).end();
}

export default handler;

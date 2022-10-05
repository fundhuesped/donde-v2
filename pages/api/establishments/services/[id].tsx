import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';
import { prismaClient } from '../../../../server/prisma/client';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'PUT':
      return updateServiceOnEstablishment(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const updateServiceOnEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  req.body.id = req.query.id;

  const disconnectPreviouslyConnectedFeatures = prismaClient.serviceOnEstablishment.update({
    where: {
      id: req.body.id,
    },
    data: {
      openingTimes: {
        deleteMany: {},
      },
    },
  });

  const updateServiceOnEstablishment = prismaClient.serviceOnEstablishment.update({
    where: {
      id: req.body.id,
    },
    data: {
      details: req.body.details,
      phoneNumber: req.body.phoneNumber,
    },
  });

  await prismaClient.$transaction([disconnectPreviouslyConnectedFeatures, updateServiceOnEstablishment]);

  return res.status(200).end();
};

export default handler;

import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import { editEstablishmentSchema as establishmentSchema } from '../../../model/establishment';
import { EstablishmentStatus } from '@prisma/client';
import { mapSpecialtiesToPrismaObject } from '../establishments';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'PUT':
      return updateEstablishment(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const updateEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  req.body.id = req.query.id;
  if (!establishmentSchema.isValidSync(req.body)) {
    return res.status(400).end();
  }
  const disconnectPreviouslyConnectedFeatures = prismaClient.establishment.update({
    where: {
      id: req.body.id,
    },
    data: {
      specialties: {
        deleteMany: {},
      },
    },
  });
  const specialties = mapSpecialtiesToPrismaObject(req.body.specialties!);
  const createNewEstablishment = prismaClient.establishment.update({
    where: {
      id: req.body.id,
    },
    data: {
      ...req.body,
      status: EstablishmentStatus.PUBLISHED,
      specialties,
    },
  });
  await prismaClient.$transaction([disconnectPreviouslyConnectedFeatures, createNewEstablishment]);
  return res.status(200).end();
};

export default handler;

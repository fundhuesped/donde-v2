import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import { editEstablishmentSchema as establishmentSchema } from '../../../model/establishment';
import { EstablishmentStatus } from '@prisma/client';
import { mapSpecialtiesToPrismaObject } from './index';
import * as yup from 'yup';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getEstablishment(req, res);
    case 'PUT':
      return updateEstablishment(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const getEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const idSchema = yup.string().uuid().required();
  const id = req.query.id;
  if (!idSchema.isValidSync(id)) {
    return res.status(400).end();
  }
  const establishment = await prismaClient.establishment.findUnique({
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
  if (establishment) {
    return res.status(200).json(establishment);
  }
  return res.status(404).end();
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

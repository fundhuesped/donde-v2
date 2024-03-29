import { EstablishmentStatus } from '@prisma/client';
import type { NextApiRequest, NextApiResponse } from 'next';
import { NextApiHandler } from 'next';
import * as yup from 'yup';
import { editEstablishmentSchema as establishmentSchema } from '../../../model/establishment';
import { prismaClient } from '../../../server/prisma/client';
import { mapServicesOnEstablishmentToPrismaObject, transformEstablishmentIntoJSONResponse } from './index';
import getUserDataFromReq from '../../../utils/getUserDataFromReq';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'GET':
      return getEstablishment(req, res);
    case 'PUT':
      return updateEstablishment(req, res);
    case 'DELETE':
      return deleteEstablishment(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const getEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const idSchema = yup.string().uuid().required();
  const { id } = req.query;
  if (!idSchema.isValidSync(id)) {
    return res.status(400).end();
  }
  const establishment = await prismaClient.establishment.findUnique({
    where: {
      id: id,
    },
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

  if (establishment) {
    return res.status(200).json(transformEstablishmentIntoJSONResponse(establishment));
  }
  return res.status(404).end();
};

const updateEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const idSchema = yup.string().uuid().required();
  const establishmentId = req.query.id;

  if (!idSchema.isValidSync(establishmentId)) {
    return res.status(400).end();
  }

  try {
    establishmentSchema.validateSync(req.body, { abortEarly: false });
  } catch (err: any) {
    return res.status(400).json(err.inner);
  }

  let disconnectPreviouslyConnectedFeatures = undefined;
  if (req.body.services) {
    disconnectPreviouslyConnectedFeatures = prismaClient.establishment.update({
      where: {
        id: establishmentId,
      },
      data: {
        services: {
          deleteMany: {},
        },
      },
    });
  }

  let services = undefined;
  try {
    services = await mapServicesOnEstablishmentToPrismaObject(req.body.services);
  } catch (err: any) {
    return res.status(400).json(err.message);
  }

  const reqUser = await getUserDataFromReq(req);
  const user = await prismaClient.user.findUnique({ where: { email: reqUser?.email } });
  if (!reqUser || !user) {
    return res.status(404);
  }

  const updateEstablishment = prismaClient.establishment.update({
    where: {
      id: establishmentId,
    },
    data: {
      ...req.body,
      lastModifiedBy: user.organization_name,
      services,
    },
  });

  if (disconnectPreviouslyConnectedFeatures) {
    await prismaClient.$transaction([disconnectPreviouslyConnectedFeatures, updateEstablishment]);
  } else {
    await prismaClient.$transaction([updateEstablishment]);
  }

  return res.status(200).end();
};

const deleteEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {
  const idSchema = yup.string().uuid().required();
  const establishmentId = req.query.id;

  if (!idSchema.isValidSync(establishmentId)) {
    return res.status(400).end();
  }

  await prismaClient.establishment.delete({
    where: {
      id: establishmentId,
    },
  });

  return res.status(200).end();
};

export default handler;

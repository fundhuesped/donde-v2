import { NextApiHandler } from 'next';
import { prismaClient } from '../../server/prisma/client';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const { service } = req.query;
  const { establishment } = req.query;
  let query: any = {};

  if (service) {
    query = {
      where: {
        service: {
          name: service,
        },
      },
    };
  }

  if (establishment) {
    query = {
      where: {
        ...query.where,
        establishments: {
          some: {
            establishment: {
              name: establishment,
            },
          },
        },
      },
    };
  }

  const specializations = await prismaClient.specialization.findMany(query);

  return res.status(200).json(specializations);
};

export default handler;

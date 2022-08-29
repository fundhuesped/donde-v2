import { NextApiHandler } from 'next';
import { prismaClient } from '../../server/prisma/client';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const { establishment } = req.query;
  let query = {};

  if (establishment) {
    query = {
      where: {
        specializations: {
          some: {
            establishments: {
              some: {
                establishment: {
                  name: establishment,
                },
              },
            },
          },
        },
      },
    };
  }

  const services = await prismaClient.service.findMany(query);

  return res.status(200).json(services);
};

export default handler;

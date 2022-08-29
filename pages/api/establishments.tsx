import { NextApiHandler } from 'next';
import { prismaClient } from '../../server/prisma/client';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const services = (req.query.services as string).split(',');
  let query = {};
  if (services) {
    query = {
      where: {
        specializations: {
          some: {
            specialization: {
              service: {
                name: { in: services }
              }
            }
          }
        }
      }
    }
  }

  const establishmentsForService = await prismaClient.establishment.findMany(query);

  return res.status(200).json(establishmentsForService);
};

export default handler;

import { NextApiHandler } from 'next';
import { prismaClient } from '../../server/prisma/client';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const establishmentsForService = await prismaClient.establishment.findMany();

  return res.status(200).json(establishmentsForService);
};

export default handler;

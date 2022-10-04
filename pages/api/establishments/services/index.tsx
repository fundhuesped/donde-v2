import { NextApiHandler, NextApiRequest, NextApiResponse } from 'next';
import { prismaClient } from '../../../../server/prisma/client';

const handler: NextApiHandler = async (req, res) => {
  switch (req.method) {
    case 'POST':
      return createServiceOnEstablishment(req, res);
    default:
      return res.status(405).json({ error: 'Method Not Allowed' });
  }
};

const createServiceOnEstablishment = async (req: NextApiRequest, res: NextApiResponse<any>) => {

  if (!req.query.id) {
    return res.status(400).end();
  }
  const establishmentId = req.query.id[0];

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
    },
  });
  return res.status(201).json(serviceOnstablishment);
};

export default handler;

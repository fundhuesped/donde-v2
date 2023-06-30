import { NextApiHandler } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import { Content } from '@prisma/client';

const DEFAULT_CONTENTS: Content[] = [
  {
    id: 'about',
    text: '',
  },
];
const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405).json({ error: 'This endpoint only supports GET requests' });
  }

  const contents = await prismaClient.content.findMany();

  return res.status(200).json([...contents, ...DEFAULT_CONTENTS.filter((x) => !contents.some((y) => y.id === x.id))]);
};

export default handler;

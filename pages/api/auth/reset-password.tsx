import { NextApiHandler } from 'next';
import { prismaClient } from '../../../server/prisma/client';
import { resetPasswordForEmail } from '../../../utils/resetPasswordForEmail';

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'This endpoint only supports POST requests' });
  }

  const { email } = req.body;

  if (!email) {
    res.status(400).json({ message: 'Email is required' });
    return;
  }

  const user = await prismaClient.user.findUnique({ where: { email } });

  if (!user) {
    res.status(400).json({ message: 'User not found' });
    return;
  }

  await resetPasswordForEmail(email);

  res.status(200).json({ message: 'Email sent' });
};

export default handler;

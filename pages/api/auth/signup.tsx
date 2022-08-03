import { NextApiHandler } from 'next';
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import { BCRYPT_COST } from '../../../config/server';

const prisma = new PrismaClient();

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'This endpoint only supports POST requests' });
  }

  const { email, password, firstName, lastName } = req.body;
  const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

  await prisma.user.create({
    data: {
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
    },
  });

  return res.status(200).end();
};

export default handler;

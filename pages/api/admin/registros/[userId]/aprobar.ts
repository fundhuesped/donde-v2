import { NextApiHandler } from 'next';
import * as yup from 'yup';
import { prismaClient } from '../../../../../server/prisma/client';
import { UserStatus } from '@prisma/client';
import { isRecordNotFoundError } from '../../../../../server/prisma/errors';

const approveSignUpQueryParamsSchema = yup.object({
  userId: yup.string().uuid().required(),
});

const handler: NextApiHandler = async (req, res) => {
  if (req.method !== 'POST') {
    return res.status(405).end();
  }
  const { query } = req;
  if (!approveSignUpQueryParamsSchema.isValidSync(query)) {
    return res.status(400).end();
  }

  const { userId } = query;

  try {
    await prismaClient.user.update({
      data: {
        status: UserStatus.ACTIVE,
      },
      where: {
        id: userId,
      },
    });
    res.status(200);
  } catch (e) {
    if (isRecordNotFoundError(e)) {
      res.status(404);
    }
    res.status(500);
  }

  res.end();
};

export default handler;

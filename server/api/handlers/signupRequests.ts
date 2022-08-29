import * as yup from 'yup';
import { NextApiHandler } from 'next';
import { prismaClient } from '../../prisma/client';
import { UserStatus } from '@prisma/client';
import { isRecordNotFoundError } from '../../prisma/errors';

const signUpRequestStatusUpdateQueryParamsSchema = yup.object({
  userId: yup.string().uuid().required(),
});

export const getHandlerForSignupRequestStatusUpdateTo =
  (status: UserStatus): NextApiHandler =>
  async (req, res) => {
    if (req.method !== 'POST') {
      return res.status(405).end();
    }
    const { query } = req;
    if (!signUpRequestStatusUpdateQueryParamsSchema.isValidSync(query)) {
      return res.status(400).end();
    }

    const { userId } = query;

    try {
      await prismaClient.user.update({
        data: { status: status },
        where: { id: userId },
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

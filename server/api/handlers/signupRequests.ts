import * as yup from 'yup';
import { NextApiHandler } from 'next';
import { prismaClient } from '../../prisma/client';
import { UserStatus } from '@prisma/client';
import { isRecordNotFoundError } from '../../prisma/errors';
import { sendMail } from '../../mail/mailer';
import signupAcceptanceMail from '../../mail/templates/signupAcceptanceMail';
import signupAcceptanceHTMLMail from '../../mail/templates/signupAcceptanceHTMLMail';

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
      const user = await prismaClient.user.update({
        data: { status: status },
        where: { id: userId },
      });

      if (status == UserStatus.ACTIVE) {
        await sendMail({
          to: user.email, 
          subject: 'Dónde',
          text: signupAcceptanceMail(),
          html: signupAcceptanceHTMLMail()});
      }
      
      res.status(200);
    } catch (e) {
      if (isRecordNotFoundError(e)) {
        res.status(404);
      }
      res.status(500);
    }

    res.end();
  };

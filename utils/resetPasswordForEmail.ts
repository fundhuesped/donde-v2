import { prismaClient } from '../server/prisma/client';
import bcrypt from 'bcrypt';
import { BCRYPT_COST } from '../config/server';
import { sendMail } from '../server/mail/mailer';
import {
  createPasswordHTMLMail,
  createPasswordMail,
  resetPasswordHTMLMail,
  resetPasswordMail,
} from '../server/mail/templates/resetPasswordMail';

export const resetPasswordForEmail = async (email: string, isNewUser?: boolean) => {
  const token = Math.random().toString(36).substring(2) + Math.random().toString(36).substring(2);

  await prismaClient.user.update({
    where: { email },
    data: { reset_password_token: await bcrypt.hash(token, BCRYPT_COST) },
  });

  const recoverLink = `${process.env.BASE_URL}/recuperar?email=${email}&token=${token}`;

  await sendMail({
    to: email,
    subject: 'Recuperar contraseña',
    html: isNewUser ? createPasswordMail(recoverLink) : resetPasswordMail(recoverLink),
    text: isNewUser ? createPasswordHTMLMail(recoverLink) : resetPasswordHTMLMail(recoverLink),
  });
};

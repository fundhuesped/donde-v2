import { NextApiRequest, NextApiResponse } from 'next';
import bcrypt from 'bcrypt';
import { BCRYPT_COST } from '../config/server';
import { prismaClient } from '../server/prisma/client';
import { UserRole, UserStatus } from '@prisma/client';
import { sendMail } from '../server/mail/mailer';
import signupRequestMail from '../server/mail/templates/singupRequestMail';
import signupRequestHTMLMail from '../server/mail/templates/singupRequestHTMLMail';
import { resetPasswordForEmail } from './resetPasswordForEmail';

const handler = async (req: NextApiRequest, res: NextApiResponse, isAdminRequest: boolean) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'This endpoint only supports POST requests' });
  }

  const {
    email,
    password,
    firstName,
    lastName,
    organizationName,
    organizationType,
    organizationRole,
    organizationCountry,
    organizationWebsite,
    userRole,
  } = req.body;

  const hashedPassword = await bcrypt.hash(password, BCRYPT_COST);

  const user = await prismaClient.user.create({
    data: {
      email,
      password: hashedPassword,
      first_name: firstName,
      last_name: lastName,
      role: isAdminRequest ? userRole : UserRole.COLLABORATOR,
      status: isAdminRequest ? UserStatus.ACTIVE : UserStatus.PENDING,
      organization_name: organizationName,
      organization_country: organizationCountry,
      organization_role: organizationRole,
      organization_type: organizationType,
      organization_website: organizationWebsite,
    },
  });

  if (isAdminRequest) {
    // We make the user change their password before the first login.
    await resetPasswordForEmail(email, true);
    return res.status(200).end();
  }

  const admins = await prismaClient.user.findMany({
    where: {
      role: UserRole.ADMIN,
    },
  });

  for (const admin of admins) {
    await sendMail({
      to: admin.email,
      subject: 'Dónde',
      text: signupRequestMail(user.first_name, user.last_name, user.organization_name, user.organization_country),
      html: signupRequestHTMLMail(user.first_name, user.last_name, user.organization_name, user.organization_country),
    });
  }

  return res.status(200).end();
};

export default handler;

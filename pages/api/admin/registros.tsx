import { NextApiHandler } from 'next';
import { Prisma } from '@prisma/client';
import { prismaClient } from '../../../server/prisma/client';
import { SignupRequests } from '../../../model/signup';

const userSignupRequestData = Prisma.validator<Prisma.UserArgs>()({
  select: {
    id: true,
    email: true,
    first_name: true,
    last_name: true,
    status: true,
    organization_name: true,
    organization_country: true,
    organization_role: true,
    organization_type: true,
    organization_website: true,
    created_at: true,
  },
});

const handler: NextApiHandler<SignupRequests> = async (req, res) => {
  if (req.method !== 'GET') {
    return res.status(405);
  }

  const signupRequestData = await prismaClient.user.findMany(userSignupRequestData);
  const signupRequests: SignupRequests = signupRequestData.map((data) => ({
    userId: data.id,
    email: data.email,
    firstName: data.first_name,
    lastName: data.last_name,
    status: data.status,
    organizationName: data.organization_name,
    organizationCountry: data.organization_country,
    organizationRole: data.organization_role,
    organizationType: data.organization_type,
    organizationWebsite: data.organization_website,
    createdAt: data.created_at,
  }));

  return res.status(200).send(signupRequests);
};

export default handler;

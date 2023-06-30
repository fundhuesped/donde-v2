import { NextApiHandler } from 'next';
import { prismaClient } from '../../../../../server/prisma/client';
import * as yup from 'yup';

const userIdSchema = yup.object({
  userId: yup.string().uuid().required(),
});

const handler: NextApiHandler = async (req, res) => {
  const { query } = req;
  if (!userIdSchema.isValidSync(query)) {
    return res.status(400).end();
  }

  const { userId } = query;

  const user = await prismaClient.user.findUnique({ where: { id: userId } });
  if (!user) {
    return res.status(404).end();
  }

  if (req.method === 'POST') {
    const {
      email,
      firstName,
      lastName,
      organizationName,
      organizationType,
      organizationRole,
      organizationCountry,
      organizationWebsite,
      userRole,
    } = req.body;

    await prismaClient.user.update({
      data: {
        email,
        first_name: firstName,
        last_name: lastName,
        role: userRole,
        organization_name: organizationName,
        organization_country: organizationCountry,
        organization_role: organizationRole,
        organization_type: organizationType,
        organization_website: organizationWebsite,
      },
      where: { id: userId },
    });
    return res.status(200).end();
  }

  const userData = {
    userId: user.id,
    email: user.email,
    firstName: user.first_name,
    lastName: user.last_name,
    status: user.status,
    role: user.role,
    organizationName: user.organization_name,
    organizationCountry: user.organization_country,
    organizationRole: user.organization_role,
    organizationType: user.organization_type,
    organizationWebsite: user.organization_website,
    createdAt: user.created_at,
  };

  return res.status(200).send(userData);
};

export default handler;

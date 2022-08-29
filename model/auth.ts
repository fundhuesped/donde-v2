import * as PrismaClient from '@prisma/client';
import * as yup from 'yup';

export type AuthenticatedUser = yup.InferType<typeof authenticatedUserSchema>;
export const authenticatedUserSchema = yup.object({
  email: yup.string().required(),
  firstName: yup.string().required(),
  lastName: yup.string().required(),
  role: yup.mixed().oneOf(Object.values(PrismaClient.UserRole)).required(),
});

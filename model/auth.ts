import { UserRole } from '@prisma/client';

export type AuthenticatedUser = {
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
};

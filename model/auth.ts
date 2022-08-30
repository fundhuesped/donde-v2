import { z } from 'zod';
import { UserRole } from '@prisma/client';

export type AuthenticatedUser = z.infer<typeof AuthenticatedUserSchema>;
export const AuthenticatedUserSchema = z.object({
  email: z.string().email(),
  firstName: z.string(),
  lastName: z.string(),
  role: z.enum([UserRole.ADMIN, UserRole.COLLABORATOR]),
});

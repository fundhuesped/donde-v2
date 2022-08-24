import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import { UserStatus, Prisma } from '@prisma/client';
import bcrypt from 'bcrypt';
import { Session } from 'next-auth/core/types';
import { AuthenticatedUser } from '../../../model/auth';
import { JWT } from 'next-auth/jwt';
import { prismaClient } from '../../../server/prisma/client';

const asd = Prisma.validator<Prisma.UserArgs>()({});

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      authorize: async (credentials: any): Promise<AuthenticatedUser | null> => {
        const { email, password } = credentials;
        const user = await prismaClient.user.findUnique({
          select: { email: true, password: true, first_name: true, last_name: true, role: true, status: true },
          where: { email },
        });

        if (user && user.status === UserStatus.ACTIVE && (await bcrypt.compare(password, user.password))) {
          return {
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name,
            role: user.role,
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({ token, user }): Promise<JWT> => {
      if (!user) {
        return token;
      }
      return { ...token, user };
    },
    session: async ({ session, token }): Promise<Session> => {
      session.user = token['user'] as any;
      return {
        ...session,
        user: token['user'] as any,
      };
    },
  },
});

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt';
import {Session} from "next-auth/core/types";
import {AuthenticatedUser} from "../../../model/auth";
import {JWT} from "next-auth/jwt";

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      authorize: async (credentials: any): Promise<AuthenticatedUser | null> => {
        const {email, password} = credentials;
        const user = await prisma.user.findUnique({
          where: {email}
        });

        if (user && await bcrypt.compare(password, user.password)) {
          return {
            email: user.email,
            firstName: user.first_name,
            lastName: user.last_name
          };
        }

        return null;
      },
    }),
  ],
  callbacks: {
    jwt: async ({token, user}): Promise<JWT> => {
      if (!user) {
        return token;
      }
      return {...token, user};
    },
    session: async ({session, token}): Promise<Session> => {
      session.user = token['user'] as any;
      return {
        ...session,
        user: token['user'] as any
      };
    }
  }
});

import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import {PrismaClient} from "@prisma/client";
import bcrypt from 'bcrypt';

const prisma = new PrismaClient()

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      authorize: async (credentials: any) => {
        const {email, password} = credentials;
        const user = await prisma.user.findUnique({
          where: { email }
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
});

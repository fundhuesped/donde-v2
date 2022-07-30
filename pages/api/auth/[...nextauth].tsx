import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';

export default NextAuth({
  providers: [
    CredentialsProvider({
      credentials: {},
      authorize: async (credentials: any) => {
        const user = { ...credentials };
        delete user.password;

        return user;
      },
    }),
  ],
});

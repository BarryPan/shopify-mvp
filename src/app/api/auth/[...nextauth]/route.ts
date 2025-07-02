import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { shopifyFetch } from '@/lib/shopify';
import { CREATE_CUSTOMER_TOKEN } from '@/lib/queries/auth';

export const authOptions = {
  providers: [
    Credentials({
      name: 'Shopify',
      credentials: {
        email:    { label: 'Email',    type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(creds) {
        const { email, password } = creds as { email: string; password: string };
        const data = await shopifyFetch<{
          customerAccessTokenCreate: {
            customerAccessToken?: { accessToken: string; expiresAt: string };
            userErrors: { message: string }[];
          };
        }>(CREATE_CUSTOMER_TOKEN, { email, password });

        const token = data.customerAccessTokenCreate.customerAccessToken;
        if (!token) return null; // 登入失敗

        return {
          id: email,
          email,
          accessToken: token.accessToken,
          accessTokenExpires: token.expiresAt,
        };
      },
    }),
  ],
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.accessToken = user.accessToken;
        token.accessTokenExpires = user.accessTokenExpires;
      }
      return token;
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken as string;
      return session;
    },
  },
};
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };

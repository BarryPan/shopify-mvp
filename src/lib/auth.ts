import type { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

import { shopifyFetch } from "@/lib/shopify";
import { CREATE_CUSTOMER_TOKEN } from "@/lib/queries/auth";
import type { Session, User } from "next-auth";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Shopify",
      credentials: {
        email:    { label: "Email",    type: "email"    },
        password: { label: "Password", type: "password" },
      },
      async authorize(creds) {
        const { email, password } = creds as {
          email: string;
          password: string;
        };

        const data = await shopifyFetch<{
          customerAccessTokenCreate: {
            customerAccessToken?: {
              accessToken: string;
              expiresAt: string;
            };
            userErrors: { message: string }[];
          };
        }>(CREATE_CUSTOMER_TOKEN, { email, password });

        const token = data.customerAccessTokenCreate.customerAccessToken;
        if (!token) return null; // ↩️  登入失敗 → 回傳 null

        return {
          id: email,
          email,
          accessToken: token.accessToken,
          accessTokenExpires: token.expiresAt,
        };
      },
    }),
  ],

  session: { strategy: "jwt" },

  callbacks: {
    async jwt({ token, user }) {
      // 把 accessToken 存進 JWT
      if (user) {
        token.accessToken = (user as User).accessToken;
        token.accessTokenExpires = (user as User).accessTokenExpires;
      }
      return token;
    },
    async session({ session, token }) {
      // 再把 accessToken 透給前端 Session
      (session as Session).accessToken = token.accessToken as string;
      return session;
    },
  },
};

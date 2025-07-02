import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { shopifyFetch } from '@/lib/shopify';

const TOKEN_DELETE = /* GraphQL */ `
  mutation customerAccessTokenDelete($token: String!) {
    customerAccessTokenDelete(customerAccessToken: $token) {
      deletedAccessToken
      userErrors { message }
    }
  }
`;

export async function POST() {
  const session = await getServerSession(authOptions);
  const token = session?.accessToken;

  if (token) {
    await shopifyFetch(TOKEN_DELETE, { token });
  }
  return NextResponse.json({ ok: true });
}

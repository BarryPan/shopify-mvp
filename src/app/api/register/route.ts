import { NextResponse } from 'next/server';
import { shopifyFetch } from '@/lib/shopify';
import { CUSTOMER_CREATE, CREATE_CUSTOMER_TOKEN } from '@/lib/queries/auth';

/** POST /api/register  */
export async function POST(req: Request) {
  const { email, password, firstName, lastName } = await req.json();

  // 1) 建立顧客
  const createRes = await shopifyFetch<{
    customerCreate: { customer?: { id: string }; userErrors: { message: string }[] };
  }>(CUSTOMER_CREATE, { email, password, firstName, lastName });

  const errors = createRes.customerCreate.userErrors;
  if (errors.length) {
    return NextResponse.json({ ok: false, errors }, { status: 400 });
  }

  // 2) 立刻取得 customerAccessToken 方便自動登入
  const tokenRes = await shopifyFetch<{
    customerAccessTokenCreate: {
      customerAccessToken: { accessToken: string; expiresAt: string } | null;
      userErrors: { message: string }[];
    };
  }>(CREATE_CUSTOMER_TOKEN, { email, password });

  const token = tokenRes.customerAccessTokenCreate.customerAccessToken;
  if (!token) {
    return NextResponse.json(
      { ok: false, errors: tokenRes.customerAccessTokenCreate.userErrors },
      { status: 400 },
    );
  }

  return NextResponse.json({ ok: true, accessToken: token.accessToken });
}

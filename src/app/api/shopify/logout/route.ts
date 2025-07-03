import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";                // 🔹1. 改正匯入路徑
import { shopifyFetch } from "@/lib/shopify";

const TOKEN_DELETE = /* GraphQL */ `
  mutation customerAccessTokenDelete($token: String!) {
    customerAccessTokenDelete(customerAccessToken: $token) {
      deletedAccessToken
      userErrors { message }
    }
  }
`;

export async function POST() {
  // 如果你用的是 next-auth v5，保留參數；
  // v4.23+ 也允許 getServerSession() 不帶參數（自動載入）。
  const session = await getServerSession(authOptions);  // 🔹2. 傳入 authOptions
  const token = session?.accessToken;          // 🔹3. 型別快速抑制

  /** 若 token 存在就呼叫 Shopify GraphQL 刪除 */
  if (token) {
    await shopifyFetch(TOKEN_DELETE, { token });
  }
  return NextResponse.json({ ok: true });
}

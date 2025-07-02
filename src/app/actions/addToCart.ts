"use server";

import { cookies } from "next/headers";
import { shopifyFetch } from "@/lib/shopify";
import { CART_CREATE, CART_LINES_ADD } from "@/lib/queries/cart";

export async function addLineToCart(variantId: string, quantity: number) {
  const store = cookies();
  let cartId  = store.get("cartId")?.value;

  if (!cartId) {
    const { cartCreate } = await shopifyFetch(CART_CREATE, {
      input: { lines: [{ merchandiseId: variantId, quantity }] },
    });
    cartId = cartCreate.cart.id;
    store.set("cartId", cartId, { path: "/", httpOnly: true, sameSite: "lax" });
    return cartCreate.cart;               // 把 cart 回傳給前端
  }

  const { cartLinesAdd } = await shopifyFetch(CART_LINES_ADD, {
    cartId,
    lines: [{ merchandiseId: variantId, quantity }],
  });
  return cartLinesAdd.cart;
}

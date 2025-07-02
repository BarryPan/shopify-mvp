/* store/cart.ts
   -------------------------------------------------------------
   Centralized cart store (Zustand + persist).
   • Only cartId / checkoutUrl are persisted to localStorage;   *
     lines are reconstructed on every page refresh via sync()   *
   • All Shopify mutations wrapped in try / finally so that     *
     `loading` is always reset, even on network / API errors    *
   ------------------------------------------------------------- */

import { create } from "zustand";
import { persist } from "zustand/middleware";
import { shopifyFetch } from "@/lib/shopify";
import {
  CART_CREATE,
  CART_LINES_ADD,
  CART_LINES_UPDATE,
  CART_QUERY,
  CART_BUYER_IDENTITY_UPDATE,
} from "@/lib/queries/cart";

export interface Line {
  id: string;            // cartLine.id
  merchandiseId: string; // variantId
  quantity: number;
  title: string;
  price: string;
  imageUrl: string;
}

type CartLineEdge = {
  node: {
    id: string;
    quantity: number;
    merchandise: {
      id: string;
      price: { amount: string };
      product: {
        title: string;
        images: { edges: { node: { url: string } }[] };
      };
    };
  };
};

interface CartState {
  /* persisted */
  cartId?: string;
  checkoutUrl?: string;

  /* volatile */
  lines: Line[];
  loading: boolean;

  /* actions */
  addToCart: (variantId: string, quantity?: number) => Promise<void>;
  updateLine: (lineId: string, quantity: number) => Promise<void>;
  sync: () => Promise<void>;
  setBuyerIdentity: (email: string, token?: string) => Promise<void>;
}

export const useCart = create<CartState>()(
  persist(
    (set, get) => ({
      cartId: undefined,
      checkoutUrl: undefined,
      lines: [],
      loading: false,

      /* ---------------------------------------------------------
         Create cart (if needed) or add a new line
         ------------------------------------------------------ */
      async addToCart(variantId, quantity = 1) {
        if (!variantId) throw new Error("variantId missing");
        set({ loading: true });

        try {
          const { cartId } = get();

          /* 1) No cart yet → cartCreate */
          if (!cartId) {
            const { cartCreate } = await shopifyFetch(CART_CREATE, {
              input: { lines: [{ merchandiseId: variantId, quantity }] },
            });

            set(
              {
                cartId: cartCreate.cart.id,
                checkoutUrl: cartCreate.cart.checkoutUrl,
              },
              false,
              "cart/create",
            );
          }
          /* 2) Existing cart → cartLinesAdd */
          else {
            await shopifyFetch(CART_LINES_ADD, {
              cartId,
              lines: [{ merchandiseId: variantId, quantity }],
            });
          }

          /* Refresh local state */
          await get().sync();
        } finally {
          set({ loading: false });
        }
      },

      /* ---------------------------------------------------------
         Update quantity (qty = 0 → remove line)
         ------------------------------------------------------ */
      async updateLine(lineId, quantity) {
        const { cartId } = get();
        if (!cartId) return;

        set({ loading: true });
        try {
          await shopifyFetch(CART_LINES_UPDATE, {
            cartId,
            lines: [{ id: lineId, quantity }],
          });
          await get().sync();
        } finally {
          set({ loading: false });
        }
      },

      /* ---------------------------------------------------------
         Pull latest cart from Shopify → map to local Line[]
         ------------------------------------------------------ */
      async sync() {
        const { cartId } = get();
        if (!cartId) return;

       const data = await shopifyFetch<{
          cart: {
            checkoutUrl: string;
            lines: { edges: CartLineEdge[] };
          };
        }>(CART_QUERY, { cartId });

        const lines: Line[] = data.cart.lines.edges.map(({ node }) => ({
          id: node.id,
          merchandiseId: node.merchandise.id,
          quantity: node.quantity,
          title: node.merchandise.product.title,
          price: node.merchandise.price.amount,
          imageUrl:
            node.merchandise.product.images.edges[0]?.node.url ?? "",
        }));


       set({ lines, checkoutUrl: data.cart.checkoutUrl });
      },

      /* ---------------------------------------------------------
         Attach email / customer token to cart (post-login)
         ------------------------------------------------------ */
      async setBuyerIdentity(email, customerAccessToken) {
        const { cartId } = get();
        if (!cartId) return;

        await shopifyFetch(CART_BUYER_IDENTITY_UPDATE, {
          cartId,
          buyerIdentity: {
            email,
            customerAccessToken,
          },
        });
        await get().sync();
      },
    }),
    {
      name: "cart-storage",
      partialize: (s) => ({
        cartId: s.cartId,
        checkoutUrl: s.checkoutUrl,
      }),
    },
  ),
);

"use client";
import { useState, startTransition } from "react";
import { useRouter } from "next/navigation";
import { Minus, Plus, ShoppingCart } from "lucide-react";
import { addLineToCart } from "@/app/actions/addToCart";

type Props = { variantId: string };

export default function AddToCartForm({ variantId }: Props) {
  const [qty, setQty] = useState(1);
  const router = useRouter();

  async function handleSubmit() {
    await addLineToCart(variantId, qty);    // Server Action
    startTransition(() => router.refresh()); // 重新抓 Cart 資料
  }

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <button onClick={() => setQty(Math.max(qty - 1, 1))}>
          <Minus size={16} />
        </button>
        <span className="w-8 text-center">{qty}</span>
        <button onClick={() => setQty(Math.min(qty + 1, 99))}>
          <Plus size={16} />
        </button>
      </div>

      <button
        onClick={handleSubmit}
        className="flex w-full items-center justify-center gap-2 rounded bg-emerald-600 py-3 text-sm font-medium text-white hover:bg-emerald-700"
      >
        <ShoppingCart size={16} /> Add to Cart
      </button>
    </div>
  );
}

'use client';

import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/store/cart';

export default function AddToCartControl({ variantId }: { variantId: string }) {
  const addToCart = useCart((s) => s.addToCart);
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="mt-3 flex flex-col items-center">
      {/* 數量控制器 */}
      <div className="flex items-center gap-2 mb-3 pb-10">
        <button onClick={decrease} className="border px-2 py-1 rounded text-gray-700 hover:bg-gray-100">
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 0) setQuantity(val);
          }}
          className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 no-spinner"
        />
        <button onClick={increase} className="border px-2 py-1 rounded text-gray-700 hover:bg-gray-100">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 加入購物車按鈕 */}
      <button
        onClick={() => addToCart(variantId, quantity)}
        className="px-20 md:px-50 bg-green-600 hover:bg-emerald-700 text-[12px] md:text-[18px] text-white py-2 rounded flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}

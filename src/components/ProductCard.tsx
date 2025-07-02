'use client';

import Image from 'next/image';
import { useState } from 'react';
import { Minus, Plus, ShoppingCart } from 'lucide-react';
import { useCart } from '@/store/cart';

interface Props {
  product: {
    id: string;
    title: string;
    handle: string;
    imageUrl: string;
    altText?: string | null;
    price: string;
    currency: string;
    variantId: string;
  };
}

function extractNumericId(gid: string): string {
  return gid.split('/').pop() ?? gid;
}

export default function ProductCard({ product }: Props) {
  const addToCart = useCart((s) => s.addToCart);
  const numericId = extractNumericId(product.id);
  const [quantity, setQuantity] = useState(1);

  const increase = () => setQuantity((q) => q + 1);
  const decrease = () => setQuantity((q) => (q > 1 ? q - 1 : 1));

  return (
    <div className="rounded-lg border border-gray-300 p-4 items-center text-left shadow-sm hover:shadow-md flex flex-col">
      <a href={`/details/${numericId}`} className="flex-1">
        <Image
          src={product.imageUrl}
          alt={product.altText ?? product.title}
          width={400}
          height={400}
          className="rounded-md object-cover mb-4"
        />
        <h3 className="text-lg font-medium">{product.title}</h3>
        <p className="mt-2 font-semibold text-[18px]">
          ${product.price}
        </p>
      </a>

      {/* 數量控制器 */}
      <div className="flex items-center gap-2 mt-3">
        <button onClick={decrease} className="border px-2 py-1 rounded text-gray-700 hover:bg-gray-100">
          <Minus className="w-4 h-4" />
        </button>
        <input
          type="number"
          min="0"
          value={quantity}
          onChange={(e) => {
            const val = parseInt(e.target.value, 10);
            if (!isNaN(val) && val >= 1) setQuantity(val);
          }}
          className="w-12 text-center border border-gray-300 rounded px-1 py-0.5 no-spinner"
         />
        <button onClick={increase} className="border px-2 py-1 rounded text-gray-700 hover:bg-gray-100">
          <Plus className="w-4 h-4" />
        </button>
      </div>

      {/* 加入購物車 */}
      <button
        onClick={() => addToCart(product.variantId, quantity)}
        className="px-10 mt-3 bg-green-600 hover:bg-emerald-700 text-white text-[18px] py-2 rounded flex items-center justify-center gap-2"
      >
        <ShoppingCart className="w-4 h-4" />
        Add to Cart
      </button>
    </div>
  );
}

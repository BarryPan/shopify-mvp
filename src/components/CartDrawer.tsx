'use client';

import { useCart } from '@/store/cart';
import { useUI } from '@/store/ui';    
import Image from 'next/image';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

export default function CartDrawer() {
  const { lines, updateLine, sync, checkoutUrl, loading } = useCart();
  const isOpen = useUI((s) => s.isCartOpen);
  const closeCart = useUI((s) => s.closeCart);
  const router = useRouter();

  /* 第一次掛載 → 拉最新 cart（因為 persist） */
  useEffect(() => { sync(); }, [sync]);

  const total = lines.reduce((acc, l) => acc + +l.price * l.quantity, 0);

  return (
    <>
    {/* 背景遮罩，點擊可關閉 */}
    <div
      className={clsx(
        "fixed inset-0 bg-black/50 z-40 transition-opacity duration-300",
        isOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}
      onClick={closeCart}
    />

      <aside
        className={clsx(
          "fixed right-0 top-0 h-full w-80 bg-white shadow-lg p-4 transition-transform duration-500 ease-in-out z-50",
          isOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
      <h2 className="text-xl font-semibold mb-4">Your cart</h2>

      {lines.length === 0 && <p className="text-gray-500">Cart is empty.</p>}

      {lines.map((l) => (
        <div key={l.id} className="flex gap-3 mb-3">
          <Image src={l.imageUrl} alt={l.title} width={60} height={60} className="rounded"/>
          <div className="flex-1">
            <p>{l.title}</p>
            <div className="flex items-center gap-2 mt-1">
              <button onClick={() => updateLine(l.id, l.quantity - 1)}>-</button>
              <span>{l.quantity}</span>
              <button onClick={() => updateLine(l.id, l.quantity + 1)}>+</button>
              <button onClick={() => updateLine(l.id, 0)} className="ml-auto">✕</button>
            </div>
          </div>
        </div>
      ))}

      {lines.length > 0 && (
        <>
          <p className="text-right font-medium mt-4">
            Subtotal: <span className="text-lg">${total.toFixed(2)}</span>
          </p>
          <button
            disabled={loading}
            onClick={() => router.push(checkoutUrl!)}
            className="w-full bg-black text-white py-2 rounded mt-4"
          >
            Checkout
          </button>
        </>
      )}
    </aside>
    </>
  );
}

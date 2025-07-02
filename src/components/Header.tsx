"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import Image from "next/image";
import { useCart } from "@/store/cart"; // optional: show cart qty badge
import { useUI } from '@/store/ui';  
import { useSession, signOut } from 'next-auth/react'; 

interface NavItem {
  href: string;
  label: string;
}

const NAV_ITEMS: NavItem[] = [
  { href: "/", label: "Home" },
  { href: "/products", label: "All Products" },
];

export default function Header() {
  const [open, setOpen] = useState(false);
  const cartQty = useCart((s) => s.lines.reduce((n, l) => n + l.quantity, 0));
  const toggleCartDrawer = useUI((s) => s.toggleCart); 
  const { data: session } = useSession(); 
  return (
    <header className="sticky top-0 z-30 w-full bg-white/80 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 md:py-4 lg:px-6">
        {/* Logo */}
        <Link href="/" className="flex items-center gap-2">
          <div className="h-15 w-15 rounded-lg flex items-center justify-center">
            {/* leaf icon mock */}
            <Image src="/logotitle.svg" alt="logo" width={500} height={500} />
          </div>
          <span className="text-xl font-bold text-gray-900">Demo App</span>
        </Link>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-10">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-gray-600 hover:text-gray-900 whitespace-nowrap"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        {/* Right actions */}
        <div className="flex items-center gap-4">
          {/* Language selector placeholder */}
          <Link href="/profile">
            <button className="flex items-center gap-2">
              <User className="w-5 h-5" />
            </button>
          </Link>
          {/* Cart */}
          <button
            onClick={toggleCartDrawer}      
            className="relative p-2 text-gray-600 hover:text-gray-900"
          >
            <ShoppingCart className="h-5 w-5" />
            {cartQty > 0 && (
              <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-red-600 text-[10px] font-medium text-white">
                {cartQty}
              </span>
            )}
          </button>

          {/* Sign in */}
          {/* Auth action */}
            {session?.accessToken ? (
             <button
              onClick={async () => {
                // ① 取得 cartId
                const { cartId } = useCart.getState();

                // ② 傳給後端 API，清 Token + 購物車
                await fetch('/api/shopify/logout', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({ cartId }),
                });

                // ③ 清除前端購物車狀態
                useCart.setState({
                  cartId: undefined,
                  lines: [],
                });

                // ④ 登出（不跳轉頁面）
                await signOut({ redirect: false });
              }}
              className="hidden md:inline-block rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-50"
            >
              Log Out
            </button>
            ) : (
              <Link
                href="/login"
                className="hidden md:inline-block rounded-lg bg-green-600 hover:bg-emerald-700 px-5 py-2 text-white"
              >
                Sign In
              </Link>
            )}


          {/* Hamburger (mobile) */}
          <button
            onClick={() => setOpen(!open)}
            className="md:hidden p-2 text-gray-600 hover:text-gray-900"
          >
            {open ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile nav */}
      {open && (
        <nav className="md:hidden border-t bg-white shadow-inner">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className="block px-6 py-3 text-gray-700 hover:bg-gray-50"
            >
              {item.label}
            </Link>
          ))}
          
          {/* Auth action */}
        {session?.accessToken ? (
          <button
            onClick={async () => {
              // ① 取得 cartId
              const { cartId } = useCart.getState();

              // ② 傳給後端 API，清 Token + 購物車
              await fetch('/api/shopify/logout', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ cartId }),
              });

              // ③ 清除前端購物車狀態
              useCart.setState({
                cartId: undefined,
                lines: [],
              });

              // ④ 登出（不跳轉頁面）
              await signOut({ redirect: false });
            }}
            className="hidden md:inline-block rounded-lg border px-5 py-2 text-gray-700 hover:bg-gray-50"
          >
            Log Out
          </button>
        ) : (
          <Link
            href="/login"
            className="hidden md:inline-block rounded-lg bg-green-600 hover:bg-emerald-700 px-5 py-2 text-white"
          >
            Sign In
          </Link>
        )}

        </nav>
      )}
    </header>
  );
}

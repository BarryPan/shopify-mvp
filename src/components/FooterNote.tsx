import Link from 'next/link';
import Image from "next/image";

export default function FooterNote() {
  return (
    <footer className="bg-gray-900 text-gray-400 text-sm">
      <div className="container mx-auto px-4 py-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <div className="p-1 rounded-md">
              <Image src="/logotitle.svg" alt="logo" width={50} height={50} />
            </div>
            <span className="text-white font-semibold text-lg">Demo App</span>
          </div>
          <p className="leading-relaxed">
            Premium quality groceries and vegetables delivered fresh to your door.
          </p>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Shop</h4>
          <ul className="space-y-1">
            <li><Link href="#">Vegetables</Link></li>
            <li><Link href="#">Fruits</Link></li>
            <li><Link href="#">Grains</Link></li>
            <li><Link href="#">Organic</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Support</h4>
          <ul className="space-y-1">
            <li><Link href="#">Contact Us</Link></li>
            <li><Link href="#">FAQ</Link></li>
            <li><Link href="#">Delivery Info</Link></li>
            <li><Link href="#">Returns</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="text-white font-semibold mb-2">Connect</h4>
          <ul className="space-y-1">
            <li><Link href="#">Newsletter</Link></li>
            <li><Link href="#">Social Media</Link></li>
            <li><Link href="#">Community</Link></li>
          </ul>
        </div>
      </div>

      <div className="border-t border-gray-700 text-center py-4">
        <p className="text-gray-500 text-xs">&copy; 2025 Buni Creative Studio. All rights reserved.</p>
      </div>
    </footer>
  );
}

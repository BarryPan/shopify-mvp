import { shopifyFetch } from '@/lib/shopify';
import { FRONT_PAGE_PRODUCTS_QUERY } from '@/lib/queries/products';
import ProductCard from '@/components/ProductCard';
import Link from "next/link";
import { Search } from 'lucide-react';

interface Edge {
  node: {
    id: string;
    title: string;
    handle: string;
    images: { edges: { node: { url: string; altText?: string | null } }[] };
    variants: {
      edges: { node: { price: { amount: string; currencyCode: string } } }[];
    };
  };
}

export default async function ShopPage() {
  const data: { products: { edges: Edge[] } } =
    await shopifyFetch(FRONT_PAGE_PRODUCTS_QUERY, { first: 4 });
  const products = data.collection.products.edges.map(({ node }) => ({
    id: node.id,
    title: node.title,
    handle: node.handle,
    imageUrl: node.images.edges[0]?.node.url ?? '/placeholder.png',
    altText: node.images.edges[0]?.node.altText ?? null,
    price: node.variants.edges[0]?.node.price.amount,
    currency: node.variants.edges[0]?.node.price.currencyCode,
    variantId: node.variants.edges[0]?.node.id,     
  }));
  return (
     <>
      {/* Hero Section */}
      <section className="w-full bg-[#f1fef4] py-20 px-6">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12">
          {/* Left text section */}
          <div className="flex-1 text-center lg:text-left">
            <h2 className="text-[48px] font-bold text-gray-900 leading-tight">
              Premium Bulk <br /> Groceries
            </h2>
            <h3 className="text-[48px] font-bold text-green-600 mt-2 mb-4">
              Delivered Fresh
            </h3>
            <p className="text-gray-700 text-lg mb-6">
              Order premium groceries with ease.
              Fresh, high-quality products delivered straight to your door — just a few clicks away.
            </p>
            <Link href="/products"> 
              <button className="bg-green-600 hover:bg-green-700 text-white text-[18px] px-6 py-3 rounded font-medium transition">
                Explore All Collections
              </button>
            </Link>
          </div>

          {/* Right image section */}
          <div className="flex-1">
            <img
              src="/fresh-food.jpg"
              alt="Fresh Salad"
              className="w-full h-auto rounded-lg object-cover"
            />
          </div>
        </div>
      </section>

      {/* Product List Section */}
      <section className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">TOP Sellers</h2>
          <a href="/products" className="text-green-600 font-semibold hover:underline flex items-center gap-1">
            View All <span className="text-xl">→</span>
          </a>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      </section>

       <section className="py-16 bg-white text-center">
        <h2 className="text-2xl sm:text-3xl font-bold mb-4">Explore Our Full Catalog</h2>
        <p className="text-gray-600 mb-8">
          Use our powerful search and filtering tools to find exactly what you need.
        </p>
        <a
          href="/products"
          className="inline-flex items-center gap-2 bg-green-600 text-white text-[18px] font-medium px-6 py-3 rounded-md hover:bg-emerald-700 transition"
        >
          <Search className="w-4 h-4" />
          Browser All Products
        </a>
      </section>
    </>

  );
}

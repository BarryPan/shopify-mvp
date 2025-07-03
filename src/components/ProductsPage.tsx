'use client';

import { useMemo, useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';   // ← ★
import ProductCard from '@/components/ProductCard';
import SearchBar from './SearchBar';
import CategoryFilter from './CategoryFilter';

/* ---------- Types ---------- */
interface RawProduct {
  id: string;
  title: string;
  handle: string;
  images: { edges: { node: { url: string; altText?: string | null } }[] };
  variants: {
    edges: { node: { id: string; price: { amount: string; currencyCode: string } } }[];
  };
  meta: { value: string }; // ← 你的 category 來源
}

interface Product {
  id: string;
  title: string;
  handle: string;
  imageUrl: string;
  altText: string | null;
  price: string;
  currency: string;
  category: string;
  variantId?: string;
}

/* ---------- Component ---------- */
export default function ProductsPage({ initialProducts }: { initialProducts: RawProduct[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();            // ← ★

  /* ---------- Step 0: 讀取 query ---------- */
  const queryCat = searchParams.get('prefiltered') || null;  // 可能是 null

  /* ---------- Step 1: 將 Raw → Processed ---------- */
  const processedProducts: Product[] = useMemo(
    () =>
      initialProducts.map((p) => ({
        id: p.id,
        title: p.title,
        handle: p.handle,
        imageUrl: p.images.edges[0]?.node.url ?? '/placeholder.png',
        altText: p.images.edges[0]?.node.altText ?? null,
        price: p.variants.edges[0]?.node.price.amount,
        currency: p.variants.edges[0]?.node.price.currencyCode,
        category: p.meta.value,
        variantId: p.variants?.edges[0]?.node.id,
      })),
    [initialProducts]
  );

  /* ---------- UI States ---------- */
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState<string | null>(queryCat);

  /* ---------- keep URL ←→ state in sync ---------- */
  useEffect(() => {
    // 把 state → URL
    const params = new URLSearchParams(searchParams);
    if (activeCategory) params.set('prefiltered', activeCategory);
    else params.delete('prefiltered');
    router.replace(`/products?${params.toString()}`, { scroll: false });
    // eslint-disable-next-line react-hooks/exhaustive-deps
    setCurrentPage(1);
  }, [activeCategory]);   // 只在 activeCategory 變動時更新

  /* ---------- Derive all unique categories ---------- */
  const categories = useMemo(
    () => Array.from(new Set(processedProducts.map((p) => p.category).filter(Boolean))),
    [processedProducts]
  );

  /* ---------- Filter logic ---------- */
  const visibleProducts = useMemo(() => {
    return processedProducts.filter((p) => {
      const matchSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase());
      const matchCat = !activeCategory || p.category === activeCategory;
      return matchSearch && matchCat;
    });
  }, [processedProducts, searchTerm, activeCategory]);

  /* -------- Page Setup ---------*/
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 24;
  const paginatedProducts = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return visibleProducts.slice(start, end);
  }, [visibleProducts, currentPage]);
  const totalPages = Math.ceil(visibleProducts.length / ITEMS_PER_PAGE);



  /* ---------- Render ---------- */
  return (
    <section className="mx-auto max-w-7xl p-4">
      <SearchBar value={searchTerm} onChange={setSearchTerm} />
      <CategoryFilter
        categories={categories}
        active={activeCategory}
        onSelect={setActiveCategory}      // ← state 交給 Filter
      />
      <p className="text-sm text-gray-500 mt-2 pt-8">
        Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} -{' '}
        {Math.min(currentPage * ITEMS_PER_PAGE, visibleProducts.length)} of {visibleProducts.length} products
      </p>

    {paginatedProducts.length === 0 ? (
        <p className="mt-4 text-gray-500">No item found.</p>
      ) : (
        <>
          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3 lg:grid-cols-4">
            {paginatedProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          {/* ✅ 分頁按鈕放這裡！ */}
          {totalPages > 1 && (
            <div className="flex justify-center mt-10 gap-2">
              {Array.from({ length: totalPages }, (_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`px-3 py-1 border rounded ${
                    currentPage === i + 1
                      ? 'bg-emerald-600 text-white'
                      : 'bg-white text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
          )}
        </>
      )}
    </section>
  );
}

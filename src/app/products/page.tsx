// app/products/page.tsx

import { Suspense } from 'react';
import { getAllProducts } from '@/lib/data/products';
import ProductsPage from '@/components/ProductsPage';


export default async function Products() {
  const products = await getAllProducts();

  return (
    <Suspense fallback={<p>Loading products…</p>}>
      <ProductsPage initialProducts={products} />
    </Suspense>
  );
}

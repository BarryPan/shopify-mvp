// app/products/page.tsx
import { getAllProducts } from '@/lib/data/products';
import ProductsPage from '@/components/ProductsPage';

export const dynamic = "force-dynamic";
export default async function Products() {
  const products = await getAllProducts();     // ← 已經是「全部」
  return <ProductsPage initialProducts={products} />;
}

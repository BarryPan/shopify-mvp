import Link from "next/link";

type Props = { title: string; productType?: string };

export default function Breadcrumb({ title, productType }: Props) {
  return (
    <nav className="mb-6 text-sm text-emerald-700">
      <Link href="/products" className="hover:underline">All Products</Link>
      <span className="px-1">/</span>
      <Link href={`/products?prefiltered=${productType?.toLowerCase()}`} className="hover:underline">
        {productType ?? "Category"}
      </Link>
      <span className="px-1">/</span>
      <span className="font-medium text-gray-800">{title}</span>
    </nav>
  );
}

import { Metadata } from "next";
import { shopifyFetch } from "@/lib/shopify";
import Breadcrumb from "@/components/product/Breadcrumb";
import Gallery from "@/components/product/Gallery";
import Details from "@/components/product/Details";
import {PRODUCTS_DETAIL} from "@/lib/queries/products";
import AddToCartButton from "@/components/cart/AddToCartButton";

export const dynamic = "force-dynamic";


export async function generateMetadata({ params }: { params: { pid: string } } ): Promise<Metadata> {
  return { title: `Product #${params.pid} – Details` };
}

export default async function ProductDetailPage({ params }: { params: { pid: string } } ) {
  const globalId = `gid://shopify/Product/${params.pid}`;
  const { node: product } = await shopifyFetch(PRODUCTS_DETAIL, { id: globalId });
  if (!product) return <p className="p-8">Product not found.</p>;

  const firstImage = product.images.edges[0]?.node;
  const variant    = product.variants.edges[0]?.node;

  return (
    <div className="mx-auto max-w-6xl px-4 py-8">
      <Breadcrumb title={product.title} productType={product.category.value} />

      <div className="flex flex-col gap-10 md:flex-row md:gap-16">
        {/* Left: Gallery */}
        <div className="md:w-1/2">
          <Gallery url={firstImage?.url} alt={firstImage?.altText} />
        </div>

        {/* Right: Product Details & Actions */}
        <div className="md:w-1/2 flex flex-col gap-6">
          <Details
            productType={product.category.value}
            title={product.title}
            price={variant?.price}
            description={product.description}
            shortdescription={product.shortdescription.value}
          />

          <AddToCartButton
            variantId={variant.id}
            title={product.title}
            price={variant.price.amount}
            imageUrl={firstImage?.url}
          />
          <div className="h-px bg-gray-300 my-4 w-full" />

          <p className="text-[24px] font-semibold mb-2">Product Details</p>
          <p className="text-[18px] text-gray-700 mb-8 max-w-md leading-relaxed">{product.description}</p>
          

        </div>
      </div>

    </div>
  );
}

import { Metadata } from "next";
import { shopifyFetch } from "@/lib/shopifyFetch";

export const dynamic = "force-dynamic";          // always fresh, optional


export async function generateMetadata({ params }: { params: { pid: string } } ): Promise<Metadata> {
  return { title: `Product #${params.pid} – Details` };
}

const PRODUCT_DETAIL_QUERY = /* GraphQL */ `
  query ProductDetail($id: ID!) {
    node(id: $id) {
      ... on Product {
        id
        title
        descriptionHtml
        vendor
        tags
        images(first: 10) {
          edges { node { url altText } }
        }
        variants(first: 10) {
          edges { node { price { amount currencyCode } } }
        }
      }
    }
  }
`;

export default async function ProductDetailPage({ params }: { params: { pid: string } } ) {
  const globalId = `gid://shopify/Product/${params.pid}`;
  const data = await shopifyFetch(PRODUCT_DETAIL_QUERY, { id: globalId });

  const product = data?.node;
  if (!product) return <p className="p-8">Product not found.</p>;

  const price = product.variants.edges[0]?.node.price;

  return (
    <main className="mx-auto max-w-4xl p-8">
      <h1 className="text-3xl font-bold mb-4">{product.title}</h1>

      {price && (
        <p className="text-xl mb-4">
          {price.amount} {price.currencyCode}
        </p>
      )}

      {/* images */}
      <section className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
        {product.images.edges.map(({ node }) => (
          <img
            key={node.url}
            src={node.url}
            alt={node.altText ?? product.title}
            className="w-full object-cover aspect-square rounded-lg"
          />
        ))}
      </section>

      {/* description */}
      <article
        className="prose"
        dangerouslySetInnerHTML={{ __html: product.descriptionHtml }}
      />

      {/* tags & vendor */}
      <div className="mt-6 text-sm text-gray-600 space-x-2">
        <span>Vendor: {product.vendor}</span>
        {product.tags.length > 0 && (
          <span>| Tags: {product.tags.join(", ")}</span>
        )}
      </div>
    </main>
  );
}

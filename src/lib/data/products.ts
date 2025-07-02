// lib/data/products.ts
import { shopifyFetch } from '@/lib/shopify';
import { PRODUCTS_QUERY_PAGINATED } from '@/lib/queries/products';

type RawProductNode = {
  id: string;
  title: string;
  handle: string;
  images: { edges: { node: { url: string; altText?: string | null } }[] };
  variants: { edges: { node: { id: string; price: { amount: string; currencyCode: string } } }[] };
};

export async function getAllProducts(batchSize = 250) {
  let hasNextPage = true;
  let cursor: string | null = null;
  const products: RawProductNode[] = [];

  while (hasNextPage) {
    const data = await shopifyFetch<{
      products: {
        pageInfo: { hasNextPage: boolean; endCursor: string | null };
        edges: { node: RawProductNode }[];
      };
    }>(PRODUCTS_QUERY_PAGINATED, { first: batchSize, cursor });

    const { edges, pageInfo } = data.products;
    edges.forEach(({ node }) => products.push(node));

    hasNextPage = pageInfo.hasNextPage;
    cursor = pageInfo.endCursor;
  }

  return products;
}

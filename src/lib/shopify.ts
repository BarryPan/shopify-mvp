const DOMAIN =
  (typeof window === 'undefined'
    ? process.env.SHOPIFY_STORE_DOMAIN
    : process.env.NEXT_PUBLIC_SHOPIFY_STORE_DOMAIN) as string;

const TOKEN =
  (typeof window === 'undefined'
    ? process.env.SHOPIFY_STOREFRONT_TOKEN
    : process.env.NEXT_PUBLIC_SHOPIFY_STOREFRONT_TOKEN) as string;
const VERSION  = process.env.SHOPIFY_API_VERSION || '2025-04';

export async function shopifyFetch<T>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<T> {
  const res = await fetch(
    `https://${DOMAIN}/api/${VERSION}/graphql.json`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': TOKEN,
      },
      body: JSON.stringify({ query, variables }),
      // App Router 伺服端元件：可加 cache: 'no-store'
    },
  );

  const json = await res.json();
  if (json.errors) {
    console.error(JSON.stringify(json.errors, null, 2));
    throw new Error('Shopify API Error');
  }
  return json.data;
}
